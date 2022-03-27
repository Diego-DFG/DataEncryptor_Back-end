require('dotenv').config();
const rotas = require('./rotas/rotas');
const express = require('express');
const conexao = require('./db/conexao');
const tabelas = require('./db/tabelas');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const url_dev = 'http://127.0.0.1:5500';
const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(cors({credentials: true, origin: url_dev}));
app.use('/', rotas);

conexao.connect((erro)=> {
    if(erro) {
        console.log(`Não foi possível se conectar com o banco.`);
        console.log(erro);
    } else {

        console.log(`Conexão com o banco estabelecida!`);
        tabelas.init(conexao);

        app.listen(port, ()=> 
            console.log(`Servidor operando na porta ${port}`)
        );

    }
})


