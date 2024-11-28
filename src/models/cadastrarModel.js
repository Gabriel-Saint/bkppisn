const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../../config/database');


function processarRegistro(req, res) {
    try {
        const user_id = req.session.user.id; // ID do usuário logado
        const description_record = req.body.descricao;
        const category_record = req.body.categoria;
        const value_record = req.body.valor;
        const type_record = req.body.tipo;
        const date_record = req.body.dataRegistro;

        // SQL para inserir o registro na tabela "record"
        const sql = 'INSERT INTO record(user_id, category_id, description_record, value_record, type_record, date_record) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [user_id, category_record, description_record, value_record, type_record, date_record], (err, results) => {
            if (err) {
                console.error('Erro ao inserir o registro no banco de dados:', err);
                res.status(500).send('Erro ao inserir o registro.');
                return;
            }

            // Obtém o ID do registro recém-inserido
            const recordId = results.insertId;

            // Insere um log na tabela "system_logs"
            const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
            const logMessage = `Usuário ID ${user_id} cadastrou o registro ID ${recordId}`;
            db.query(sqlLogInsert, [user_id, logMessage], (logErr) => {
                if (logErr) {
                    console.error('Erro ao registrar log no banco de dados:', logErr);
                    res.status(500).send('Erro ao registrar log.');
                    return;
                }

                console.log('Registro inserido com sucesso e log registrado.');
                res.redirect('/home');
            });
        });
    } catch (err) {
        res.status(500).send('Erro interno ao processar o registro.');
        console.error('Ocorreu um erro ao inserir os registros:', err);
    }
}

module.exports = {
    processarRegistro: processarRegistro
};
