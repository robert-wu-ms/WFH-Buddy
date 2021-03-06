import cv2
import numpy as np
import colour
import winrt.windows.devices.sensors as sensors
import time

def get_capture():
    cap = cv2.VideoCapture(0)

    # Lower resolution to speed up processing
    cap.set(3, 640)
    cap.set(4, 480)

    ret, img = cap.read()

    if not ret:
        print("Failed to get video capture.")
        raise ConnectionError
    else:
        return img


def write_data_to_file(iter, img, lux):
    print("Writing iteration {}".format(iter))
    cv2.imwrite("{}.png".format(iter), img)
    text = open("{}.txt".format(iter), "w")
    text.write(str(lux))
    text.close()


def main():
    iter = 0
    als = sensors.LightSensor.get_default()

    for i in range(100):
        print("Getting video capture")
        img = get_capture()
        print("Getting lux")
        lux = als.get_current_reading().illuminance_in_lux
        write_data_to_file(iter, img, lux)

        iter = iter + 1
        # time.sleep(0.5)


if __name__ == "__main__":
    main()