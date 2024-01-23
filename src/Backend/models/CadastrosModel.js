// Importa a biblioteca mongoose, que permite interagir com o MongoDB no Node.js
const mongoose = require('mongoose');

// Cria um esquema para a coleção 'cadastros' no MongoDB
const cadastrosSchema = new mongoose.Schema({
    // Define o campo 'id' do tipo String no esquema
    id: String,
    // Define o campo 'email' do tipo String no esquema
    email: String,
    // Define o campo 'senha' do tipo String no esquema
    senha: String
});

// Exporta um modelo baseado no esquema 'cadastrosSchema' para a coleção 'cadastros'
// Isso permite realizar operações CRUD (Create, Read, Update, Delete) na coleção 'cadastros'
module.exports = mongoose.model('cadastros', cadastrosSchema, 'cadastros');
