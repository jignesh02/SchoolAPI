const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
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

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;