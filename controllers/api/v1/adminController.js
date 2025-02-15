const adminModel = require("../../../models/adminModels");
const facultyModel = require("../../../models/facultyModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
                        return res.status(200).json({ msg: "Admin password is upadted" });
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

module.exports.sendMail = async (req, res) => {
    try {
        let checkEmail = await adminModel.findOne({ email: req.body.email });
        let otp = Math.round(Math.random() * 100000);
        if (checkEmail) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "jigneshb0208@gmail.com",
                    pass: "ueoiatzsolippcgs",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const info = await transporter.sendMail({
                from: 'jigneshb0208@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "Verify your email", // Subject line
                html: `<b>OTP: ${otp}</b>`, // html body
            });

            const data = {
                email: req.body.email, otp
            };

            if (info) {
                return res.status(200).json({ msg: "Mail sent successfully", data: data });
            } else {
                return res.status(200).json({ msg: "something went wrong while sendeing the mail" });
            }
        } else {
            return res.status(200).json({ msg: "Invalid email" });
        }
    } catch (error) {
        return res.status(200).json({ msg: "Something went wrong", error: error });
    }
};

module.exports.updatePassowrd = async (req, res) => {
    try {
        let updateAdminPassowrd = await adminModel.findOne({ email: req.query.email });
        if (updateAdminPassowrd) {
            if (req.body.newPassword == req.body.confirmPassword) {
                req.body.password = await bcrypt.hash(req.body.newPassword, 10);
                let updatedPassword = await adminModel.findByIdAndUpdate(updateAdminPassowrd._id, req.body);
                if (updatedPassword) {
                    return res.status(200).json({ msg: "Admin password is upadted" });
                } else {
                    return res.status(200).json({ msg: "Something went wrong whilw trying to update password" });
                }
            } else {
                return res.status(200).json({ msg: "New passowrd & Confirm password should be the same" });
            }
        } else {
            return res.status(200).json({ msg: "Invalid email" });
        }
    } catch (error) {
        return res.status(200).json({ msg: "Something went wrong", error: error });
    }
};

module.exports.facultyRegistration = async (req, res) => {
    try {
        let facultyMail = await adminModel.findOne({ email: req.user.email });
        if (facultyMail) {
            let gpass = generatePassword();
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: "jigneshb0208@gmail.com",
                    pass: "ueoiatzsolippcgs",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const info = await transporter.sendMail({
                from: "jigneshb0208@gmail.com",
                to: req.body.email,
                subject: "Welcome to the Faculty Portal",
                text: "Hello, your faculty account has been created.",
                html: `<p>Email: ${req.body.email}</p><p>Password: ${gpass}</p>`,
            });

            if (info) {
                gpass = await bcrypt.hash(gpass, 10);
                let addFaculty = await facultyModel.create({
                    userName: req.body.userName,
                    email: req.body.email,
                    password: gpass,
                });
                return res.status(200).json({ msg: "Check your email for login details",addFaculty });
               
            } else {
                return res.status(200).json({ msg: "Something went wrong while sending email",data:data });
            }
        } else {
            return res.status(200).json({ msg: "Admin not found or unauthorized" });
        }
    } catch (error) {
        return res.status(400).json({ msg: "Something went wrong", error: error });
    }
};

function generatePassword() {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};

