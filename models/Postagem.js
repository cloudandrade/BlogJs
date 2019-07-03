const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo:{
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId, //categoria vai armazenar um id de alguma categoria
        ref: "categorias", //passa o nome do model no banco de dados
        required: true
    },
    data: {
        type: Date,
        default: Date.now();
    }
})

mongoose.model("postagens", Postagem)