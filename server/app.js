const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Extra security
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');

app.use(cors());
app.use(xss());
app.use(helmet());
app.use(express.json());

// API routes
app.get("/api", (req, res) => {
    res.status(200).json({message: "Hello from server!"});
});

// Not Found
app.use('/api', (req, res) => {
    res.status(404).json({error: "Data not found"});
})

// Deployment
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Start App
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

