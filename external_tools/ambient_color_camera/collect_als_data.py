import cv2
import numpy as np
import colour
import winrt.windows.devices.sensors as sensors

def show_img(img):
    cv2.imshow('Image', img)
    cv2.waitKey(0)


def get_capture():
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    # Lower resolution to speed up processing
    cap.set(3, 640)
    cap.set(4, 480)

    ret, img = cap.read()

    if not ret:
        print("Failed to get video capture.")
        raise ConnectionError
    else:
        return img


def calc_lum(img):
    w = img.shape[1]
    h = img.shape[0]

    img2 = cv2.cvtColor(img, cv2.COLOR_BGR2YUV)
    y, u, v = cv2.split(img2)
    
    return np.mean(y)


def main():
    # img = get_capture()
    als = sensors.LightSensor.get_default()


if __name__ == "__main__":
    main()