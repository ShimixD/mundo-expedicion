const { Router } = require("express");
const router = Router();
const passport = require("passport");
const { isAuthorized } = require("../utils/middleware/auth");

const { MessageEmbed } = require("discord.js");
const { createMessage } = require("../utils/utils")

// Models
const cartaBeta = require("../utils/models/cartaBeta");
const userSchema = require("../utils/models/userSchema");
// Auth routes
router.get("/auth", passport.authenticate("discord"));
router.get("/auth/redirect", passport.authenticate("discord", {
    failureRedirect: "/",
    successRedirect: "/",
}));

router.get("/auth/logout", (req, res) => {
    if (req.user) {
        req.session.destroy(() => {
            req.logout();
            res.redirect("/");
        });
    } else {
        res.redirect("/");
    }
});
// Views router
router.get("/", (req, res) => {
    res.render("home")
});
router.get("/crear", isAuthorized, async (req, res) => {
    res.render("crear");
});
router.get("/comunidad", async (req, res) => {
    res.render("comunidad", {
        userA: await userSchema.find()
    })
});
router.get("/cartas", async (req, res) => {
    res.render("cartas", {
        carta: await cartaBeta.find()
    });
});
router.get("/user/:id", async (req, res) => {
    const findUser = await userSchema.find()
    const filterUser = findUser.find(e => req.params.id === e.discordId)
    if(!filterUser) return res.render("layouts/404")

    res.render("user", {
        userB: filterUser
    });
});
// Post views
router.post("/crear", async (req, res) => {
    const algo = await cartaBeta.findOne({ userID: req.user.discordId }).lean()
    if(algo) return res.send("Pendejo ya hiciste tu carta osea no mames")
    if(!req.body.mensaje) return res.send("Pendejo no pusiste el mensaje")
    
    const data = await cartaBeta.create({
        userID: req.user.discordId,
        username: req.user.username,
        avatar: req.user.avatar,
        mensaje: req.body.mensaje
    })
    await data.save()

    const embebeao = new MessageEmbed()
    .setTitle("Nueva carta de " + data.username)
    .setThumbnail(`https://cdn.discordapp.com/avatars/${data.userID}/${data.avatar}`)
    .setDescription(data.mensaje)
    .setColor("RANDOM")
    await createMessage("909858459107856466", { embeds: [embebeao] })

    res.redirect("/cartas")
});
router.post("/datos-opcionales", async (req, res) => {
    if(!req.body.descripcion) return res.send("Pendejo no pusiste la descripcion")
    const data = await userSchema.findOneAndUpdate({ discordId: req.user.discordId }, { descripcion: req.body.descripcion })

    console.log(data)
    console.log(req.user.id)

    res.redirect("/user/" + req.user.discordId)
});

module.exports = router;