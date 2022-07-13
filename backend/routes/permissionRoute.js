const express = require("express");
const router = express.Router();
const controller = require("../controllers/permissionController");

router.post("/", controller.create);
router.get("/", controller.getAllData);
router.get("/:id", controller.getOneData);
router.put("/:id", controller.updateData);
router.delete("/:id", controller.deleteData);

module.exports = router;
