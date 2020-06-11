const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.getAll = async function (req, res) {

    try {
        const users = await User.publicUser.find();
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.register = async function (req, res) {
    const userExists = await User.authUser.findOne({
        email: req.body.email,
    });
    if (userExists) {
        return res.json({
            success: false,
            message: `Email already exists`,
        });
    }
    const user = new User.authUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        confirmed: req.body.confirmed,
        password: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role
    });
    try {
        const newUser = await user.save();
        res.json({ success: true, message: `User saved with id ${newUser._id}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUser = async function (req, res) {
    res.json(res.user);
};

exports.deleteUser = async function (req, res) {
    try {
        await res.user.remove();
        res.json({ success: true, message: `User ${res.user.email} Removed` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.truncate = async (req, res) => {
    try {
        await User.authUser.deleteMany({ role: { $ne: "5ee21995739e921003625b25" } })
        return res.json({ success: true, message: `User Collection Truncated` })
    } catch (error) {
        return res.json({ success: false, message: "Shit" })
    }
}

exports.updateUser = async function (req, res) {
    const currentUser = await User.publicUser.findById(req.params.id);
    const newEmail = await User.publicUser.findOne({
        email: req.body.email,
    });
    if (currentUser.email != req.body.email) {
        if (newEmail)
            return res.status(500).json({
                success: false,
                message: `Email ${req.body.email} already exists. Please try a different username`,
            });
    }
    if (req.body.firstName != null) {
        res.user.firstName = req.body.firstName;
    }
    if (req.body.lastName != null) {
        res.user.lastName = req.body.lastName;
    }
    if (req.body.email != null) {
        res.user.email = req.body.email;
    }
    if (req.body.confirmed != null) {
        res.user.confirmed = req.body.confirmed;
    }
    if (req.body.blocked != null) {
        res.user.blocked = req.body.blocked;
    }
    if (req.body.role != null) {
        res.user.role = req.body.role;
    }
    if (req.body.password != null) {
        res.user.password = bcrypt.hashSync(req.body.password);
    }
    try {
        const updatedUser = await res.user.save();
        res.json({ success: true, message: `User ${res.user.email} updated` });
    } catch (error) {
        res
            .json(500)
            .json({ success: false, message: `Uh oh, something wrong happened.` });
    }
};


exports.loginUser = async function (req, res) {
    const user = await User.authUser.findOne({ email: req.body.email });
    if (!user)
        return res.status(500).json({
            success: false,
            field: "email",
            message: `We cannot find a user with that email`,
        });

    const isCorrectPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!isCorrectPassword)
        return res.status(500).json({
            success: false,
            field: "password",
            message: `Your password is invalid.`,
        });
    if (!user.confirmed) {
        return res.status(500).json({
            success: false,
            field: "email",
            message: "Please wait for your account to be verified. You will be contacted once your account is approved or denied",
        });
    }
    if (user.blocked) {
        return res.status(500).json({
            success: false,
            field: "email",
            message: "Your access has been restricted by your administrator",
        });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: 86400,
    });
    return res.json({ success: true, message: `Login Successful`, token: token });
};

exports.me = async function (req, res) {
    const user = await User.publicUser.findById(res._id);
    res.json(user);
};

exports.getUserById = async function (req, res, next) {
    try {
        user = await User.publicUser.findById(req.params.id);
        if (user == null) {
            return res
                .status(404)
                .json({ success: false, message: "User Not Found" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "User not Found" });
    }
    res.user = user;
    next();
};




