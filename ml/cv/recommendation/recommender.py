from .analyzer import analyze_image


def recommend_settings(image_or_props):
    if isinstance(image_or_props, dict):
        props = image_or_props
    else:
        props = analyze_image(image_or_props)

    b_val = props["brightness"]
    c_val = props["contrast"]
    sh_val = props["sharpness"]
    n_val = props["noise"]
    sat_val = props["saturation"]

    recommendations = {
        "brightness": 0,
        "contrast": 1.0,
        "blur_k": 0,
        "grayscale": 0,
        "sharpen_val": 0.0,
        "threshold_val": 0,
        "denoise_val": 0,
        "color_filter_idx": 0,
        "enhance": 0,
    }

    reasons = {}

    # 1. Brightness recommendation
    if b_val < 85:
        rec_b = min(50, int((110 - b_val) * 0.4))
        recommendations["brightness"] = rec_b
        reasons["brightness"] = f"Image is dark (+{rec_b})"
    elif b_val > 175:
        rec_b = max(-50, int((150 - b_val) * 0.4))
        recommendations["brightness"] = rec_b
        reasons["brightness"] = f"Image is overexposed ({rec_b})"
    else:
        reasons["brightness"] = "Brightness is balanced"

    # 2. Contrast recommendation
    if c_val < 45:
        recommendations["contrast"] = 1.25
        reasons["contrast"] = "Contrast is low (1.25x)"
    elif c_val > 75:
        recommendations["contrast"] = 0.9
        reasons["contrast"] = "Contrast is high (0.90x)"
    else:
        reasons["contrast"] = "Contrast level is good"

    # 3. Sharpen recommendation
    if sh_val < 80:
        recommendations["sharpen_val"] = 1.5
        reasons["sharpen_val"] = "Image appears blurry (1.5)"
    elif sh_val < 250:
        recommendations["sharpen_val"] = 0.8
        reasons["sharpen_val"] = "Slight edge enhancement (0.8)"
    else:
        reasons["sharpen_val"] = "Image is already sharp"

    # 4. Denoise recommendation
    if n_val > 7.0:
        recommendations["denoise_val"] = 10
        reasons["denoise_val"] = "Noticeable noise detected (10)"
    else:
        reasons["denoise_val"] = "No significant noise detected"

    # 5. Enhance recommendation
    if sat_val > 0 and sat_val < 50 and c_val < 50:
        recommendations["enhance"] = 1
        reasons["enhance"] = "Color contrast is dull (ON)"
    else:
        reasons["enhance"] = "Enhancement not required"

    return {
        "recommendations": recommendations,
        "reasons": reasons,
        "properties": props,
    }
