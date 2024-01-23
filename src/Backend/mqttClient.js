// Importando o pacote MQTT
const mqtt = require('mqtt');
// Importando a função para lidar com mensagens MQTT do controlador de localizações
const { handleMqttMessage } = require('./controllers/LocalizacoesController');

// Configurando o cliente MQTT
const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
  console.log('Cliente MQTT Conectado');
  client.subscribe('intel_m4_rnp_g1', (err) => {
    if (!err) {
      console.log('Inscrito no Tópico');
    }
  });
});

client.on('message', (topic, message) => {
  // Analisar a mensagem recebida como JSON
  const data = JSON.parse(message.toString());
  // Chamar a função para lidar e salvar os dados
  handleMqttMessage(data);
});
