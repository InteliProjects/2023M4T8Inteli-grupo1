// Importa o pacote mongoose, que permite interagir com o MongoDB
const mongoose = require('mongoose');

// Configurações para o servidor e banco de dados
const config = {
  port: 3000, // Porta do servidor
  db: {
    user: 'admin', // Nome de usuário do banco de dados
    password: 'dozka3-qebKiq-rifvib', // Senha do banco de dados
    host: '2023-2semestre.skcrjtb.mongodb.net', // Endereço do host do banco de dados
    dbName: 'banco_de_dados_gp1', // Nome do banco de dados
  }
};

// Função para conectar ao banco de dados
const connectToDatabase = () => {
  // Extrai informações do objeto de configuração para facilitar o acesso
  const DB_USER = config.db.user;
  const DB_PASS = encodeURIComponent(config.db.password);
  const DB_HOST = config.db.host;
  const DB_NAME = config.db.dbName;

  // Conecta ao banco de dados usando as informações fornecidas
  mongoose
    .connect(
      `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
      console.log('Conectado ao banco de dados'); // Mensagem de sucesso ao conectar
    })
    .catch((err) => {
      console.error('Erro ao conectar ao banco de dados', err); // Mensagem de erro se a conexão falhar
      process.exit(1); // Encerra o processo com um código de erro
    });
};

// Exporta as configurações e a função de conexão para uso em outros arquivos
module.exports = { config, connectToDatabase };
