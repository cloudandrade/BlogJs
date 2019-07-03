const express = require('express')
const router = express.Router();
const mongoose = require("mongoose")
require("../models/Categoria")//importando o model para ser usado
const Categoria = mongoose.model("categorias") //passando o valor do model para uma variavel e relacionando a collection
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

//---------------------------------------------------------------------------------ADMIN - HOME ----------------
//rota para página inicial do admin
router.get('/', (req, res) => {
    res.render("admin/index")
})
//--------------------------------------------------------------------------------CATEGORIAS--------------------
//rota para listagem de categorias, página principal de categorias
router.get('/categorias', (req, res) => {
    Categoria.find().sort({date:'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((erro) => {
        req.flash("msg_error", "houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})
//-------------------------------------------------------------------------------CREATE--CATEGORIA---------------
//rota para formulário de adicionar uma nova categoria
router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

//rota para salvamento de categoria
router.post('/categorias/nova', (req, res) => {

    var erros = []
    //se não for enviado um nome, ou for não definido ou for nulo
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        //se não for enviado um nome, ou for não definido ou for nulo
        erros.push({ texto: "nome inválido" })

    }
    //se não for enviado um slug, ou for não definido ou for nulo
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug inválido" })
    }

    if (req.body.nome.length < 2) {
        erros.push({ texto: "Nome da categoria é muito pequeno" })
    }

    if (erros.length > 0) { //verifica se existe algum erro 
        res.render("admin/addcategorias", { erros: erros })
    } else {
        const novaCategoria = { //requisitando os dados da página colocado nos inputs e criando um objeto
            nome: req.body.nome,
            slug: req.body.slug
        }
        //salvando no banco
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso")
           res.redirect("/admin/categorias")
        }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao salvar a categoria!")
            console.log("não foi possível salvar a categoria" + erro)
        })
    }
})
//-------------------------------------------------------------------------------EDIT-CATEGORIA-----------------
//rota para passar a categoria com id para editar
router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((erro) => {
        req.flash("error_msg","Essa categoria não existe")
        res.redirect("/admin/categorias")
    })
   
})

//rota para alteração de categoria - salvamento
router.post("/categorias/edit",(req, res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        //criar depois validação da edição
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria")
            res.redirect("/admin/categorias")
        })

    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })
})

//----------------------------------------------------------------------------------DELETE-CATEGORIA-----------
//rota para deletar categorias
router.post("/categorias/deletar", (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        //criar depois validação da edição
       req.flash("success_msg", "A Categoria foi excluida")
        res.redirect("/admin/categorias")
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao excluir a categoria")
        res.redirect("/admin/categorias")
    })
})

//--------------------------------------------------------------------------------------POSTAGENS--------------------
//rota para listagem de postagens, página central de postagens
router.get('/postagens', (req, res) => {

    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) => { // no populate deve estar o nome do campo
        res.render("admin/postagens", {postagens: postagens})
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        console.log("erro de listagem: console: " + erro)
        res.redirect("/admin")
    })

    
})
//----------------------------------------------------------------------------------------CREATE--POSTAGEM----------
//rota para criação de uma nova postagem
router.get('/postagens/add', (req, res) => {
    Categoria.find().then((categorias) => {
    res.render("admin/addpostagem", {categorias: categorias})
    }).catch((erro) => {
        req.flash("error_msg", "houve um erro ao carregar o formulário")
        res.redirect("/admin/postagens")
    })
   
})

//rota para salvamento de postagem
router.post("/postagens/nova",(req,res) => {

    var erros = []
    if(req.body.categoria == "0" || req.body.categoria == null || req.body.categoria == undefined){
        erros.push({texto: "Categoria inválida, registre uma categoria"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro no salvamento da postagem")
            console.log("erro de salvamento da postagem: console: " + erro)
            res.redirect("/admin/postagens")
        })
    }

})
//------------------------------------------------------------------------------------------EDIT-POSTAGEM-----------
router.get("/postagens/edit/:id", (req,res) => {

    Postagem.findOne({_id: req.params.id}).then((postagem) => {

        Categoria.find().then((categorias) =>{
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})
        }).catch((erro) => {
            req.flash("error_msg","Houve um erro ao listar as categorias")
            console.log("Erro de listagem de categorias, editar postagem: console: "+ erro)
            res.redirect("/admin/postagens")
        })

    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao carregar formulário de edição")
        console.log("Erro de busca em editar categoria: console: " +erro)
        res.redirect("/admin/postagens")
    })

    
})
//atualizar dados da postagem
router.post("/postagem/edit", (req,res) => {
    Postagem.findOne({_id: req.body.id}).then((postagem) => {

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro interno ao salvar as modificações")
            console.log("erro interno edição de postagem: console: "+erro)
            res.redirect("/admin/postagens")
        })

    }).catch((erro) => {
        req.flash("error_msg", "Não foi possivel salvar a postagem editada")
        console.log("erro de edição da postagem: console: " + erro)
        res.redirect("/admin/postagens")
    })
})

//------------------------------------------------------------------------------------------DELETE-POSTAGEM---------
router.get("/postagens/deletar/:id", (req,res) => {
    Postagem.remove({_id: req.params.id}).then(() => {
       req.flash("success_msg", "Postagem Excluida!")
        res.redirect("/admin/postagens")
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro interno ao excluir")
        res.redirect("/admin/postagens")
    })
})
//exportando router -  o router será responsavel por administrar nossas rotas
module.exports = router