import cv2
import numpy as np


def load_and_prepare_image_inference(image_path,img_width, img_height):
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_resized = cv2.resize(image_rgb, (img_width, img_height))
    image_input = image_resized / 255.0
    return np.expand_dims(image_input, axis=0).astype(np.float32), image_resized

def predict_mask(image_path, model, img_width, img_height, threshold=0.5):
    input_image, orig_image = load_and_prepare_image_inference(image_path, img_width, img_height)
    pred_mask = model.predict(input_image)[0]
    binary_mask = (pred_mask[..., 0] > threshold).astype(np.uint8) * 255
    return binary_mask, orig_image

def calculate_area(binary_mask):
    # Подсчет площади по пикселям (белые пиксели = 255)
    area_pixels = np.sum(binary_mask == 255)
    return area_pixels