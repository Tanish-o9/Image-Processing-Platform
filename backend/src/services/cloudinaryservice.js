const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (
    buffer,
    userId
) => {
    return new Promise((resolve, reject) => {
        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    folder:
                        `image-processing-platform/${userId}`,

                    resource_type: "image"
                },

                (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(result);
                }
            );

        streamifier
            .createReadStream(buffer)
            .pipe(uploadStream);
    });
};

const deleteFromCloudinary = async (
    publicId
) => {
    return cloudinary.uploader.destroy(
        publicId,
        {
            resource_type: "image"
        }
    );
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
};