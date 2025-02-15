const StudentModel = require("../../../models/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.studentLogin = async (req, res) => {
    try {
        let checkEmail = await StudentModel.findOne({ email: req.body.email });
        if (checkEmail) {
            let checkPassword = await bcrypt.compare(req.body.password, checkEmail.password);
            console.log(checkPassword);
            if (checkPassword) {
                let token = await jwt.sign({ st: checkEmail }, "studentKey");
                return res.status(200).json({ msg: "user login successfully", data: token });
            }
            else {
                return res.status(200).json({ msg: "Invalid pasword" });
            }
        }
        else {
            return res.status(200).json({ msg: "Email doesn't match" });
        }
    } catch (err) {
        return res.status(400).json({ msg: "Something went wrong", error: err });
    }
};