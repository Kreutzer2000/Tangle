// En archivo models/RegistrosAcceso.js
const mongoose = require('mongoose');

const registrosAccesoSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    fechaAcceso: { type: Date, default: Date.now },
    ip: String,
    userAgent: String
}, { versionKey: false });

const RegistrosAcceso = mongoose.model('RegistrosAcceso', registrosAccesoSchema);

module.exports = RegistrosAcceso;
