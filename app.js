const express = require("express");
const app = express();
const port = 8005;

const passport = require("passport");
const jwtPassport = require("./config/passport-jwt-strategy");
const session = require("express-session");

app.use(session({
    name: "jignesh",
    secret: "jwtToken",
    resave: false,
    saveUninitialized: false,
    cookie: {
        MaxAge: 1000 * 60 * 60
    }
}));

const db = require("./config/db");

app.use(express.urlencoded());
app.use("/api", require("./routes/api/v1/adminRoutes"));

app.listen(port, (err) => {
    err ? console.log(err) : console.log(`Serevr started on port :${port}`);
});