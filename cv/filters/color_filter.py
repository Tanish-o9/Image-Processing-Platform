import cv2
import numpy as np


def color_filter(image, filter_type="sepia"):
    if image is None:
        raise ValueError("Input image cannot be None")

    if filter_type == "sepia":
        kernel = np.array(
            [[0.272, 0.534, 0.131],
             [0.349, 0.686, 0.168],
             [0.393, 0.769, 0.189]]
        )
        return cv2.transform(image, kernel)

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    hsv[:, :, 0] = (hsv[:, :, 0] + 30) % 180
    return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
