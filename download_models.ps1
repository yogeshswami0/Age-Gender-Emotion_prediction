$baseUrl = "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/"
$models = @(
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_expression_model-weights_manifest.json",
    "face_expression_model-shard1",
    "age_gender_model-weights_manifest.json",
    "age_gender_model-shard1"
)

Write-Host "Downloading face-api.js models..."
foreach ($model in $models) {
    $url = $baseUrl + $model
    $output = "public\models\" + $model
    Write-Host "Downloading $model..."
    Invoke-WebRequest -Uri $url -OutFile $output
}
Write-Host "All models downloaded successfully!" 