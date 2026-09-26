import numpy as np
import pytest
from cv.recommendation import analyze_image, recommend_settings


def test_dark_image_recommendation():
    dark_img = np.full((100, 100, 3), 20, dtype=np.uint8)
    res = recommend_settings(dark_img)
    rec = res["recommendations"]
    assert rec["brightness"] > 0, "Dark image should recommend positive brightness adjustment"


def test_bright_image_recommendation():
    bright_img = np.full((100, 100, 3), 220, dtype=np.uint8)
    res = recommend_settings(bright_img)
    rec = res["recommendations"]
    assert rec["brightness"] < 0, "Bright image should recommend negative brightness adjustment"


def test_low_contrast_image_recommendation():
    np.random.seed(42)
    low_contrast_img = np.random.randint(100, 110, (100, 100, 3), dtype=np.uint8)
    res = recommend_settings(low_contrast_img)
    rec = res["recommendations"]
    assert rec["contrast"] > 1.0, "Low contrast image should recommend contrast increase (> 1.0)"


def test_sharp_image_recommendation():
    sharp_img = np.zeros((100, 100, 3), dtype=np.uint8)
    sharp_img[::2, ::2] = 255
    res = recommend_settings(sharp_img)
    rec = res["recommendations"]
    assert rec["sharpen_val"] == 0.0, "Already sharp image should not recommend unnecessary sharpening"


def test_blurry_image_recommendation():
    blurry_img = np.full((100, 100, 3), 128, dtype=np.uint8)
    res = recommend_settings(blurry_img)
    rec = res["recommendations"]
    assert rec["sharpen_val"] > 0.0, "Blurry image should recommend sharpening"


def test_balanced_image_recommendation():
    balanced_img = np.tile(np.linspace(20, 220, 100, dtype=np.uint8), (100, 1)).reshape(100, 100)
    balanced_img = np.stack([balanced_img] * 3, axis=-1)
    res = recommend_settings(balanced_img)
    rec = res["recommendations"]
    assert rec["brightness"] == 0
    assert rec["contrast"] == 1.0
