//carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const admin = require("./routes/admin.js")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash") //módulo flash é um tipo de sessão que só aparece 1 vez

//Configurações

        //session
        app.use(session({ //criando uma chave de seção
          secret: "cursodenode",
          resave: true,
          saveUninitialized: true
        }))
        app.use(flash())
        //midleware
        app.use((req,res, next) =>{

          //variaveis globais de sucesso e erro  para registrar mensagens
            res.locals.success_msg = req.flash("success_msg") 
            res.locals.error_msg = req.flash("error_msg")
            next()
          })

        //Body parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
        //Handlebars
        app.engine('handlebars', handlebars({defaultLayout:'main'}))//definindo o arquivo principal de configuração do handlebars
        app.set('view engine', 'handlebars')//definindo o handlebars como ferramenta de frontent
        //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/blogapp").then(() => {
          console.log("banco de dados conectado")
        }).catch((erro) =>{
          console.log("houve um problema ao se conectar ao banco de dados, erro: " +erro)
        })
        //Public
        app.use(express.static(path.join(__dirname,"public")))//fala pra o app que todos os arquivos estáticos estão na pasta public

        app.use((req,res, next) => {
          console.log("Testando middleware!")
          next();
        })

//Rotas
  app.get('/',(req,res)=>{
      res.send("rota funcionando, página principal")
    })
    
    app.use('/admin' , admin) //definindo um prefixo para agrupar as rotas 
//Outros

const PORT = 8081  //criando uma constante que irá armazenar a porta do nosso servidor
app.listen(PORT, () => {
    console.log("servidor rodando...")
})