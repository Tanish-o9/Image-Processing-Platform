import cv2


def flip(image, direction="horizontal"):
    if image is None:
        raise ValueError("Input image cannot be None")

    if isinstance(direction, str):
        mode_map = {"vertical": 0, "horizontal": 1, "both": -1}
        mode = mode_map.get(direction.lower(), 1)
    else:
        mode = direction

    return cv2.flip(image, mode)
