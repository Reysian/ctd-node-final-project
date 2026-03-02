require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// Extra security
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");

app.use(cors());
//app.use(xss()); Depreciated in express 5. Ask mentor.
app.use(helmet());
app.use(express.json());

// TODO: Middleware

// TODO: Connect DB

// Routers
const authRouter = require('./routes/auth');
const transactionRouter = require('./routes/transactions');

// API routes
app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionRouter);

app.get("/api", (req, res) => {
  res.status(200).json({ message: "Hello from server!" });
});

// Not Found
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Data not found" });
});

// Deployment
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Start App
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
