import numpy as np
import pytest
import cv


def test_blur():
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    out = cv.blur(img, k=5)
    assert out.shape == img.shape


def test_grayscale():
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    out = cv.grayscale(img)
    assert out.shape == (100, 100)
    assert out.ndim == 2


def test_color_filter():
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    sepia = cv.color_filter(img, filter_type="sepia")
    assert sepia.shape == img.shape

    hue = cv.color_filter(img, filter_type="hue_shift")
    assert hue.shape == img.shape


def test_denoise():
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    out = cv.denoise(img, strength=5)
    assert out.shape == img.shape


def test_enhance():
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    out = cv.enhance(img)
    assert out.shape == img.shape


def test_sharpen():
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    out = cv.sharpen(img, strength=1.0)
    assert out.shape == img.shape


def test_threshold():
    img = np.full((100, 100, 3), 150, dtype=np.uint8)
    out = cv.threshold(img, thresh=128)
    assert out.shape == (100, 100)
    assert np.all(out == 255)
