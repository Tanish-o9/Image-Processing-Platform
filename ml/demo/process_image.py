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

WINDOW_NAME = "Image Processing Demo"

# Global state for UI interaction
active_control = None
needs_update = True

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
    """
    Applies all active edits and filters in sequence to a copy of original_image.
    Always starts from original_image so edits do not accumulate incorrectly.
    """
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


def handle_mouse(event, x, y, flags, param):
    global active_control, needs_update

    all_controls = controls_edit + controls_filter

    if event == cv2.EVENT_LBUTTONDOWN:
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
    title = "IMAGE PROCESSING DEMO - SINGLE WINDOW LIVE PREVIEW"
    cv2.putText(canvas, title, (20, 24), font, 0.65, (240, 240, 240), 2, cv2.LINE_AA)

    # 2. Top Half: Image Preview Box (x: 10, y: 40, w: 1380, h: 360) -> ~40% height
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

    # 3. Bottom-Left Panel: EDIT CONTROLS (x: 10, y: 415, w: 680, h: 480) -> 9 controls
    p1_x, p1_y, p1_w, p1_h = 10, 415, 680, 480
    cv2.rectangle(canvas, (p1_x, p1_y), (p1_x + p1_w, p1_y + p1_h), (33, 33, 33), -1)
    cv2.rectangle(canvas, (p1_x, p1_y), (p1_x + p1_w, p1_y + p1_h), (70, 70, 70), 1)
    cv2.putText(canvas, "EDIT CONTROLS", (p1_x + 15, p1_y + 26), font, 0.65, (0, 220, 255), 2, cv2.LINE_AA)

    y_curr = p1_y + 55
    dy_edit = 45  # Spacing per edit control
    for ctrl in controls_edit:
        label_str = ctrl["fmt"](ctrl["val"])
        cv2.putText(canvas, label_str, (p1_x + 15, y_curr + 4), font, 0.48, (230, 230, 230), 1, cv2.LINE_AA)

        tx1, tx2 = p1_x + 230, p1_x + 660
        ty = y_curr
        ctrl["track_x1"] = tx1
        ctrl["track_x2"] = tx2
        ctrl["track_y"] = ty

        cv2.line(canvas, (tx1, ty), (tx2, ty), (80, 80, 80), 3)

        ratio = (ctrl["val"] - ctrl["min"]) / float(ctrl["max"] - ctrl["min"])
        ratio = max(0.0, min(1.0, ratio))
        kx = int(tx1 + ratio * (tx2 - tx1))

        cv2.line(canvas, (tx1, ty), (kx, ty), (0, 180, 240), 3)
        cv2.circle(canvas, (kx, ty), 7, (255, 255, 255), -1)
        cv2.circle(canvas, (kx, ty), 7, (0, 180, 240), 2)

        y_curr += dy_edit

    # 4. Bottom-Right Panel: FILTER CONTROLS (x: 710, y: 415, w: 680, h: 480) -> 7 controls
    p2_x, p2_y, p2_w, p2_h = 710, 415, 680, 480
    cv2.rectangle(canvas, (p2_x, p2_y), (p2_x + p2_w, p2_y + p2_h), (33, 33, 33), -1)
    cv2.rectangle(canvas, (p2_x, p2_y), (p2_x + p2_w, p2_y + p2_h), (70, 70, 70), 1)
    cv2.putText(canvas, "FILTER CONTROLS", (p2_x + 15, p2_y + 26), font, 0.65, (0, 255, 180), 2, cv2.LINE_AA)

    y_curr = p2_y + 55
    dy_filter = 58  # Spacing per filter control
    for ctrl in controls_filter:
        label_str = ctrl["fmt"](ctrl["val"])
        cv2.putText(canvas, label_str, (p2_x + 15, y_curr + 4), font, 0.48, (230, 230, 230), 1, cv2.LINE_AA)

        tx1, tx2 = p2_x + 230, p2_x + 660
        ty = y_curr
        ctrl["track_x1"] = tx1
        ctrl["track_x2"] = tx2
        ctrl["track_y"] = ty

        cv2.line(canvas, (tx1, ty), (tx2, ty), (80, 80, 80), 3)

        ratio = (ctrl["val"] - ctrl["min"]) / float(ctrl["max"] - ctrl["min"])
        ratio = max(0.0, min(1.0, ratio))
        kx = int(tx1 + ratio * (tx2 - tx1))

        cv2.line(canvas, (tx1, ty), (kx, ty), (0, 220, 160), 3)
        cv2.circle(canvas, (kx, ty), 7, (255, 255, 255), -1)
        cv2.circle(canvas, (kx, ty), 7, (0, 220, 160), 2)

        y_curr += dy_filter

    # 5. Footer Bar (y: 905 - 950)
    cv2.rectangle(canvas, (0, 905), (CANVAS_W, 950), (20, 20, 20), -1)
    footer_text = "[S] SAVE final_output.jpg    |    [R] RESET ALL    |    [Q / ESC] EXIT"
    cv2.putText(canvas, footer_text, (20, 932), font, 0.52, (200, 200, 200), 1, cv2.LINE_AA)

    if status_msg:
        cv2.putText(canvas, status_msg, (800, 932), font, 0.52, (0, 255, 120), 2, cv2.LINE_AA)

    return canvas


def main():
    global needs_update

    demo_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(demo_dir, "input.jpg")
    output_dir = os.path.join(demo_dir, "outputs")

    os.makedirs(output_dir, exist_ok=True)
    final_output_path = os.path.join(output_dir, "final_output.jpg")

    # Clean up old intermediate files if present
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
    print("      IMAGE PROCESSING DEMO - SINGLE WINDOW       ")
    print("==================================================")
    print(f"Opening window '{WINDOW_NAME}'...")
    print("Keyboard Shortcuts:")
    print(" [S] - SAVE final processed image to demo/outputs/final_output.jpg")
    print(" [R] - RESET all settings to default values")
    print(" [Q] or [ESC] - Exit demo\n")

    is_interactive = sys.stdin.isatty()

    try:
        cv2.namedWindow(WINDOW_NAME, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(WINDOW_NAME, 1400, 950)
        cv2.setMouseCallback(WINDOW_NAME, handle_mouse)

        saved = False
        current_preview = original_image.copy()
        status_msg = ""

        while True:
            if needs_update:
                settings = get_current_settings()
                current_preview = apply_pipeline(original_image, settings)
                canvas = draw_ui(current_preview, status_msg)
                cv2.imshow(WINDOW_NAME, canvas)
                needs_update = False

            key = cv2.waitKey(30) & 0xFF
            if key in [ord("q"), ord("Q"), 27]:  # Q or ESC
                if not saved:
                    cv2.imwrite(final_output_path, current_preview)
                    print(f"✓ Final output saved to: {final_output_path}")
                break
            elif key in [ord("s"), ord("S")]:  # S key to Save
                cv2.imwrite(final_output_path, current_preview)
                saved = True
                status_msg = "✓ SAVED to final_output.jpg"
                print(f"✓ [SAVE] Final output saved to: {final_output_path}")
                needs_update = True
            elif key in [ord("r"), ord("R")]:  # R key to Reset
                for ctrl in controls_edit + controls_filter:
                    ctrl["val"] = ctrl["default"]
                status_msg = "✓ All controls reset"
                print("✓ [RESET] All settings reset to default.")
                needs_update = True

            # If running in non-interactive environment, save default preview and exit
            if not is_interactive:
                cv2.imwrite(final_output_path, current_preview)
                print("✓ Non-interactive run completed. Saved final_output.jpg.")
                break

        cv2.destroyAllWindows()

    except Exception as e:
        print(f"Notice: OpenCV GUI unavailable ({e}). Running default headless pipeline.")
        default_settings = get_current_settings()
        default_settings.update({
            "brightness": 40,
            "contrast": 1.3,
            "resize_pct": 100,
            "rotate_idx": 1,  # 90 deg
            "blur_k": 5,
        })
        final_img = apply_pipeline(original_image, default_settings)
        cv2.imwrite(final_output_path, final_img)
        print(f"✓ Final output saved to: {final_output_path}")


if __name__ == "__main__":
    main()





