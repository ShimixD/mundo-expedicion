const { Strategy } = require("passport-discord");
const passport = require("passport");
const User = require("../utils/models/userSchema");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    if (user) done(null, user);
});

passport.use(new Strategy({
    clientID: process.env.DISCORD_CLIENTID,
    clientSecret: process.env.DISCORD_CLIENTSECRET,
    callbackURL: process.env.DISCORD_CALLBACKURL,
    scope: ["identify", "guilds"],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({ discordId: profile.id });

        if (user) return done(null, user);

        const newUser = new User({
            discordId: profile.id,
            username: `${profile.username}#${profile.discriminator}`,
            avatar: profile.avatar,
        });

        const savedUser = await newUser.save();
        done(null, savedUser);
    } catch (error) {
        console.error(error);
        return done(err, null);
    }
}));

module.exports = passport;