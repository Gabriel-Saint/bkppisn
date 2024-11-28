const express = require('express');
const router = express.Router();
const path = require('path');


const caminhoAbsoluto = path.resolve(__dirname, '../../view/cadastro.ejs');

function exibirCadastrar(req, res) {
    let mensagemErro ='';
    res.render(caminhoAbsoluto, {mensagemErro});
}

module.exports = {
    exibirCadastrar: exibirCadastrar
};
