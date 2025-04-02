# Face Recognition App

A modern web application that detects face emotions, gender, and age using face-api.js and Node.js.

## Features

- Real-time face detection
- Emotion recognition
- Gender detection
- Age estimation
- Modern responsive UI
- RESTful API backend

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Modern web browser with camera access

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd face-recognition-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

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