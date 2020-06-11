const express = require("express");
const router = express.Router();
const PositionController = require("../controllers/positions");
const JWTController = require("../controllers/jwt_controller");
const verifyJWT = JWTController.verifyJWT;
const allowAction = JWTController.allowAction;

router.get(
    "/",
    // [verifyJWT, allowAction("positions", "find")],
    PositionController.getAll
);
router.post(
    "/",
    [verifyJWT, allowAction("positions", "create")],
    PositionController.register
);
router.get(
    "/:id",
    [verifyJWT, allowAction("positions", "findOne"), PositionController.getPositionById],
    PositionController.getPosition
);
router.patch(
    "/:id",
    // PositionController.getPositionById,
    [verifyJWT, allowAction("positions", "update"), PositionController.getPositionById],
    PositionController.updatePosition
);
router.delete(
    "/:id",
    [verifyJWT, allowAction("positions", "delete"), PositionController.getPositionById],
    PositionController.deletePosition
);
router.delete(
    "/truncate/all",
    [verifyJWT, allowAction("positions", "delete")],
    PositionController.truncate
);
module.exports = router;
