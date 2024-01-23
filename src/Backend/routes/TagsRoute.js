// Importa o pacote 'express' para criação de rotas
const express = require('express');

// Cria um objeto router para lidar com as rotas
const router = express.Router();

// Importa o controlador 'tagsController' que contém as funções para operações com tags
const tagsController = require('../controllers/TagsController');

// Define as rotas e associa cada rota a uma função no controlador 'tagsController'

// Rota para buscar todas as tags
router.get('/', tagsController.getAllTags);

// Rota para buscar uma tag pelo código de barras
router.get('/', tagsController.getTagBySnBarCode);

// Rota para criar uma nova tag
router.post('/', tagsController.createTag);

// Rota para atualizar uma tag existente
router.put('/', tagsController.updateTag);

// Rota para deletar uma tag
router.delete('/', tagsController.deleteTag);

// Exporta o router para uso em outros arquivos
module.exports = router;
