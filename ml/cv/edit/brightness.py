import cv2


def brightness(image, value=30):
    if image is None:
        raise ValueError("Input image cannot be None")
    if value == 0:
        return image.copy()
    return cv2.convertScaleAbs(image, alpha=1.0, beta=value)
