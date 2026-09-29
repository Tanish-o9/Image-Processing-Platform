import json
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import Response
from cv.recommendation import analyze_image, recommend_settings
from .pipeline import apply_settings, decode_image, encode_image

app = FastAPI(
    title="Image Processing API",
    description="FastAPI service exposing OpenCV image processing, analysis, and recommendation.",
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/process")
async def process(
    image: UploadFile = File(...),
    settings: str = Form("{}"),
):
    try:
        contents = await image.read()
        img = decode_image(contents)

        if settings and settings.strip():
            try:
                parsed_settings = json.loads(settings)
            except Exception as parse_err:
                raise HTTPException(status_code=400, detail=f"Invalid JSON settings: {parse_err}")
        else:
            parsed_settings = {}

        processed_img = apply_settings(img, parsed_settings)
        encoded_bytes = encode_image(processed_img, format=".jpg")
        return Response(content=encoded_bytes, media_type="image/jpeg")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        img = decode_image(contents)
        props = analyze_image(img)

        return {
            "brightness": round(props["brightness"], 2),
            "contrast": round(props["contrast"], 2),
            "sharpness": round(props["sharpness"], 2),
            "saturation": round(props["saturation"], 2),
            "noise": round(props["noise"], 2),
            "is_dark": bool(props["brightness"] < 85),
            "is_blurry": bool(props["sharpness"] < 80),
            "underexposed_pct": round(props["underexposed_pct"], 2),
            "overexposed_pct": round(props["overexposed_pct"], 2),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/recommend")
async def recommend(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        img = decode_image(contents)
        res = recommend_settings(img)

        recs = res["recommendations"]
        reasons_dict = res["reasons"]
        reason_summary = ". ".join(reasons_dict.values())

        return {
            "brightness": recs["brightness"],
            "contrast": recs["contrast"],
            "sharpen": recs["sharpen_val"],
            "denoise": recs["denoise_val"],
            "blur": recs["blur_k"],
            "grayscale": bool(recs["grayscale"]),
            "enhance": bool(recs["enhance"]),
            "reason": reason_summary,
            "reasons": reasons_dict,
            "properties": res["properties"],
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

