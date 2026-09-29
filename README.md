# Image-Processing-Platform

AI-powered image processing and analysis platform that combines computer vision, image-processing algorithms, and ML-based analysis.

## Running the API Service

To run the FastAPI service locally:

```bash
cd ml
uvicorn api.main:app --reload
```

The service will be available at `http://127.0.0.1:8000` and interactive Swagger documentation at `http://127.0.0.1:8000/docs`.

---

## API Endpoints

### 1. Health Check
- **Endpoint:** `GET /health`
- **Purpose:** Check API operational status.
- **Input:** None
- **Response:**
  ```json
  {
    "status": "ok"
  }
  ```

---

### 2. Main Image Processing
- **Endpoint:** `POST /process`
- **Purpose:** Apply image editing and filtering settings to an uploaded image.
- **Input:** `multipart/form-data`
  - `image`: Uploaded image file (e.g. JPEG/PNG)
  - `settings` *(optional)*: JSON string containing processing options (missing fields use safe defaults).
- **Example Request (`settings` JSON):**
  ```json
  {
    "brightness": 20,
    "contrast": 1.2,
    "resize": { "width": 800, "height": 600 },
    "crop": { "x": 0, "y": 0, "width": 500, "height": 400 },
    "rotate": 90,
    "flip": "horizontal",
    "blur": 3,
    "grayscale": false,
    "sharpen": 2,
    "threshold": 0,
    "denoise": 1,
    "color_filter": "none",
    "enhance": false
  }
  ```
- **Response:** Binary JPEG image (`image/jpeg`).

---

### 3. Image Analysis
- **Endpoint:** `POST /analyze`
- **Purpose:** Calculate brightness, contrast, sharpness, saturation, and quality metrics of an image.
- **Input:** `multipart/form-data` (`image` file)
- **Response:**
  ```json
  {
    "brightness": 90.71,
    "contrast": 57.76,
    "sharpness": 1804.39,
    "saturation": 125.34,
    "noise": 5.29,
    "is_dark": false,
    "is_blurry": false,
    "underexposed_pct": 14.68,
    "overexposed_pct": 0.96
  }
  ```

---

### 4. AI Recommendation
- **Endpoint:** `POST /recommend`
- **Purpose:** Analyzes an image and suggests optimal edit and filter parameter settings.
- **Input:** `multipart/form-data` (`image` file)
- **Response:**
  ```json
  {
    "brightness": 15,
    "contrast": 1.15,
    "sharpen": 2,
    "denoise": 1,
    "blur": 0,
    "grayscale": false,
    "enhance": false,
    "reason": "Image is slightly dark. Contrast is low.",
    "reasons": {
      "brightness": "Image is dark (+15)",
      "contrast": "Contrast is low (1.15x)",
      "sharpen_val": "Slight edge enhancement (2)",
      "denoise_val": "No significant noise detected",
      "enhance": "Enhancement not required"
    }
  }
  ```

---

## Running Tests

To run pytest tests:

```bash
cd ml
python -m pytest
```

---

## Running the Interactive Demo

To run the standalone OpenCV GUI demo:

```bash
cd ml
python demo/process_image.py
```
