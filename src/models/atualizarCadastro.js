const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../../config/database');
const bcrypt = require('bcrypt');
const caminhoAbsolutoHome = path.resolve(__dirname, '../../view/home.ejs');

function atualizarCadastro(req, res) {
    const nomeSession = req.session.user.nome;
    const idSession = req.session.user.id;
    const id = req.body.id;
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;
    const admin = req.body.admin;

    const sql = 'UPDATE user_data SET name_user = ?, email = ?, password_user = ?, admin = ? WHERE id = ?';

    bcrypt.hash(senha, 10).then((hash) => {
        db.query(sql, [nome, email, hash, admin, id], (erro) => {
            if (erro) {
                console.error('Erro ao inserir dados no banco de dados', erro);
                res.status(500).send('Erro ao atualizar usuário!');
            } else {
        

                if (idSession == id) {
                    const sql2 = 'SELECT id, name_user, admin, email FROM user_data WHERE id = ?';
                    db.query(sql2, [id], (err, rows) => {
                        if (err) {
                            console.log('Falha ao buscar dados da sessão', err);
                            res.status(500).send('Erro ao iniciar sessão do usuário atualizado');
                        } else {
                            // Inserir log na tabela `system_logs`
                            const logMessage = `Usuário ID ${idSession} atualizou seu próprio cadastro`;
                            const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
                            db.query(sqlLogInsert, [idSession, logMessage], (logErr) => {
                                if (logErr) {
                                    console.error('Erro ao registrar log no banco de dados:', logErr);
                                    res.status(500).send('Erro ao registrar log.');
                                    return;
                                }
                            });

                            if (rows[0].admin == 0) {
                                req.session.user = {
                                    id: rows[0].id,
                                    nome: rows[0].name_user,
                                    admin: rows[0].admin,
                                    email: rows[0].email
                                };
                                res.redirect('/home');
                            } else {
                                res.redirect('/usuarios');
                            }

                            console.log(`${rows[0].name_user} atualizou a conta e reiniciou a sessão!`);
                        }
                    });
                } else {
                    res.redirect('/usuarios');
                    console.log(`${nomeSession} atualizou a conta do usuário: ${nome}!`);
                    
                    // Inserir log na tabela `system_logs` para o administrador
                    const logMessage = `Administrador ID ${idSession} atualizou o cadastro do usuário ID ${id}`;
                    const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
                    db.query(sqlLogInsert, [idSession, logMessage], (logErr) => {
                        if (logErr) {
                            console.error('Erro ao registrar log no banco de dados:', logErr);
                            res.status(500).send('Erro ao registrar log.');
                        }
                    });
                }
            }
        });
    }).catch((erro) => {
        console.error("Erro ao gerar hash da senha:", erro);
        res.status(500).send('Erro ao atualizar usuário');
    });
}

function excluirCadastro(req, res) {
    const id = req.query.id;
    const nome = req.session.user.nome;
    const idSession = req.session.user.id;

    try {
        const sql = 'DELETE FROM user_data WHERE id = ?';
        db.query(sql, [id], (err) => {
            if (err) {
                console.log("ERRO:", err);
                res.status(500).send('Erro ao excluir usuário');
            } else {
                // Inserir log na tabela `system_logs` quando um administrador excluir o cadastro de um usuário
                const logMessage = `Administrador ID ${idSession} excluiu o usuário ID ${id}`;
                const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
                db.query(sqlLogInsert, [idSession, logMessage], (logErr) => {
                    if (logErr) {
                        console.error('Erro ao registrar log no banco de dados:', logErr);
                        res.status(500).send('Erro ao registrar log.');
                        return;
                    }
                });

                res.redirect('/usuarios');
                console.log(`${nome} deletou o usuário de id: ${id}`);
            }
        });
    } catch (error) {
        console.log("ERRO:", error);
        res.status(500).send('Erro ao excluir usuário');
    }
}


module.exports = {
    atualizarCadastro: atualizarCadastro,
    excluirCadastro: excluirCadastro
};