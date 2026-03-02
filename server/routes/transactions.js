const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Get all transactions" });
});

router.get("/:id", (req, res) => {
  res.status(200).json({ message: `Get transaction ${req.params.id}` });
});

router.post("/", (req, res) => {
  res.status(201).json({ message: "Add transaction" });
});

router.patch("/:id", (req, res) => {
  res.status(201).json({ message: `Update transaction ${req.params.id}` });
});

router.delete("/:id", (req, res) => {
  res.status(201).json({ message: `Delete transaction ${req.params.id}` });
});

module.exports = router;
