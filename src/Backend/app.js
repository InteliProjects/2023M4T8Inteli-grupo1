// Importa o pacote 'express' para criar o servidor
const express = require('express');

// Importa as funções de configuração e conexão com o banco de dados do arquivo './config'
const { config, connectToDatabase } = require('./config');

// Importa a configuração mqtt
// const setupMqttClient = require('./mqttClient');

// Importa os middlewares de configuração do servidor do arquivo './middlewares'
const setupMiddlewares = require('./middlewares');

// Importa os arquivos de rotas para diferentes funcionalidades
const productRoutes = require('./routes/ProductRoute');
const localizacoesRoutes = require('./routes/LocalizacoesRoute');
const cadastrosRoutes = require('./routes/CadastrosRoute');
const tagsRoutes = require('./routes/TagsRoute');

// Cria uma instância do aplicativo Express
const app = express();

// Configura os middlewares do aplicativo
setupMiddlewares(app);

// Rota principal, retorna uma mensagem simples
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Define as rotas para diferentes funcionalidades usando os arquivos de rotas importados
app.use('/product', productRoutes);
app.use('/localizacoes', localizacoesRoutes);
app.use('/cadastros', cadastrosRoutes);
app.use('/tags', tagsRoutes);

// Conecta ao banco de dados
connectToDatabase();

// Isso inicializa o cliente MQTT
// setupMqttClient(); 

// Inicia o servidor na porta especificada no arquivo de configuração
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});


// não foi testado com o uso do mqtt e não foi adicionado as dependências da biblioteca mqtt
