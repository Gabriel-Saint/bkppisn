const express = require('express');
const router = express.Router();
const path = require('path');


const caminhoAbsolutoEditar = path.resolve(__dirname, '../../view/editar.ejs');

function exibirEditar(req, res) {
    const user = req.session.user;
    const admin = req.session.user.admin || 0;
    const id = req.query.id;
    const nome = decodeURIComponent(req.query.nome);
    const email = decodeURIComponent(req.query.email);

    if(admin === 1){
        let dados = {
            id: id,
            nome: nome,
            email: email,
            admin: admin
        
        }
        res.render(caminhoAbsolutoEditar, { dados });
    }
        
    if (admin === 0 ){
        let dados = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            admin: user.admin
        }
        console.log('--------------')
        console.log(user)
        res.render(caminhoAbsolutoEditar, { dados });
    }
}


module.exports = {
    exibirEditar: exibirEditar
};
