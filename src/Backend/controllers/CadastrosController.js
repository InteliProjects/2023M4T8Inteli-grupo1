// Importa o modelo de Cadastros e a biblioteca bcrypt para hash de senhas
const Cadastros = require('../models/CadastrosModel');
const bcrypt = require('bcryptjs');

// Constantes para códigos de status HTTP
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

// Função para registrar um novo usuário
const register = async (req, res) => {
    try {
        // Extrai email e senha do corpo da requisição
        const { email, senha } = req.body;

        // Verifica se email e senha foram fornecidos
        if (!email || !senha) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Email e senha são obrigatórios' });
        }

        // Verifica se o email já está cadastrado
        const existingUser = await Cadastros.findOne({ email });
        if (existingUser) {
            return res.status(HTTP_STATUS.CONFLICT).json({ error: 'Email já cadastrado' });
        }

        // Gera um hash da senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(senha, 10);
        
        // Cria um novo cadastro no banco de dados com email e senha hasheda
        const newCadastro = await Cadastros.create({
            email,
            senha: hashedPassword
        });

        // Remove a senha do objeto antes de retornar na resposta
        const responseCadastro = { ...newCadastro._doc };
        delete responseCadastro.senha;

        // Retorna uma mensagem de sucesso com os dados do novo cadastro
        res.status(HTTP_STATUS.CREATED).json({ message: 'Cadastro realizado com sucesso', user: responseCadastro });

    } catch (err) {
        // Em caso de erro, retorna um status de erro interno do servidor
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

// Função para realizar o login de um usuário
const login = async (req, res) => {
    try {
        // Extrai email e senha do corpo da requisição
        const { email, senha } = req.body;

        // Procura pelo usuário com o email fornecido
        const user = await Cadastros.findOne({ email });
        if (!user) {
            // Se o usuário não existe, retorna um erro de não autorizado
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Email ou senha inválidos' });
        }

        // Compara a senha fornecida com a senha hasheda do usuário no banco de dados
        const senhaCorrespondente = await bcrypt.compare(senha, user.senha);
        if (!senhaCorrespondente) {
            // Se as senhas não coincidem, retorna um erro de não autorizado
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Email ou senha inválidos' });
        }

        // Se tudo estiver correto, retorna uma mensagem de sucesso de login
        res.status(HTTP_STATUS.OK).json({ message: 'Login realizado com sucesso' });
    } catch (err) {
        // Em caso de erro, retorna um status de erro interno do servidor
        console.error('Erro no processo de login:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

// Exporta as funções 'register' e 'login' para uso em outros arquivos
module.exports = {
    register,
    login,
};
