const path = require('path');
const caminhoAbsoluto = path.resolve(__dirname, '../../view/novoUsuario.ejs');

function exibirCadastrarUsuario(req, res) {
    let mensagemErro ='';
    res.render(caminhoAbsoluto, {mensagemErro});
}

module.exports = {
    exibirCadastrarUsuario: exibirCadastrarUsuario
};
