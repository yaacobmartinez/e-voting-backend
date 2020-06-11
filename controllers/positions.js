const express = require("express");
const Position = require("../models/positions");

exports.getAll = async function (req, res) {

    try {
        const positions = await Position.find();
        res.json(positions)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.truncate = async (req, res) => {
    try {
        await Position.deleteMany({})
        return res.json({ success: true, message: `Position Collection Truncated` })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


exports.register = async function (req, res) {
    const position_exists = await Position.findOne({
        position_name: req.body.position_name,
    });
    if (position_exists) {
        return res.json({
            success: false,
            message: `Position already exists`,
        });
    }
    const position = new Position({
        position_name: req.body.position_name,
        position_description: req.body.position_description,
    });

    const errors = position.validateSync();
    if (errors) {
        const error = Object.values(errors.errors);
        const e = getErrors(error);
        return res.status(500).json({ success: false, errors: e });
    }

    try {
        const newPosition = await position.save();
        res.json({ success: true, message: `Position Saved.` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPosition = async function (req, res) {
    res.json(res.position);
};

exports.deletePosition = async function (req, res) {
    try {
        await res.position.remove();
        res.json({ success: true, message: `Position ${res.position.position_name} Removed` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updatePosition = async function (req, res) {
    if (req.body.position_name != null) {
        res.position.position_name = req.body.position_name;
    }
    if (req.body.position_description != null) {
        res.position.position_description = req.body.position_description;
    }
    try {
        const updatedPosition = await res.position.save();
        res.json({ success: true, message: `Position ${updatedPosition.position_name} updated` });
    } catch (error) {
        res
            .json(500)
            .json({ success: false, message: `Uh oh, something wrong happened.` });
    }
};

exports.getPositionById = async function (req, res, next) {
    try {
        position = await Position.findById(req.params.id);
        if (position == null) {
            return res
                .status(404)
                .json({ success: false, message: "Position Not Found" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Position not Found" });
    }
    res.position = position;
    next();
};


function getErrors(error) {
    var e = {};
    for (var key in error) {
        if (error.hasOwnProperty(key)) {
            e[error[key].properties["path"]] = error[key].message;
        }
    }
    return e;
}
