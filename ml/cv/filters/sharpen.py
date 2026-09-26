import cv2
import numpy as np


def sharpen(image, strength=1.0):
    if image is None:
        raise ValueError("Input image cannot be None")

    s = float(strength)
    kernel = np.array([[0, -s, 0], [-s, 1 + 4 * s, -s], [0, -s, 0]])
    return cv2.filter2D(image, -1, kernel)
