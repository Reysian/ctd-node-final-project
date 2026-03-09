const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const { login, register } = require('../controllers/auth');

router.post("/register", register);
router.post("/login", login);
router.get("/verify", auth, (req, res) => {
    res.status(200).json({message: "Verification successful"});
});

module.exports = router;