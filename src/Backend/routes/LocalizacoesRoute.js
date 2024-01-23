// Importa o pacote 'express' para criação de rotas
const express = require('express');

// Cria um objeto router para lidar com as rotas
const router = express.Router();

// Importa o controlador 'localizacoesController' que contém as funções para operações com localizações
const localizacoesController = require('../controllers/LocalizacoesController');

// Define as rotas e associa cada rota a uma função no controlador 'localizacoesController'

// Rota para buscar todas as localizações
router.get('/', localizacoesController.getAllLocalizacoes);

// Rota para buscar localizações pelo código de barras
router.get('/', localizacoesController.getLocalizacoesBySnBarCode);

// Rota para criar uma nova localização
router.post('/', localizacoesController.createLocalizacoes);

// Rota para atualizar uma localização existente
router.put('/', localizacoesController.updateLocalizacoes);

// Rota para deletar uma localização
router.delete('/', localizacoesController.deleteLocalizacoes);

// Exporta o router para uso em outros arquivos
module.exports = router;
