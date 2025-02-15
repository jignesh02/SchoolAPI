const express = require("express");
const routes = express.Router();
const passport = require("passport");
const StudentCtl = require("../../../../controllers/api/v1/studentController")

routes.post("/studentLogin", StudentCtl.studentLogin);

module.exports = routes;