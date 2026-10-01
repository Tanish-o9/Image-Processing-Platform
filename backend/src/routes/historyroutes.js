const express = require("express");
const router = express.Router();
const {protect} =require("../middleware/authmiddleware");

const {getHistory,clearHistory} = require("../controllers/historycontroller");

router.get("/gethistory",protect,getHistory);

router.delete("/deletehistory",protect,clearHistory);

module.exports = router;