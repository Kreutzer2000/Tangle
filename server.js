// server.js
// Importaciones necesarias
const express = require('express');
const app = express();  // ¡Inicialización de la aplicación Express!
const CryptoJS = require('crypto-js');
const { Client, Block, hexToUtf8, initLogger, TaggedDataPayload, utf8ToHex, Utils } = require('@iota/sdk');
//const { composeAPI } = require('@iota/core');
const { asciiToTrytes } = require('@iota/converter');  // Importa asciiToTrytes de @iota/converter
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 20 * 1024 * 1024 } });  // Configura la carpeta de destino para los archivos cargados y un límite de tamaño de 10MB
const fs = require('fs').promises; 

// Creación del cliente de IOTA
const client = new Client({
    nodes: ['https://api.testnet.shimmer.network'],
});

initLogger();
const SEED = 'MGZSCRYXYCRUBLIEVJC9GZVKZUGIWFMMZVXRBJEMROTCMQHCRZDAY9EKRYDYJWYUOXQHHTEGDF9GEOYCH';  // Reemplaza con tu semilla real

// Sirve archivos estáticos desde el directorio 'public'
app.use(express.static('public'));
app.use(express.json({limit: '10mb'}));  // Agregar esto para parsear cuerpos JSON

// Maneja el archivo encriptado
app.post('/upload', upload.single('file'), async (req, res) => {
    // Cambio: ahora busca 'file' en req.file, no en req.body
    const file = req.file;
    if (!file) {
        res.status(400).send('No file uploaded');
        return;
    }

    const secretKey = req.body.secretKey;
    console.log(secretKey + " = esto es el secretKey de servidor");  // Comprueba que la clave secreta se ha configurado correctamente

    const fileData = await fs.readFile(file.path);

    const base64 = fileData.toString('base64');
    //const wordArray = CryptoJS.enc.Base64.parse(base64);
    const wordArray = CryptoJS.lib.WordArray.create(fileData);
    const encrypted = CryptoJS.AES.encrypt(wordArray, secretKey);
    const base64String = encrypted.toString();
    
    try {
        const decrypted = CryptoJS.AES.decrypt(base64, secretKey, {
            format: CryptoJS.format.OpenSSL
        }).toString(CryptoJS.enc.Latin1);
        const decryptedFileData = decrypted.toString(CryptoJS.enc.Latin1);
        
        if (!decryptedFileData) throw new Error('Decryption failed');

        const options = {
            tag: utf8ToHex('Hello'),
            data: utf8ToHex(base64String),
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
            res.json({ blockId });
    
        } catch (iotaError) {
            // console.error('Error sending message to the Tangle:', JSON.stringify(iotaError, null, 2));
            // res.status(500).send('Server error');
            console.error('Error sending message to the Tangle:', iotaError);
            res.status(500).send('Server error');
        }

    } catch (error) {
        console.error(error.message);
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

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
