def crop(image, x, y, width, height):
    if image is None:
        raise ValueError("Input image cannot be None")
    return image[y : y + height, x : x + width]
