const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../../config/database');

function buscarDadosSQL(req, res) {

    try {
        const admin = req.session.user.admin;  
        const userId = req.session.user.id; 
    
        
        const sql = admin === 1 ? 
           "SELECT r.id AS record_id, r.description_record, r.value_record, r.type_record, r.date_record, u.name_user, c.name_category FROM record AS r INNER JOIN user_data AS u ON r.user_id = u.id INNER JOIN category AS c ON r.category_id = c.id" :
           "SELECT r.id AS record_id, r.description_record, r.value_record, r.type_record, r.date_record, u.name_user, c.name_category FROM record AS r INNER JOIN user_data AS u ON r.user_id = u.id INNER JOIN category AS c ON r.category_id = c.id WHERE r.user_id = ?";
    
    
        const params = admin === 1 ? [] : [userId];
    
        db.query(sql, params, (err, results) => {
            if (err) {
                console.error('Erro ao consultar registros:', err);
                res.status(500).send('Erro ao consultar registros.');
            } else {
                console.log('Consulta realizada com sucesso no banco de dados.');
                res.json(results);
            }
        });
    
    } catch (err) {
        console.error('Ocorreu um erro:', err);
        res.status(500).send('Ocorreu um erro ao processar sua solicitação.');
    }
    


}

function buscarValores(req, res) {
    try {
        const userId = req.session.user.id;
        const isAdmin = req.session.user.admin === 1; 
    
        const sql = isAdmin 
            ? 'SELECT SUM(CASE WHEN type_record = 1 THEN value_record ELSE 0 END) AS total_entradas, SUM(CASE WHEN type_record = 0 THEN value_record ELSE 0 END) AS total_saidas, SUM(CASE WHEN type_record = 1 THEN value_record ELSE -value_record END) AS saldo FROM record'
            : 'SELECT SUM(CASE WHEN type_record = 1 THEN value_record ELSE 0 END) AS total_entradas, SUM(CASE WHEN type_record = 0 THEN value_record ELSE 0 END) AS total_saidas, SUM(CASE WHEN type_record = 1 THEN value_record ELSE -value_record END) AS saldo FROM record WHERE user_id = ?';
    
        const queryParams = isAdmin ? [] : [userId]; 
    
        
        db.query(sql, queryParams, (err, results) => {
            if (err) {
                console.error('Erro ao consultar registros:', err);
                res.status(500).send('Erro ao consultar registros.');
                return;
            }
            console.log('Consulta realizada com sucesso no banco de dados.');
            res.json(results);
        });
    } catch (err) {
        console.error('Ocorreu um erro:', err);
        res.status(500).send('Ocorreu um erro ao processar sua solicitação.');
    }
    
}

module.exports = {
    buscarDadosSQL: buscarDadosSQL,
    buscarValores: buscarValores
};
