const mongoose = require("mongoose");

const Candidate = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, `First Name is required`]
    },
    lastName: {
        type: String,
        required: [true, `Last Name is required`]
    },
    position: {
        type: String,
        required: [true, `What's your Position?`]
    },
    party: {
        type: String,
        required: [true, `Party is required`]
    },
    voteCount: {
        type: Number,
        required: true,
        default: 0
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model("Candidate", Candidate, "candidates");
