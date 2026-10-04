import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL, getToken } from "../../api";

function EditImage() {

  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const originalImageRef = useRef(null);

  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);

  // =========================
  // Editing settings
  // =========================

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(1);

  const [resize, setResize] = useState(100);

  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(100);
  const [cropHeight, setCropHeight] = useState(100);

  const [rotate, setRotate] = useState(0);
  const [flip, setFlip] = useState("none");

  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(false);
  const [sharpen, setSharpen] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [denoise, setDenoise] = useState(0);

  const [colorFilter, setColorFilter] = useState("none");
  const [enhance, setEnhance] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [previewChanged, setPreviewChanged] = useState(false);


  // =========================
  // Load original image
  // =========================

  useEffect(() => {

    const imageData =
      sessionStorage.getItem("imageData");

    if (!imageData) {
      navigate("/dashboard/upload");
      return;
    }

    setImage(imageData);

    const img = new Image();

    img.onload = () => {
      originalImageRef.current = img;

      drawLivePreview(img);
    };

    img.src = imageData;


    // Convert stored data URL back into File
    fetch(imageData)
      .then((response) => response.blob())
      .then((blob) => {

        const name =
          sessionStorage.getItem("imageFileName") ||
          "image.jpg";

        const newFile = new File(
          [blob],
          name,
          {
            type: blob.type
          }
        );

        setFile(newFile);
      })
      .catch((error) => {
        console.error(
          "Could not load image file:",
          error
        );
      });

  }, [navigate]);


  // =========================
  // Draw live preview
  // =========================

  useEffect(() => {

    if (!originalImageRef.current) {
      return;
    }

    if (!previewChanged) {
      return;
    }

    drawLivePreview(
      originalImageRef.current
    );

  }, [
    brightness,
    contrast,
    resize,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    rotate,
    flip,
    blur,
    grayscale,
    sharpen,
    threshold,
    denoise,
    colorFilter,
    enhance,
    previewChanged
  ]);


  // =========================
  // Live preview function
  // =========================

  const drawLivePreview = (sourceImage) => {

    const canvas = canvasRef.current;

    if (!canvas || !sourceImage) {
      return;
    }

    const ctx = canvas.getContext("2d");

    const sourceWidth =
      sourceImage.naturalWidth;

    const sourceHeight =
      sourceImage.naturalHeight;


    // =========================
    // Crop calculations
    // =========================

    const startX =
      sourceWidth * Number(cropX) / 100;

    const startY =
      sourceHeight * Number(cropY) / 100;

    const cropW =
      Math.max(
        1,
        Math.min(
          sourceWidth - startX,
          sourceWidth * Number(cropWidth) / 100
        )
      );

    const cropH =
      Math.max(
        1,
        Math.min(
          sourceHeight - startY,
          sourceHeight * Number(cropHeight) / 100
        )
      );


    // =========================
    // Resize
    // =========================

    const resizeValue =
      Number(resize) / 100;

    const finalWidth =
      Math.max(
        1,
        Math.round(cropW * resizeValue)
      );

    const finalHeight =
      Math.max(
        1,
        Math.round(cropH * resizeValue)
      );


    // =========================
    // Rotation
    // =========================

    const angle =
      Number(rotate) * Math.PI / 180;

    const isRotated =
      Number(rotate) % 180 !== 0;


    if (isRotated) {

      canvas.width = finalHeight;
      canvas.height = finalWidth;

    } else {

      canvas.width = finalWidth;
      canvas.height = finalHeight;

    }


    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    // =========================
    // Browser filters
    // =========================

    let filter = "";

    // Brightness
    const brightnessValue =
      100 + Number(brightness);

    filter +=
      `brightness(${brightnessValue}%) `;

    // Contrast
    filter +=
      `contrast(${Number(contrast)}) `;

    // Blur
    if (Number(blur) > 0) {

      filter +=
        `blur(${Number(blur) / 2}px) `;

    }

    // Grayscale
    if (grayscale) {

      filter +=
        "grayscale(100%) ";

    }

    // Color filters
    if (colorFilter === "sepia") {

      filter +=
        "sepia(100%) ";

    }

    if (colorFilter === "hue_shift") {

      filter +=
        "hue-rotate(90deg) ";

    }

    // Sharpen approximation
    if (Number(sharpen) > 0) {

      filter +=
        `contrast(${1 + Number(sharpen) * 0.15}) `;

    }

    // Enhance approximation
    if (enhance) {

      filter +=
        "saturate(1.25) contrast(1.1) ";

    }

    // Threshold approximation
    if (Number(threshold) > 0) {

      filter +=
        `grayscale(100%) contrast(500%) `;

    }

    // Denoise approximation
    if (Number(denoise) > 0) {

      filter +=
        `blur(${Number(denoise) / 10}px) `;

    }

    ctx.filter = filter;


    // =========================
    // Flip
    // =========================

    ctx.save();

    ctx.translate(
      canvas.width / 2,
      canvas.height / 2
    );


    if (flip === "horizontal") {

      ctx.scale(-1, 1);

    }

    if (flip === "vertical") {

      ctx.scale(1, -1);

    }

    if (flip === "both") {

      ctx.scale(-1, -1);

    }


    // =========================
    // Rotate
    // =========================

    ctx.rotate(angle);


    // =========================
    // Draw image
    // =========================

    ctx.drawImage(
      sourceImage,
      startX,
      startY,
      cropW,
      cropH,
      -finalWidth / 2,
      -finalHeight / 2,
      finalWidth,
      finalHeight
    );


    ctx.restore();

    ctx.filter = "none";


    // Show canvas as preview
    setImage(
      canvas.toDataURL("image/jpeg")
    );

  };


  // =========================
  // Mark preview as changed
  // =========================

  const changePreview = (setter) => {

    return (event) => {

      setter(event.target.value);

      setPreviewChanged(true);

    };

  };


  // =========================
  // Apply actual ML changes
  // =========================

  const processImage = async () => {

    if (!file) {

      setError(
        "Image is not ready yet."
      );

      return;
    }


    try {

      setLoading(true);
      setError("");


      const imageId =
        sessionStorage.getItem("imageId");


      if (!imageId) {

        setError(
          "Image ID not found."
        );

        return;
      }


      const settings = {

        brightness:
          Number(brightness),

        contrast:
          Number(contrast),

        resize_pct:
          Number(resize),

        crop_x_pct:
          Number(cropX),

        crop_y_pct:
          Number(cropY),

        crop_w_pct:
          Number(cropWidth),

        crop_h_pct:
          Number(cropHeight),

        rotate:
          Number(rotate),

        flip:
          flip,

        blur:
          Number(blur),

        grayscale:
          grayscale,

        sharpen:
          Number(sharpen),

        threshold:
          Number(threshold),

        denoise:
          Number(denoise),

        color_filter:
          colorFilter,

        enhance:
          enhance

      };


      const response = await fetch(
     `${BACKEND_URL}/api/analysis/process`,
        {
          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${getToken()}`
          },

          body: JSON.stringify({

            imageId:
              imageId,

            ...settings

          })
        }
      );


      if (!response.ok) {

        let message =
          "Image processing failed.";

        try {

          const data =
            await response.json();

          message =
            data.message ||
            message;

        } catch {
          // Server did not return JSON
        }

        throw new Error(message);

      }


      // Backend returns actual image
      const blob =
        await response.blob();


      /*
       * Convert the backend Blob into a
       * permanent data URL.
       *
       * We do NOT store a blob URL because
       * blob URLs can become unavailable later.
       */
      const processedDataUrl =
        await new Promise(
          (resolve, reject) => {

            const reader =
              new FileReader();

            reader.onloadend = () => {

              resolve(
                reader.result
              );

            };

            reader.onerror = () => {

              reject(
                new Error(
                  "Could not convert processed image."
                )
              );

            };

            reader.readAsDataURL(blob);

          }
        );


      // Show actual ML result
      setImage(
        processedDataUrl
      );


      // Store actual image data
      sessionStorage.setItem(
        "processedImage",
        processedDataUrl
      );

      sessionStorage.setItem(
        "analysisImage",
        processedDataUrl
      );


      // Convert processed image to File
      const processedFile =
        new File(
          [blob],
          "processed-image.jpg",
          {
            type:
              "image/jpeg"
          }
        );


      setFile(
        processedFile
      );


      // Actual backend result is now
      // being displayed.
      setPreviewChanged(false);


    } catch (error) {

      console.error(
        "Image processing error:",
        error
      );

      setError(
        error.message ||
        "Image processing failed."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // Go to analysis
  // =========================

  const goToAnalysis = () => {

    const analysisImage =
      sessionStorage.getItem(
        "analysisImage"
      );

    if (!analysisImage) {

      setError(
        "Processed image not found."
      );

      return;
    }

    navigate(
      "/dashboard/analysis"
    );

  };


  return (

    <div>

      <h1 className="text-2xl font-bold">
        Edit Image
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        Adjust your image using the available tools.
      </p>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">


        {/* ================= IMAGE ================= */}

        <div
          className="
            lg:col-span-2
            bg-white
            rounded-xl
            border
            p-6
            flex
            items-center
            justify-center
            min-h-[450px]
          "
        >

          {image && (

            <img
              src={image}
              alt="Editing"
              className="
                max-h-[420px]
                max-w-full
                object-contain
              "
            />

          )}

          {/* Hidden canvas used for live preview */}

          <canvas
            ref={canvasRef}
            className="hidden"
          />

        </div>


        {/* ================= CONTROLS ================= */}

        <div
          className="
            bg-white
            rounded-xl
            border
            p-5
            max-h-[700px]
            overflow-y-auto
          "
        >

          <h2 className="font-bold">
            Adjustments
          </h2>


          {/* ================= BRIGHTNESS ================= */}

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span>
                Brightness
              </span>

              <span>
                {brightness}
              </span>

            </div>

            <input
              type="range"
              min="-50"
              max="50"
              value={brightness}
              onChange={changePreview(
                setBrightness
              )}
              className="w-full mt-2"
            />

          </div>


          {/* ================= CONTRAST ================= */}

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span>
                Contrast
              </span>

              <span>
                {contrast}
              </span>

            </div>

            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={contrast}
              onChange={changePreview(
                setContrast
              )}
              className="w-full mt-2"
            />

          </div>


          {/* ================= RESIZE ================= */}

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span>
                Resize
              </span>

              <span>
                {resize}%
              </span>

            </div>

            <input
              type="range"
              min="25"
              max="200"
              value={resize}
              onChange={changePreview(
                setResize
              )}
              className="w-full mt-2"
            />

          </div>


          {/* ================= CROP X ================= */}

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span>
                Crop X
              </span>

              <span>
                {cropX}%
              </span>

            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={cropX}
              onChange={changePreview(
                setCropX
              )}
              className="w-full mt-2"
            />

          </div>


          {/* ================= CROP Y ================= */}

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span>
                Crop Y
              </span>

              <span>
                {cropY}%
              </span>

            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={cropY}
              onChange={changePreview(
                setCropY
              )}
              className="w-full mt-2"
            />

          </div>


          {/* ================= CROP WIDTH ================= */}

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span>
                Crop Width
              </span>

              <span>
                {cropWidth}%
              </span>

            </div>

            <input
              type="range"
              min="1"
              max="100"
              value={cropWidth}
              onChange={changePreview(
                setCropWidth
              )}
              className="w-full mt-2"
            />

          </div>


          {/* ================= CROP HEIGHT ================= */}

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span>
                Crop Height
              </span>

              <span>
                {cropHeight}%
              </span>

            </div>

            <input
              type="range"
              min="1"
              max="100"
              value={cropHeight}
              onChange={changePreview(
                setCropHeight
              )}
              className="w-full mt-2"
            />

          </div>


          {/* ================= ROTATE ================= */}

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span>
                Rotate
              </span>

              <span>
                {rotate}°
              </span>

            </div>

            <input
              type="range"
              min="-180"
              max="180"
              value={rotate}
              onChange={changePreview(
                setRotate
              )}
              className="w-full mt-2"
            />

          </div>


          {/* ================= FLIP ================= */}

          <div className="mt-6">

            <label className="text-sm">
              Flip
            </label>

            <select
              value={flip}
              onChange={changePreview(
                setFlip
              )}
              className="
                w-full
                border
                rounded-lg
                p-2
                mt-2
              "
            >

              <option value="none">
                None
              </option>

              <option value="horizontal">
                Horizontal
              </option>

              <option value="vertical">
                Vertical
              </option>

              <option value="both">
                Both
              </option>

            </select>

          </div>


          {/* ================= BLUR ================= */}

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span>
                Blur
              </span>

              <span>
                {blur}
              </span>

            </div>

            <input
              type="range"
              min="0"
              max="15"
              step="2"
              value={blur}
              onChange={changePreview(
                setBlur
              )}
              className="w-full mt-2"
            />

          </div>


          {/* ================= GRAYSCALE ================= */}

          <label className="flex items-center gap-3 mt-6 text-sm">

            <input
              type="checkbox"
              checked={grayscale}
              onChange={(e) => {

                setGrayscale(
                  e.target.checked
                );

                setPreviewChanged(true);

              }}
            />

            Grayscale

          </label>


          {/* ================= SHARPEN ================= */}

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span>
                Sharpen
              </span>

              <span>
                {sharpen}
              </span>

            </div>

            <input
              type="range"
              min="0"
              max="3"
              step="0.5"
              value={sharpen}
              onChange={changePreview(
                setSharpen
              )}
              className="w-full mt-2"
            />

          </div>


          {/* ================= THRESHOLD ================= */}

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span>
                Threshold
              </span>

              <span>
                {threshold}
              </span>

            </div>

            <input
              type="range"
              min="0"
              max="255"
              value={threshold}
              onChange={changePreview(
                setThreshold
              )}
              className="w-full mt-2"
            />

          </div>


          {/* ================= DENOISE ================= */}

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span>
                Denoise
              </span>

              <span>
                {denoise}
              </span>

            </div>

            <input
              type="range"
              min="0"
              max="20"
              value={denoise}
              onChange={changePreview(
                setDenoise
              )}
              className="w-full mt-2"
            />

          </div>


          {/* ================= COLOR FILTER ================= */}

          <div className="mt-6">

            <label className="text-sm">
              Color Filter
            </label>

            <select
              value={colorFilter}
              onChange={changePreview(
                setColorFilter
              )}
              className="
                w-full
                border
                rounded-lg
                p-2
                mt-2
              "
            >

              <option value="none">
                None
              </option>

              <option value="sepia">
                Sepia
              </option>

              <option value="hue_shift">
                Hue Shift
              </option>

            </select>

          </div>


          {/* ================= ENHANCE ================= */}

          <label className="flex items-center gap-3 mt-6 text-sm">

            <input
              type="checkbox"
              checked={enhance}
              onChange={(e) => {

                setEnhance(
                  e.target.checked
                );

                setPreviewChanged(true);

              }}
            />

            Enhance Image

          </label>


          {/* ================= APPLY ================= */}

          <button
            onClick={processImage}
            disabled={loading}
            className="
              w-full
              bg-purple-600
              text-white
              py-3
              rounded-lg
              mt-7
            "
          >

            {loading
              ? "Processing..."
              : "Apply Changes"}

          </button>


          {/* ================= AI ANALYSIS ================= */}

          <button
            onClick={goToAnalysis}
            className="
              w-full
              border
              border-purple-600
              text-purple-600
              py-3
              rounded-lg
              mt-3
            "
          >

            AI Analysis

          </button>


          {/* ================= ERROR ================= */}

          {error && (

            <p className="text-red-500 text-xs mt-4">
              {error}
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default EditImage;