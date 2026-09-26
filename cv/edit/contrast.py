import cv2


def contrast(image, factor=1.2):
    if image is None:
        raise ValueError("Input image cannot be None")
    return cv2.convertScaleAbs(image, alpha=factor, beta=0)
