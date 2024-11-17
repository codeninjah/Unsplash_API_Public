// server/index.js

require('dotenv').config(); // Loads the .env file

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Example endpoint that provides the API key to the front-end (if needed)
app.get('/api/getApiKey', (req, res) => {
    res.json({
        apiKey: process.env.UNSPLASH_ACCESS_KEY
    });
});

// Serve your static files (e.g., from a 'public' folder)
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});