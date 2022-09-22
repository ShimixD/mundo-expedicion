require("dotenv").config();
const app = require("./server/express");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conectado correctamente a MongoDB.")
}).catch((err) => {
    console.log(err)
})

app.listen(process.env.PORT);
console.log("Listening on port", process.env.PORT);