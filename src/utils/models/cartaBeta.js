const { Schema, model } = require("mongoose");

const cartaBeta = new Schema({
    userID: {
        type: String
    },
    username: {
        type: String
    },
    avatar: {
        type: String
    },
    mensaje: {
        type: String,
        required: true
    }
})

module.exports = model("cartaBeta", cartaBeta)