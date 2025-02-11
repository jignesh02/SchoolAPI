const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://jigneshb0208:Y6MIwinVYd7TBysg@cluster1.rvs0c.mongodb.net/schoolManagement")

const db = mongoose.connection;

db.once("open", (err) => {
    err ? console.log(err) : console.log("mongoDB connected successfully");
});

module.exports = db;