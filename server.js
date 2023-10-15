// server.js
// Importaciones necesarias
const express = require('express');
const app = express();  // ¡Inicialización de la aplicación Express!
const CryptoJS = require('crypto-js');
//const { Client } = require('@iota/client');
const { Client, Block, hexToUtf8, initLogger, TaggedDataPayload, utf8ToHex, Utils } = require('@iota/sdk');
//const { composeAPI } = require('@iota/core');
const { asciiToTrytes } = require('@iota/converter');  // Importa asciiToTrytes de @iota/converter
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });  // Configura la carpeta de destino para los archivos cargados y un límite de tamaño de 10MB

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

    const options = {
        tag: utf8ToHex('Hello'),
        data: utf8ToHex('Tangle'),
    };
    
    // Cambio: Convierte el buffer del archivo directamente a una WordArray
    const encryptedWordArray = CryptoJS.lib.WordArray.create(file.buffer);
    const decrypted = CryptoJS.AES.decrypt(encryptedWordArray, 'secret key');
    const decryptedFileData = decrypted.toString(CryptoJS.enc.Utf8);

    const message = {
        data: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(decryptedFileData))
    };
    console.log(message + " " + message.data + "esto es el mensaje");
    try {
        // Enviar el mensaje a la Tangle
        const payload = asciiToTrytes(JSON.stringify(message));
        console.log(payload + " " + payload.data + " " + "esto es el payload");
        
        const mnemonic = Utils.generateMnemonic();
        const secretManager = { mnemonic: mnemonic };

        const blockIdAndBlock = await client.buildAndPostBlock();
        console.log('Block:', blockIdAndBlock, '\n');

        // Fetch a block ID from the node.
        const blockIds = await client.getTips();
        console.log('Block IDs:', blockIds, '\n');

        // Get the metadata for the block.
        const blockMetadata = await client.getBlockMetadata(blockIds[0]);
        console.log('Block metadata: ', blockMetadata, '\n');

        // Request the block by its id.
        const blockData = await client.getBlock(blockIds[0]);
        console.log('Block data: ', blockData, '\n');

        // Create block with tagged payload
        const blockIdAndBlock_ej = await client.buildAndPostBlock(
            secretManager,
            options,
        );

        console.log(
            `Block sent: ${process.env.EXPLORER_URL}/block/${blockIdAndBlock_ej[0]}`,
        );

        const fetchedBlock = await client.getBlock(blockIdAndBlock_ej[0]);
        console.log('Block data: ', fetchedBlock);

        if (fetchedBlock.payload instanceof TaggedDataPayload) {
            const payload = fetchedBlock.payload ;
            console.log('Decoded data:', hexToUtf8(payload.data));
        }

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
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
