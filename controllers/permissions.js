const Permission = require("../models/permissions");

exports.getAll = async function (req, res) {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.add = async function (req, res) {
    const permissionExists = await Permission.findOne({
        controller: req.body.controller,
        action: req.body.action,
        role: req.body.role,
    });
    if (permissionExists) {
        res.status(500).json({
            success: false,
            message: `Permission already exists`,
        });
    }
    const permission = new Permission({
        controller: req.body.controller,
        action: req.body.action,
        enabled: req.body.enabled,
        role: req.body.role,
    });
    const errors = permission.validateSync();
    if (errors) {
        const error = Object.values(errors.errors);
        const e = getErrors(error);
        return res.status(500).json({ success: false, errors: e });
    }
    try {
        const newPermission = await permission.save();
        res.json({
            success: true,
            message: `Permission Added`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPermission = async function (req, res) {
    res.json(res.permission);
};

exports.updatePermission = async function (req, res) {
    if (req.body.controller != null) {
        res.permission.controller = req.body.controller;
    }
    if (req.body.action != null) {
        res.permission.action = req.body.action;
    }
    if (req.body.enabled != null) {
        res.permission.enabled = req.body.enabled;
    }
    if (req.body.role != null) {
        res.permission.role = req.body.role;
    }

    try {
        const permission = await res.permission.save();
        res.json({
            success: true,
            message: `Permission updated`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deletePermission = async function (req, res) {
    try {
        const permission = res.permission.remove();
        res.json({
            success: true,
            message: `Permission removed`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPermissionById = async function (req, res, next) {
    try {
        permission = await Permission.findById(req.params.id);
        if (permission == null)
            return res
                .status(500)
                .json({ success: false, message: `Permission not found` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    res.permission = permission;
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
