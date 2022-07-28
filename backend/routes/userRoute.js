const express = require("express");
const router = express.Router();
const users = require("../controllers/userController");
const { PermissionData } = require("../middleware/DocRule");
const { verifyToken } = require("../middleware/VerifiyToken");

router.post("/", verifyToken, PermissionData, users.register);
router.get("/", verifyToken, PermissionData, users.getUsers);
router.post("/login", users.login);
router.get("/token/:id", users.refreshToken);
router.delete("/logout", users.logout);

module.exports = router;
