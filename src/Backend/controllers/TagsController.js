// Importa o modelo de Tags
const Tags = require('../models/TagsModel');

// Função para obter todas as tags
const getAllTags = async (req, res) => {
    try {
        // Busca todas as tags no banco de dados
        const tags = await Tags.find();
        // Retorna um array de tags em formato JSON se a busca for bem-sucedida
        res.status(200).json(tags);
    } catch (err) {
        // Retorna um erro 500 se ocorrer algum problema durante a busca
        res.status(500).json({ error: err.message });
    }
}

// Função para obter uma tag pelo código de barras
const getTagBySnBarCode = async (req, res) => {
    try {
        // Obtém o código de barras da requisição
        const snBarCode = req.query.sn_bar_code;
        // Procura uma tag com o código de barras fornecido no banco de dados
        const tag = await Tags.findOne({ sn_bar_code: snBarCode });

        // Verifica se a tag foi encontrada
        if (!tag) {
            // Retorna um erro 404 se a tag não for encontrada
            return res.status(404).json({ error: 'Tag not found' });
        }

        // Retorna a tag encontrada em formato JSON se for encontrada
        res.status(200).json(tag);
    } catch (err) {
        // Retorna um erro 500 se ocorrer algum problema durante o processo
        res.status(500).json({ error: err.message });
    }
}

// Função para criar uma nova tag
const createTag = async (req, res) => {
    try {
        // Cria uma nova tag com base nos dados da requisição
        const newTag = new Tags(req.body);
        // Salva a nova tag no banco de dados
        await newTag.save();
        // Retorna a nova tag criada em formato JSON se for bem-sucedida
        res.status(201).json(newTag);
    } catch (err) {
        // Retorna um erro 500 se ocorrer algum problema durante o processo de criação
        res.status(500).json({ error: err.message });
    }
}

// Função para atualizar uma tag existente
const updateTag = async (req, res) => {
    try {
        // Obtém o código de barras da requisição
        const snBarCode = req.query.sn_bar_code;
        // Procura e atualiza a tag com base no código de barras fornecido
        const updatedTag = await Tags.findOneAndUpdate({ sn_bar_code: snBarCode }, req.body, { new: true });

        // Verifica se a tag foi encontrada e atualizada
        if (!updatedTag) {
            // Retorna um erro 404 se a tag não foi encontrada para atualização
            return res.status(404).json({ error: 'Tag not found' });
        }

        // Retorna a tag atualizada em formato JSON se a atualização for bem-sucedida
        res.status(200).json(updatedTag);
    } catch (err) {
        // Retorna um erro 500 se ocorrer algum problema durante o processo de atualização
        res.status(500).json({ error: err.message });
    }
}

// Função para deletar uma tag
const deleteTag = async (req, res) => {
    try {
        // Obtém o código de barras da requisição
        const snBarCode = req.query.sn_bar_code;
        // Procura e deleta a tag com base no código de barras fornecido
        const tag = await Tags.findOneAndDelete({ sn_bar_code: snBarCode });

        // Verifica se a tag foi encontrada e deletada
        if (!tag) {
            // Retorna um erro 404 se a tag não foi encontrada para exclusão
            return res.status(404).json({ error: 'Tag not found' });
        }

        // Retorna a tag deletada em formato JSON se a exclusão for bem-sucedida
        res.status(200).json(tag);
    } catch (err) {
        // Retorna um erro 500 se ocorrer algum problema durante o processo de exclusão
        res.status(500).json({ error: err.message });
    }
}

// Exporta as funções para uso em outros arquivos
module.exports = {
    getAllTags,
    getTagBySnBarCode,
    createTag,
    updateTag,
    deleteTag
}
