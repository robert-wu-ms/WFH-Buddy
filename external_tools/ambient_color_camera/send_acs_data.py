from set_sample_ioctl import set_acs_sample
import cv2
import time
import numpy as np
import colour


def avg_image_colors(img):
    average = img.mean(axis=0).mean(axis=0)
    avg_img = np.ones(shape=img.shape, dtype=np.uint8)*np.uint8(average)
    return avg_img[4, 4]


def bgr_to_rgb(color_bgr):
    return color_bgr[2], color_bgr[1], color_bgr[0]


def get_cap():
    cap = cv2.VideoCapture(0)
    ret, img = cap.read()
    return img


def main():
    while True:
        time.sleep(1)
        img = get_cap()
        avg_color_rgb = bgr_to_rgb(avg_image_colors(img))
        avg_color_xyz = colour.sRGB_to_XYZ(avg_color_rgb)
        avg_color_xy = XYZ_to_xy(avg_color_xyz)
        avg_color_cct = colour.xy_to_CCT(avg_color_xy, 'hernandez1999')
        avg_img_color_cct_xy = colour.temperature.CCT_to_xy(avg_color_cct)

        print("Average RGB Value: {}, Rounded CCT: {}, Sent xy: {}".format(
            avg_color_rgb, avg_Color_cct, avg_img_color_cct_xy))

        set_acs_sample(avg_img_color_cct_xy[0], avg_img_color_cct_xy[1])


if __name__ == "__main__":
    main()