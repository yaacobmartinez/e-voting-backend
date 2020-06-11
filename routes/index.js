const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/roles", require("./roles"));
router.use("/students", require("./students"));
router.use("/permissions", require("./permissions"));
router.use("/positions", require("./positions"));
router.use("/parties", require("./party"));
router.use("/candidates", require("./candidates"));
router.use("/vote", require("./vote"));

module.exports = router;
