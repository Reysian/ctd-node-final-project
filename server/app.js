const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.get("/api", (req, res) => {
    res.status(200).json({message: "Hello from server!"});
});

// Deployment
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Start App
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

