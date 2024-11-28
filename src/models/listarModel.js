
const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../../config/database');

const caminhoAbsoluto = path.resolve(__dirname, '../../view/listar.ejs');

function listar(req, res) {
    try {

        const sql = 'SELECT * FROM user_data';

        db.query(sql, [], (erro, rows) => {

            if (erro) {
                console.error('Erro ao consultar dados no banco de dados:', erro);
                res.status(500).send('Erro ao listar usuários');
            } else {
                const dados = rows || [];
                console.log(dados)
                console.log("---------")
                res.render(caminhoAbsoluto, { dados });
            }

        })

    } catch (erro) {
        console.error('Erro ao consultar dados no banco de dados:', erro);
        res.status(500).send('Erro ao listar usuários');
    }
}

module.exports = {
    listar: listar
};