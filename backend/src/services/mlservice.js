const axios = require("axios");

const ML_BASE_URL =
    process.env.ML_BASE_URL;


const checkHealth = async () => {
    const response =
        await axios.get(
            `${ML_BASE_URL}/health`
        );

    return response.data;
};


const processImage = async (
    data
) => {
    const response =
        await axios.post(
            `${ML_BASE_URL}/process`,
            data
        );

    return response.data;
};


const analyzeImage = async (
    data
) => {
    const response =
        await axios.post(
            `${ML_BASE_URL}/analyze`,
            data
        );

    return response.data;
};


const getRecommendation = async (
    data
) => {
    const response =
        await axios.post(
            `${ML_BASE_URL}/recommend`,
            data
        );

    return response.data;
};


module.exports = {
    checkHealth,
    processImage,
    analyzeImage,
    getRecommendation
};