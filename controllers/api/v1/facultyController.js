const FacultyModel = require("../../../models/facultyModel");
const StudentModel = require("../../../models/studentModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.facultyLogin = async (req, res) => {
    try {
        let checkEmail = await FacultyModel.findOne({ email: req.body.email });
        if (checkEmail) {
            let checkPassword = await bcrypt.compare(req.body.password, checkEmail.password);
            console.log(checkPassword);
            if (checkPassword) {
                let token = await jwt.sign({ ft: checkEmail }, "FacultyKey");
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

module.exports.studentRegistration = async (req, res) => {
    try {
        let studentyMail = await FacultyModel.findOne({ email: req.user.email });
        if (studentyMail) {
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
                let addStudent = await StudentModel.create({
                    userName: req.body.userName,
                    email: req.body.email,
                    password: gpass,
                });
                return res.status(200).json({ msg: "Check your email for login details", addStudent });

            } else {
                return res.status(200).json({ msg: "Something went wrong while sending email", data: data });
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
