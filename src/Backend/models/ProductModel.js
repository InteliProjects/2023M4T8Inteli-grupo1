// Importa a biblioteca mongoose para interagir com o MongoDB
const mongoose = require('mongoose');

// Define um esquema para a coleção 'banco_rnp' no MongoDB
const productSchema = new mongoose.Schema({
    // Define os campos e seus tipos para os documentos na coleção 'banco_rnp'
    description: String, // Descrição do produto (String)
    inicio_contrato: Date, // Data de início do contrato (Date)
    board_type: String, // Tipo de placa (String)
    num_contrato: Number, // Número do contrato (Number)
    board_name: String, // Nome da placa (String)
    fim_contrato: Date, // Data de término do contrato (Date)
    ne_type_mpu_type: String, // Tipo de NE/MPU (String)
    pn_bom_code: String, // Código PN/BOM (String)
    sn_bar_code: String, // Código de barras SN (String)
    list_price_usd: String, // Preço de lista em USD (String)
    preco_real: String, // Preço real (String)
    processo_compra: String, // Processo de compra (String)
    ne_name: String, // Nome do NE (String)
    projeto: String, // Projeto relacionado (String)
    fim_garantia: String, // Data de fim de garantia (String)
    cidade: String, // Cidade (String)
    uf: String, // Estado/UF (String)
    board_full_name: String, // Nome completo da placa (String)
    ne_adress: String // Endereço NE (String)
});

// Exporta um modelo baseado no esquema 'productSchema' para a coleção 'banco_rnp'
// Isso permite realizar operações CRUD (Create, Read, Update, Delete) na coleção 'banco_rnp'
module.exports = mongoose.model('banco_rnp', productSchema, 'banco_rnp');
