const https = require('https');
const fs = require('fs');
const path = require('path');

const models = [
    'tiny_face_detector_model-weights_manifest.json',
    'tiny_face_detector_model-shard1',
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1',
    'face_recognition_model-weights_manifest.json',
    'face_recognition_model-shard1',
    'face_expression_model-weights_manifest.json',
    'face_expression_model-shard1',
    'age_gender_model-weights_manifest.json',
    'age_gender_model-shard1'
];

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
const modelsDir = path.join(__dirname, 'public', 'models');

// Create models directory if it doesn't exist
if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
}

console.log('Downloading face-api.js models...');

let downloaded = 0;

function downloadModel(model) {
    return new Promise((resolve, reject) => {
        const url = baseUrl + model;
        const filePath = path.join(modelsDir, model);
        
        console.log(`Downloading ${model}...`);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${model}: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Downloaded: ${model}`);
                resolve();
            });

            fileStream.on('error', (err) => {
                fs.unlink(filePath, () => {}); // Delete the file if download fails
                reject(err);
            });
        }).on('error', reject);
    });
}

async function downloadAllModels() {
    for (const model of models) {
        try {
            await downloadModel(model);
            downloaded++;
        } catch (error) {
            console.error(`Error downloading ${model}:`, error.message);
        }
    }
    
    if (downloaded === models.length) {
        console.log('All models downloaded successfully!');
    } else {
        console.log(`Downloaded ${downloaded} out of ${models.length} models.`);
    }
}

downloadAllModels(); 