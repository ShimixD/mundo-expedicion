const express = require("express");
const session = require("express-session");
const app = express()
const path = require("path");
const passport = require("./passport")
const MongoStore = require("connect-mongo");

// Settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '../views'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')))
// Middlewares
app.use(session({
    secret: process.env.APIPASS,
    cookie: { maxAge: 60000 * 60 * 24, },
    saveUninitialized: false,
    resave: false,
    name: "discord.oauth2",
    store: MongoStore.create({ mongoUrl: process.env.MONGODB, }),
}));
app.use(passport.initialize());
app.use(passport.session());
// Global variables
app.use((req, res, next) => {
  app.locals.user = req.user;
  next();
});
// Routes
app.use("/", require("../routes/routes"));

module.exports = app;