const axios = require("axios");
const FormData = require("form-data");

const ML_BASE_URL =
    process.env.ML_BASE_URL;

if (!ML_BASE_URL) {
    throw new Error(
        "ML_BASE_URL is not configured"
    );
}

const checkHealth = async () => {
    const response =
        await axios.get(
            `${ML_BASE_URL}/health`
        );

    return response.data;
};

//get image buffer
const getImageBuffer = async (imageSource) => {

    if (!imageSource) {
        throw new Error(
            "Image source is required"
        );
    }
    if (
        imageSource.startsWith("http://") ||
        imageSource.startsWith("https://")
    ) {

        const response = await axios.get(
            imageSource,
            {
                responseType: "arraybuffer"
            }
        );

        return Buffer.from(
            response.data
        );
    }
    if (
        imageSource.startsWith("data:image/")
    ) {

        const parts =
            imageSource.split(",");

        if (parts.length !== 2) {
            throw new Error(
                "Invalid base64 image data"
            );
        }

        return Buffer.from(
            parts[1],
            "base64"
        );
    }


    throw new Error(
        "Invalid image source"
    );
};

// process image
const processImage = async (
    imageUrl,
    settings = {}
) => {

    const imageBuffer =
        await getImageBuffer(
            imageUrl
        );


    const formData =
        new FormData();


    formData.append(
        "image",
        imageBuffer,
        {
            filename: "image.jpg"
        }
    );


    formData.append(
        "settings",
        JSON.stringify(settings)
    );


    const response =
        await axios.post(
            `${ML_BASE_URL}/process`,
            formData,
            {
                headers:
                    formData.getHeaders(),

                responseType:
                    "arraybuffer",

                maxBodyLength:
                    Infinity,

                maxContentLength:
                    Infinity
            }
        );


    return Buffer.from(
        response.data
    );
};

//analyze image
const analyzeImage = async (
    imageSource
) => {

    const imageBuffer =
        await getImageBuffer(
            imageSource
        );


    const formData =
        new FormData();


    formData.append(
        "image",
        imageBuffer,
        {
            filename: "image.jpg"
        }
    );


    const response =
        await axios.post(
            `${ML_BASE_URL}/analyze`,
            formData,
            {
                headers:
                    formData.getHeaders(),

                maxBodyLength:
                    Infinity,

                maxContentLength:
                    Infinity
            }
        );


    return response.data;
};

// get recommendation
const getRecommendation = async (
    imageSource
) => {

    const imageBuffer =
        await getImageBuffer(
            imageSource
        );


    const formData =
        new FormData();


    formData.append(
        "image",
        imageBuffer,
        {
            filename: "image.jpg"
        }
    );


    const response =
        await axios.post(
            `${ML_BASE_URL}/recommend`,
            formData,
            {
                headers:
                    formData.getHeaders(),

                maxBodyLength:
                    Infinity,

                maxContentLength:
                    Infinity
            }
        );


    return response.data;
};


module.exports = {
    checkHealth,
    processImage,
    analyzeImage,
    getRecommendation
};