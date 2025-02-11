const express = require("express");
const routes = express.Router();

const AdminCtl = require("../../../../controllers/api/v1/adminController")

routes.post("/adminRegister", AdminCtl.adminRegister);

routes.post("/adminLogin", AdminCtl.adminLogin)

module.exports = routes;