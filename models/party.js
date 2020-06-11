const mongoose = require("mongoose");

const Party = new mongoose.Schema({
    partyName: {
        type: String,
        required: true,
    },
    partyTagLine: {
        type: String,
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model("Party", Party, "party");
