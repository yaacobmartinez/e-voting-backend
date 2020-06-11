const mongoose = require("mongoose");

const Permission = new mongoose.Schema({
    controller: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
        enum: ["count", "find", "create", "delete", "findOne", "update"],
        default: "count",
    },
    enabled: {
        type: Boolean,
        required: true,
        default: false,
    },
    role: {
        type: String,
        required: true,
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model("Permission", Permission, "permissions");
