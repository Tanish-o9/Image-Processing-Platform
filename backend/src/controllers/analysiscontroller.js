const {
    checkHealth,
    analyzeImage,
    getRecommendation
} = require("../services/mlservice");

const {
    processStoredImage
} = require("../services/imageprocessingservice");

const Image = require("../models/image");

// ML health
const mlHealth = async (req,res,next) => {
    try {
        const result =
            await checkHealth();

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        next(error);
    }
};

// Process image
const process = async (req,res,next) => {
    try {
        const {
            imageId,
            ...options
        } = req.body;

        if (!imageId) {
            return res.status(400).json({
                success: false,
                message:
                    "imageId is required"
            });
        }
        const result =
            await processStoredImage(
                imageId,
                req.user._id,
                options
            );

        // If ML service returns image buffer
        if (Buffer.isBuffer(result.result)) {
            res.set("Content-Type", "image/jpeg");
            return res.send(result.result);
        }

        return res.status(200).json({
            success: true,

            message:
                "Image processed successfully",

            data: result.result
        });

    } catch (error) {
        next(error);
    }
};
// Analyze image
const analyze = async (req,res,next) => {
    try {
        const { imageId } = req.body;

        if (!imageId) {
            return res.status(400).json({
                success: false,
                message: "imageId is required"
            });
        }

        // Find image belonging to logged-in user
        const image = await Image.findOne({
            _id: imageId,
            user: req.user._id
        });

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        // Send Cloudinary image URL to ML service
        const result = await analyzeImage(
            image.secureUrl
        );

        // Save analysis result
        image.analysisResult = result;

        await image.save();

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        next(error);
    }
};


// Recommendation
const recommendation = async (req,res,next) => {
     try {
        const { imageId } = req.body;

        if (!imageId) {
            return res.status(400).json({
                success: false,
                message: "imageId is required"
            });
        }

        // Find image belonging to logged-in user
        const image = await Image.findOne({
            _id: imageId,
            user: req.user._id
        });

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        // Send Cloudinary image URL to ML service
        const result = await getRecommendation(
            image.secureUrl
        );

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    mlHealth,
    process,
    analyze,
    recommendation
};