const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        originalName: {
            type: String,
            required: true,
            trim: true
        },

        cloudinaryPublicId: {
            type: String,
            required: true
        },

        cloudinaryUrl: {
            type: String,
            required: true
        },

        secureUrl: {
            type: String,
            required: true
        },

        mimeType: {
            type: String,
            required: true
        },

        format: {
            type: String
        },

        size: {
            type: Number
        },

        width: {
            type: Number
        },

        height: {
            type: Number
        },

        status: {
            type: String,
            enum: [
                "uploaded",
                "processing",
                "processed",
                "failed"
            ],
            default: "uploaded"
        },

        processingResult: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        analysisResult: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        exportedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Image",
    imageSchema
);