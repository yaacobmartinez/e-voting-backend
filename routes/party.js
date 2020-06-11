const express = require("express");
const router = express.Router();
const PartyController = require("../controllers/party");
const JWTController = require("../controllers/jwt_controller");
const verifyJWT = JWTController.verifyJWT;
const allowAction = JWTController.allowAction;

router.get(
    "/",
    // [verifyJWT, allowAction("party", "find")],
    PartyController.getAll
);
router.post(
    "/",
    // [verifyJWT, allowAction("party", "create")],
    PartyController.add
);
router.get(
    "/:id",
    [verifyJWT, allowAction("party", "findOne"), PartyController.getPartyById],
    PartyController.getParty
);
router.patch(
    "/:id",
    // PositionController.getPositionById,
    [verifyJWT, allowAction("party", "update"), PartyController.getPartyById],
    PartyController.updateParty
);
router.delete(
    "/:id",
    [verifyJWT, allowAction("party", "delete"), PartyController.getPartyById],
    PartyController.deleteParty
);
router.delete(
    "/truncate/all",
    [verifyJWT, allowAction("party", "delete")],
    PartyController.truncate
);
module.exports = router;
