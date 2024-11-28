const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../../config/database');
const bcrypt = require('bcrypt');
const session = require('express-session');



const caminhoAbsolutoLogin = path.resolve(__dirname, '../../view/login.ejs');
const caminhoAbsolutoHome = path.resolve(__dirname, '../../view/home.ejs');

function fazerLogin(req, res) {
    const email = req.body.email;
    const senha = req.body.senha;

    const pegaHashBD = 'SELECT name_user, id, password_user, email, admin FROM user_data WHERE email = ?';

    db.query(pegaHashBD, [email], (erro, rows) => {
        if (erro) {
            console.error('Erro ao fazer login', erro);
            return res.status(500).send('Erro ao consultar usuário!');
        } 
        
        let mensagemErro = '';
        if (rows.length === 0) {
            mensagemErro = 'Usuário não encontrado. Por favor, cadastre-se!';
            return res.render(caminhoAbsolutoLogin, { mensagemErro });
        } 

        const hashDoBD = rows[0].password_user;
        const idDoBD = rows[0].id;
        const nomeDoBD = rows[0].name_user;
        const admin = rows[0].admin;

        bcrypt.compare(senha, hashDoBD).then((resultado) => {
            if (resultado) {
                // Configura a sessão do usuário
                req.session.user = {
                    id: idDoBD,
                    nome: nomeDoBD,
                    admin: admin,
                    email: email
                };

                // Mensagem de log para debug
                console.log(`${nomeDoBD} iniciou a sessão!`);

                // Inserir log na tabela `system_logs`
                const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
                const logMessage = `Usuário ID ${idDoBD} iniciou a sessão`;

                db.query(sqlLogInsert, [idDoBD, logMessage], (logErr) => {
                    if (logErr) {
                        console.error('Erro ao registrar log no banco de dados:', logErr);
                        return res.status(500).send('Erro ao registrar log.');
                    }

                    // Redireciona para a página inicial após login
                    if (admin === 1) {
                        console.log(`O admin ${nomeDoBD} iniciou a sessão!`);
                    }
                    res.redirect('/home');
                });
            } else {
                mensagemErro = 'Senha ou email incorreto!';
                res.render(caminhoAbsolutoLogin, { mensagemErro });
            }
        }).catch((erroBcrypt) => {
            console.error('Erro ao comparar hashes', erroBcrypt);
            res.status(500).send('Erro ao verificar senha!');
        });
    });
}



module.exports = {
    fazerLogin: fazerLogin
};

