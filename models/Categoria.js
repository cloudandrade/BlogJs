const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Categoria = new Schema({
    nome:{
        type: String,
    required: true
    },
    slug:{
        type: String,
        required: true
    },
    date:{
        type: Date, 
        default: Date.now() //captura a data e hora atual, default coloca algo como padrão para ser inserido
    }
})

mongoose.model("categorias", Categoria)