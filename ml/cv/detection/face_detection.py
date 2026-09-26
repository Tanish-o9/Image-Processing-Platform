import cv2
from ..filters.grayscale import grayscale


def face_detection(image):
    if image is None:
        raise ValueError("Input image cannot be None")

    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    face_cascade = cv2.CascadeClassifier(cascade_path)
    gray = grayscale(image)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    out = image.copy()
    for (x, y, w, h) in faces:
        cv2.rectangle(out, (x, y), (x + w, y + h), (0, 255, 0), 2)
    return out, faces
