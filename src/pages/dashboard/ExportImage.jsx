import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL, getToken } from "../../api";

function ExportImage() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const imageId =
    sessionStorage.getItem("imageId");

  const image =
    sessionStorage.getItem("processedImage") ||
    sessionStorage.getItem("imageData");


  const handleExport = async () => {

    if (!imageId) {
      setError("No uploaded image found.");
      return;
    }

    try {

      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${BACKEND_URL}/api/images/export/${imageId}`,
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${getToken()}`
            }
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Export failed"
        );
      }

      // Open the exported Cloudinary image
      window.open(
        data.data.url,
        "_blank"
      );

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold">
        Export Image
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        Your image is ready to export.
      </p>


      <div className="bg-white border rounded-xl p-8 mt-6">

        <div className="flex justify-center">

          {image && (
            <img
              src={image}
              alt="Export"
              className="max-h-[450px] max-w-full object-contain rounded-lg"
            />
          )}

        </div>


        <div className="flex justify-center gap-3 mt-8">

          <button
            onClick={() =>
              navigate("/dashboard/edit")
            }
            className="border border-gray-300 px-6 py-3 rounded-lg text-sm"
          >
            Back to Edit
          </button>


          <button
            onClick={handleExport}
            disabled={loading}
            className="bg-purple-600 text-white px-7 py-3 rounded-lg text-sm"
          >
            {loading
              ? "Preparing..."
              : "Export Image"}
          </button>

        </div>


        {error && (
          <p className="text-red-500 text-sm text-center mt-5">
            {error}
          </p>
        )}

      </div>

    </div>
  );
}

export default ExportImage;