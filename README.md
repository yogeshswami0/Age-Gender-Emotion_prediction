# Face Recognition App

A web-based face recognition application that detects faces and analyzes emotions, age, and gender.

## Prerequisites

- Node.js (v14 or higher)
- A modern web browser (Chrome, Firefox, or Edge recommended)
- Webcam access

## Setup Instructions

1. First, download the required face-api.js models:
   - Create a `models` directory in the `public` folder
   - Download the following model files and place them in the `models` directory:
     - `tiny_face_detector_model-weights_manifest.json`
     - `tiny_face_detector_model-shard1`
     - `face_landmark_68_model-weights_manifest.json`
     - `face_landmark_68_model-shard1`
     - `face_recognition_model-weights_manifest.json`
     - `face_recognition_model-shard1`
     - `face_expression_model-weights_manifest.json`
     - `face_expression_model-shard1`
     - `age_gender_model-weights_manifest.json`
     - `age_gender_model-shard1`

2. You can download these models from:
   - [face-api.js models](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
   - Or use this command to download them:
     ```bash
     mkdir -p public/models
     cd public/models
     curl -O https://github.com/justadudewhohacks/face-api.js/raw/master/weights/tiny_face_detector_model-weights_manifest.json
     curl -O https://github.com/justadudewhohacks/face-api.js/raw/master/weights/tiny_face_detector_model-shard1
     curl -O https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-weights_manifest.json
     curl -O https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-shard1
     curl -O https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-weights_manifest.json
     curl -O https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-shard1
     curl -O https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_expression_model-weights_manifest.json
     curl -O https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_expression_model-shard1
     curl -O https://github.com/justadudewhohacks/face-api.js/raw/master/weights/age_gender_model-weights_manifest.json
     curl -O https://github.com/justadudewhohacks/face-api.js/raw/master/weights/age_gender_model-shard1
     ```

3. Start a local web server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node.js
   npx http-server
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

5. Allow camera access when prompted by your browser.

## Troubleshooting

If the camera doesn't open:
1. Make sure you're running the application through a web server (not opening the HTML file directly)
2. Check if the models directory exists and contains all required files
3. Ensure your browser has permission to access the camera
4. Try using a different browser
5. Check if your webcam is working in other applications

## Features

- Real-time face detection
- Emotion analysis
- Age estimation
- Gender detection
- Confidence meter
- Responsive design
- Modern UI with animations

## Project Structure

```
face-recognition-app/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── face-api.min.js
│       └── main.js
├── models/
├── server.js
└── package.json
```

## Usage

1. Allow camera access when prompted
2. The application will automatically start detecting faces
3. Results will be displayed in real-time below the video feed

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript
  - Bootstrap 5
  - face-api.js

- Backend:
  - Node.js
  - Express.js
  - CORS
  - Body Parser

## License

This project is licensed under the MIT License - see the LICENSE file for details. 