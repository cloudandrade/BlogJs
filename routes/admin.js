const express = require('express')
const router = express.Router();
const mongoose = require("mongoose")
require("../models/Categoria")//importando o model para ser usado
const Categoria = mongoose.model("categorias") //passando o valor do model para uma variavel

router.get('/', (req, res) =>{
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Página de postagens")
})

router.get('/categorias', (req, res) => {
    res.render("admin/categorias")
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res) => {
    const novaCategoria = { //requisitando os dados da página colocado nos inputs e criando um objeto
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
        console.log("categoria salva com sucesso!")
    }).catch((erro) => {
        console.log("não foi possível salvar a categoria" + erro)
    })

 })

router.get('/teste', (req, res) => {
    res.send("Página teste")
})



//exportando router -  o router será responsavel por administrar nossas rotas
module.exports = router