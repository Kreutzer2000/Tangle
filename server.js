// server.js
// Importaciones necesarias
const express = require('express');
const cookieParser = require('cookie-parser');
const sql = require('mssql/msnodesqlv8');

const { Client, Block, hexToUtf8, initLogger, TaggedDataPayload, utf8ToHex, Utils } = require('@iota/sdk');
//const { composeAPI } = require('@iota/core');
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 30 * 1024 } });  
const fs = require('fs').promises; 
// const fs = require('fs');
const sha3 = require('js-sha3');

const jwt = require('jsonwebtoken');  // Importa jsonwebtoken

const expressJwt = require('express-jwt');
const crypto = require('crypto');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();  // ¡Inicialización de la aplicación Express!
app.use(cookieParser());

const generateAccessToken = require('./public/js/auth.js');

const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=tanglestore;AccountKey=ZTFvf57GOFp+IF1mEwwcbkJ1BYyYZm3+bTuxYDiVNbvAzKYfPEV5ZlDhzBk0+xuErUL8V53QpckE+AStfKK+xg==;EndpointSuffix=core.windows.net'; // Obtén esto desde el portal de Azure
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerName = 'storagetangle'; // El nombre de tu contenedor en Azure Blob Storage

// Creación del cliente de IOTA
const client = new Client({
    nodes: ['https://api.testnet.shimmer.network'],
});

// Configuración de la conexión a la base de datos
const dbConfig = {
    server: 'DESKTOP-C29VI7H\\PCRENZO',
    database: 'Tangle',
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true,
        enableArithAbort: true
    }
};

initLogger();

function customJwtMiddleware(req, res, next) {
    // Lista de rutas que deseas permitir sin autenticación
    const allowedPaths = ['/app/login/login.html', '/app/register/register.html', '/login', '/register', '/logout'];

    if (allowedPaths.includes(req.path)) {
        next();
    } else {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/app/login/login.html');
        }
        jwt.verify(token, 'clave_secreta', (err, decoded) => {
            if (err) {
                return res.redirect('/app/login/login.html');
            }
            req.user = decoded;  // Almacena el payload decodificado en req.user
            // console.log(req.user);
            next();
        });
    }
}

// Aplica customJwtMiddleware en lugar de jwtMiddleware
app.use(customJwtMiddleware);

// Middleware para manejar errores de express-jwt
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.redirect('/app/login/login.html');  // Redirige al usuario a /login si hay un error de autenticación
    } else {
        next(err);  // Pasa otros errores al siguiente middleware de manejo de errores
    }
});

// Sirve archivos estáticos desde el directorio 'public'
app.use(express.static('public'));
app.use(express.json({limit: '10mb'}));  // Agregar esto para parsear cuerpos JSON

// Ruta para servir login.html
app.get('/app/login/login.html', (req, res) => {
    res.sendFile(__dirname + '/public/app/login/login.html');
});

// Función para verificar el token
function verifyToken(req, res, next) {
    const token = req.cookies.token;
    console.log(token + '\n' + "Este es el token de la cookie");
    if (!token) {
        // No hay token, redirige a la página de login
        return res.redirect('/app/login/login.html');
    }
    // Verificar el token
    jwt.verify(token, 'clave_secreta', (err, decoded) => {
        if (err) {
            // Token inválido o expirado, redirige a la página de login
            return res.redirect('/app/login/login.html');
        }
        // Token válido, procede a la siguiente función/middleware
        next();
    });
}

// Ruta para servir index.html
app.get('/', verifyToken, (req, res) => {
    // Token válido, sirve index.html
    res.sendFile(__dirname + '/public/index.html');
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    res.clearCookie('token');  // Elimina la cookie 'token'
    res.redirect('/app/login/login.html');  // Redirecciona al usuario a la página de inicio de sesión
});

app.post('/uploadToAzure', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log(req.file);
    console.log(req.body);
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }
        const azureBlobUrl = await uploadFileToAzureBlob(file);
        res.json({ azureBlobUrl });
    } catch (error) {
        console.error('Error uploading to Azure:', error);
        res.status(500).send('Server error');
    }
});

async function uploadFileToAzureBlob(file) {
    if (!file || !file.originalname) {
        throw new Error('No file provided or file is missing name property.');
    }
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = new Date().getTime() + file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Lee el archivo del sistema de archivos de forma asíncrona
    const fileData = await fs.readFile(file.path);

    // Pasa los datos del archivo a uploadData
    const uploadBlobResponse = await blockBlobClient.uploadData(fileData);
    
    // Establece el nivel de acceso del blob a "anónimo de solo lectura"
    await blockBlobClient.setAccessTier("Hot");  // Puedes cambiar "Cool" a "Hot" si prefieres ese nivel de acceso

    // Elimina el archivo temporal de forma asíncrona
    await fs.unlink(file.path);
    return blockBlobClient.url; // Esta es la URL que guardarás en la base de datos
}

// Maneja el hash SHA-3
app.post('/upload', upload.none(), async (req, res) => { // Cambio: upload.none() ya que ya no estás enviando un archivo
    const hash = req.body.hash;
    const azureBlobUrl = req.body.azureBlobUrl;
    console.log(hash + '\n' + "Este es el hash");
    if (!hash) {
        res.status(400).send('No hash provided');
        return;
    }

    const options = {
        tag: utf8ToHex('Hello'),
        data: utf8ToHex(hash),  // Envía el hash SHA-3 a la red Tangle
    };

    try {
        const mnemonic = Utils.generateMnemonic();
        const secretManager = { mnemonic: mnemonic };

        // Create block with tagged payload
        const blockIdAndBlock_ej = await client.buildAndPostBlock(
            secretManager,
            options,
        );
        // console.log('Block sent: ', blockIdAndBlock_ej, '\n');

        const fetchedBlock = await client.getBlock(blockIdAndBlock_ej[0]);
        console.log('Block data: ', fetchedBlock);

        const block = new Block();
        block.protocolVersion = fetchedBlock.protocolVersion;
        block.parents = fetchedBlock.parents;
        block.payload = fetchedBlock.payload;
        block.nonce = fetchedBlock.nonce;

        const blockId = await client.postBlock(block);
        console.log('Block ID:', blockId);

        const usuarioId = req.user.userId; // obtén el UsuarioID del payload del token

        // Conexión a la base de datos y registro de la transacción
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('UsuarioID', sql.Int, usuarioId)
            .input('HashSHA3', sql.NVarChar(255), hash)
            .input('BlockID', sql.NVarChar(255), blockId)
            .input('ProtocolVersion', sql.Int, block.protocolVersion)
            .input('Parents', sql.NVarChar(sql.MAX), JSON.stringify(block.parents))
            .input('PayloadType', sql.Int, block.payload.type)
            .input('PayloadTag', sql.NVarChar(255), block.payload.tag)
            .input('PayloadData', sql.NVarChar(sql.MAX), block.payload.data)
            .input('Nonce', sql.NVarChar(255), block.nonce)
            .input('ArchivoCifradoURL', sql.NVarChar(1024), azureBlobUrl)
            .query('INSERT INTO TransaccionesTangle (UsuarioID, HashSHA3, BlockID, ProtocolVersion, Parents, PayloadType, PayloadTag, PayloadData, Nonce, ArchivoCifradoURL) VALUES (@UsuarioID, @HashSHA3, @BlockID, @ProtocolVersion, @Parents, @PayloadType, @PayloadTag, @PayloadData, @Nonce, @ArchivoCifradoURL)');

        sql.close();

        res.json({ blockId });

    } catch (iotaError) {
        console.error('Error sending message to the Tangle:', iotaError);
        res.status(500).send('Server error');
    }

});

app.get('/retrieve/:blockId', async (req, res) => {
    const blockId = req.params.blockId;
    
    console.log(blockId);
    try {
        // Conexión a la base de datos
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('BlockID', sql.NVarChar(255), blockId)
            .query('SELECT * FROM TransaccionesTangle WHERE BlockID = @BlockID');
        // sql.close();

        // Verificar si el blockId existe en la base de datos
        if (result.recordset.length > 0) {
            const fetchedBlock = await client.getBlock(blockId);
            console.log('Block data: ', fetchedBlock);
            if (fetchedBlock.payload instanceof TaggedDataPayload) {
                const payload = fetchedBlock.payload;
                const encryptedFileDataBase64 = hexToUtf8(payload.data);
                const dbData = result.recordset[0];  // Asumiendo que BlockID es único y sólo hay una entrada correspondiente en la DB

                const usuarioid = dbData.UsuarioID;
                // console.log(usuarioid);
                const resultUsuario = await pool.request()
                    .input('UsuarioID', sql.Int, usuarioid)
                    .query('SELECT * FROM Usuarios WHERE UsuarioID = @UsuarioID');
                // console.log(result.recordset);
                sql.close();
                const dbUsuario = resultUsuario.recordset[0];
                // console.log(resultUsuario);
                // Crear un objeto que contenga tanto los datos de la base de datos como los datos de Tangle
                const responseData = {
                    encryptedFileData: encryptedFileDataBase64,
                    dbData: {
                        id: dbData.TransaccionID,
                        usuario: dbUsuario.Usuario,
                        blockId: dbData.BlockID,
                        hashSHA3: dbData.HashSHA3,
                        fechaTransaccion: dbData.FechaTransaccion
                    }
                };

                res.send(responseData);  // Envía la respuesta al cliente
            } else {
                res.status(400).send('Invalid block payload');
            }
        } else {
            res.status(404).send('BlockID no encontrado en la base de datos');
        }

    } catch (iotaError) {
        console.error('Error retrieving block from the Tangle:', iotaError);
        res.status(500).send('Server error');
    }
});

app.get('/retrieveByPhone/:phone/:userId', async (req, res) => {
    const phone = req.params.phone;
    const userId = req.params.userId;  // Obtén el ID del usuario de los parámetros de la URL
    console.log(phone + '\n' + userId);
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('NumeroTelefono', sql.NVarChar(255), phone)  // Actualizado a 'NumeroTelefono'
            .input('UserId', sql.Int, userId)
            .query(`
            SELECT * 
            FROM TransaccionesTangle 
            JOIN Usuarios 
            ON TransaccionesTangle.UsuarioID = Usuarios.UsuarioID
            WHERE Usuarios.NumeroTelefono = @NumeroTelefono
            AND Usuarios.UsuarioID = @UserId AND TransaccionesTangle.ArchivoCifradoURL NOT IN ('NULL', 'undefined')
          `);  // Consulta actualizada
        sql.close();
        console.log(result.recordset);
        
        const responseData = await Promise.all(result.recordset.map(async dbData => {
            const blockId = dbData.BlockID;
            const fetchedBlock = await client.getBlock(blockId);
            if (fetchedBlock.payload instanceof TaggedDataPayload) {
                const payload = fetchedBlock.payload;
                const encryptedFileDataBase64 = hexToUtf8(payload.data);
                return {
                    encryptedFileData: encryptedFileDataBase64,
                    dbData: {
                        id: dbData.TransaccionID,
                        usuario: dbData.Usuario,
                        blockId: dbData.BlockID,
                        hashSHA3: dbData.HashSHA3,
                        fechaTransaccion: dbData.FechaTransaccion,
                        ArchivoCifradoURL: dbData.ArchivoCifradoURL
                    }
                };
            } else {
                return null;
            }
        }));
    
        if (responseData.length > 0) {
            res.send(responseData);
        } else {
            res.status(404).send('Número de teléfono no encontrado en la base de datos');
        }

    } catch (iotaError) {
        console.error('Error retrieving block from the Tangle:', iotaError);
        res.status(500).send('Server error');
    }
});

app.get('/users', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .query('SELECT UsuarioID, Usuario FROM Usuarios');
        sql.close();
        res.json(result.recordset);  // Envía los usuarios como una respuesta JSON
    } catch (err) {
        console.error(err);
        sql.close();
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para registrar un nuevo usuario
app.post('/register', express.json(), async (req, res) => {
    const { nombre, apellido, email, usuario, contrasena, telefono } = req.body;

    if (!telefono || !usuario || !contrasena) {
        return res.status(400).send('Los campos obligatorios no están completos.');
    }
    
    // Hash de la contraseña
    const hash = crypto.createHash('sha256').update(contrasena).digest('hex');
    
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('Nombre', sql.NVarChar(100), nombre)
            .input('Apellido', sql.NVarChar(100), apellido)
            .input('Email', sql.NVarChar(255), email)
            .input('NumeroTelefono', sql.NVarChar(50), telefono)
            .input('Usuario', sql.NVarChar(50), usuario)
            .input('Contrasena', sql.NVarChar(255), hash)
            .query('INSERT INTO Usuarios (Nombre, Apellido, Email, Usuario, Contrasena, NumeroTelefono) VALUES (@Nombre, @Apellido, @Email, @Usuario, @Contrasena, @NumeroTelefono)');
        sql.close();
        res.status(201).send('Usuario registrado');
    } catch (err) {
        console.error(err);
        sql.close();
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para iniciar sesión
app.post('/login',  async (req, res) => {
    const { usuario, contrasena } = req.body;
    console.log('Received login request for user:', usuario);  // Añade un log aquí
    console.log(usuario, contrasena);
    const hash = crypto.createHash('sha256').update(contrasena).digest('hex');
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('Usuario', sql.NVarChar(50), usuario)
            .input('Contrasena', sql.NVarChar(255), hash)
            .query('SELECT * FROM Usuarios WHERE Usuario = @Usuario AND Contrasena = @Contrasena');
        sql.close();
        if (result.recordset.length > 0) {
            // Inicio de sesión exitoso, genera el token
            const user = result.recordset[0];
            const token = generateAccessToken(usuario, user.UsuarioID);   // pasa el UsuarioID a la función
            // console.log(token);
            res.cookie('token', token, { httpOnly: true });  // Almacena el token como una cookie
            res.status(200).json({ message: 'Inicio de sesión exitoso', token });  // Envía el token en la respuesta
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (err) {
        console.error(err);
        sql.close();
        res.status(500).json({ message: 'Error en el servidor' });  // Modificado aquí
    }
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});