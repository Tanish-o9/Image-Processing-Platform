const Image = require("../models/imagemodel");

const {
    uploadToCloudinary,
    deleteFromCloudinary
} = require("../services/cloudinaryservice");


// Upload image
const uploadImage = async (req,res,next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }
        const result =
            await uploadToCloudinary(
                req.file.buffer,
                req.user._id.toString()
            );
        const image = await Image.create({
            user: req.user._id,
            originalName:req.file.originalname,
            cloudinaryPublicId:result.public_id,
            cloudinaryUrl:result.url,
            secureUrl:result.secure_url,
            mimeType:req.file.mimetype,
            format:result.format,
            size:req.file.size,
            width:result.width,
            height:result.height,
            status: "uploaded"
        });

        return res.status(201).json({
            success: true,
            message:
                "Image uploaded successfully",
            data: {
                image
            }
        });

    } catch (error) {
        next(error);
    }
};
// Get one image
const getImageById = async (req,res,next) => {
    try {
        const image =
            await Image.findOne({
                _id: req.params.id,
                user: req.user._id
            });

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        return res.status(200).json({
            success: true,

            data: {
                image
            }
        });

    } catch (error) {
        next(error);
    }
};
// Delete image
const deleteImage = async (req,res,next) => {
    try {
        const image =
            await Image.findOne({
                _id: req.params.id,
                user: req.user._id
            });

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        await deleteFromCloudinary(
            image.cloudinaryPublicId
        );

        await image.deleteOne();

        return res.status(200).json({
            success: true,

            message:
                "Image deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};
// Mark image as exported
const exportImage = async (req,res,next) => {
    try {
        const image =
            await Image.findOne({
                _id: req.params.id,
                user: req.user._id
            });

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }
        image.exportedAt = new Date();
        await image.save();
        return res.status(200).json({
            success: true,
            message:
                "Image is ready for export",
            data: {
                imageId: image._id,
                url: image.secureUrl,
                exportedAt:
                    image.exportedAt
            }
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    uploadImage,
    getImageById,
    deleteImage,
    exportImage
};