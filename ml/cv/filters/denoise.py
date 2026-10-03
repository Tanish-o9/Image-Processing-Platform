import cv2


def denoise(image, strength=10):
    if image is None:
        raise ValueError("Input image cannot be None")

    s = float(strength)
    d = 5 if s < 15 else 7
    sigma = min(100.0, s * 3.0)
    return cv2.bilateralFilter(image, d=d, sigmaColor=sigma, sigmaSpace=sigma)
