const conexao = require('../db/conexao');

class DadosEncriptados {

    recuperaDados(res) {

        const sql = `SELECT * FROM dadosencriptados`;

        conexao.query(sql, (erro, resultado)=> {
            if(erro) {
                res.status(500).json();
            } else {
                res.status(200).json(resultado);
            }
        });

    }

    recuperaDadosPorId(id, res) {
        return new Promise((resolve, reject)=> {
            const sql = `SELECT * FROM dadosencriptados WHERE id=?`;

            conexao.query(sql, id, (erro, resultado)=> {
                if(erro) reject(erro);
                    resolve(resultado);
                
            })
        })
    }

    insereDados(dados, res) {

        const sql = `INSERT INTO dadosencriptados SET ?`;

        conexao.query(sql, dados, (erro, resultado)=> {
            if(erro) {
                res.status(500).json();
            } else {
                res.status(200).json(resultado);
            }
        })

    }

    apagaDados(id, res) {

        const sql = `DELETE FROM dadosencriptados WHERE id=?`;

        conexao.query(sql, id, (erro, resultado)=> {
            if(erro) {
                res.status(500).json(erro);
            } else {
                res.status(200).json(resultado);
            }
        })

    }

}
module.exports = new DadosEncriptados;