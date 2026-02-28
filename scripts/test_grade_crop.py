import requests
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Get a test image path
TEST_IMAGE = os.path.join(os.path.dirname(BASE_DIR), "data", "crop_images", "grade_a", "synthetic_grade_a_0.jpg")

if not os.path.exists(TEST_IMAGE):
    print(f"Test image not found at {TEST_IMAGE}")
else:
    url = "http://127.0.0.1:8000/grade-crop"
    with open(TEST_IMAGE, "rb") as f:
        files = {"file": ("test_image.jpg", f, "image/jpeg")}
        response = requests.post(url, files=files)
        print("Status Code:", response.status_code)
        try:
            print("Response:", response.json())
        except:
            print("Response Text:", response.text)
