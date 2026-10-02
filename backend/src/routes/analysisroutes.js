const express = require("express");

const router = express.Router();

const { protect } =
    require("../middleware/authmiddleware");

const {
    mlHealth,
    process,
    analyze,
    recommendation
} = require("../controllers/analysiscontroller");


// ML service health
router.get("/health",mlHealth);

// Image processing
router.post("/process",protect,process);

// Image analysis
router.post( "/analyze", protect, analyze);

// Recommendation
router.post("/recommend",protect,recommendation);

module.exports = router;