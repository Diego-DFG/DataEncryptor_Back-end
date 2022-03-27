const conexao = require("./conexao");

class Tabelas {
    init(conexao) {

        this.criaTabelaDados(conexao);

        this.criaUsuario(conexao);

    }

    criaTabelaDados() {
        const sql =`
        CREATE TABLE IF NOT EXISTS dadosencriptados (id int NOT NULL AUTO_INCREMENT,
        cpf varchar(100), nome varchar(200), senha varchar(100), PRIMARY KEY(id))
        `;

        conexao.query(sql, (erro)=> {
            if(erro) {
                console.log(erro);
            } else {
                console.log('Tabela dadosencriptados criada com sucesso!')
            }
        })
    }

    criaUsuario() {
        const sql =`
        CREATE TABLE IF NOT EXISTS usuarios (id int NOT NULL AUTO_INCREMENT,
        login varchar(100), senha varchar(100), PRIMARY KEY(id))
        `;

        conexao.query(sql, (erro)=> {
            if(erro) {
                console.log(erro);
            } else {
                console.log('Tabela usuarios criada com sucesso!')
            }
        })
    }
}
module.exports = new Tabelas;