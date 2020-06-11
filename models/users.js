const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");

const authenticatedUser = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is Required."],
        minlength: 2,
        maxlength: 30,
    },
    lastName: {
        type: String,
        required: [true, "Last Name is Required."],
        minlength: 2,
        maxlength: 30,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: "Email address is required",
        validate: [validator.isEmail, "Please fill in a valid email."],
    },
    password: {
        type: String,
        required: [true, "A password will make sure we can secure your account."],
        minlength: [8, "Password must be 8-15 characters long"],
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now,
    },
    confirmed: {
        type: Boolean,
        required: true,
        default: false,
    },
    blocked: {
        type: Boolean,
        required: true,
        default: false,
    },
    role: {
        type: String,
        required: true,
        default: "5ee217552a35b70f555b4a7b",
    },
});

const unauthenticatedUser = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is Required."],
        minlength: 2,
        maxlength: 30,
    },
    lastName: {
        type: String,
        required: [true, "Last Name is Required."],
        minlength: 2,
        maxlength: 30,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: "Email address is required",
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now,
        select: false,
    },
    confirmed: {
        type: Boolean,
        required: true,
        default: false,
    },
    blocked: {
        type: Boolean,
        required: true,
        default: false,
    },
    role: {
        type: String,
        required: true,
    },
});

const authUser = mongoose.model("authUser", authenticatedUser, "users");
const publicUser = mongoose.model("publicUser", unauthenticatedUser, "users");

module.exports = {
    authUser: authUser,
    publicUser: publicUser,
};
