import cv2


def grayscale(image):
    if image is None:
        raise ValueError("Input image cannot be None")

    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
