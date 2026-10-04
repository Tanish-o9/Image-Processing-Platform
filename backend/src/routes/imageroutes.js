const express = require("express");

const router = express.Router();

const {
    uploadImage,
    getImageById,
    deleteImage,
    exportImage,
    getImageStats
} = require("../controllers/imagecontroller");

const { protect } = require("../middleware/authmiddleware");
const upload = require("../middleware/uploadmiddleware");

//upload image
router.post("/upload",protect,upload.single("image"),uploadImage);

//get image by id
router.get("/getimage/:imageId",protect, getImageById);

//delete image
router.delete("/deleteimage/:imageId",protect, deleteImage);

//export image
router.post("/export/:id",protect,exportImage);

// get image statistics
router.get("/stats",protect,getImageStats);

module.exports = router;