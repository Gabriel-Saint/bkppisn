const express = require('express');
const path = require('path');
const db = require('../../config/database');
const categoriasModel = require('../models/cadastrarCategoriaModel'); 

const caminhoAbsoluto = path.resolve(__dirname, '../../view/editarRegistro.ejs');

async function exibirEditar(req, res) {
    const user = req.session.user;
    const categorias = await categoriasModel.listarCategorias(user.id);
    const id = req.query.id;
    const sql = `SELECT * FROM record WHERE id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log("erro:")
        } else {

            const dados = results[0];


            res.render(caminhoAbsoluto, { dados, categorias });
        }
    })
}
function atualizarRegistro(req, res) {
    const userId = req.session.user.id; // ID do usuário logado
    const id = req.body.id; // ID do registro a ser atualizado
    const descricao = req.body.descricao;
    const categoria = req.body.categoria;
    const tipo = req.body.tipo;
    const valor = req.body.valor;
    const data = req.body.data;

    const sqlUpdate = `
        UPDATE record 
        SET description_record = ?, category_id = ?, type_record = ?, value_record = ?, date_record = ? 
        WHERE id = ?;
    `;

    try {
        db.query(sqlUpdate, [descricao, categoria, tipo, valor, data, id], (erro) => {
            if (erro) {
                console.error('Erro ao atualizar registro no banco de dados:', erro);
                return res.status(500).send('Erro ao atualizar registro!');
            }

            // Inserir log na tabela system_logs
            const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
            const logMessage = `Usuário ID ${userId} alterou o registro ID ${id}`;
            db.query(sqlLogInsert, [userId, logMessage], (logErr) => {
                if (logErr) {
                    console.error('Erro ao registrar log no banco de dados:', logErr);
                    return res.status(500).send('Erro ao registrar log.');
                }

                console.log('Registro atualizado e log registrado com sucesso.');
                res.redirect('/home');
            });
        });
    } catch (error) {
        console.error('Erro ao atualizar registro no banco de dados:', error);
        res.status(500).send('Erro interno ao processar a atualização.');
    }
}
function deletarRegistro(req, res) {
    const userId = req.session.user.id; // ID do usuário logado
    const id = req.body.id; // ID do registro a ser deletado

    const sqlDelete = 'DELETE FROM record WHERE id = ?;';
    try {
        db.query(sqlDelete, [id], (erro) => {
            if (erro) {
                console.error('Erro ao deletar registro no banco de dados:', erro);
                return res.status(500).send('Erro ao deletar registro!');
            }

            // Inserir log na tabela system_logs
            const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
            const logMessage = `Usuário ID ${userId} deletou o registro ID ${id}`;
            db.query(sqlLogInsert, [userId, logMessage], (logErr) => {
                if (logErr) {
                    console.error('Erro ao registrar log no banco de dados:', logErr);
                    return res.status(500).send('Erro ao registrar log.');
                }

                console.log('Registro deletado e log registrado com sucesso.');
                res.redirect('/home');
            });
        });
    } catch (error) {
        console.error('Erro ao deletar registro no banco de dados:', error);
        res.status(500).send('Erro interno ao processar a exclusão.');
    }
}

module.exports = {
    exibirEditar: exibirEditar,
    atualizarRegistro: atualizarRegistro,
    deletarRegistro: deletarRegistro
}