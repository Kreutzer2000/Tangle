// server.js
// Importaciones necesarias
const express = require('express');
const cookieParser = require('cookie-parser');
const sql = require('mssql/msnodesqlv8');

const { Client, Block, hexToUtf8, initLogger, TaggedDataPayload, utf8ToHex, Utils } = require('@iota/sdk');
//const { composeAPI } = require('@iota/core');
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 20 * 1024 * 1024 } });  
const fs = require('fs').promises; 
const sha3 = require('js-sha3');

const jwt = require('jsonwebtoken');  // Importa jsonwebtoken

const expressJwt = require('express-jwt');

const app = express();  // ¡Inicialización de la aplicación Express!
app.use(cookieParser());

const generateAccessToken = require('./public/js/auth.js');

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
            console.log(req.user);
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

// Maneja el hash SHA-3
app.post('/upload', upload.none(), async (req, res) => { // Cambio: upload.none() ya que ya no estás enviando un archivo
    const hash = req.body.hash;
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
            .query('INSERT INTO TransaccionesTangle (UsuarioID, HashSHA3, BlockID, ProtocolVersion, Parents, PayloadType, PayloadTag, PayloadData, Nonce) VALUES (@UsuarioID, @HashSHA3, @BlockID, @ProtocolVersion, @Parents, @PayloadType, @PayloadTag, @PayloadData, @Nonce)');

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
        const fetchedBlock = await client.getBlock(blockId);
        console.log('Block data: ', fetchedBlock);
        if (fetchedBlock.payload instanceof TaggedDataPayload) {
            const payload = fetchedBlock.payload;
            // const encryptedFileData = hexToUtf8(payload.data);
            // res.send(encryptedFileData);
            const encryptedFileDataBase64 = hexToUtf8(payload.data);
            res.send({ encryptedFileData: encryptedFileDataBase64 });
        } else {
            res.status(400).send('Invalid block payload');
        }
    } catch (iotaError) {
        console.error('Error retrieving block from the Tangle:', iotaError);
        res.status(500).send('Server error');
    }
});

// Ruta para registrar un nuevo usuario
app.post('/register', express.json(), async (req, res) => {
    const { nombre, apellido, email, usuario, contrasena } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('Nombre', sql.NVarChar(100), nombre)
            .input('Apellido', sql.NVarChar(100), apellido)
            .input('Email', sql.NVarChar(255), email)
            .input('Usuario', sql.NVarChar(50), usuario)
            .input('Contrasena', sql.NVarChar(255), contrasena)
            .query('INSERT INTO Usuarios (Nombre, Apellido, Email, Usuario, Contrasena) VALUES (@Nombre, @Apellido, @Email, @Usuario, @Contrasena)');
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
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('Usuario', sql.NVarChar(50), usuario)
            .input('Contrasena', sql.NVarChar(255), contrasena)
            .query('SELECT * FROM Usuarios WHERE Usuario = @Usuario AND Contrasena = @Contrasena');
        sql.close();
        if (result.recordset.length > 0) {
            // Inicio de sesión exitoso, genera el token
            const user = result.recordset[0];
            const token = generateAccessToken(usuario, user.UsuarioID);   // pasa el UsuarioID a la función
            console.log(token);
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