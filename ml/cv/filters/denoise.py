import cv2


def denoise(image, strength=10):
    if image is None:
        raise ValueError("Input image cannot be None")

    h = float(strength)
    if len(image.shape) == 2:
        return cv2.fastNlMeansDenoising(image, h=h)
    return cv2.fastNlMeansDenoisingColored(image, h=h, hColor=h)
