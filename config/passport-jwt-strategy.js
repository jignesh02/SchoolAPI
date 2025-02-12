const passport = require("passport")

const jStrategy = require("passport-jwt").Strategy;
const Ejwt = require("passport-jwt").ExtractJwt;

let opts = {
    jwtFromRequest: Ejwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secrateKey"
};

const adminModel = require('../models/adminModels');

passport.use(new jStrategy(opts, async function (payload, done) {
    let checkAdminData = await adminModel.findOne({ email: payload.userData.email });
    if (checkAdminData) {
        return done(null, checkAdminData);
    } else {
        return done(null, false);
    }
}));

passport.serializeUser((user, done) => {
    return done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    let userData = await adminModel.findById(id);
    if (userData) {
        return done(null, userData);
    } else {
        return done(null, false);
    }
});

module.exports = passport;