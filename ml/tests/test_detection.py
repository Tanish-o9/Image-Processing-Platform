import cv2
import numpy as np
import pytest
import cv


def test_contours():
    img = np.zeros((200, 200, 3), dtype=np.uint8)
    cv2.rectangle(img, (50, 50), (150, 150), (255, 255, 255), -1)

    annotated, cnts = cv.contours(img)
    assert annotated.shape == img.shape
    assert len(cnts) > 0


def test_face_detection():
    img = np.zeros((200, 200, 3), dtype=np.uint8)
    annotated, faces = cv.face_detection(img)
    assert annotated.shape == img.shape
    assert isinstance(faces, (list, tuple, np.ndarray))
