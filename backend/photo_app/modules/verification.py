import tensorflow as tf
import numpy as np

def verify_image(verify_model, image_path, class_names, image_size=(224, 224)):
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=image_size)
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.cast(img_array, tf.float32)
    img_array = np.expand_dims(img_array, axis=0)

    predictions = verify_model.predict(img_array)
    predicted_index = np.argmax(predictions, axis=1)[0]
    return class_names[predicted_index]