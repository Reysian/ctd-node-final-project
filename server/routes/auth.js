const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const { login, register } = require('../controllers/auth');

router.post("/register", register); // register new user
router.post("/login", login); // login existing user
router.get("/verify", auth, (req, res) => { // verify that a valid user is logged in
    res.status(200).json({message: "Verification successful"});
});

module.exports = router;