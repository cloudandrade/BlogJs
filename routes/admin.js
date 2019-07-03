const express = require('express')
const router = express.Router();
const mongoose = require("mongoose")
require("../models/Categoria")//importando o model para ser usado
const Categoria = mongoose.model("categorias") //passando o valor do model para uma variavel

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Página de postagens")
})

router.get('/categorias', (req, res) => {
    Categoria.find().sort({date:'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((erro) => {
        req.flash("msg_error", "houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

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

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((erro) => {
        req.flash("error_msg","Essa categoria não existe")
        res.redirect("/admin/categorias")
    })
   
})

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


router.get('/teste', (req, res) => {
    res.send("Página teste")
})



//exportando router -  o router será responsavel por administrar nossas rotas
module.exports = router