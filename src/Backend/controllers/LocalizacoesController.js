// Importa o modelo Localizacoes para interagir com os dados do banco de dados
const Localizacoes = require('../models/LocalizacoesModel');

// Função para lidar com mensagens MQTT e salvar no banco de dados
const handleMqttMessage = async (mqttData) => {
    try {
        // Cria uma nova localização com os dados da mensagem MQTT
        const newLocalizacoes = new Localizacoes({
            sn_bar_code: mqttData.sn_bar_code,
            latitude: mqttData.latitude,
            longitude: mqttData.longitude,
            data_hora: mqttData.dateTime
        });

        // Salva a nova localização no banco de dados
        await newLocalizacoes.save();
        console.log('Nova localização salva com sucesso');
    } catch (err) {
        // Loga o erro em caso de falha ao salvar
        console.error('Erro ao salvar nova localização', err);
    }
};


// Função para obter todas as localizações
const getAllLocalizacoes = async (req, res) => {
    try {
        const localizacoes = await Localizacoes.find(); // Busca todas as localizações
        res.status(200).json(localizacoes); // Retorna as localizações encontradas
    } catch (err) {
        res.status(500).json({ error: err.message }); // Retorna um erro interno do servidor em caso de falha
    }
};

// Função para obter uma localização com base no código de barras
const getLocalizacoesBySnBarCode = async (req, res) => {
    try {
        const snBarCode = req.query.sn_bar_code; // Obtém o código de barras da requisição
        const localizacoes = await Localizacoes.findOne({ sn_bar_code: snBarCode }); // Busca a localização pelo código de barras

        if (!localizacoes) {
            return res.status(404).json({ error: 'Localizacoes not found' }); // Retorna um erro se a localização não for encontrada
        }

        res.status(200).json(localizacoes); // Retorna a localização encontrada
    } catch (err) {
        res.status(500).json({ error: err.message }); // Retorna um erro interno do servidor em caso de falha
    }
};

// Função para criar uma nova localização
const createLocalizacoes = async (req, res) => {
    try {
        const newLocalizacoes = new Localizacoes(req.body); // Cria uma nova instância de localização com os dados da requisição
        await newLocalizacoes.save(); // Salva a nova localização no banco de dados

        res.status(201).json({ message: 'Localizacoes created successfully' }); // Retorna uma mensagem de sucesso
    } catch (err) {
        res.status(500).json({ error: err.message }); // Retorna um erro interno do servidor em caso de falha
    }
};

// Função para deletar uma localização com base no código de barras
const deleteLocalizacoes = async (req, res) => {
    try {
        const snBarCode = req.query.sn_bar_code; // Obtém o código de barras da requisição
        const localizacoes = await Localizacoes.findOneAndDelete({ sn_bar_code: snBarCode }); // Busca e deleta a localização pelo código de barras

        if (!localizacoes) {
            return res.status(404).json({ error: 'Localizacoes not found' }); // Retorna um erro se a localização não for encontrada
        }

        res.status(200).json(localizacoes); // Retorna a localização deletada
    } catch (err) {
        res.status(500).json({ error: err.message }); // Retorna um erro interno do servidor em caso de falha
    }
};

// Função para atualizar uma localização com base no código de barras
const updateLocalizacoes = async (req, res) => {
    try {
        const snBarCode = req.query.sn_bar_code; // Obtém o código de barras da requisição
        const localizacoes = await Localizacoes.findOneAndUpdate({ sn_bar_code: snBarCode }, req.body, { new: true }); // Busca e atualiza a localização pelo código de barras

        if (!localizacoes) {
            return res.status(404).json({ error: 'Localizacoes not found' }); // Retorna um erro se a localização não for encontrada
        }

        res.status(200).json(localizacoes); // Retorna a localização atualizada
    } catch (err) {
        res.status(500).json({ error: err.message }); // Retorna um erro interno do servidor em caso de falha
    }
};

// Exporta as funções para uso em outros arquivos
module.exports = {
    handleMqttMessage,
    getAllLocalizacoes,
    getLocalizacoesBySnBarCode,
    createLocalizacoes,
    deleteLocalizacoes,
    updateLocalizacoes
};
