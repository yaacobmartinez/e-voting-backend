const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/roles");
const JWTController = require("../controllers/jwt_controller");
const verifyJWT = JWTController.verifyJWT;
const allowAction = JWTController.allowAction;

router.get(
    "/",
    // [verifyJWT, allowAction("roles", "find")],
    RoleController.getAll
);
router.post(
    "/",
    // [verifyJWT, allowAction("roles", "create")],
    RoleController.add
);
router.get(
    "/:id",
    [verifyJWT, allowAction("roles", "findOne"), RoleController.getRoleById],
    RoleController.getRole
);
router.patch(
    "/:id",
    [verifyJWT, allowAction("roles", "update"), RoleController.getRoleById],
    RoleController.updateRole
);
router.delete(
    "/:id",
    [verifyJWT, allowAction("roles", "delete"), RoleController.getRoleById],
    RoleController.deleteRole
);
module.exports = router;
