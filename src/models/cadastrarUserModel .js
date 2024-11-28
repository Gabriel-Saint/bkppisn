const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../../config/database');
const bcrypt = require('bcrypt');
const caminhoAbsolutoHome = path.resolve(__dirname, '../../view/home.ejs');

const caminhoAbsoluto = path.resolve(__dirname, '../../view/cadastro.ejs');

function processarCadastro(req, res) {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    // Verifica se o e-mail já existe no banco
    const sqlCheckEmail = 'SELECT id FROM user_data WHERE email = ?';
    db.query(sqlCheckEmail, [email], (err, results) => {
        if (err) {
            console.error('Erro ao verificar e-mail no banco de dados:', err);
            return res.status(500).send('Erro ao cadastrar usuário!');
        }

        // Se o e-mail já existe, envia uma mensagem de erro para o front-end
        if (results.length > 0) {
            return res.render('caminhoAbsoluto', { mensagemErro: 'O e-mail já está cadastrado!' });
        }

        // Caso o e-mail não exista, continua o cadastro
        const sqlInsert = 'INSERT INTO user_data (name_user, email, password_user) VALUES (?, ?, ?)';
        bcrypt.hash(senha, 10).then((hash) => {
            db.query(sqlInsert, [nome, email, hash], (erro, result) => {
                if (erro) {
                    console.error('Erro ao inserir dados no banco de dados:', erro);
                    return res.status(500).send('Erro ao cadastrar usuário!');
                } 

                // Obtém o ID do novo usuário cadastrado
                const newUserId = result.insertId;

                // Insere o log de criação do usuário
                const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
                db.query(sqlLogInsert, [newUserId, 'Novo usuário cadastrado'], (logErr) => {
                    if (logErr) {
                        console.error('Erro ao registrar log no banco de dados:', logErr);
                        return res.status(500).send('Erro ao registrar log do usuário!');
                    }

                    // Inicia a sessão do novo usuário
                    const sqlSession = 'SELECT id, name_user, email, admin FROM user_data WHERE email = ?';
                    db.query(sqlSession, [email], (sessionErr, rows) => {
                        if (sessionErr) {
                            console.log('Falha ao buscar dados da sessão:', sessionErr);
                            return res.status(500).send('Erro ao iniciar sessão do novo usuário');
                        }

                        req.session.user = {
                            id: rows[0].id,
                            nome: rows[0].name_user,
                            email: rows[0].email,
                            senha: rows[0].senha,
                            admin: rows[0].admin,
                        };

                        res.redirect('/home');
                        console.log(`${rows[0].name_user} criou uma conta e iniciou a sessão!`);
                    });
                });
            });
        }).catch((erro) => {
            console.error("Erro ao gerar hash da senha:", erro);
            res.status(500).send('Erro ao cadastrar usuário');
        });
    });
}
function processarCadastroAdmin(req, res) {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;
    const adminId = req.session.user.id; // Obtém o ID do admin logado a partir da sessão

    // Verifica se o e-mail já existe no banco
    const sqlCheckEmail = 'SELECT id FROM user_data WHERE email = ?';
    db.query(sqlCheckEmail, [email], (err, results) => {
        if (err) {
            console.error('Erro ao verificar e-mail no banco de dados:', err);
            return res.status(500).send('Erro ao cadastrar usuário!');
        }

        // Se o e-mail já existe, envia uma mensagem de erro para o front-end
        if (results.length > 0) {
            return res.render('caminhoAbsoluto', { mensagemErro: 'O e-mail já está cadastrado!' });
        }

        // Caso o e-mail não exista, continua o cadastro
        const sqlInsert = 'INSERT INTO user_data (name_user, email, password_user) VALUES (?, ?, ?)';
        bcrypt.hash(senha, 10).then((hash) => {
            db.query(sqlInsert, [nome, email, hash], (erro, result) => {
                if (erro) {
                    console.error('Erro ao inserir dados no banco de dados:', erro);
                    return res.status(500).send('Erro ao cadastrar usuário!');
                } 

                // Insere o log de cadastro feito pelo admin
                const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
                const logMessage = `Admin ID ${adminId} cadastrou um novo usuário: ${nome}`;
                db.query(sqlLogInsert, [adminId, logMessage], (logErr) => {
                    if (logErr) {
                        console.error('Erro ao registrar log no banco de dados:', logErr);
                        return res.status(500).send('Erro ao registrar log do usuário!');
                    }

                    // Redireciona para a página de usuários
                    res.redirect('/usuarios');
                });
            });
        }).catch((erro) => {
            console.error("Erro ao gerar hash da senha:", erro);
            res.status(500).send('Erro ao cadastrar usuário');
        });
    });
}
    
    module.exports = {
        processarCadastro: processarCadastro,
        processarCadastroAdmin:processarCadastroAdmin
    };
/*





const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../../config/database');
const bcrypt = require('bcrypt');


function processarCadastro(req, res){
    

    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    // sql
    const sql = 'INSERT INTO usuarios (nome, email, senha_hash) values (?, ?, ?)';
    // gerar uma hash com o bcrypt
   bcrypt.hash(senha, 10, (erro, hash)=>{
            if(erro) {
                    console.error("erro ao gerar hash da senha:", erro);
                    res.status(500).send('erro ao cadastar usuario');

            }else{
                    db.run(sql, [nome, email, hash], (erro)=>{
                            if(erro){
                                    console.error('Erro ao inserir dados no banco de dados', erro);
                                    res.status(500).send('Erro ao cadastrar usuário!');
                            }else{
                                     //res.redirect('/sucesso');
                                    console.log('Cadastro realizado com sucesso');
                                    res.send(`Olá ${nome}, seu cadastro foi realizado com suecesso e sua hash da senha é ${hash}!`);
            
                            }
                    })
            }
   })

}

module.exports = {
    processarCadastro: processarCadastro
};
*/