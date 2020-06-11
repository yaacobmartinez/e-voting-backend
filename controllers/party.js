const Party = require("../models/party");

exports.getAll = async function (req, res) {
    try {
        const parties = await Party.find();
        res.json(parties);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.truncate = async (req, res) => {
    try {
        await Party.deleteMany({})
        return res.json({ success: true, message: `Party Collection Truncated` })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

exports.add = async function (req, res) {
    const partyExists = await Party.findOne({
        partyName: req.body.partyName
    });
    if (partyExists) {
        res.status(500).json({
            success: false,
            message: `Party already exists`,
        });
    }
    const party = new Party({
        partyName: req.body.partyName,
        partyTagLine: req.body.partyTagLine,
    });
    const errors = party.validateSync();
    if (errors) {
        const error = Object.values(errors.errors);
        const e = getErrors(error);
        return res.status(500).json({ success: false, errors: e });
    }
    try {
        const newParty = await party.save();
        res.json({
            success: true,
            message: `Party Added`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getParty = async function (req, res) {
    res.json(res.party);
};

exports.updateParty = async function (req, res) {
    if (req.body.partyName != null) {
        res.party.partyName = req.body.partyName;
    }
    if (req.body.partyTagLine != null) {
        res.party.partyTagLine = req.body.partyTagLine;
    }

    try {
        const party = await res.party.save();
        res.json({
            success: true,
            message: `Party updated`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteParty = async function (req, res) {
    try {
        const party = res.party.remove();
        res.json({
            success: true,
            message: `Party removed`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPartyById = async function (req, res, next) {
    try {
        party = await Party.findById(req.params.id);
        if (party == null)
            return res
                .status(500)
                .json({ success: false, message: `Party not found` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    res.party = party;
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
