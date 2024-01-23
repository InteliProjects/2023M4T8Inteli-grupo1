// Importa o Express para criação de servidor e o CORS para lidar com políticas de segurança do navegador
const express = require('express');
const cors = require('cors');

// Função responsável por configurar os middlewares na aplicação Express
const setupMiddlewares = (app) => {
  // Configuração do middleware para analisar dados codificados na URL
  app.use(express.urlencoded({ extended: true }));
  
  // Configuração do middleware para analisar solicitações com corpo em JSON
  app.use(express.json());
  
  // Middleware para lidar com CORS (Cross-Origin Resource Sharing)
  app.use(cors());
};

// Exporta a função setupMiddlewares para ser utilizada na configuração da aplicação
module.exports = setupMiddlewares;
