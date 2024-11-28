const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../../config/database');


function cadastrarCategoria(req, res) {
    try {
        const userId = req.session.user.id; // ID do usuário logado
        const nameCategory = req.body.novaCategoria; // Nome da nova categoria

        // Inserir categoria na tabela `category`
        const sqlInsertCategory = 'INSERT INTO category(user_id, name_category) VALUES (?, ?)';
        db.query(sqlInsertCategory, [userId, nameCategory], (err, results) => {
            if (err) {
                console.error('Erro ao inserir a categoria no banco de dados:', err);
                return res.status(500).send('Erro ao cadastrar categoria.');
            }

            const categoryId = results.insertId; // ID da nova categoria criada

            // Inserir log na tabela `system_logs`
            const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
            const logMessage = `Usuário ID ${userId} cadastrou a categoria ID ${categoryId} (${nameCategory})`;
            db.query(sqlLogInsert, [userId, logMessage], (logErr) => {
                if (logErr) {
                    console.error('Erro ao registrar log no banco de dados:', logErr);
                    return res.status(500).send('Erro ao registrar log.');
                }

                console.log('Categoria cadastrada e log registrado com sucesso.');
                res.redirect('/cadastrar-categoria');
            });
        });
    } catch (err) {
        console.error('Ocorreu um erro ao cadastrar a categoria:', err);
        res.status(500).send('Erro interno ao processar o cadastro da categoria.');
    }
}
function DeletarCategoria(req, res) {
    try {
        const userId = req.session.user.id; // ID do usuário logado
        const categoryId = req.params.id; // ID da categoria a ser deletada

        // Deletar categoria na tabela `category`
        const sqlDeleteCategory = 'DELETE FROM category WHERE user_id = ? AND id = ?';
        db.query(sqlDeleteCategory, [userId, categoryId], (err, results) => {
            if (err) {
                console.error('Erro ao excluir a categoria do banco de dados:', err);
                return res.status(500).send('Erro ao excluir a categoria.');
            }

            if (results.affectedRows === 0) {
                // Caso nenhuma categoria seja deletada, informa que não foi encontrada
                return res.status(404).send('Categoria não encontrada ou não pertence ao usuário.');
            }

            // Inserir log na tabela `system_logs`
            const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
            const logMessage = `Usuário ID ${userId} deletou a categoria ID ${categoryId}`;
            db.query(sqlLogInsert, [userId, logMessage], (logErr) => {
                if (logErr) {
                    console.error('Erro ao registrar log no banco de dados:', logErr);
                    return res.status(500).send('Erro ao registrar log.');
                }

                console.log('Categoria excluída e log registrado com sucesso.');
                res.json({ success: true });
            });
        });
    } catch (err) {
        console.error('Ocorreu um erro ao excluir a categoria:', err);
        res.status(500).send('Erro interno ao processar a exclusão da categoria.');
    }
}

async function listarCategorias(userId) {

    const sql = 'SELECT * FROM category WHERE user_id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [userId], (erro, rows) => {
            if (erro) {
                return reject(erro);
            }
            resolve(rows); 
        });
    });
}

function alterarCategoria(req, res) {
    try {
        const categoryId = req.params.id; 
        const novoNomeCategoria = req.params.name;
        console.log('novoNomeCategoria');
        console.log(novoNomeCategoria);

        const sql = 'UPDATE category SET name_category = ? WHERE id = ?';
        db.query(sql, [novoNomeCategoria, categoryId], (err, results) => {
            if (err) {
                console.error('Erro ao alterar o registro no banco de dados:', err);
                res.status(500).json({ success: false, message: 'Erro ao alterar a categoria.' });
            } else {
                console.log('Categoria alterada com sucesso no banco de dados.');
                res.json({ success: true, message: 'Categoria alterada com sucesso!' });
            }
        });
    } catch (err) {
        console.error('Ocorreu um erro ao alterar a categoria:', err);
        res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
    }
}


module.exports = {
    DeletarCategoria: DeletarCategoria,
    cadastrarCategoria: cadastrarCategoria,
    listarCategorias: listarCategorias,
    alterarCategoria: alterarCategoria
};
