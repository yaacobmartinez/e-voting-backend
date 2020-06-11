const express = require("express");
const router = express.Router();
const PermissionController = require("../controllers/permissions");
const JWTController = require("../controllers/jwt_controller");
const verifyJWT = JWTController.verifyJWT;
const allowAction = JWTController.allowAction;

router.get(
    "/",
    [verifyJWT, allowAction("permissions", "find")],
    PermissionController.getAll
);
router.post(
    "/",
    [verifyJWT, allowAction("permissions", "create")],
    PermissionController.add
);
router.get(
    "/:id",
    [
        verifyJWT,
        allowAction("permissions", "findOne"),
        PermissionController.getPermissionById,
    ],
    PermissionController.getPermission
);
router.patch(
    "/:id",
    [
        verifyJWT,
        allowAction("permissions", "update"),
        PermissionController.getPermissionById,
    ],
    PermissionController.updatePermission
);
router.delete(
    "/:id",
    [
        verifyJWT,
        allowAction("permissions", "delete"),
        PermissionController.getPermissionById,
    ],
    PermissionController.deletePermission
);
module.exports = router;
