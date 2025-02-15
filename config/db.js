const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://jigneshb0208:G5EBR9AbnWSEM4ES@clusterforschool.izl99.mongodb.net/schoolManagement");


const db = mongoose.connection;

db.once("open", (err) => {
    err ? console.log(err) : console.log("mongoDB connected successfully");
});

module.exports = db;