const adminModel = require("../../../models/adminModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

module.exports.adminRegister = async (req, res) => {
    try {
        let adminEmailExist = await adminModel.findOne({ email: req.body.email });
        if (!adminEmailExist) {
            if (req.body.password == req.body.confirmPassword) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
                let registerAdmin = await adminModel.create(req.body);
                if (registerAdmin) {
                    return res.status(200).json({ msg: "Admin register successfully", data: registerAdmin });
                } else {
                    return res.status(200).json({ msg: "Something went wrong whilw registring admin" });
                }
            } else {
                return res.status(200).json({ msg: "password & confirm password does not match" });
            }
        } else {
            return res.status(200).json({ msg: "Email is already register. Use another email" });
        }
    } catch (err) {
        return res.status(400).json({ msg: "Something went wrong", error: err });
    }
};

module.exports.adminLogin = async (req, res) => {
    try {
        let checkEmail = await adminModel.findOne({ email: req.body.email });
        if (checkEmail) {
            let checkPassword = await bcrypt.compare(req.body.password, checkEmail.password);
            if (checkPassword) {
                let token = jwt.sign({ registerAdmin: checkEmail }, "secrateKey");
                return res.status(200).json({ msg: "user login successfully", data:token });
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
}