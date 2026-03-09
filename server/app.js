require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// Extra security
const cors = require("cors");
const { xss } = require("express-xss-sanitizer"); // xss-clean is depreciated. This is the best alternative I could find.
const helmet = require("helmet");

app.use(cors());
app.use(xss());
app.use(helmet());
app.use(express.json());

// Middleware
const errorHandlerMiddleware = require('./middleware/error-handler');
const authUser = require('./middleware/auth');

// Connect DB
const connectDB = require('./db/connect');

// Routers
const authRouter = require('./routes/auth');
const transactionRouter = require('./routes/transactions');

// API routes
app.use('/api/auth', authRouter);
app.use('/api/transactions', authUser, transactionRouter);

app.get("/api", (req, res) => {
  res.status(200).json({ message: "Hello from server!" });
});

// Not Found
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Data not found" });
});

// Error handler(s)
app.use(errorHandlerMiddleware);

// Deployment
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Start App
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();


