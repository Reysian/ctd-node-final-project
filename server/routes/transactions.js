const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  getTransaction,
  createTransaction,
  editTransaction,
  deleteTransaction,
  submitTransaction,
} = require('../controllers/transactions');

router.get("/", getAllTransactions);

router.get("/:id", getTransaction);

router.post("/", createTransaction);

router.patch("/:id", editTransaction);

router.delete("/:id", deleteTransaction);

router.post("/:id", submitTransaction);

module.exports = router;
