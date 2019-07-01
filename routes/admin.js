const express = require("express")
const router = express.Router()

router.get('/', (req, res) =>{
    res.send("página principal do painel adm")
})

router.get('/posts', (req, res) => {
    res.send("Página de postagens")
})

router.get('/categorias', (req, res) => {
    res.send("Página de categorias")
})

router.get('/teste', (req, res) => {
    res.send("Página teste")
})

//exportando router -  o router será responsavel por administrar nossas rotas
module.exports = router