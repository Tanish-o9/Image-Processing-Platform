import cv2


def contrast(image, factor=1.2):
    if image is None:
        raise ValueError("Input image cannot be None")

    f = float(factor)
    if f > 3.0:
        f = 1.0 + (f / 100.0)

    return cv2.convertScaleAbs(image, alpha=f, beta=0)
