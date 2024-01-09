const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    token: String,
    nombre: String,
    apellido: String,
    email: String,
    usuario: String,
    contrasena: String,
    fechaCreacion: { type: Date, default: Date.now },
    activo: Boolean,
    numeroTelefono: String
}, { versionKey: false });

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
