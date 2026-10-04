import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ML_URL, getToken } from "../../api";

function Analysis() {

    const navigate = useNavigate();

    const [image, setImage] = useState("");

    const [analysis, setAnalysis] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================
    // Load Image
    // =========================

    useEffect(() => {

        const analysisImage =
            sessionStorage.getItem(
                "analysisImage"
            );

        const processedImage =
            sessionStorage.getItem(
                "processedImage"
            );

        const imageData =
            sessionStorage.getItem(
                "imageData"
            );


        if (analysisImage) {

            setImage(analysisImage);

            return;

        }


        if (processedImage) {

            setImage(processedImage);

            return;

        }


        if (imageData) {

            setImage(imageData);

            return;

        }


        navigate(
            "/dashboard/upload"
        );

    }, [navigate]);


    // =========================
    // Analyze Image
    // =========================

    const runAnalysis = async () => {

        const imageId =
            sessionStorage.getItem(
                "imageId"
            );


        const analysisImage =
            sessionStorage.getItem(
                "analysisImage"
            );


        const processedImage =
            sessionStorage.getItem(
                "processedImage"
            );


        const originalImage =
            sessionStorage.getItem(
                "imageData"
            );


        const imageToAnalyze =
            analysisImage ||
            processedImage ||
            originalImage;


        if (!imageId) {

            setError(
                "Image ID not found."
            );

            return;

        }


        if (!imageToAnalyze) {

            setError(
                "Image not found."
            );

            return;

        }


        try {

            setLoading(true);

            setError("");


            const response =
                await fetch(
                    `${ML_URL}/analyze`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${getToken()}`
                        },

                        body:
                            JSON.stringify({

                                imageId:
                                    imageId,

                                imageData:
                                    imageToAnalyze

                            })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(

                    data.message ||
                    "Analysis failed"

                );

            }


            setAnalysis(
                data.data
            );


            sessionStorage.setItem(

                "analysis",

                JSON.stringify(
                    data.data
                )

            );


        } catch (error) {

            console.error(
                "Analysis error:",
                error
            );


            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div>

            <h1 className="text-2xl font-bold">
                AI Image Analysis
            </h1>


            <p className="text-sm text-gray-500 mt-1">
                Get detailed information about your image.
            </p>


            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-6
                    mt-6
                "
            >

                {/* IMAGE */}

                <div
                    className="
                        bg-white
                        border
                        rounded-xl
                        p-6
                        flex
                        items-center
                        justify-center
                    "
                >

                    {image && (

                        <img
                            src={image}
                            alt="Analysis"
                            className="
                                max-h-[400px]
                                max-w-full
                                object-contain
                            "
                        />

                    )}

                </div>


                {/* ANALYSIS */}

                <div
                    className="
                        bg-white
                        border
                        rounded-xl
                        p-6
                    "
                >

                    <h2 className="font-bold text-lg">
                        Image Properties
                    </h2>


                    {!analysis && (

                        <div className="mt-8">

                            <p className="text-sm text-gray-500">
                                Click the button to analyze your image.
                            </p>


                            <button
                                onClick={runAnalysis}
                                disabled={loading}
                                className="
                                    bg-purple-600
                                    text-white
                                    px-6
                                    py-3
                                    rounded-lg
                                    mt-5
                                "
                            >

                                {loading
                                    ? "Analyzing..."
                                    : "Analyze Image"
                                }

                            </button>

                        </div>

                    )}


                    {analysis && (

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-4
                                mt-6
                            "
                        >

                            <Result
                                title="Brightness"
                                value={analysis.brightness}
                            />

                            <Result
                                title="Contrast"
                                value={analysis.contrast}
                            />

                            <Result
                                title="Sharpness"
                                value={analysis.sharpness}
                            />

                            <Result
                                title="Saturation"
                                value={analysis.saturation}
                            />

                            <Result
                                title="Noise"
                                value={analysis.noise}
                            />

                            <Result
                                title="Underexposed"
                                value={
                                    `${analysis.underexposed_pct}%`
                                }
                            />

                            <Result
                                title="Overexposed"
                                value={
                                    `${analysis.overexposed_pct}%`
                                }
                            />

                            <Result
                                title="Blurry"
                                value={
                                    analysis.is_blurry
                                        ? "Yes"
                                        : "No"
                                }
                            />

                            <Result
                                title="Dark"
                                value={
                                    analysis.is_dark
                                        ? "Yes"
                                        : "No"
                                }
                            />

                        </div>

                    )}


                    {analysis && (

                        <button
                            onClick={() =>
                                navigate(
                                    "/dashboard/recommendations"
                                )
                            }
                            className="
                                w-full
                                bg-purple-600
                                text-white
                                py-3
                                rounded-lg
                                mt-7
                            "
                        >

                            Get AI Recommendations

                        </button>

                    )}


                    {error && (

                        <p
                            className="
                                text-red-500
                                text-sm
                                mt-5
                            "
                        >

                            {error}

                        </p>

                    )}

                </div>

            </div>

        </div>

    );

}


// =========================
// Result Component
// =========================

function Result({
    title,
    value
}) {

    return (

        <div
            className="
                bg-purple-50
                rounded-lg
                p-4
            "
        >

            <p className="text-xs text-gray-500">
                {title}
            </p>


            <p className="text-lg font-bold mt-1">
                {value}
            </p>

        </div>

    );

}


export default Analysis;