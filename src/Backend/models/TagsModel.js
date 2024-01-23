// Importa a biblioteca mongoose para interagir com o MongoDB
const mongoose = require('mongoose');

// Define um esquema para a coleção 'tags' no MongoDB
const tagsSchema = new mongoose.Schema({
    // Define o campo 'id' do tipo String no esquema
    id: String,
    // Define o campo 'sn_bar_code' do tipo String no esquema
    sn_bar_code: String,
    // Define o campo 'tag' do tipo String no esquema
    tag: String
});

// Exporta um modelo baseado no esquema 'tagsSchema' para a coleção 'tags'
// Isso permite realizar operações CRUD (Create, Read, Update, Delete) na coleção 'tags'
module.exports = mongoose.model('tags', tagsSchema, 'tags');
