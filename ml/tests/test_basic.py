import numpy as np
import pytest
import cv
import cv.edit


def test_brightness():
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    out = cv.brightness(img, value=50)
    assert out.shape == img.shape
    assert np.all(out == 50)

    out_edit = cv.edit.brightness(img, value=50)
    assert np.all(out_edit == 50)


def test_contrast():
    img = np.full((100, 100, 3), 100, dtype=np.uint8)
    out = cv.contrast(img, factor=1.5)
    assert out.shape == img.shape
    assert np.all(out == 150)

    out_edit = cv.edit.contrast(img, factor=1.5)
    assert np.all(out_edit == 150)


def test_crop():
    img = np.zeros((200, 200, 3), dtype=np.uint8)
    out = cv.crop(img, x=10, y=10, width=50, height=50)
    assert out.shape == (50, 50, 3)

    out_edit = cv.edit.crop(img, x=10, y=10, width=50, height=50)
    assert out_edit.shape == (50, 50, 3)


def test_flip():
    img = np.zeros((100, 200, 3), dtype=np.uint8)
    out = cv.flip(img, direction="horizontal")
    assert out.shape == img.shape

    out_edit = cv.edit.flip(img, direction="horizontal")
    assert out_edit.shape == img.shape


def test_resize():
    img = np.zeros((100, 200, 3), dtype=np.uint8)
    out_w = cv.resize(img, width=100)
    assert out_w.shape == (50, 100, 3)

    out_h = cv.resize(img, height=50)
    assert out_h.shape == (50, 100, 3)

    out_both = cv.resize(img, width=80, height=80)
    assert out_both.shape == (80, 80, 3)

    out_edit = cv.edit.resize(img, width=100)
    assert out_edit.shape == (50, 100, 3)


def test_rotate():
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    out = cv.rotate(img, angle=90)
    assert out.shape == img.shape

    out_edit = cv.edit.rotate(img, angle=90)
    assert out_edit.shape == img.shape
