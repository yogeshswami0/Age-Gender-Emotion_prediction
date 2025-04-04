@echo off
echo Downloading face-api.js models...

mkdir public\models 2>nul

powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://github.com/justadudewhohacks/face-api.js/raw/master/weights/tiny_face_detector_model-weights_manifest.json', 'public\models\tiny_face_detector_model-weights_manifest.json')"
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://github.com/justadudewhohacks/face-api.js/raw/master/weights/tiny_face_detector_model-shard1', 'public\models\tiny_face_detector_model-shard1')"
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-weights_manifest.json', 'public\models\face_landmark_68_model-weights_manifest.json')"
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-shard1', 'public\models\face_landmark_68_model-shard1')"
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-weights_manifest.json', 'public\models\face_recognition_model-weights_manifest.json')"
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-shard1', 'public\models\face_recognition_model-shard1')"
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_expression_model-weights_manifest.json', 'public\models\face_expression_model-weights_manifest.json')"
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_expression_model-shard1', 'public\models\face_expression_model-shard1')"
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://github.com/justadudewhohacks/face-api.js/raw/master/weights/age_gender_model-weights_manifest.json', 'public\models\age_gender_model-weights_manifest.json')"
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://github.com/justadudewhohacks/face-api.js/raw/master/weights/age_gender_model-shard1', 'public\models\age_gender_model-shard1')"

echo All models downloaded successfully!
pause 