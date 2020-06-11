const mongoose = require("mongoose");

const Role = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Name is required.`],
    },
    description: {
        type: String,
        required: [true, `Description is required.`],
    },
    type: {
        type: String,
        required: [true, `Type is required.`],
        enum: ["authenticated", "public", "admin"],
        default: "public",
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model("Role", Role, "roles");
