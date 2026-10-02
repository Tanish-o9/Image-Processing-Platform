const Image = require("../models/image");

const {processImage} = require("./mlservice");


const processStoredImage = async (
    imageId,
    userId,
    options = {}
) => {
    const image =
        await Image.findOne({
            _id: imageId,
            user: userId
        });

    if (!image) {
        throw new Error(
            "Image not found"
        );
    }

    image.status = "processing";

    await image.save();

    try {
        const result = await processImage({
                imageUrl:image.secureUrl,
                ...options
            });

        image.status = "processed";

        image.processingResult =result;
        await image.save();
        return {
            image,
            result
        };

    } catch (error) {
        image.status = "failed";

        await image.save();

        throw error;
    }
};


module.exports = {
    processStoredImage
};
