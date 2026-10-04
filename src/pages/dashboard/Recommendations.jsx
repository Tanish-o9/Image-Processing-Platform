import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL, getToken } from "../../api";

function Recommendations() {

  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [recommendation, setRecommendation] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    const analysisImage =
      sessionStorage.getItem("analysisImage");

    const processedImage =
      sessionStorage.getItem("processedImage");

    const imageData =
      sessionStorage.getItem("imageData");

    const imageToShow =
      analysisImage ||
      processedImage ||
      imageData;

    if (!imageToShow) {
      navigate("/dashboard/upload");
      return;
    }

    setImage(imageToShow);

  }, [navigate]);


  const getRecommendations = async () => {

    const imageId =
      sessionStorage.getItem("imageId");

    const analysisImage =
      sessionStorage.getItem("analysisImage");

    const processedImage =
      sessionStorage.getItem("processedImage");

    const imageData =
      sessionStorage.getItem("imageData");

    const imageToAnalyze =
      analysisImage ||
      processedImage ||
      imageData;


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
    `${BACKEND_URL}/api/analysis/recommend`,
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
          "Recommendation failed"
        );

      }


      setRecommendation(
        data.data
      );


      sessionStorage.setItem(
        "recommendation",
        JSON.stringify(data.data)
      );


    } catch (error) {

      console.error(
        "Recommendation error:",
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
        AI Recommendations
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        Let AI suggest improvements for your image.
      </p>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* Image */}

        <div className="bg-white border rounded-xl p-6 flex items-center justify-center">

          <img
            src={image}
            alt="Recommendation"
            className="max-h-[400px] object-contain"
          />

        </div>


        {/* Recommendation */}

        <div className="bg-white border rounded-xl p-6">

          <h2 className="font-bold text-lg">
            Suggested Settings
          </h2>


          {!recommendation && (
            <div>

              <p className="text-sm text-gray-500 mt-4">
                AI will inspect your image and suggest
                suitable settings.
              </p>

              <button
                onClick={getRecommendations}
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg mt-6"
              >

                {loading
                  ? "Getting Recommendations..."
                  : "Get Recommendations"}

              </button>

            </div>
          )}


          {recommendation && (
            <div className="mt-6 space-y-3">

              <Recommendation
                title="Brightness"
                value={recommendation.brightness}
              />

              <Recommendation
                title="Contrast"
                value={recommendation.contrast}
              />

              <Recommendation
                title="Sharpen"
                value={recommendation.sharpen}
              />

              <Recommendation
                title="Denoise"
                value={recommendation.denoise}
              />

              <Recommendation
                title="Blur"
                value={
                  recommendation.blur !== undefined
                    ? recommendation.blur
                    : "No recommendation"
                }
              />

              <Recommendation
                title="Grayscale"
                value={
                  recommendation.grayscale
                    ? "ON"
                    : "OFF"
                }
              />

              <Recommendation
                title="Enhance"
                value={
                  recommendation.enhance
                    ? "ON"
                    : "OFF"
                }
              />

            </div>
          )}


          {recommendation?.reason && (
            <div className="bg-purple-50 rounded-lg p-4 mt-5">

              <p className="text-xs font-semibold">
                AI Explanation
              </p>

              <p className="text-xs text-gray-600 mt-2">
                {recommendation.reason}
              </p>

            </div>
          )}


          {recommendation && (
            <button
              onClick={() =>
                navigate("/dashboard/edit")
              }
              className="w-full bg-purple-600 text-white py-3 rounded-lg mt-6"
            >
              Edit Image
            </button>
          )}


          {error && (
            <p className="text-red-500 text-sm mt-5">
              {error}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}


function Recommendation({ title, value }) {

  return (
    <div className="flex justify-between bg-gray-50 rounded-lg p-3">

      <span className="text-sm text-gray-600">
        {title}
      </span>

      <span className="text-sm font-semibold">
        {value}
      </span>

    </div>
  );

}


export default Recommendations;