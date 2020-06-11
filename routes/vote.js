const express = require("express");
const router = express.Router();
const VoteController = require("../controllers/vote");
const JWTController = require("../controllers/jwt_controller");
const verifyJWT = JWTController.verifyJWT;
const allowAction = JWTController.allowAction;

router.post(
    "/", verifyJWT,
    VoteController.vote
);

module.exports = router;