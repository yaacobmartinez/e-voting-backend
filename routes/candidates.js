const express = require("express");
const router = express.Router();
const CandidateController = require("../controllers/candidates");
const JWTController = require("../controllers/jwt_controller");
const verifyJWT = JWTController.verifyJWT;
const allowAction = JWTController.allowAction;

router.get(
    "/",
    // [verifyJWT, allowAction("candidates", "find")],
    CandidateController.getAll
);
router.post(
    "/",
    // [verifyJWT, allowAction("candidates", "create")],
    CandidateController.register
);
router.get(
    "/:id",
    [verifyJWT, allowAction("candidates", "findOne"), CandidateController.getCandidateById],
    CandidateController.getCandidate
);
router.patch(
    "/:id",
    [verifyJWT, allowAction("candidates", "update"), CandidateController.getCandidateById],
    CandidateController.updateCandidate
);
router.delete(
    "/:id",
    [verifyJWT, allowAction("candidates", "delete"), CandidateController.getCandidateById],
    CandidateController.deleteCandidate
);
router.delete(
    "/truncate/all",
    [verifyJWT, allowAction("candidates", "delete")],
    CandidateController.truncate
);
module.exports = router;
