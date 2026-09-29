import cv2


def resize(image, width=None, height=None):
    if image is None:
        raise ValueError("Input image cannot be None")

    h, w = image.shape[:2]
    if not width and not height:
        return image.copy()
    if width and not height:
        height = int(h * (width / w))
    elif height and not width:
        width = int(w * (height / h))
    return cv2.resize(image, (width, height))
