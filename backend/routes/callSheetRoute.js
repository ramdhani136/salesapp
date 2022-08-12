const express = require("express");
const router = express.Router();
const callSheet = require("../controllers/callSheetController");

router.post("/", callSheet.create);
router.get("/", callSheet.getAllCallSheet);
router.get("/:id", callSheet.getOneCallSheet);
router.put("/:id", callSheet.updateCallSheet);
router.delete("/:id", callSheet.deleteCallSheet);
router.get("/status/:status", callSheet.getByStatus);

module.exports = router;
