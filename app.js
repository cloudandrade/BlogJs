//carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash") //módulo flash é um tipo de sessão que só aparece 1 vez
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuario")

//Configurações

//session
app.use(session({ //criando uma chave de seção
  secret: "cursodenode",
  resave: true,
  saveUninitialized: true
}))
app.use(flash())
//midleware
app.use((req, res, next) => {

  //variaveis globais de sucesso e erro  para registrar mensagens
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  next()
})

//Body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))//definindo o arquivo principal de configuração do handlebars
app.set('view engine', 'handlebars')//definindo o handlebars como ferramenta de frontent
//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blogapp").then(() => {
  console.log("banco de dados conectado")
}).catch((erro) => {
  console.log("houve um problema ao se conectar ao banco de dados, erro: " + erro)
})
//Public
app.use(express.static(path.join(__dirname, "public")))//fala pra o app que todos os arquivos estáticos estão na pasta public

app.use((req, res, next) => {
  console.log("Testando middleware!")
  next();
})

//Rotas
app.get('/', (req, res) => {

  Postagem.find().populate("categoria").sort({ data: "desc" }).then((postagens) => {
    res.render("index", { postagens: postagens })
  }).catch((erro) => {
    req.flash("error_msg", "Houve um erro interno ao carregar a página")
    console.log("erro de carregamento index: console: " + erro)
    res.redirect("/404")
  })

})

app.get("/postagem/:slug", (req, res) => {
  Postagem.findOne({ slug: req.params.slug }).then((postagem) => {
    if (postagem) {
      res.render("postagem/index", { postagem: postagem })
    } else {
      req.flash("error_msg", "A postagem em questão não existe")
      res.redirect("/")
    }
  }).catch((erro) => {
    req.flash("error_msg", "Houve um erro interno ao carregar a postagem")
    res.redirect("/")
  })
})

app.get("/categorias", (req, res) => {
  Categoria.find().then((categorias) => {
    res.render("categorias/index", { categorias: categorias })
  }).catch((erro) => {
    console.log("falha ao carregar pagina categorias client: console: " + erro)
    res.redirect("/404")
  })

})


app.get("/categorias/:slug", (req, res) => {
  Categoria.findOne({slug: req.params.slug}).then((categoria) => {
          if(categoria){

            Postagem.find({categoria: categoria._id}).then((postagens) => {
              res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
            }).catch((erro) => {
              req.flash("error_msg", "Houve um erro ao listar postagens dessa categoria")
              console.log("erro ao listar postagens dessa categoria: console: "+erro)
              res.redirect("/")
            })

          }else{
            req.flash("error_msg", "Essa categoria não existe")
            res.redirect("/")
          }
  }).catch((erro) => {
    req.flash("error_msg", "Houve um erro interno ao carregar a pagina desta categorai")
      res.redirect("/")
  })
  
})

app.get("/404", (req, res) => {
  res.render("404")
})



//--------------------------------------------------------------------------------------------------------------

app.use('/admin', admin) //definindo um prefixo para agrupar as rotas 
//Outros
app.use('/usuarios', usuarios)

const PORT = 8081  //criando uma constante que irá armazenar a porta do nosso servidor
app.listen(PORT, () => {
  console.log("servidor rodando...")
})