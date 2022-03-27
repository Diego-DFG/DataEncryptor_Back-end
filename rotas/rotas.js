require('dotenv').config();
const rotas = require('express').Router();
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const DadosEncriptados = require('../models/dadosencriptados');
const Usuarios = require('../models/usuarios');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//const jwt = require('jwt');

const arrayUsuarioAutenticado = [];

passport.use(new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'senha',
      session: false
    }, async (login, senha, done)=>{
      try {

        console.log(login);


        const user = Usuarios.retornaArrayUsuarios(login);
        const objetoUsuario = user;
        
        
       const senhaDecodificada = await bcrypt.compare(senha, objetoUsuario.senha);
  
        if(senhaDecodificada !== true || login !== objetoUsuario.login) {
          throw new Error('Dados inconsistentes!');
        } else {
          console.log('Inicia área de autenticação ...');
          console.log('Finaliza área de autenticação ...');
        }
  
        arrayUsuarioAutenticado.push(objetoUsuario);
  
        done(null, login);
  
      } catch (error) {
        done(error);
      }
    }
));

function verificaToken(req, res, next) {
    
    const tokenVerificado = req.cookies.userToken;
  console.log(req.cookies);
  console.log(tokenVerificado);
  if(!tokenVerificado) {
    res.status(403).send('É necessário token para atenticação!');
  }

  const decoded = jwt.verify(tokenVerificado, process.env.CHAVE_JWT);
  console.log(decoded);
 next();
  }

  rotas.post("/auth", passport.authenticate('local', {session: false}), async (req, res) => {
    console.log('Acessei a rota Auth');
      const usuarioAutenticado = arrayUsuarioAutenticado[0];
      const payload = {id: usuarioAutenticado.id};
      const options = { secure: true, sameSite: 'none', httpOnly: true}; 
      const token = jwt.sign(payload.id, process.env.CHAVE_JWT);

      console.log(token);
  
      res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500")
      res.cookie("userToken", token, options);
      res.sendStatus(204);
});

rotas.delete("/logout", async (req, res) => {
    console.log("Realizando logout...")
    res.clearCookie("userToken");
    res.logout()
    return res.sendStatus(200);
});

rotas.get('/', verificaToken, async (req, res)=> {
    await DadosEncriptados.recuperaDados(res);
});
    
rotas.post('/encriptar', async (req, res)=> {

    console.log(req.body);
    const objUsuario = {
        cpf: req.body.cpf,
        nome: req.body.nome,
        senha: req.body.senha
    }

    console.log(objUsuario.cpf);

    const cpfHash = CryptoJS.AES.encrypt(JSON.stringify(objUsuario.cpf), process.env.SECRET).toString();
    const nomeHash = CryptoJS.AES.encrypt(JSON.stringify(objUsuario.nome), process.env.SECRET).toString();
    const senhaHash = CryptoJS.AES.encrypt(JSON.stringify(objUsuario.senha), process.env.SECRET).toString();
    
     
    const objDB = {
        cpf: cpfHash,
        nome: nomeHash,
        senha: senhaHash
    }

    await DadosEncriptados.insereDados(objDB, res);

     res.setHeader("Access-Control-Allow-Origin","http://127.0.0.1:5500");
});

rotas.get('/decriptar/:id', async (req, res)=> {
    
    const id = parseInt(req.params.id);

    await DadosEncriptados
            .recuperaDadosPorId(id, res)
            .then(obj => {

                console.log(obj[0]);
                const bytesNome = CryptoJS.AES.decrypt(obj[0].nome, process.env.SECRET);
                const bytesCpf = CryptoJS.AES.decrypt(obj[0].cpf, process.env.SECRET);
                const bytesSenha = CryptoJS.AES.decrypt(obj[0].senha, process.env.SECRET)

                console.log(bytesNome);

                const decryptedNome = JSON.parse(bytesNome.toString(CryptoJS.enc.Utf8));
                const decryptedCpf = JSON.parse(bytesCpf.toString(CryptoJS.enc.Utf8));
                const decryptedSenha = JSON.parse(bytesSenha.toString(CryptoJS.enc.Utf8));

                const objDec = {
                    cpf: decryptedCpf,
                    nome: decryptedNome,
                    senha: decryptedSenha
                }

                console.log(objDec);

                res.send(objDec);
            });
     
});
    
 rotas.delete('/apaga/:id', async (req, res)=> {

    console.log('Acessando a rota DELETE');

    const id = parseInt(req.params.id);

    await DadosEncriptados.apagaDados(id, res);
});

rotas.post('/cadastraUsuario', async (req, res)=> {

    const objUsuario = {
        login: req.body.login,
        senha: req.body.senha
    }

    const senhaHash = await bcrypt.hash(objUsuario.senha, 10);
    
     
    const objDB = {
        login: objUsuario.login,
        senha: senhaHash
    }

    await Usuarios.cadastraUsuario(objDB, res);

});

rotas.delete('/apagaUsuario/:id', async (req, res)=> {

    const id = parseInt(req.params.id);

    await Usuarios.apagaUsuario(id, res);

});

rotas.get('/retornaUsuarios', async (req, res)=> {

    await Usuarios.retornaUsuario(res);

});



module.exports = rotas;