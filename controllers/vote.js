const Candidate = require("../models/candidates");
const Position = require('../models/positions')
const Student = require('../models/students')

exports.vote = async (req, res) => {
    const position_count = await Position.countDocuments({})
    const body = Object.keys(req.body).length
    if (position_count !== body) {
        return res.json({ success: false, message: `Please make sure all positions have been filled` })
    }

    try {
        const student = await Student.findOne({
            userId: res._id
        })
        if (student.voted) {
            return res.json({ success: false, message: `Student has already voted.` })
        }
        student.voted = true
        student.votedFrom = req.ip
        await student.save()

        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                item = req.body[key];
                const candidate = await Candidate.findById(item)
                candidate.voteCount += 1
                await candidate.save()
            }
        }
        return res.json({
            success: true,
            message: 'Thank you for exercising your right to elect officials.',
            subtext: 'You can view your votes anytime. However, you cannot change them anymore.'
        })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}