import cv2


def histogram(image):
    if image is None:
        raise ValueError("Input image cannot be None")

    if len(image.shape) == 2:
        return cv2.calcHist([image], [0], None, [256], [0, 256]).flatten()
    return {
        col: cv2.calcHist([ch], [0], None, [256], [0, 256]).flatten()
        for ch, col in zip(cv2.split(image), ("blue", "green", "red"))
    }
