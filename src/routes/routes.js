const { Router } = require("express");
const router = Router();
const passport = require("passport");
const { isAuthorized } = require("../utils/middleware/auth");

// Models
const cartaBeta = require("../utils/models/cartaBeta")

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
})
router.get("/welcome", (req, res) => {
    res.render("welcome")
})
router.get("/crear", isAuthorized, async (req, res) => {
    res.render("crear");
})
router.get("/cartas", async (req, res) => {
    res.render("cartas", {
        carta: await cartaBeta.find()
    });
})
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

    res.redirect("/cartas")
})

module.exports = router;