const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Role = require("../models/roles");
const Permission = require("../models/permissions");

exports.verifyJWT = async function (req, res, next) {
    try {
        var token = req.headers["access_token"];
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized Access" });
        }
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err)
                return res
                    .status(500)
                    .json({ success: false, message: "Unauthorized Access" });
            res.verified = true;
            res._id = decoded.id;
            return res;
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Uh oh something wrong happened." });
    }
    next();
};

exports.allowAction = function (controller, action) {
    return async (req, res, next) => {
        const user = await User.publicUser.findById(res._id);
        const role = await Role.findById(user.role);
        const permission = await Permission.findOne({
            controller,
            role: role._id,
            action,
            enabled: true,
        });
        if (permission === null) {
            res.json({
                success: false,
                field: "access",
                message: "Permission Denied",
            });
        } else {
            next();
        }
    };
};
