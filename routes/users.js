const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users");
const JWTController = require("../controllers/jwt_controller");
const verifyJWT = JWTController.verifyJWT;
const allowAction = JWTController.allowAction;

router.get(
    "/",
    // [verifyJWT, allowAction("users", "find")],
    UserController.getAll
);
// router.get('/', UserController.getAll)
router.post(
    "/register",
    // [verifyJWT, allowAction("users", "create")],
    UserController.register
);
router.get(
    "/:id",
    [verifyJWT, allowAction("users", "findOne"), UserController.getUserById],
    UserController.getUser
);
router.delete(
    "/:id",
    [verifyJWT, allowAction("users", "delete"), UserController.getUserById],
    UserController.deleteUser
);
router.delete(
    "/truncate/all",
    [verifyJWT, allowAction("users", "delete")],
    UserController.truncate
);

router.patch(
    "/:id",
    [verifyJWT, allowAction("users", "update"),
        UserController.getUserById],
    UserController.updateUser
);
router.post("/login", UserController.loginUser);
router.get("/profile/me", verifyJWT, UserController.me);

module.exports = router;
