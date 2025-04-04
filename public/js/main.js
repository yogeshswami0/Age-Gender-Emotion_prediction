const video = document.getElementById("video");
const toggleButton = document.getElementById("toggleDetection");
const loadingSpinner = document.getElementById("loading");
const confidenceBar = document.getElementById("confidenceBar");
const cameraPermission = document.getElementById("cameraPermission");
const requestCameraButton = document.getElementById("requestCamera");
const isScreenSmall = window.matchMedia("(max-width: 700px)");
let predictedAges = [];
let lastDetections = null;
let detectionCount = 0;
let isDetecting = false;
let detectionInterval = null;
let lastResults = { age: null, gender: null, emotion: null };

// Check camera permission status
async function checkCameraPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (err) {
        console.error("Camera permission denied:", err);
        cameraPermission.style.display = "block";
        return false;
    }
}

// Request camera access
requestCameraButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraPermission.style.display = "none";
        video.srcObject = stream;
        await video.play();
    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Please allow camera access to use face detection");
    }
});

// Load models when page loads
window.addEventListener('load', async () => {
    loadingSpinner.classList.remove('d-none');
    try {
        // Load all models from GitHub raw content
        const modelBaseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
        
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(modelBaseUrl),
            faceapi.nets.faceLandmark68Net.loadFromUri(modelBaseUrl),
            faceapi.nets.faceRecognitionNet.loadFromUri(modelBaseUrl),
            faceapi.nets.faceExpressionNet.loadFromUri(modelBaseUrl),
            faceapi.nets.ageGenderNet.loadFromUri(modelBaseUrl)
        ]);
        
        loadingSpinner.classList.add('d-none');
        const hasPermission = await checkCameraPermission();
        if (hasPermission) {
            startVideo();
        }
    } catch (err) {
        console.error("Error loading models:", err);
        loadingSpinner.classList.add('d-none');
        alert("Error loading face detection models. Please check your internet connection and try refreshing the page. If the problem persists, please try using a different browser.");
    }
});

function startVideo() {
    navigator.mediaDevices.getUserMedia({
        video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
            frameRate: { ideal: 30 }
        }
    })
    .then(stream => {
        video.srcObject = stream;
        return video.play();
    })
    .catch(err => {
        console.error("Error accessing camera:", err);
        cameraPermission.style.display = "block";
    });
}

function screenResize(isScreenSmall) {
    if (isScreenSmall.matches) {
        video.style.width = "100%";
    } else {
        video.style.width = "100%";
    }
}

screenResize(isScreenSmall);
isScreenSmall.addListener(screenResize);

// Toggle detection button handler
toggleButton.addEventListener('click', () => {
    if (!isDetecting) {
        startDetection();
        toggleButton.innerHTML = '<i class="fas fa-stop"></i> Stop Detection';
        toggleButton.classList.add('detecting');
    } else {
        stopDetection();
        toggleButton.innerHTML = '<i class="fas fa-play"></i> Start Detection';
        toggleButton.classList.remove('detecting');
    }
    isDetecting = !isDetecting;
});

function startDetection() {
    const canvas = document.getElementById('overlay');
    if (!canvas) {
        console.error("Canvas element not found");
        return;
    }

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    detectionInterval = setInterval(async () => {
        try {
            const detections = await faceapi
                .detectSingleFace(
                    video,
                    new faceapi.TinyFaceDetectorOptions({
                        inputSize: 512,
                        scoreThreshold: 0.7
                    })
                )
                .withFaceLandmarks()
                .withFaceExpressions()
                .withAgeAndGender();

            if (detections) {
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                
                // Update confidence bar
                confidenceBar.style.width = `${detections.detection.score * 100}%`;
                
                // Smooth the detections with increased stability
                if (lastDetections) {
                    resizedDetections.detection.box = smoothBox(
                        lastDetections.detection.box,
                        resizedDetections.detection.box,
                        0.8 // Increased smoothing factor
                    );
                    resizedDetections.landmarks.positions = smoothLandmarks(
                        lastDetections.landmarks.positions,
                        resizedDetections.landmarks.positions,
                        0.8 // Increased smoothing factor
                    );
                }
                
                lastDetections = resizedDetections;
                detectionCount++;

                // Clear canvas and draw new detections
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw face box with improved styling
                ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
                ctx.lineWidth = 3;
                ctx.strokeRect(
                    resizedDetections.detection.box.x,
                    resizedDetections.detection.box.y,
                    resizedDetections.detection.box.width,
                    resizedDetections.detection.box.height
                );

                // Draw landmarks with improved visibility
                ctx.fillStyle = 'rgba(255, 0, 255, 0.7)';
                resizedDetections.landmarks.positions.forEach(point => {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                    ctx.fill();
                });

                // Update results with smoothing and animation
                if (detectionCount > 3) {
                    const age = Math.round(smoothValue(lastResults.age, resizedDetections.age, 0.7));
                    const gender = resizedDetections.gender;
                    const expressions = resizedDetections.expressions;
                    const maxValue = Math.max(...Object.values(expressions));
                    const emotion = Object.keys(expressions).filter(
                        item => expressions[item] === maxValue
                    )[0];

                    updateResults(age, gender, emotion);
                    
                    // Store last results for smoothing
                    lastResults = {
                        age: resizedDetections.age,
                        gender: gender,
                        emotion: emotion
                    };
                }

                // Add active class to result items when detection is stable
                if (detectionCount > 5) {
                    document.querySelectorAll('.result-item').forEach(item => {
                        item.classList.add('active');
                    });
                }
            } else {
                clearResults();
                confidenceBar.style.width = "0%";
                document.querySelectorAll('.result-item').forEach(item => {
                    item.classList.remove('active');
                });
            }
        } catch (error) {
            console.error("Detection error:", error);
        }
    }, 100);
}

function stopDetection() {
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
    }
    const canvas = document.getElementById('overlay');
    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    clearResults();
    confidenceBar.style.width = "0%";
    document.querySelectorAll('.result-item').forEach(item => {
        item.classList.remove('active');
    });
    lastDetections = null;
    lastResults = { age: null, gender: null, emotion: null };
    detectionCount = 0;
}

function updateResults(age, gender, emotion) {
    const elements = {
        age: document.getElementById("age"),
        gender: document.getElementById("gender"),
        emotion: document.getElementById("emotion")
    };

    // Update with animation if value changed
    if (elements.age.innerText !== `Age - ${age}`) {
        elements.age.classList.add('updated');
        elements.age.innerText = `Age - ${age}`;
        setTimeout(() => elements.age.classList.remove('updated'), 500);
    }

    if (elements.gender.innerText !== `Gender - ${gender}`) {
        elements.gender.classList.add('updated');
        elements.gender.innerText = `Gender - ${gender}`;
        setTimeout(() => elements.gender.classList.remove('updated'), 500);
    }

    if (elements.emotion.innerText !== `Emotion - ${emotion}`) {
        elements.emotion.classList.add('updated');
        elements.emotion.innerText = `Emotion - ${emotion}`;
        setTimeout(() => elements.emotion.classList.remove('updated'), 500);
    }
}

function clearResults() {
    document.getElementById("age").innerText = "Age - -";
    document.getElementById("gender").innerText = "Gender - -";
    document.getElementById("emotion").innerText = "Emotion - -";
}

function smoothBox(oldBox, newBox, factor = 0.8) {
    return {
        x: oldBox.x + (newBox.x - oldBox.x) * (1 - factor),
        y: oldBox.y + (newBox.y - oldBox.y) * (1 - factor),
        width: oldBox.width + (newBox.width - oldBox.width) * (1 - factor),
        height: oldBox.height + (newBox.height - oldBox.height) * (1 - factor)
    };
}

function smoothLandmarks(oldPositions, newPositions, factor = 0.8) {
    return newPositions.map((newPos, index) => ({
        x: oldPositions[index].x + (newPos.x - oldPositions[index].x) * (1 - factor),
        y: oldPositions[index].y + (newPos.y - oldPositions[index].y) * (1 - factor)
    }));
}

function smoothValue(oldValue, newValue, factor = 0.7) {
    if (oldValue === null) return newValue;
    return oldValue + (newValue - oldValue) * (1 - factor);
}

function interpolateAgePredictions(age) {
    predictedAges = [age].concat(predictedAges).slice(0, 30);
    const avgPredictedAge =
        predictedAges.reduce((total, a) => total + a) / predictedAges.length;
    return avgPredictedAge;
}
