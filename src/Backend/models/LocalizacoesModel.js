// Importa a biblioteca mongoose para interagir com o MongoDB
const mongoose = require('mongoose');

// Define um esquema para a coleção 'localizacoes' no MongoDB
const Localizacoes = new mongoose.Schema({
    // Define o campo 'sn_bar_code' do tipo String no esquema
    sn_bar_code: String,
    // Define o campo 'latitude' do tipo String no esquema
    latitude: String,
    // Define o campo 'longitude' do tipo String no esquema
    longitude: String,
    // Define o campo 'data_hora' do tipo Date no esquema
    data_hora: Date
}, { versionKey: false }); // Opção para desativar a inclusão automática do "__v" (version key) nos documentos

// Exporta um modelo baseado no esquema 'Localizacoes' para a coleção 'localizacoes'
// Isso permite realizar operações CRUD (Create, Read, Update, Delete) na coleção 'localizacoes'
module.exports = mongoose.model('localizacoes', Localizacoes, 'localizacoes');
