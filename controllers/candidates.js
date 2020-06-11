const express = require("express");
const Candidate = require("../models/candidates");

exports.getAll = async function (req, res) {

    try {
        const candidates = await Candidate.find();
        res.json(candidates)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.truncate = async (req, res) => {
    try {
        await Candidate.deleteMany({})
        return res.json({ success: true, message: `Candidate Collection Truncated` })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

exports.register = async function (req, res) {
    const candidate_exists = await Candidate.findOne({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    if (candidate_exists) {
        return res.json({
            success: false,
            message: `Candidate already exists`,
        });
    }
    const position_taken = await Candidate.findOne({
        position: req.body.position,
        party: req.body.party,
    });
    if (position_taken) {
        return res.json({
            success: false,
            message: `Party already has a candidate for this position`,
        });
    }
    const candidate = new Candidate({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        position: req.body.position,
        party: req.body.party,
    });

    const errors = candidate.validateSync();
    if (errors) {
        const error = Object.values(errors.errors);
        const e = getErrors(error);
        return res.status(500).json({ success: false, errors: e });
    }

    try {
        const newCandidate = await candidate.save();
        res.json({ success: true, message: `Candidate Saved.` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCandidate = async function (req, res) {
    res.json(res.candidate);
};

exports.deleteCandidate = async function (req, res) {
    try {
        await res.candidate.remove();
        res.json({ success: true, message: `Candidate Removed` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCandidate = async function (req, res) {
    if (req.body.firstName != null) {
        res.candidate.firstName = req.body.firstName;
    }
    if (req.body.lastName != null) {
        res.candidate.lastName = req.body.lastName;
    }
    if (req.body.position != null) {
        res.candidate.position = req.body.position;
    }
    if (req.body.party != null) {
        res.candidate.party = req.body.party;
    }
    try {
        const updatedCandidate = await res.candidate.save();
        res.json({ success: true, message: `Candidate updated` });
    } catch (error) {
        res
            .json(500)
            .json({ success: false, message: `Uh oh, something wrong happened.` });
    }
};

exports.getCandidateById = async function (req, res, next) {
    try {
        candidate = await Candidate.findById(req.params.id);
        if (candidate == null) {
            return res
                .status(404)
                .json({ success: false, message: "Candidate Not Found" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Candidate not Found" });
    }
    res.candidate = candidate;
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
