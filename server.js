// server.js
// Importaciones necesarias
const express = require('express');
const cookieParser = require('cookie-parser');
// const sql = require('mssql/msnodesqlv8');
const sql = require('mssql');
const connectDB = require('./db');

// Importar node-seal
const SEAL = require('node-seal');

const nodemailer = require('nodemailer');

const Usuario = require('./models/Usuario');

const { Client, Block, hexToUtf8, initLogger, TaggedDataPayload, utf8ToHex, Utils } = require('@iota/sdk');
//const { composeAPI } = require('@iota/core');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/', limits: { fileSize: 900000000000 * 1024 } });  
const upload = multer({ 
    dest: 'uploads/', 
    limits: { fileSize: 200000 * 1024 } // Ejemplo para un límite de 200,000 KB (195 MB)
});
const fs = require('fs').promises; 
// const fs = require('fs');
const sha3 = require('js-sha3');

const jwt = require('jsonwebtoken');  // Importa jsonwebtoken

const expressJwt = require('express-jwt');
const crypto = require('crypto');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();  // ¡Inicialización de la aplicación Express!
app.use(cookieParser());
app.use(express.json()); // Para parsear cuerpos de solicitud JSON
const generateAccessToken = require('./public/js/auth.js');

const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=tanglestore;AccountKey=ZTFvf57GOFp+IF1mEwwcbkJ1BYyYZm3+bTuxYDiVNbvAzKYfPEV5ZlDhzBk0+xuErUL8V53QpckE+AStfKK+xg==;EndpointSuffix=core.windows.net'; // Obtén esto desde el portal de Azure
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerName = 'storagetangle'; // El nombre de tu contenedor en Azure Blob Storage

// Creación del cliente de IOTA
const client = new Client({
    //nodes: ['https://api.testnet.shimmer.network'],
    nodes: ['http://35.194.18.16:14265']
});

const clients = [
    new Client({ nodes: ['http://35.194.18.16:14265'] }), // Nodo 1
    new Client({ nodes: ['http://35.194.18.16:14266'] }), // Nodo 2
    new Client({ nodes: ['http://35.194.18.16:14267'] }), // Nodo 3
    new Client({ nodes: ['http://35.194.18.16:14268'] }),  // Nodo 4
    new Client({ nodes: ['https://api.testnet.shimmer.network'] })  // Nodo de Pruebas
];

// Configuración de la conexión a la base de datos
const dbConfig = {
    server: 'tangle.database.windows.net',
    //database: 'Tangle', // Produccion
    database: 'TanglePruebas', // Pruebas
    user: 'rdipaolaj',
    password: '12Enero2000###', // Reemplaza {your_password} con tu contraseña real
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true
    }
};

// Conectarse a la base de datos MongoDB
connectDB();

initLogger();

// Función para inicializar el sistema de cifrado homomórfico
async function initializeSeal() {
    const seal = await SEAL();
    const schemeType = seal.SchemeType.bfv;
    const polyModulusDegree = 4096;
    const bitSizes = [36, 36, 37];
    const bitSize = 20;

    const parms = seal.EncryptionParameters(schemeType);

    parms.setPolyModulusDegree(polyModulusDegree);
    parms.setCoeffModulus(seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes)));
    parms.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize));

    const context = seal.Context(parms, true, seal.SecurityLevel.tc128);

    const keyGenerator = seal.KeyGenerator(context);
    const publicKey = keyGenerator.createPublicKey();
    const secretKey = keyGenerator.secretKey();

    return {
        seal,
        context,
        keyGenerator,
        publicKey,
        secretKey
    };
}

// Función de prueba para verificar la correspondencia de claves mediante cifrado y descifrado
async function testEncryption() {
    try {
        const testText = "Prueba";
        const encryptedText = await encryptText(testText);
        //console.log("Texto cifrado:", encryptedText);
        const decryptedText = await decryptText(encryptedText);
        //console.log("Texto descifrado:", decryptedText);

        if (decryptedText === testText) {
            console.log("Prueba de cifrado/descifrado exitosa: las claves parecen corresponder.");
            return true;
        } else {
            console.error("Prueba de cifrado/descifrado fallida: las claves podrían no corresponder.");
            return false;
        }
    } catch (error) {
        console.error("Error durante la prueba de cifrado/descifrado:", error);
        return false;
    }
}

let sealObjects;
initializeSeal().then(objects => {
    sealObjects = objects;
    console.log("SEAL inicializado correctamente");

    // Envolver la llamada en una función asíncrona anónima autoejecutable
    (async () => {
        const testResult = await testEncryption();
        if (!testResult) {
            // Manejar el caso en que la prueba falla
            console.error("Error en la prueba de cifrado/descifrado");
        } else {
            console.log("Prueba de cifrado/descifrado exitosa");
        }
    })();
});

// Función para cifrar texto
async function encryptText(text) {
    if (!sealObjects) {
        throw new Error("SEAL no está inicializado");
    }

    try {
        const batchEncoder = sealObjects.seal.BatchEncoder(sealObjects.context);
        const textArray = Int32Array.from(text.split('').map(char => char.charCodeAt(0)));
        const plaintext = sealObjects.seal.PlainText();
        batchEncoder.encode(textArray, plaintext);

        const encryptor = sealObjects.seal.Encryptor(sealObjects.context, sealObjects.publicKey);
        const ciphertext = sealObjects.seal.CipherText();
        encryptor.encrypt(plaintext, ciphertext);

        // Serializar el CipherText a un Buffer y luego a Base64
        const buffer = ciphertext.save();
        console.log("Buffer serializado:", buffer);
        console.log("Tamaño del buffer serializado (antes de Base64):", buffer.length);
        return buffer.toString('base64');
    } catch (error) {
        console.error('Error al cifrar el texto:', error);
        throw error;
    }
}

async function decryptText(encryptedText) {
    //console.log("Texto cifrado recibido:", encryptedText);
    if (!sealObjects) {
        console.error("Error: SEAL no está inicializado.");
        throw new Error("SEAL no está inicializado");
    }

    try {
        // Convierte la cadena Base64 de nuevo a un Buffer
        const buffer = Buffer.from(encryptedText, 'base64');
        //console.log("Buffer convertido:", buffer.toString('hex'));
        console.log("Buffer convertido (Base64 a buffer):", buffer);
        console.log("Tamaño del buffer (después de Base64):", buffer.length);

        // Cargar el CipherText desde el Buffer
        const ciphertext = sealObjects.seal.CipherText();
        if (!ciphertext.load(sealObjects.context, buffer)) {
            throw new Error("Error al cargar CipherText desde el buffer");
        }

        console.log("Ciphertext cargado correctamente");

        // Proceso de descifrado
        const decryptor = sealObjects.seal.Decryptor(sealObjects.context, sealObjects.secretKey);
        const decryptedPlaintext = sealObjects.seal.PlainText();
        decryptor.decrypt(ciphertext, decryptedPlaintext);
        console.log("Texto descifrado exitosamente");

        // Decodificar el Plaintext
        const batchEncoder = sealObjects.seal.BatchEncoder(sealObjects.context);
        const decodedArray = batchEncoder.decode(decryptedPlaintext);
        const decodedText = String.fromCharCode.apply(null, decodedArray);
        console.log("Texto descifrado:", decodedText);

        return decodedText;
    } catch (error) {
        console.error('Error al descifrar el texto:', error);
        throw error;
    }
}

// Función para generar un token aleatorio
function generateRandomToken() {
    const tokenLength = 20; // Longitud deseada del token
    const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * possibleCharacters.length);
        token += possibleCharacters[randomIndex];
    }

    return token;
}

// Función para cifrar el token con SHA-256
function encryptToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

// Middleware para verificar el token
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
app.use(express.json({limit: '1000gb'}));  // Agregar esto para parsear cuerpos JSON

// Ruta para servir login.html
app.get('/app/login/login.html', (req, res) => {
    res.sendFile(__dirname + '/public/app/login/login.html');
});

// Función para verificar el token
function verifyToken(req, res, next) {
    const token = req.cookies.token;
    // console.log(token + '\n' + "Este es el token de la cookie");
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

// Ruta para servir profile.html
app.get('/profile', verifyToken, (req, res) => {
    res.sendFile(__dirname + '/public/app/profile/profile.html');
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    res.clearCookie('token');  // Elimina la cookie 'token'
    res.redirect('/app/login/login.html');  // Redirecciona al usuario a la página de inicio de sesión
});

app.get('/getProfile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('UsuarioID', sql.Int, userId)
            .query('SELECT Nombre, Apellido, Email, Usuario, NumeroTelefono FROM Usuarios WHERE UsuarioID = @UsuarioID');
        sql.close();
        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            res.json({
                nombre: user.Nombre,
                apellido: user.Apellido,
                email: user.Email,
                usuario: user.Usuario,
                numeroTelefono: user.NumeroTelefono
            });
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (err) {
        console.error(err);
        sql.close();
        res.status(500).send('Error en el servidor');
    }
});

app.post('/updateProfile', verifyToken, express.json(), async (req, res) => {
    const { nombre, apellido, email, usuario, telefono } = req.body;
    const userId = req.user.userId;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('UsuarioID', sql.Int, userId)
            .input('Nombre', sql.NVarChar(100), nombre)
            .input('Apellido', sql.NVarChar(100), apellido)
            .input('Email', sql.NVarChar(255), email)
            .input('Usuario', sql.NVarChar(50), usuario)
            .input('NumeroTelefono', sql.NVarChar(15), telefono)
            .query('UPDATE Usuarios SET Nombre = @Nombre, Apellido = @Apellido, Email = @Email, Usuario = @Usuario, NumeroTelefono = @NumeroTelefono WHERE UsuarioID = @UsuarioID');
        sql.close();
        res.status(200).send('Perfil actualizado');
    } catch (err) {
        console.error(err);
        sql.close();
        res.status(500).send('Error en el servidor');
    }
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
        console.log(azureBlobUrl + '\n' + "Este es el azureBlobUrl");
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

    console.log(containerClient + '\n' + "Este es el containerClient");
    console.log('\nUploading to Azure storage as blob:\n\t', blobName);
    console.log('\n', blockBlobClient.url, '\n');
    // Lee el archivo del sistema de archivos de forma asíncrona
    const fileData = await fs.readFile(file.path);
    // console.log(fileData + '\n' + "Este es el fileData");

    // Pasa los datos del archivo a uploadData
    const uploadBlobResponse = await blockBlobClient.uploadData(fileData);
    console.log(uploadBlobResponse + '\n' + "Este es el uploadBlobResponse");
    
    // Establece el nivel de acceso del blob a "anónimo de solo lectura"
    await blockBlobClient.setAccessTier("Hot");  // Puedes cambiar "Cool" a "Hot" si prefieres ese nivel de acceso

    // Elimina el archivo temporal de forma asíncrona
    await fs.unlink(file.path);
    return blockBlobClient.url; // Esta es la URL que guardarás en la base de datos
}

// Función para recuperar un bloque de la red Tangle (versión paralela) - Se usa
async function retrieveBlockFromNodesParallel(blockId) {
    console.log('Retrieving block from nodes in parallel...');
    const blockPromises = clients.map(client => client.getBlock(blockId).catch(e => null));
    console.log(blockPromises + '\n' + "Este es el blockPromises");
    const results = await Promise.all(blockPromises);
    console.log(results + '\n' + "Este es el results");
    const fetchedBlock = results.find(block => block !== null);
    console.log(fetchedBlock + '\n' + "Este es el fetchedBlock");
    if (!fetchedBlock) {
        throw new Error('Block not found on any node');
    }
    return fetchedBlock;
}

// Función para recuperar un bloque de la red Tangle (versión secuencial) - No se usa
async function retrieveBlockFromNodes(blockId) {
    for (const client of clients) {
        try {
            console.log('Retrieving block from node:', client.node);
            const fetchedBlock = await client.getBlock(blockId);
            console.log(fetchedBlock + '\n' + "Este es el fetchedBlock");
            if (fetchedBlock) {
                // Procesa el bloque y devuelve la respuesta
                return fetchedBlock;
            }
        } catch (error) {
            console.error('Error retrieving block from node:', error);
        }
    }
    throw new Error('Block not found on any node');
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
        console.log('Block sent: ', blockIdAndBlock_ej, '\n');

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
            //const fetchedBlock = await client.getBlock(blockId);
            const fetchedBlock = await retrieveBlockFromNodesParallel(blockId);
            //const fetchedBlock = await retrieveBlockFromNodes(blockId);
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
            //const fetchedBlock = await client.getBlock(blockId);
            const fetchedBlock = await retrieveBlockFromNodesParallel(blockId);
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

// Configuración del transportador SMTP para Outlook
let transporter = nodemailer.createTransport({
    service: 'Outlook365', // Especifica Outlook como servicio
    auth: {
        user: 'rdipaolaj@outlook.com',
        pass: '12Enero2000---'
    }
});

// Función para enviar el token por correo electrónico
async function sendTokenByEmail(email, token) {
    let mailOptions = {
        from: 'rdipaolaj@outlook.com',
        to: email,
        subject: 'Tu Token de Logeo al Sistema',
        text: `Tu token es: ${token} \nUsa este token para entrar al sistema.`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email enviado: ' + info.response);
    } catch (error) {
        console.error('Error al enviar el email:', error);
    }
}

// Ruta para registrar un nuevo usuario
app.post('/register', express.json(), async (req, res) => {
    const { nombre, apellido, email, usuario, contrasena, telefono } = req.body;

    if (!telefono || !usuario || !contrasena) {
        return res.status(400).send('Los campos obligatorios no están completos.');
    }

    const rawToken = generateRandomToken();

    // Envía el token por correo electrónico
    sendTokenByEmail(email, rawToken);

    const encryptedToken = encryptToken(rawToken);

    console.log('Token:', rawToken); // Token sin cifrar
    console.log('Encrypted Token:', encryptedToken); // Token cifrado
    
    // Espera a que cada campo sea cifrado antes de continuar
    const encryptedNombre = await encryptText(nombre);
    const encryptedApellido = await encryptText(apellido);
    const encryptedEmail = await encryptText(email);
    const encryptedUsuario = await encryptText(usuario);
    const encryptedContrasena = await encryptText(contrasena);
    const encryptedTelefono = await encryptText(telefono);
    
    try {

        const nuevoUsuario = new Usuario({
            token: encryptedToken,
            nombre: encryptedNombre,
            apellido: encryptedApellido,
            email: encryptedEmail,
            usuario: encryptedUsuario,
            contrasena: encryptedContrasena,
            numeroTelefono: encryptedTelefono,
            activo: true
        });

        await nuevoUsuario.save(); // Guarda el usuario en MongoDB

        res.status(201).send('Usuario registrado con datos cifrados');
    } catch (err) {
        console.error(err);
        sql.close();
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para iniciar sesión
app.post('/login',  async (req, res) => {
    const { usuario, contrasena, token } = req.body;
    console.log('Received login request for user:', usuario);  // Añade un log aquí
    console.log(usuario, contrasena, token);
    //const hash = crypto.createHash('sha256').update(contrasena).digest('hex');
    // Verificar si el token proporcionado es válido
    const encryptedToken = encryptToken(token);
    try {
        
        // Buscar al usuario por token cifrado
        const user = await Usuario.findOne({ token: encryptedToken });
        //console.log(user);
        if (user) {
            // Aquí asumimos que tus funciones de descifrado devuelven una promesa
            //const nombreDescifrado = await decryptText(user.nombre);
            // const apellidoDescifrado = await decryptText(user.apellido);
            // const emailDescifrado = await decryptText(user.email);
            const usuarioDescifrado = await decryptText(user.usuario);
            // const contrasenaDescifrada = await decryptText(user.contrasena);
            //console.log(nombreDescifrado + '\n' );
            // Verificar si la contraseña es correcta
            // if (contrasenaDescifrada !== contrasena) {
            //     return res.status(401).json({ message: 'Credenciales inválidas' });
            // }

            // Generar token de acceso (JWT o similar)
            // const accessToken = generateAccessToken(usuarioDescifrado, user._id);
            // console.log(accessToken);
            // res.cookie('token', accessToken, { httpOnly: true });
            // return res.status(200).json({ message: 'Inicio de sesión exitoso', token: accessToken });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }

    } catch (err) {
        console.error(err);
        sql.close();
        res.status(500).json({ message: 'Error en el servidor' });  // Modificado aquí
    }
});

module.exports = app; // Exporta la aplicación Express para las pruebas unitarias (pruebas de integración) en Jest

// Inicia el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});