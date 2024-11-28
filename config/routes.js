const express = require('express');
const router = express.Router();
const db = require('./database');

//middlewares
const autenticacao = require('../src/middlewares/authMiddleware');

//controllers
const loginController = require('../src/controllers/loginController');
const homeController = require('../src/controllers/homeController');
const editarController = require('../src/controllers/editarUser');
const exibircadastrarCategoria = require('../src/controllers/cadastrarCategoria');
const exibirDashboard = require('../src/controllers/dashBoard');
const cadastrarUsuario = require('../src/controllers/cadastrarNovoUsuario');
const cadastrar = require('../src/controllers/cadastrar');

//models
const login = require('../src/models/loginModel');
const cadastrarUser = require('../src/models/cadastrarUserModel ');
const buscarDados = require("../src/models/buscarDados");
const cadastrarModel = require("../src/models/cadastrarModel");
const listarModel = require('../src/models/listarModel');
const AtualizarModel = require('../src/models/atualizarCadastro');
const editModel = require('../src/models/editModel');
const cadastrarCategoria = require('../src/models/cadastrarCategoriaModel');

//gets
router.get('/', loginController.exibirLogin);
router.get('/home', autenticacao, homeController.exibirHome);
router.get('/buscar-valores', buscarDados.buscarValores);
router.get('/usuarios', autenticacao, listarModel.listar);
router.get('/editaruser', editarController.exibirEditar)
router.get('/buscar-dados', autenticacao, buscarDados.buscarDadosSQL);
router.get('/editar', editModel.exibirEditar);
router.get('/cadastrar-categoria', exibircadastrarCategoria.exibirCadastrarCategorias);
router.get('/dashboard', exibirDashboard.exibirDashboard);
router.get('/novo-usuario', cadastrarUsuario.exibirCadastrarUsuario);
router.get('/cadastrar', cadastrar.exibirCadastrar);
//posts
router.post('/cadastrar-categoria', cadastrarCategoria.cadastrarCategoria);
router.post('/fazer-login', login.fazerLogin);
router.post('/cadastro', cadastrarUser.processarCadastro);
router.post('/cadastro-admin', cadastrarUser.processarCadastroAdmin);
router.post('/registrar', autenticacao, cadastrarModel.processarRegistro);
router.post('/atualizarCadastro', autenticacao, AtualizarModel.atualizarCadastro);
router.post('/atualizar-registro', editModel.atualizarRegistro);
router.post('/deletar-registro', editModel.deletarRegistro);

router.get('/excluirCadastro', autenticacao, AtualizarModel.excluirCadastro);

router.delete('/deletar-categoria/:id', cadastrarCategoria.DeletarCategoria);
router.post('/atualizar-categoria/:id/:name', cadastrarCategoria.alterarCategoria);


router.get('/logout', function (req, res) {
    const usuario = req.session.user;  
    const idSession = usuario.id;  
    const nomeSession = usuario.nome;  

    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Erro ao encerrar sessão');
        } else {
            // Inserir log na tabela system_logs quando o usuário encerrar a sessão
            const logMessage = `Usuário ID ${idSession} com nome ${nomeSession} encerrou a sessão`;
            const sqlLogInsert = 'INSERT INTO system_logs (user_id, action_type) VALUES (?, ?)';
            
            db.query(sqlLogInsert, [idSession, logMessage], (logErr) => {
                if (logErr) {
                    console.error('Erro ao registrar log no banco de dados:', logErr);
                    res.status(500).send('Erro ao registrar log.');
                    return;
                }

              
                res.redirect('/');
            });
        }
    });
});



router.get('/verificar-sessao', (req, res) => {
    const user = req.session;
    res.send(user);
});

module.exports = router;