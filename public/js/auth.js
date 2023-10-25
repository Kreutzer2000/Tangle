// En ./public/js/auth.js
const jwt = require('jsonwebtoken');

function generateAccessToken(username, userId) {  // Asegúrate de incluir userId aquí
    const payload = {
        username,
        userId,  // incluye userId en el payload
        // ... otros datos que quieras incluir
    };
    const token = jwt.sign(payload, 'clave_secreta', { expiresIn: '1h' });  // asume que jwt es una instancia de jsonwebtoken
    console.log(token);
    return token;
}

module.exports = generateAccessToken;
