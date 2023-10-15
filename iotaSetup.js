const { composeAPI } = require('@iota/core');
const crypto = require('crypto');

// Función para generar una semilla
function generateSeed() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    let seed = '';
    while (seed.length < 81) {
        const randChar = charset[crypto.randomInt(charset.length)];
        seed += randChar;
    }
    return seed;
}

// Configuración de la API de IOTA
const iota = composeAPI({
    provider: 'https://api.lb-0.h.chrysalis-devnet.iota.cafe',
});

async function generateAddress() {
    const seed = generateSeed();
    console.log('Tu semilla es:', seed);

    try {
        const addresses = await iota.getNewAddress(seed, {
            index: 0,
            total: 1,
        });
        console.log('Tu nueva dirección es:', addresses[0]);
        return { seed, address: addresses[0] };
    } catch (error) {
        console.error('Error obteniendo dirección:', error);
    }
}

generateAddress();