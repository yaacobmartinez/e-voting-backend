const mongoose = require("mongoose");

const Student = new mongoose.Schema({
    studentNo: {
        type: String,
        required: [true, `Student No. is required`],
    },
    firstName: {
        type: String,
        required: [true, `First Name is required`],
    },
    lastName: {
        type: String,
        required: [true, `Last Name is required`],
    },
    course: {
        type: String,
        required: true,
        default: "SHS"
    },
    gradeLevel: {
        type: Number,
        required: [true, `Level is required`],
    },
    voted: {
        type: Boolean,
        required: true,
        default: false,
    },
    votedFrom: {
        type: String,
    },
    userId: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model("Student", Student, "students");
