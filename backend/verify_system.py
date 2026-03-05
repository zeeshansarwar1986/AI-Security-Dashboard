import requests
import json
import os

BASE_URL = "http://localhost:8000"

def test_flow():
    print("--- Starting SENTINEYE End-to-End Test ---")
    
    # 1. Login (Get Token)
    print("1. Logging in...")
    login_data = {"username": "admin", "password": "admin123"}
    res = requests.post(f"{BASE_URL}/token", data=login_data)
    if res.status_code != 200:
        print("Login Failed!")
        return
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("   Success.")

    # 2. Add a new Person
    print("2. Registering Test Identity...")
    # Using a placeholder image for test
    if not os.path.exists("test_face.jpg"):
        # Create a dummy image if not exists for testing
        print("   Notice: test_face.jpg not found, creating dummy.")
        import cv2
        import numpy as np
        img = np.zeros((200, 200, 3), dtype=np.uint8)
        cv2.putText(img, "TEST", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.imwrite("test_face.jpg", img)

    with open("test_face.jpg", "rb") as f:
        files = {"file": ("test_face.jpg", f, "image/jpeg")}
        data = {"name": "Test User", "category": "VIP", "notes": "Automated Test"}
        res = requests.post(f"{BASE_URL}/persons", headers=headers, data=data, files=files)
    
    if res.status_code == 200:
        person_id = res.json()["id"]
        print(f"   Success: Registered with ID {person_id}")
    else:
        print(f"   Failed to register person: {res.text}")
        return

    # 3. Analyze an image
    print("3. Analyzing Image...")
    with open("test_face.jpg", "rb") as f:
        files = {"file": ("scene.jpg", f, "image/jpeg")}
        data = {"camera_id": 1}
        res = requests.post(f"{BASE_URL}/analyze", data=data, files=files)
    
    if res.status_code == 200:
        print(f"   Success: Analyzed. Found {res.json()['faces_found']} faces.")
    else:
        print(f"   Analysis failed: {res.text}")

    # 4. Check Logs
    print("4. Verifying Event Log...")
    res = requests.get(f"{BASE_URL}/logs", headers=headers)
    if res.status_code == 200:
        logs = res.json()
        if len(logs) > 0 and logs[0]["name"] == "Test User":
            print(f"   Success: Log entry verified for '{logs[0]['name']}'")
        else:
            print(f"   Log entry mismatch: {logs}")
    else:
        print(f"   Failed to fetch logs: {res.text}")

    # 5. Cleanup
    print("5. Cleaning Up...")
    res = requests.delete(f"{BASE_URL}/persons/{person_id}", headers=headers)
    if res.status_code == 200:
        print("   Success: Test record deleted.")

    print("\n--- Test Complete ---")

if __name__ == "__main__":
    test_flow()
