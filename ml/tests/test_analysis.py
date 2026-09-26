import numpy as np
import pytest
import cv


def test_histogram():
    # 2D Grayscale
    gray_img = np.zeros((100, 100), dtype=np.uint8)
    hist_gray = cv.histogram(gray_img)
    assert hist_gray.shape == (256,)

    # 3D Color BGR
    color_img = np.zeros((100, 100, 3), dtype=np.uint8)
    hist_color = cv.histogram(color_img)
    assert isinstance(hist_color, dict)
    assert "blue" in hist_color and "green" in hist_color and "red" in hist_color
    assert hist_color["blue"].shape == (256,)
