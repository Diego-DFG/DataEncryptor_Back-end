const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
});
module.exports = conexao;