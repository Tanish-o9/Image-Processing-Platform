import cv2


def brightness(image, value=30):
    if image is None:
        raise ValueError("Input image cannot be None")
    return cv2.convertScaleAbs(image, alpha=1.0, beta=value)
