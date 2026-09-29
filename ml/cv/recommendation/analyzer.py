import cv2
import numpy as np


def analyze_image(image):
    if image is None:
        raise ValueError("Input image cannot be None")

    if image.ndim == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        saturation = float(np.mean(hsv[:, :, 1]))
    else:
        gray = image.copy()
        saturation = 0.0

    mean_brightness = float(np.mean(gray))
    std_contrast = float(np.std(gray))
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    blurred_gray = cv2.medianBlur(gray, 3)
    noise_level = float(np.mean(np.abs(gray.astype(np.float32) - blurred_gray.astype(np.float32))))

    underexposed_pct = float(np.mean(gray < 30) * 100.0)
    overexposed_pct = float(np.mean(gray > 225) * 100.0)

    return {
        "brightness": mean_brightness,
        "contrast": std_contrast,
        "sharpness": laplacian_var,
        "saturation": saturation,
        "noise": noise_level,
        "underexposed_pct": underexposed_pct,
        "overexposed_pct": overexposed_pct,
    }
