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
                let token = jwt.sign({ userData: checkEmail }, "secrateKey");
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

module.exports.adminProfile = async (req, res) => {
    try {
        return res.status(200).json({ msg: "User profile", data: req.user });
    } catch (err) {
        return res.status(200).json({ msg: "Something went wrong", error: err });
    }
};

module.exports.editAdminProfile = async (req, res) => {
    try {
        let updateData = await adminModel.findById(req.params.id);
        if (updateData) {
            let updatedAdminData = await adminModel.findByIdAndUpdate(req.params.id, req.body);
            if (updatedAdminData) {
                return res.status(200).json({ msg: "Admin data updated successfully", data: updatedAdminData });
            } else {
                return res.status(500).json({ msg: "Something went wrong while updating admin data" });
            }
        } else {
            return res.status(404).json({ msg: "Admin not found" });
        }
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong", error: error });
    }
};

module.exports.adminLogout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(400).json({ msg: "Something went wrong" });
            } else {
                return res.status(200).json({ msg: "Go to login page for Login" });
            }
        })
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong", error: error });
    }
};

module.exports.changeAdminPassword = async (req, res) => {
    try {
        let CheckCurrentPassword = await bcrypt.compare(req.body.currentPassword, req.user.password);
        if (CheckCurrentPassword) {
            if (req.body.currentPassword != req.body.newPassword) {
                if (req.body.newPassword == req.body.confirmPassword) {
                    req.body.password = await bcrypt.hash(req.body.newPassword, 10);
                    let updatedPassword = await adminModel.findByIdAndUpdate(req.user._id, req.body);
                    if (updatedPassword) {
                        return res.status(200).json({ msg: "user password is upadted" });
                    } else {
                        return res.status(200).json({ msg: "Something went wrong whilw trying to update " });
                    }
                } else {
                    return res.status(200).json({ msg: "New passowrd & Confirm password should be the same" });
                }
            } else {
                return res.status(200).json({ msg: "Currnet passowrd & New password should not be the same" });
            }
        } else {
            return res.status(200).json({ msg: "Enter valid current passowrd" });
        }
    } catch (error) {
        return res.status(200).json({ msg: "Something went wrong", error: error });
    }
};