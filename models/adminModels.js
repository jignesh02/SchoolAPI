const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;