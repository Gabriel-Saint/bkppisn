const path = require('path');
const categoriasModel = require('../models/cadastrarCategoriaModel'); 
const CadastrarCategorias = path.resolve(__dirname, '../../view/cadastrarCategoria.ejs');

async function exibirCadastrarCategorias(req, res) {
    
    const userId = req.session.user.id;
    console.log(userId);
    const categorias = await categoriasModel.listarCategorias(userId);
    res.render(CadastrarCategorias, { categorias });
}

module.exports = {
    exibirCadastrarCategorias: exibirCadastrarCategorias
};
