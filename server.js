const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const port = 3000;

app.set('view engine', 'ejs');//estudar

app.use(bodyParser.urlencoded({ extended: true }));//estudar


app.use(express.static('view'));
app.use(express.static('public/css'));
app.use(express.static('public/js'));
app.use(express.static('public/ico'));
app.use(express.static('public/images'));

app.use(session({
    secret: 'CRUD',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000
    }

}));

const routes = require('./config/routes');

app.use('/', routes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
//ajustes de rotas de login e cadastro feitas.. falta a conexao com db e colocar o verificador de sessao 
