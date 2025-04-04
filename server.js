const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for face detection results
app.post('/api/detect', (req, res) => {
    res.json({
        success: true,
        data: req.body
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
    console.log(`You can access the application by opening this link in your browser:`);
    console.log(`http://localhost:${PORT}`);
}); 