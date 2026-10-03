import cv2
import numpy as np


def sharpen(image, strength=1.0):
    if image is None:
        raise ValueError("Input image cannot be None")

    s = float(strength)
    if s > 3.0:
        s = s / 20.0
    s = min(2.5, max(0.0, s))

    kernel = np.array([[0, -s, 0], [-s, 1 + 4 * s, -s], [0, -s, 0]])
    filtered = cv2.filter2D(image, -1, kernel)
    return np.clip(filtered, 0, 255).astype(np.uint8)
