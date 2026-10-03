import cv2
import numpy as np
from cv.edit import brightness, contrast, crop, flip, resize, rotate
from cv.filters import blur, color_filter, denoise, enhance, grayscale, sharpen, threshold


def decode_image(file_bytes: bytes) -> np.ndarray:
    nparr = np.frombuffer(file_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Invalid image file or format")
    return image


def encode_image(image: np.ndarray, format: str = ".jpg") -> bytes:
    success, encoded = cv2.imencode(format, image)
    if not success:
        raise ValueError("Failed to encode image")
    return encoded.tobytes()


def apply_settings(image: np.ndarray, settings: dict) -> np.ndarray:
    if image is None:
        raise ValueError("Input image cannot be None")

    img = image.copy()
    
    # Auto-limit extreme camera dimensions (>1920px) for real-time processing speed
    h_orig, w_orig = img.shape[:2]
    max_dim = max(h_orig, w_orig)
    if max_dim > 1920 and "resize" not in settings and "resize_pct" not in settings:
        scale = 1920.0 / max_dim
        img = resize(img, width=int(w_orig * scale), height=int(h_orig * scale))

    if not settings:
        return img

    # 1. Brightness
    b_val = settings.get("brightness", 0)
    if b_val != 0:
        # Scale large slider values (e.g. +-100) smoothly so image doesn't blow out
        b_scaled = int(b_val * 0.4) if abs(b_val) > 25 else int(b_val)
        img = brightness(img, value=b_scaled)

    # 2. Contrast
    c_val = settings.get("contrast", 1.0)
    if c_val != 1.0:
        c_float = float(c_val)
        if c_float > 3.0:
            c_float = 1.0 + (c_float / 100.0)
        img = contrast(img, factor=c_float)

    # 3. Resize
    resize_setting = settings.get("resize")
    if isinstance(resize_setting, dict):
        w = resize_setting.get("width")
        h = resize_setting.get("height")
        if w or h:
            img = resize(img, width=w, height=h)
    elif settings.get("resize_pct") is not None and settings.get("resize_pct") != 100:
        scale_pct = float(settings["resize_pct"])
        h_orig, w_orig = img.shape[:2]
        new_w = max(1, int(w_orig * scale_pct / 100.0))
        new_h = max(1, int(h_orig * scale_pct / 100.0))
        img = resize(img, width=new_w, height=new_h)

    # 4. Crop
    crop_setting = settings.get("crop")
    if isinstance(crop_setting, dict):
        x = int(crop_setting.get("x", 0))
        y = int(crop_setting.get("y", 0))
        w = int(crop_setting.get("width", img.shape[1] - x))
        h = int(crop_setting.get("height", img.shape[0] - y))
        img = crop(img, x, y, w, h)
    elif any(k in settings for k in ("crop_x_pct", "crop_y_pct", "crop_w_pct", "crop_h_pct")):
        cx = settings.get("crop_x_pct", 0)
        cy = settings.get("crop_y_pct", 0)
        cw = settings.get("crop_w_pct", 100)
        ch = settings.get("crop_h_pct", 100)
        if cx > 0 or cy > 0 or cw < 100 or ch < 100:
            h_orig, w_orig = img.shape[:2]
            x = int(w_orig * cx / 100.0)
            y = int(h_orig * cy / 100.0)
            w_crop = min(w_orig - x, max(1, int(w_orig * cw / 100.0)))
            h_crop = min(h_orig - y, max(1, int(h_orig * ch / 100.0)))
            img = crop(img, x, y, w_crop, h_crop)

    # 5. Rotate
    rot_val = settings.get("rotate")
    rot_idx = settings.get("rotate_idx")
    if rot_val is not None and rot_val != 0:
        img = rotate(img, float(rot_val))
    elif rot_idx is not None and rot_idx != 0:
        angles = {1: 90, 2: 180, 3: 270}
        if rot_idx in angles:
            img = rotate(img, angles[rot_idx])

    # 6. Flip
    flip_val = settings.get("flip")
    flip_idx = settings.get("flip_idx")
    if flip_val is not None and flip_val != "none" and flip_val != 0:
        img = flip(img, direction=flip_val)
    elif flip_idx is not None and flip_idx != 0:
        modes = {1: "horizontal", 2: "vertical", 3: "both"}
        if flip_idx in modes:
            img = flip(img, direction=modes[flip_idx])

    # 7. Blur
    blur_k = settings.get("blur") if settings.get("blur") is not None else settings.get("blur_k", 0)
    if blur_k > 0:
        img = blur(img, k=int(blur_k))

    # 8. Grayscale
    gs = settings.get("grayscale", False)
    if gs:
        img = grayscale(img)

    # 9. Sharpen
    sh_val = settings.get("sharpen") if settings.get("sharpen") is not None else settings.get("sharpen_val", 0)
    if sh_val > 0:
        img = sharpen(img, strength=float(sh_val))

    # 10. Threshold
    th_val = settings.get("threshold") if settings.get("threshold") is not None else settings.get("threshold_val", 0)
    if th_val > 0:
        img = threshold(img, thresh=int(th_val))

    # 11. Denoise
    den_val = settings.get("denoise") if settings.get("denoise") is not None else settings.get("denoise_val", 0)
    if den_val > 0:
        img = denoise(img, strength=int(den_val))

    # 12. Color Filter
    cf_val = settings.get("color_filter")
    cf_idx = settings.get("color_filter_idx")
    filter_type = None
    if cf_val and cf_val != "none":
        filter_type = cf_val
    elif cf_idx:
        idx_map = {1: "sepia", 2: "hue_shift"}
        filter_type = idx_map.get(cf_idx)

    if filter_type:
        if img.ndim == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        img = color_filter(img, filter_type=filter_type)

    # 13. Enhance
    enh = settings.get("enhance", False)
    if enh:
        if img.ndim == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        img = enhance(img)

    return img
