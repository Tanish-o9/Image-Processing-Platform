const Image = require("../models/image");

const {deleteFromCloudinary} = require("../services/cloudinaryservice");


// Get history
const getHistory = async (req,res,next) => {
    try {
        const history =
            await Image.find({
                user: req.user._id
            }).sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            message:
                "History fetched successfully",
            data: {
                history
            }
        });
    } catch (error) {
        next(error);
    }
};


// Clear history
const clearHistory = async (req,res,next) => {
    try {
        const images =await Image.find({
                user: req.user._id
            });

        for (const image of images) {
            await deleteFromCloudinary(
                image.cloudinaryPublicId
            );
        }
        await Image.deleteMany({
            user: req.user._id
        });
        return res.status(200).json({
            success: true,

            message:
                "History cleared successfully"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHistory,
    clearHistory
};