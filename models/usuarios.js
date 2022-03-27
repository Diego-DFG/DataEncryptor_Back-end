const conexao = require('../db/conexao');

const aUsuarios = [
	{
		"id": 4,
		"login": process.env.LOGIN,
		"senha": "$2b$10$fhWus9DfhWQV777ZV8vBPu9/A7mAO4X6Qj52At.RcijUGJ83p9uCa"
	}
];
const arraySelecionado = [];

class Usuarios {

    cadastraUsuario(usuario, res) {

        const sql = `INSERT INTO usuarios SET ?`;

        conexao.query(sql, usuario, (erro, resultado)=> {
            if(erro) {
                res.status(500).json();
            } else {
                res.status(200).json(resultado);
            }
        });

    }

    apagaUsuario(id, res) {

        const sql = `DELETE FROM usuarios WHERE id=?`;

        conexao.query(sql, id, (erro, resultado)=> {
            if(erro) {
                res.status(500).json(erro);
            } else {
                res.status(200).json(resultado);
            }
        })

    }

    retornaUsuario(res) {

        const sql = `SELECT * FROM usuarios`;

        conexao.query(sql, (erro, resultado)=> {
            if(erro) {
                res.status(500).json();
            } else {
                res.status(200).json(resultado);
            }
        });

    }

    retornaArrayUsuarios(usuario) {

        console.log('OBJETO USUÁRIO: '+usuario);

        console.log(aUsuarios);
        
        aUsuarios.map(objs => {
            console.log(objs);
            console.log('USUARIO BD: '+objs.login);
            if(objs.login.includes(usuario)) {
            arraySelecionado[0] = objs;
            }
        });

return arraySelecionado[0];
    }

}
module.exports = new Usuarios;