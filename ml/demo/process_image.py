import os
import sys
import cv2
import numpy as np

# Configure UTF-8 output for Windows console unicode checkmarks
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure parent directory is in Python path for cv package import
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from cv.edit import brightness, contrast, crop, flip, resize, rotate
from cv.filters import blur, color_filter, denoise, enhance, grayscale, sharpen, threshold
from cv.recommendation import recommend_settings

WINDOW_NAME = "Image Processing Demo"

# Global state for UI interaction
active_control = None
needs_update = True
ai_result = None  # Holds analysis & recommendation results once user clicks Analyze

# Control definitions for EDIT panel (9 controls)
controls_edit = [
    {
        "id": "brightness",
        "name": "Brightness",
        "min": -100,
        "max": 100,
        "val": 0,
        "default": 0,
        "is_float": False,
        "fmt": lambda v: f"Brightness: {int(v):+d}",
    },
    {
        "id": "contrast",
        "name": "Contrast",
        "min": 0.5,
        "max": 2.5,
        "val": 1.0,
        "default": 1.0,
        "is_float": True,
        "fmt": lambda v: f"Contrast: {v:.2f}x",
    },
    {
        "id": "resize_pct",
        "name": "Resize %",
        "min": 10,
        "max": 200,
        "val": 100,
        "default": 100,
        "is_float": False,
        "fmt": lambda v: f"Resize: {int(v)}%",
    },
    {
        "id": "crop_x_pct",
        "name": "Crop X %",
        "min": 0,
        "max": 90,
        "val": 0,
        "default": 0,
        "is_float": False,
        "fmt": lambda v: f"Crop X: {int(v)}%",
    },
    {
        "id": "crop_y_pct",
        "name": "Crop Y %",
        "min": 0,
        "max": 90,
        "val": 0,
        "default": 0,
        "is_float": False,
        "fmt": lambda v: f"Crop Y: {int(v)}%",
    },
    {
        "id": "crop_w_pct",
        "name": "Crop W %",
        "min": 10,
        "max": 100,
        "val": 100,
        "default": 100,
        "is_float": False,
        "fmt": lambda v: f"Crop W: {int(v)}%",
    },
    {
        "id": "crop_h_pct",
        "name": "Crop H %",
        "min": 10,
        "max": 100,
        "val": 100,
        "default": 100,
        "is_float": False,
        "fmt": lambda v: f"Crop H: {int(v)}%",
    },
    {
        "id": "rotate_idx",
        "name": "Rotate",
        "min": 0,
        "max": 3,
        "val": 0,
        "default": 0,
        "is_float": False,
        "fmt": lambda v: f"Rotate: {int(v)*90}°",
    },
    {
        "id": "flip_idx",
        "name": "Flip",
        "min": 0,
        "max": 3,
        "val": 0,
        "default": 0,
        "is_float": False,
        "fmt": lambda v: f"Flip: {['None', 'Horiz', 'Vert', 'Both'][int(v)]}",
    },
]

# Control definitions for FILTER panel (7 controls)
controls_filter = [
    {
        "id": "blur_k",
        "name": "Blur",
        "min": 0,
        "max": 25,
        "val": 0,
        "default": 0,
        "is_float": False,
        "fmt": lambda v: f"Blur: {int(v) if int(v)>0 else 'OFF'}",
    },
    {
        "id": "grayscale",
        "name": "Grayscale",
        "min": 0,
        "max": 1,
        "val": 0,
        "default": 0,
        "is_float": False,
        "fmt": lambda v: f"Grayscale: {'ON' if int(v) else 'OFF'}",
    },
    {
        "id": "sharpen_val",
        "name": "Sharpen",
        "min": 0.0,
        "max": 3.0,
        "val": 0.0,
        "default": 0.0,
        "is_float": True,
        "fmt": lambda v: f"Sharpen: {v:.1f}" if v > 0 else "Sharpen: OFF",
    },
    {
        "id": "threshold_val",
        "name": "Threshold",
        "min": 0,
        "max": 255,
        "val": 0,
        "default": 0,
        "is_float": False,
        "fmt": lambda v: f"Threshold: {int(v)}" if int(v) > 0 else "Threshold: OFF",
    },
    {
        "id": "denoise_val",
        "name": "Denoise",
        "min": 0,
        "max": 30,
        "val": 0,
        "default": 0,
        "is_float": False,
        "fmt": lambda v: f"Denoise: {int(v)}" if int(v) > 0 else "Denoise: OFF",
    },
    {
        "id": "color_filter_idx",
        "name": "Color Filter",
        "min": 0,
        "max": 2,
        "val": 0,
        "default": 0,
        "is_float": False,
        "fmt": lambda v: f"Color Filter: {['None', 'Sepia', 'Hue Shift'][int(v)]}",
    },
    {
        "id": "enhance",
        "name": "Enhance",
        "min": 0,
        "max": 1,
        "val": 0,
        "default": 0,
        "is_float": False,
        "fmt": lambda v: f"Enhance: {'ON' if int(v) else 'OFF'}",
    },
]


def get_current_settings():
    settings = {}
    for ctrl in controls_edit + controls_filter:
        settings[ctrl["id"]] = ctrl["val"]
    return settings


def apply_pipeline(original_image, settings):
    img = original_image.copy()

    # 1. Brightness (-100 to +100)
    b_val = settings.get("brightness", 0)
    if b_val != 0:
        img = brightness(img, value=b_val)

    # 2. Contrast (0.5 to 2.5)
    c_val = settings.get("contrast", 1.0)
    if c_val != 1.0:
        img = contrast(img, factor=c_val)

    # 3. Resize (% scale: 10 to 200)
    scale_pct = settings.get("resize_pct", 100)
    if scale_pct != 100 and scale_pct > 0:
        h, w = img.shape[:2]
        new_w = max(1, int(w * scale_pct / 100.0))
        new_h = max(1, int(h * scale_pct / 100.0))
        img = resize(img, width=new_w, height=new_h)

    # 4. Crop (X %, Y %, W %, H %)
    cx_pct = settings.get("crop_x_pct", 0)
    cy_pct = settings.get("crop_y_pct", 0)
    cw_pct = settings.get("crop_w_pct", 100)
    ch_pct = settings.get("crop_h_pct", 100)

    if cx_pct > 0 or cy_pct > 0 or cw_pct < 100 or ch_pct < 100:
        h, w = img.shape[:2]
        x = int(w * cx_pct / 100.0)
        y = int(h * cy_pct / 100.0)
        cw = min(w - x, max(1, int(w * cw_pct / 100.0)))
        ch = min(h - y, max(1, int(h * ch_pct / 100.0)))
        if cw > 0 and ch > 0:
            img = crop(img, x, y, cw, ch)

    # 5. Rotate (0: 0°, 1: 90°, 2: 180°, 3: 270°)
    rot_idx = settings.get("rotate_idx", 0)
    if rot_idx == 1:
        img = rotate(img, 90)
    elif rot_idx == 2:
        img = rotate(img, 180)
    elif rot_idx == 3:
        img = rotate(img, 270)

    # 6. Flip (0: none, 1: horizontal, 2: vertical, 3: both)
    flip_idx = settings.get("flip_idx", 0)
    if flip_idx == 1:
        img = flip(img, direction="horizontal")
    elif flip_idx == 2:
        img = flip(img, direction="vertical")
    elif flip_idx == 3:
        img = flip(img, direction="both")

    # 7. Blur (kernel size > 0)
    blur_k = settings.get("blur_k", 0)
    if blur_k > 0:
        k = blur_k if blur_k % 2 == 1 else blur_k + 1
        img = blur(img, k=k)

    # 8. Grayscale (0 or 1)
    if settings.get("grayscale", 0) == 1:
        img = grayscale(img)

    # 9. Sharpen (strength > 0)
    sh_val = settings.get("sharpen_val", 0)
    if sh_val > 0:
        img = sharpen(img, strength=sh_val)

    # 10. Threshold (0-255)
    th_val = settings.get("threshold_val", 0)
    if th_val > 0:
        img = threshold(img, thresh=th_val)

    # 11. Denoise (strength > 0)
    den_val = settings.get("denoise_val", 0)
    if den_val > 0:
        img = denoise(img, strength=den_val)

    # 12. Color Filter (0: none, 1: sepia, 2: hue_shift)
    cf_idx = settings.get("color_filter_idx", 0)
    if cf_idx == 1:
        if img.ndim == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        img = color_filter(img, filter_type="sepia")
    elif cf_idx == 2:
        if img.ndim == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        img = color_filter(img, filter_type="hue_shift")

    # 13. Enhance (0 or 1)
    if settings.get("enhance", 0) == 1:
        if img.ndim == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        img = enhance(img)

    return img


def update_control_val(ctrl, ratio):
    raw_val = ctrl["min"] + ratio * (ctrl["max"] - ctrl["min"])
    if ctrl["is_float"]:
        ctrl["val"] = round(raw_val, 1)
    else:
        ctrl["val"] = int(round(raw_val))


def run_ai_analysis(original_image):
    global ai_result
    ai_result = recommend_settings(original_image)


def apply_ai_recommendations():
    global ai_result, needs_update
    if ai_result is None:
        return False
    recs = ai_result["recommendations"]
    for ctrl in controls_edit + controls_filter:
        cid = ctrl["id"]
        if cid in recs:
            ctrl["val"] = recs[cid]
    needs_update = True
    return True


def handle_mouse(event, x, y, flags, param):
    global active_control, needs_update, ai_result

    orig_img = param.get("original_image") if isinstance(param, dict) else None

    # Button coordinates for AI Recommendation panel
    btn1_x1, btn1_y1, btn1_x2, btn1_y2 = 935, 455, 1145, 495
    btn2_x1, btn2_y1, btn2_x2, btn2_y2 = 1165, 455, 1375, 495

    all_controls = controls_edit + controls_filter

    if event == cv2.EVENT_LBUTTONDOWN:
        # Check [ Analyze / AI Recommend ] button click
        if btn1_x1 <= x <= btn1_x2 and btn1_y1 <= y <= btn1_y2:
            if orig_img is not None:
                run_ai_analysis(orig_img)
                if isinstance(param, dict):
                    param["status_msg"] = "✓ Image analyzed. Recommendations ready!"
                needs_update = True
            return

        # Check [ Apply Recommendation ] button click
        if btn2_x1 <= x <= btn2_x2 and btn2_y1 <= y <= btn2_y2:
            if ai_result is not None:
                apply_ai_recommendations()
                if isinstance(param, dict):
                    param["status_msg"] = "✓ Applied AI recommendations to controls!"
            else:
                if isinstance(param, dict):
                    param["status_msg"] = "⚠ Run Analyze / AI Recommend first!"
                needs_update = True
            return

        # Check slider track clicks
        for ctrl in all_controls:
            tx1 = ctrl.get("track_x1", 0)
            tx2 = ctrl.get("track_x2", 0)
            ty = ctrl.get("track_y", 0)

            if (tx1 - 15) <= x <= (tx2 + 15) and (ty - 16) <= y <= (ty + 16):
                active_control = ctrl
                ratio = max(0.0, min(1.0, (x - tx1) / float(tx2 - tx1)))
                update_control_val(ctrl, ratio)
                needs_update = True
                break

    elif event == cv2.EVENT_MOUSEMOVE and (flags & cv2.EVENT_FLAG_LBUTTON):
        if active_control is not None:
            tx1 = active_control["track_x1"]
            tx2 = active_control["track_x2"]
            ratio = max(0.0, min(1.0, (x - tx1) / float(tx2 - tx1)))
            update_control_val(active_control, ratio)
            needs_update = True

    elif event == cv2.EVENT_LBUTTONUP:
        active_control = None


def draw_ui(current_preview_img, status_msg=""):
    CANVAS_W = 1400
    CANVAS_H = 950
    canvas = np.full((CANVAS_H, CANVAS_W, 3), 25, dtype=np.uint8)
    font = cv2.FONT_HERSHEY_SIMPLEX

    # 1. Header Banner (y: 0 - 35)
    cv2.rectangle(canvas, (0, 0), (CANVAS_W, 35), (40, 40, 40), -1)
    title = "IMAGE PROCESSING PLATFORM - AI RECOMMENDATION & EDITING DEMO"
    cv2.putText(canvas, title, (20, 24), font, 0.60, (240, 240, 240), 2, cv2.LINE_AA)

    # 2. Top Half: Image Preview Box (x: 10, y: 40, w: 1380, h: 360)
    prev_box_x, prev_box_y = 10, 40
    prev_box_w, prev_box_h = 1380, 360
    cv2.rectangle(canvas, (prev_box_x, prev_box_y), (prev_box_x + prev_box_w, prev_box_y + prev_box_h), (16, 16, 16), -1)
    cv2.rectangle(canvas, (prev_box_x, prev_box_y), (prev_box_x + prev_box_w, prev_box_y + prev_box_h), (55, 55, 55), 1)

    img_disp = current_preview_img.copy()
    if img_disp.ndim == 2:
        img_disp = cv2.cvtColor(img_disp, cv2.COLOR_GRAY2BGR)

    max_w, max_h = prev_box_w - 20, prev_box_h - 20
    h_orig, w_orig = img_disp.shape[:2]
    scale = min(max_w / float(w_orig), max_h / float(h_orig))
    new_w = max(1, int(w_orig * scale))
    new_h = max(1, int(h_orig * scale))

    resized_prev = cv2.resize(img_disp, (new_w, new_h))
    offset_x = prev_box_x + (prev_box_w - new_w) // 2
    offset_y = prev_box_y + (prev_box_h - new_h) // 2
    canvas[offset_y : offset_y + new_h, offset_x : offset_x + new_w] = resized_prev

    size_str = f"Image Size: {w_orig}x{h_orig}"
    cv2.putText(canvas, size_str, (prev_box_x + prev_box_w - 180, prev_box_y + 22), font, 0.45, (200, 200, 200), 1, cv2.LINE_AA)

    # Separator Line
    cv2.line(canvas, (10, 408), (1390, 408), (70, 70, 70), 2)

    # 3. Bottom Panel 1: EDIT CONTROLS (x: 10, y: 415, w: 440, h: 480)
    p1_x, p1_y, p1_w, p1_h = 10, 415, 440, 480
    cv2.rectangle(canvas, (p1_x, p1_y), (p1_x + p1_w, p1_y + p1_h), (33, 33, 33), -1)
    cv2.rectangle(canvas, (p1_x, p1_y), (p1_x + p1_w, p1_y + p1_h), (70, 70, 70), 1)
    cv2.putText(canvas, "EDIT CONTROLS", (p1_x + 15, p1_y + 26), font, 0.60, (0, 220, 255), 2, cv2.LINE_AA)

    y_curr = p1_y + 55
    dy_edit = 45
    for ctrl in controls_edit:
        label_str = ctrl["fmt"](ctrl["val"])
        cv2.putText(canvas, label_str, (p1_x + 12, y_curr + 4), font, 0.44, (230, 230, 230), 1, cv2.LINE_AA)

        tx1, tx2 = p1_x + 160, p1_x + 420
        ty = y_curr
        ctrl["track_x1"] = tx1
        ctrl["track_x2"] = tx2
        ctrl["track_y"] = ty

        cv2.line(canvas, (tx1, ty), (tx2, ty), (80, 80, 80), 3)

        ratio = (ctrl["val"] - ctrl["min"]) / float(ctrl["max"] - ctrl["min"])
        ratio = max(0.0, min(1.0, ratio))
        kx = int(tx1 + ratio * (tx2 - tx1))

        cv2.line(canvas, (tx1, ty), (kx, ty), (0, 180, 240), 3)
        cv2.circle(canvas, (kx, ty), 6, (255, 255, 255), -1)
        cv2.circle(canvas, (kx, ty), 6, (0, 180, 240), 2)

        y_curr += dy_edit

    # 4. Bottom Panel 2: FILTER CONTROLS (x: 465, y: 415, w: 440, h: 480)
    p2_x, p2_y, p2_w, p2_h = 465, 415, 440, 480
    cv2.rectangle(canvas, (p2_x, p2_y), (p2_x + p2_w, p2_y + p2_h), (33, 33, 33), -1)
    cv2.rectangle(canvas, (p2_x, p2_y), (p2_x + p2_w, p2_y + p2_h), (70, 70, 70), 1)
    cv2.putText(canvas, "FILTER CONTROLS", (p2_x + 15, p2_y + 26), font, 0.60, (0, 255, 180), 2, cv2.LINE_AA)

    y_curr = p2_y + 55
    dy_filter = 58
    for ctrl in controls_filter:
        label_str = ctrl["fmt"](ctrl["val"])
        cv2.putText(canvas, label_str, (p2_x + 12, y_curr + 4), font, 0.44, (230, 230, 230), 1, cv2.LINE_AA)

        tx1, tx2 = p2_x + 160, p2_x + 420
        ty = y_curr
        ctrl["track_x1"] = tx1
        ctrl["track_x2"] = tx2
        ctrl["track_y"] = ty

        cv2.line(canvas, (tx1, ty), (tx2, ty), (80, 80, 80), 3)

        ratio = (ctrl["val"] - ctrl["min"]) / float(ctrl["max"] - ctrl["min"])
        ratio = max(0.0, min(1.0, ratio))
        kx = int(tx1 + ratio * (tx2 - tx1))

        cv2.line(canvas, (tx1, ty), (kx, ty), (0, 220, 160), 3)
        cv2.circle(canvas, (kx, ty), 6, (255, 255, 255), -1)
        cv2.circle(canvas, (kx, ty), 6, (0, 220, 160), 2)

        y_curr += dy_filter

    # 5. Bottom Panel 3: AI RECOMMENDATION (x: 920, y: 415, w: 470, h: 480)
    p3_x, p3_y, p3_w, p3_h = 920, 415, 470, 480
    cv2.rectangle(canvas, (p3_x, p3_y), (p3_x + p3_w, p3_y + p3_h), (33, 33, 33), -1)
    cv2.rectangle(canvas, (p3_x, p3_y), (p3_x + p3_w, p3_y + p3_h), (70, 70, 70), 1)
    cv2.putText(canvas, "AI RECOMMENDATION", (p3_x + 15, p3_y + 26), font, 0.60, (255, 200, 0), 2, cv2.LINE_AA)

    # Button 1: [ Analyze / AI Recommend ]
    btn1_x1, btn1_y1, btn1_x2, btn1_y2 = 935, 455, 1145, 495
    cv2.rectangle(canvas, (btn1_x1, btn1_y1), (btn1_x2, btn1_y2), (0, 90, 80), -1)
    cv2.rectangle(canvas, (btn1_x1, btn1_y1), (btn1_x2, btn1_y2), (0, 220, 180), 2)
    cv2.putText(canvas, "Analyze / AI Recommend", (btn1_x1 + 8, btn1_y1 + 25), font, 0.42, (255, 255, 255), 1, cv2.LINE_AA)

    # Button 2: [ Apply Recommendation ]
    btn2_x1, btn2_y1, btn2_x2, btn2_y2 = 1165, 455, 1375, 495
    cv2.rectangle(canvas, (btn2_x1, btn2_y1), (btn2_x2, btn2_y2), (120, 60, 20), -1)
    cv2.rectangle(canvas, (btn2_x1, btn2_y1), (btn2_x2, btn2_y2), (255, 150, 40), 2)
    cv2.putText(canvas, "Apply Recommendation", (btn2_x1 + 10, btn2_y1 + 25), font, 0.42, (255, 255, 255), 1, cv2.LINE_AA)

    cv2.line(canvas, (p3_x + 15, 510), (p3_x + p3_w - 15, 510), (60, 60, 60), 1)

    # Display AI analysis & recommendation content
    if ai_result is None:
        cv2.putText(canvas, "Status: Not Analyzed Yet", (p3_x + 15, 535), font, 0.48, (180, 180, 180), 1, cv2.LINE_AA)
        cv2.putText(canvas, "Click [Analyze / AI Recommend] button or", (p3_x + 15, 570), font, 0.44, (160, 160, 160), 1, cv2.LINE_AA)
        cv2.putText(canvas, "press 'A' key to run image analysis.", (p3_x + 15, 595), font, 0.44, (160, 160, 160), 1, cv2.LINE_AA)
        cv2.putText(canvas, "Analysis is performed ONCE on demand.", (p3_x + 15, 630), font, 0.42, (130, 130, 130), 1, cv2.LINE_AA)
        cv2.putText(canvas, "Sliders do NOT trigger auto-analysis.", (p3_x + 15, 655), font, 0.42, (130, 130, 130), 1, cv2.LINE_AA)
    else:
        props = ai_result["properties"]
        recs = ai_result["recommendations"]
        reasons = ai_result["reasons"]

        cv2.putText(canvas, "Status: Analysis Complete", (p3_x + 15, 532), font, 0.48, (0, 255, 180), 2, cv2.LINE_AA)

        # Show analyzed properties
        cv2.putText(canvas, "IMAGE PROPERTIES:", (p3_x + 15, 560), font, 0.44, (255, 200, 0), 1, cv2.LINE_AA)
        p_str1 = f"Brightness: {props['brightness']:.1f} | Contrast: {props['contrast']:.1f}"
        p_str2 = f"Sharpness: {props['sharpness']:.1f} | Noise: {props['noise']:.1f}"
        cv2.putText(canvas, p_str1, (p3_x + 15, 580), font, 0.40, (220, 220, 220), 1, cv2.LINE_AA)
        cv2.putText(canvas, p_str2, (p3_x + 15, 600), font, 0.40, (220, 220, 220), 1, cv2.LINE_AA)

        cv2.line(canvas, (p3_x + 15, 615), (p3_x + p3_w - 15, 615), (60, 60, 60), 1)

        # Show Recommendations & Reasons
        cv2.putText(canvas, "AI RECOMMENDATIONS:", (p3_x + 15, 638), font, 0.44, (255, 200, 0), 1, cv2.LINE_AA)

        lines_to_show = [
            ("Brightness", reasons.get("brightness", "")),
            ("Contrast", reasons.get("contrast", "")),
            ("Sharpen", reasons.get("sharpen_val", "")),
            ("Denoise", reasons.get("denoise_val", "")),
            ("Enhance", reasons.get("enhance", "")),
        ]

        y_rec = 662
        for title_key, reason_txt in lines_to_show:
            txt = f"• {title_key}: {reason_txt}"
            cv2.putText(canvas, txt, (p3_x + 15, y_rec), font, 0.41, (240, 240, 240), 1, cv2.LINE_AA)
            y_rec += 24

        cv2.putText(canvas, "Click [Apply Recommendation] or 'P' to update.", (p3_x + 15, 875), font, 0.40, (0, 220, 255), 1, cv2.LINE_AA)

    # 6. Footer Bar (y: 905 - 950)
    cv2.rectangle(canvas, (0, 905), (CANVAS_W, 950), (20, 20, 20), -1)
    footer_text = "[S] SAVE output | [R] RESET | [A] ANALYZE | [P] APPLY AI | [Q/ESC] EXIT"
    cv2.putText(canvas, footer_text, (20, 932), font, 0.48, (200, 200, 200), 1, cv2.LINE_AA)

    if status_msg:
        cv2.putText(canvas, status_msg, (780, 932), font, 0.48, (0, 255, 120), 2, cv2.LINE_AA)

    return canvas


def main():
    global needs_update, ai_result

    demo_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(demo_dir, "input.jpg")
    output_dir = os.path.join(demo_dir, "outputs")

    os.makedirs(output_dir, exist_ok=True)
    final_output_path = os.path.join(output_dir, "final_output.jpg")

    for f in os.listdir(output_dir):
        file_path = os.path.join(output_dir, f)
        if os.path.isfile(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass

    if not os.path.exists(input_path):
        print(f"Error: Input image not found at {input_path}")
        return

    original_image = cv2.imread(input_path)
    if original_image is None:
        print(f"Error: Could not read image at {input_path}")
        return

    print("==================================================")
    print("   IMAGE PROCESSING PLATFORM - AI RECOMMENDATION   ")
    print("==================================================")
    print(f"Opening window '{WINDOW_NAME}'...")
    print("Keyboard Shortcuts:")
    print(" [A] - Run Analyze / AI Recommend ONCE on demand")
    print(" [P] - Apply AI Recommendations to control sliders")
    print(" [S] - SAVE final processed image to demo/outputs/final_output.jpg")
    print(" [R] - RESET all settings to default values")
    print(" [Q] or [ESC] - Exit demo\n")

    is_interactive = sys.stdin.isatty()
    param_dict = {"original_image": original_image, "status_msg": ""}

    try:
        cv2.namedWindow(WINDOW_NAME, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(WINDOW_NAME, 1400, 950)
        cv2.setMouseCallback(WINDOW_NAME, handle_mouse, param_dict)

        saved = False
        current_preview = original_image.copy()

        while True:
            if needs_update:
                settings = get_current_settings()
                current_preview = apply_pipeline(original_image, settings)
                canvas = draw_ui(current_preview, param_dict.get("status_msg", ""))
                cv2.imshow(WINDOW_NAME, canvas)
                needs_update = False

            key = cv2.waitKey(30) & 0xFF
            if key in [ord("q"), ord("Q"), 27]:  # Q or ESC
                if not saved:
                    cv2.imwrite(final_output_path, current_preview)
                    print(f"✓ Final output saved to: {final_output_path}")
                break
            elif key in [ord("a"), ord("A")]:  # A key to Analyze
                run_ai_analysis(original_image)
                param_dict["status_msg"] = "✓ Image analyzed. Recommendations ready!"
                needs_update = True
            elif key in [ord("p"), ord("P")]:  # P key to Apply
                if apply_ai_recommendations():
                    param_dict["status_msg"] = "✓ Applied AI recommendations to controls!"
                else:
                    param_dict["status_msg"] = "⚠ Run Analyze / AI Recommend first!"
                needs_update = True
            elif key in [ord("s"), ord("S")]:  # S key to Save
                cv2.imwrite(final_output_path, current_preview)
                saved = True
                param_dict["status_msg"] = "✓ SAVED to final_output.jpg"
                print(f"✓ [SAVE] Final output saved to: {final_output_path}")
                needs_update = True
            elif key in [ord("r"), ord("R")]:  # R key to Reset
                for ctrl in controls_edit + controls_filter:
                    ctrl["val"] = ctrl["default"]
                ai_result = None
                param_dict["status_msg"] = "✓ All controls reset"
                print("✓ [RESET] All settings reset to default.")
                needs_update = True

            if not is_interactive:
                cv2.imwrite(final_output_path, current_preview)
                print("✓ Non-interactive run completed. Saved final_output.jpg.")
                break

        cv2.destroyAllWindows()

    except Exception as e:
        print(f"Notice: OpenCV GUI unavailable ({e}). Running default headless pipeline.")
        default_settings = get_current_settings()
        rec_res = recommend_settings(original_image)
        default_settings.update(rec_res["recommendations"])
        final_img = apply_pipeline(original_image, default_settings)
        cv2.imwrite(final_output_path, final_img)
        print(f"✓ Final output saved to: {final_output_path}")


if __name__ == "__main__":
    main()
