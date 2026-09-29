const express = require("express");

const router = express.Router();

const {
    uploadImage,
    getImageById,
    deleteImage,
    exportImage
} = require("../controllers/imagecontroller");

const { protect } = require("../middleware/authmiddleware");
const upload = require("../middleware/uploadmiddleware");

router.post("/upload",upload.single("image"),uploadImage);

router.get("/getimage/:imageId",protect, getImageById);

router.delete("/deleteimage/:imageId",protect, deleteImage);

router.post("/export/:id",protect,exportImage);

module.exports = router;