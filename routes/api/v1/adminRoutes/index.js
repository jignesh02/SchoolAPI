const express = require("express");
const routes = express.Router();
const passport = require("passport");

const AdminCtl = require("../../../../controllers/api/v1/adminController");

routes.post("/adminRegister", AdminCtl.adminRegister);

routes.post("/adminLogin", AdminCtl.adminLogin);

routes.get("/adminProfile", passport.authenticate("jwt", { failureRedirect: "/api/adminLoginFailure" }), AdminCtl.adminProfile);

routes.put("/editAdminProfile/:id", passport.authenticate("jwt", { failureRedirect: "/api/adminLoginFailure" }), AdminCtl.editAdminProfile);

routes.get("/adminLoginFailure", async (req, res) => {
    return res.status(400).json({ msg: "You are unauthorized" })
});

routes.get("/adminLogout", passport.authenticate("jwt", { failureRedirect: "/api/adminLoginFailure" }), AdminCtl.adminLogout);

routes.post("/changeAdminPassword", passport.authenticate("jwt", { failureRedirect: "/api/adminLoginFailure" }), AdminCtl.changeAdminPassword);

routes.post("/sendMail", passport.authenticate("jwt", { failureRedirect: "/api/adminLoginFailure" }), AdminCtl.sendMail);

routes.post("/updatePassowrd", passport.authenticate("jwt", { failureRedirect: "/api/adminLoginFailure" }), AdminCtl.updatePassowrd);

routes.post("/facultyRegistration", passport.authenticate("jwt", { failureRedirect: "/api/adminLoginFailure" }), AdminCtl.facultyRegistration);

module.exports = routes;