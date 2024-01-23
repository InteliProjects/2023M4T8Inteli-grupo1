// Importa o pacote 'express' para criação de rotas
const express = require('express');

// Cria um objeto router para lidar com as rotas
const router = express.Router();

// Importa o controlador 'cadastrosController' que contém as funções para registro e login
const cadastrosController = require('../controllers/CadastrosController');

// Define as rotas e associa cada rota a uma função no controlador 'cadastrosController'
router.post('/register', cadastrosController.register); // Rota para registro de usuário
router.post('/login', cadastrosController.login); // Rota para login de usuário

// Exporta o router para uso em outros arquivos
module.exports = router;
