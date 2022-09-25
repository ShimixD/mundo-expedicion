const { Schema, model } = require("mongoose");

const datosOptional = new Schema({
    userID: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    }
})

module.exports = model("datosSchema", datosOptional)