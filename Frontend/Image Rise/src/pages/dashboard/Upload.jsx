import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL, getToken } from "../../api";

function Upload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError("Image must be smaller than 25 MB.");
      return;
    }

    setError("");
    setFile(selectedFile);

    const imageUrl = URL.createObjectURL(selectedFile);
    setPreview(imageUrl);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(
        `${BACKEND_URL}/api/images/upload`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${getToken()}`
          },

          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      const uploadedImage = data.data.image;

      /*
       * Remove data from the previous image.
       * This prevents an old edited image from
       * appearing when a new image is uploaded.
       */

      sessionStorage.removeItem("analysisImage");
      sessionStorage.removeItem("processedImage");
      sessionStorage.removeItem("analysis");

      sessionStorage.setItem(
        "imageId",
        uploadedImage._id
      );

      sessionStorage.setItem(
        "imageUrl",
        uploadedImage.secureUrl
      );

      sessionStorage.setItem(
        "imageName",
        uploadedImage.originalName
      );

      sessionStorage.setItem(
        "imageFileName",
        file.name
      );

      // Store the new original image as a data URL
      // so the file can be used on the next screens.

      const reader = new FileReader();

      reader.onload = () => {

        sessionStorage.setItem(
          "imageData",
          reader.result
        );

        navigate("/dashboard/edit");
      };

      reader.readAsDataURL(file);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold">
        Upload Image
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        Upload an image to start editing and analyzing.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl mt-6 p-8">

        {!preview && (
          <label className="border-2 border-dashed border-purple-300 rounded-xl h-72 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50">

            <div className="text-5xl text-purple-500">
              ↑
            </div>

            <h2 className="font-semibold mt-4">
              Upload your image
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Click here to choose an image
            </p>

            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG, JPEG up to 25 MB
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

          </label>
        )}

        {preview && (
          <div>

            <div className="flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="max-h-80 rounded-lg object-contain"
              />
            </div>

            <p className="text-center text-sm mt-4">
              {file?.name}
            </p>

            <div className="flex justify-center gap-3 mt-6">

              <label className="border border-gray-300 px-5 py-2 rounded-lg text-sm cursor-pointer">
                Choose Another

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm"
              >
                {loading ? "Uploading..." : "Upload & Continue"}
              </button>

            </div>

          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center mt-5">
            {error}
          </p>
        )}

      </div>

    </div>
  );
}

export default Upload;