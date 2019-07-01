//carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require("body-parser")
//const mongoose = require("mongoose")
const app = express()
//configurações

        //body parser
        app.use(bodyParser.urlencoded({extended:true}))
        app.use(bodyParser.json())
        //Handlebars
        app.engine('handlebars', handlebars({defaultLayout:'main'}))//definindo o arquivo principal de configuração do handlebars
        app.set('view engine', 'handlebars')//definindo o handlebars como ferramenta de frontent

//rotas

//outros

const PORT = 8081  //criando uma constante que irá armazenar a porta do nosso servidor
app.listen(PORT, () => {
    console.log("servidor rodando...")
})