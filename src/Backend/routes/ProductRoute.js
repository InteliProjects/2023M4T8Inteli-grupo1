// Importa o pacote 'express' para criação de rotas
const express = require('express');

// Cria um objeto router para lidar com as rotas
const router = express.Router();

// Importa o controlador 'productController' que contém as funções para operações com produtos
const productController = require('../controllers/ProductController');

// Define as rotas e associa cada rota a uma função no controlador 'productController'

// Rota para buscar todos os produtos
router.get('/', productController.getAllProducts);

// Rota para buscar um produto pelo código de barras
router.get('/', productController.getProductBySnBarCode);

// Rota para criar um novo produto
router.post('/', productController.createProduct);

// Rota para atualizar um produto existente
router.put('/', productController.updateProduct);

// Rota para deletar um produto
router.delete('/', productController.deleteProduct);

// Exporta o router para uso em outros arquivos
module.exports = router;
