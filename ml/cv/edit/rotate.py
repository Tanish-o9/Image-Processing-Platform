import cv2


def rotate(image, angle):
    if image is None:
        raise ValueError("Input image cannot be None")

    h, w = image.shape[:2]
    matrix = cv2.getRotationMatrix2D((w / 2, h / 2), angle, 1.0)
    return cv2.warpAffine(image, matrix, (w, h))
