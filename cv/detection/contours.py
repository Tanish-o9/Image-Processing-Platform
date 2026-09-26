import cv2
from ..filters.grayscale import grayscale


def contours(image, thresh_val=60):
    if image is None:
        raise ValueError("Input image cannot be None")

    gray = grayscale(image)
    _, thresh = cv2.threshold(gray, thresh_val, 255, cv2.THRESH_BINARY)
    cnts, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    out = image.copy()
    cv2.drawContours(out, cnts, -1, (0, 255, 0), 2)
    return out, cnts
