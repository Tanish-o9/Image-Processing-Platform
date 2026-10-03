const {
    checkHealth,
    analyzeImage,
    getRecommendation
} = require("../services/mlservice");

const {
    processStoredImage
} = require("../services/imageprocessingservice");


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
        return res.status(200).json({
            success: true,

            message:
                "Image processed successfully",

            data: result
        });

    } catch (error) {
        next(error);
    }
};
// Analyze image
const analyze = async (req,res,next) => {
    try {
        const result =
            await analyzeImage(
                req.body
            );
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
        const result =
            await getRecommendation(
                req.body
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