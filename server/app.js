const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
    res.status(200).json({message: "Hello from server!"});
});

// Deployment
// Serve static files from client build (AI)
app.use(express.static(path.join(__dirname, "../client/dist")));
// Catch all route for react router (AI)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
});

// Start App
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

