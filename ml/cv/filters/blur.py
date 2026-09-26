import cv2


def blur(image, k=5):
    if image is None:
        raise ValueError("Input image cannot be None")

    k = int(k)
    if k % 2 == 0:
        k += 1
    return cv2.GaussianBlur(image, (k, k), 0)
