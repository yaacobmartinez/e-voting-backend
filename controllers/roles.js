const Role = require("../models/roles");

exports.getAll = async function (req, res) {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.add = async function (req, res) {
    const roleExists = await Role.findOne({
        name: req.body.name,
    });
    if (roleExists) {
        res.status(500).json({
            success: false,
            message: `Role ${req.body.name} already exists`,
        });
    }
    const role = new Role({
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
    });
    const errors = role.validateSync();
    if (errors) {
        const error = Object.values(errors.errors);
        const e = getErrors(error);
        return res.status(500).json({ success: false, errors: e });
    }
    try {
        const newRole = await role.save();
        res.json({ success: true, message: `Role ${newRole.name} Added` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getRole = async function (req, res) {
    res.json(res.role);
};

exports.updateRole = async function (req, res) {
    if (req.body.name != null) {
        res.role.name = req.body.name;
    }
    if (req.body.description != null) {
        res.role.description = req.body.description;
    }
    if (req.body.type != null) {
        res.role.type = req.body.type;
    }

    try {
        const role = await res.role.save();
        res.json({
            success: true,
            message: `Role ${role.name} updated`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteRole = async function (req, res) {
    try {
        const role = res.role.remove();
        res.json({
            success: true,
            message: `Role ${res.role.name} removed`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getRoleById = async function (req, res, next) {
    try {
        role = await Role.findById(req.params.id);
        if (role == null)
            return res
                .status(500)
                .json({ success: false, message: `Role not found` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    res.role = role;
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
