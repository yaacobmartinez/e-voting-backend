const mongoose = require("mongoose");

const Position = new mongoose.Schema({
    position_name: {
        type: String,
        required: [true, `Name is required`],
    },
    position_description: {
        type: String,
        required: [true, `Description is required`],
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model("Position", Position, "positions");
