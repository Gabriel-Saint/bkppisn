const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../../config/database');

function encerrarSessao(req, res) {
    const idSession = req.session.user.id;  // ID do usuário que está encerrando a sessão
    const nomeSession = req.session.user.nome;  // Nome do usuário que está encerrando a sessão

    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao encerrar sessão:', err);
            res.status(500).send('Erro ao encerrar a sessão');
        } else {
            // Inserir log na tabela `system_logs` quando um usuário encerrar a sessão
            const logMessage = `Usuário ID ${idSession} com nome ${nomeSession} encerrou a sessão`;
            const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
            db.query(sqlLogInsert, [idSession, logMessage], (logErr) => {
                if (logErr) {
                    console.error('Erro ao registrar log no banco de dados:', logErr);
                    res.status(500).send('Erro ao registrar log.');
                    return;
                }

                // Redireciona para a página de login após encerrar a sessão
                res.redirect('/login');
            });
        }
    });
}


module.exports = {
    encerrarSessao: encerrarSessao
};
