const path = require('path');
const categoriasModel = require('../models/cadastrarCategoriaModel'); 

const caminhoAbsolutoHome = path.resolve(__dirname, '../../view/home.ejs');

async function exibirHome(req, res) {

    try {
        const user = req.session.user;
        const admin = req.session.user.admin || 0;

        const categorias = await categoriasModel.listarCategorias(user.id);
        console.log(categorias)
        res.render(caminhoAbsolutoHome, { user, admin, categorias });

    } catch (erro) {
        console.error('Erro ao carregar a página home:', erro);
        mensagemErro = 'Erro ao carregar a página';
        res.render(caminhoAbsolutoHome, { user: req.session.user, admin: req.session.user.admin, categorias: [] });
    }
}

module.exports = {
    exibirHome
};
