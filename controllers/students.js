const Student = require("../models/students");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

exports.getAll = async function (req, res) {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.truncate = async (req, res) => {
    try {
        await Student.deleteMany({})
        return res.json({ success: true, message: `Student Collection Truncated` })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

exports.add = async function (req, res) {
    const studentExists = await Student.findOne({
        studentNo: req.body.studentNo,
    });
    if (studentExists) {
        return res.status(500).json({
            success: false,
            message: `Student No. with ${req.body.studentNo} already exists`,
        });
    }
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
        confirmed: false,
        password: bcrypt.hashSync(req.body.password, 10),
    });
    const errors = user.validateSync();
    if (errors) {
        const error = Object.values(errors.errors);
        const e = getErrors(error);
        return res.status(500).json({ success: false, errors: e });
    }

    try {
        const newUser = await user.save()
        const student = new Student({
            studentNo: req.body.studentNo,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            course: req.body.course,
            gradeLevel: req.body.gradeLevel,
            userId: newUser._id
        });
        const errors = student.validateSync();
        if (errors) {
            const error = Object.values(errors.errors);
            const e = getErrors(error);
            return res.status(500).json({ success: false, errors: e });
        }
        const newStudent = await student.save();
        res.json({ success: true, message: `New Student Added` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getStudent = async function (req, res) {
    res.json(res.student);
};

exports.updateStudent = async function (req, res) {
    if (req.body.studentNo != null) {
        res.student.studentNo = req.body.studentNo;
    }
    if (req.body.firstName != null) {
        res.student.firstName = req.body.firstName;
    }
    if (req.body.course != null) {
        res.student.course = req.body.course;
    }
    if (req.body.gradeLevel != null) {
        res.student.gradeLevel = req.body.gradeLevel;
    }
    if (req.body.voted != null) {
        res.student.voted = req.body.voted;
    }

    try {
        const student = await res.student.save();
        res.json({
            success: true,
            message: `Student updated`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.setVoted = async function (req, res) {
    res.student.voted = true;
    try {
        const student = await res.student.save();
        res.json({
            success: true,
            message: `Student has Voted`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteStudent = async function (req, res) {
    try {
        const student = res.student.remove();
        res.json({
            success: true,
            message: `Student removed`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getStudentById = async function (req, res, next) {
    try {
        student = await Student.findById(req.params.id);
        if (student == null)
            return res
                .status(500)
                .json({ success: false, message: `Student not found` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    res.student = student;
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
