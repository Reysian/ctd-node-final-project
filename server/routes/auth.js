const express = require('express');
const router = express.Router();

router.post("/register", (req, res) => {
  res.json({ message: "Register Page" });
});

router.post("/login", (req, res) => {
  res.json({ message: "Login Page" });
});

module.exports = router;