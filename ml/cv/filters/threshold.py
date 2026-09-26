import cv2
from .grayscale import grayscale


def threshold(image, thresh=128, max_val=255):
    if image is None:
        raise ValueError("Input image cannot be None")

    gray = grayscale(image)
    _, result = cv2.threshold(gray, thresh, max_val, cv2.THRESH_BINARY)
    return result
