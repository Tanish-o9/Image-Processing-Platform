import cv2
import numpy as np
import pytest
from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


def create_test_image_bytes():
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    img[25:75, 25:75] = (255, 255, 255)
    success, encoded = cv2.imencode(".jpg", img)
    assert success
    return encoded.tobytes()


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_process_endpoint_default():
    img_bytes = create_test_image_bytes()
    files = {"image": ("test.jpg", img_bytes, "image/jpeg")}
    response = client.post("/process", files=files)

    assert response.status_code == 200
    assert response.headers["content-type"] == "image/jpeg"
    assert len(response.content) > 0


def test_process_endpoint_with_settings():
    img_bytes = create_test_image_bytes()
    files = {"image": ("test.jpg", img_bytes, "image/jpeg")}
    data = {
        "settings": '{"brightness": 20, "contrast": 1.2, "grayscale": true, "rotate": 90}'
    }
    response = client.post("/process", files=files, data=data)

    assert response.status_code == 200
    assert response.headers["content-type"] == "image/jpeg"
    assert len(response.content) > 0


def test_process_endpoint_partial_setting():
    img_bytes = create_test_image_bytes()
    files = {"image": ("test.jpg", img_bytes, "image/jpeg")}
    data = {"settings": '{"brightness": 15}'}
    response = client.post("/process", files=files, data=data)

    assert response.status_code == 200
    assert response.headers["content-type"] == "image/jpeg"


def test_analyze_endpoint():
    img_bytes = create_test_image_bytes()
    files = {"image": ("test.jpg", img_bytes, "image/jpeg")}
    response = client.post("/analyze", files=files)

    assert response.status_code == 200
    data = response.json()
    assert "brightness" in data
    assert "contrast" in data
    assert "sharpness" in data
    assert "is_dark" in data
    assert "is_blurry" in data


def test_recommend_endpoint():
    img_bytes = create_test_image_bytes()
    files = {"image": ("test.jpg", img_bytes, "image/jpeg")}
    response = client.post("/recommend", files=files)

    assert response.status_code == 200
    data = response.json()
    assert "brightness" in data
    assert "contrast" in data
    assert "reason" in data

