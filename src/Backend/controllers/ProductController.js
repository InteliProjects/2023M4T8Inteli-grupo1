const Product = require('../models/ProductModel'); // Importa o modelo de Produto

// Obtém todos os produtos do banco de dados
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Encontra todos os produtos
    res.status(200).json(products); // Retorna os produtos como JSON com status 200 (OK)
  } catch (err) {
    res.status(500).json({ error: err.message }); // Em caso de erro, retorna um erro interno do servidor com detalhes
  }
};

// Obtém um produto pelo código de barras
const getProductBySnBarCode = async (req, res) => {
    try {
      const snBarCode = req.query.sn_bar_code; // Obtém o código de barras da requisição
      const product = await Product.findOne({ sn_bar_code: snBarCode }); // Encontra um produto pelo código de barras
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' }); // Se o produto não for encontrado, retorna um erro 404 (Não encontrado)
      }
  
      res.status(200).json(product); // Retorna o produto encontrado como JSON com status 200 (OK)
    } catch (err) {
      res.status(500).json({ error: err.message }); // Em caso de erro, retorna um erro interno do servidor com detalhes
    }
  };

// Cria um novo produto no banco de dados
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body); // Cria um novo produto com base nos dados da requisição
    await newProduct.save(); // Salva o novo produto no banco de dados
    res.status(201).json(newProduct); // Retorna o novo produto como JSON com status 201 (Criado)
  } catch (err) {
    res.status(500).json({ error: err.message }); // Em caso de erro, retorna um erro interno do servidor com detalhes
  }
};

// Atualiza um produto existente pelo código de barras
const updateProduct = async (req, res) => {
    try {
      const snBarCode = req.query.sn_bar_code; // Obtém o código de barras da requisição
      const updatedProduct = await Product.findOneAndUpdate({ sn_bar_code: snBarCode }, req.body, { new: true }); // Procura e atualiza um produto pelo código de barras
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' }); // Se o produto não for encontrado, retorna um erro 404 (Não encontrado)
      }
  
      res.status(200).json(updatedProduct); // Retorna o produto atualizado como JSON com status 200 (OK)
    } catch (err) {
      res.status(500).json({ error: err.message }); // Em caso de erro, retorna um erro interno do servidor com detalhes
    }
  };

// Deleta um produto pelo código de barras
const deleteProduct = async (req, res) => {
    try {
      const snBarCode = req.query.sn_bar_code; // Obtém o código de barras da requisição
      const product = await Product.findOneAndDelete({ sn_bar_code: snBarCode }); // Procura e deleta um produto pelo código de barras
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' }); // Se o produto não for encontrado, retorna um erro 404 (Não encontrado)
      }
  
      res.status(200).json({ message: 'Product deleted successfully' }); // Retorna uma mensagem indicando que o produto foi deletado com sucesso
    } catch (err) {
      res.status(500).json({ error: err.message }); // Em caso de erro, retorna um erro interno do servidor com detalhes
    }
  };
  
module.exports = {
    getAllProducts,
    getProductBySnBarCode,
    createProduct,
    updateProduct,
    deleteProduct
};
