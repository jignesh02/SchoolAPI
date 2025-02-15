const express = require("express");
const routes = express.Router();
const passport = require("passport");
const FacultyCtl = require("../../../../controllers/api/v1/facultyController");

routes.post("/facultyLogin", FacultyCtl.facultyLogin);

routes.post("/studentRegistration", passport.authenticate("faculty", { failureRedirect: "/faculty/facultyLoginFailure" }), FacultyCtl.studentRegistration);

routes.get("/facultyLoginFailure", async (req, res) => {
    return res.status(400).json({ msg: "You are unauthorized" })
});

module.exports = routes;