const User = require("../models/User");
const Transaction = require("../models/Transaction");

const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find({
    createdBy: req.user.userID,
  }).sort("createdAt");
  res.status(200).json({ count: transactions.length, transactions });
};

const getUserInfo = async (req, res) => {
  const user = await User.findOne({_id: req.user.userID});
  if (!user) {
    throw new Error(`No user with id=${req.params.id}`);
  }
  res.status(200).json({ user });
}

const getTransaction = async (req, res) => {
  const tID = req.params.id;
  const { name, userID } = req.user;
  const transaction = await Transaction.findOne({
    _id: tID,
    createdBy: userID,
  });
  if (!transaction) {
    throw new Error(`No transaction with id=${tID} from user=${name} found`);
  }
  res.status(200).json({ transaction });
};

const createTransaction = async (req, res) => {
  const createdBy = req.user.userID;
  const { typeOf, amount, recipient_email } = req.body;
  let recipient = null;
  let recipientEmail = null;

  // Get recipient's user ID if recipient email is included
  if (typeOf === "transfer") {
    if (!recipient_email) {
      throw Error("Transfer requires recipient email");
    }
    const recipientObject = await User.findOne({
      email: req.body.recipient_email,
    });
    if (recipientObject) {
      recipient = recipientObject._id;
      recipientEmail = recipientObject.email;
    } else {
      throw Error("Recipient email invalid");
    }
  }

  const transactionJSON = {
    createdBy,
    recipient,
    recipientEmail,
    typeOf,
    amount,
  };
  const transaction = await Transaction.create(transactionJSON);
  res.status(201).json({ transaction });
};

const editTransaction = async (req, res) => {
  const tID = req.params.id;
  const { name } = req.user;
  const createdBy = req.user.userID;
  const { typeOf, amount, recipient_email } = req.body;
  let recipient = null;
  let recipientEmail = null;

  // Get recipient's user ID if recipient email is included
  if (typeOf === "transfer") {
    if (!recipient_email) {
      throw Error("Transfer requires recipient email");
    }
    const recipientObject = await User.findOne({
      email: recipient_email,
    });
    if (recipientObject) {
      recipient = recipientObject._id;
      recipientEmail = recipientObject.email;
    } else {
      throw Error("Recipient email invalid");
    }
  }

  const transactionJSON = {
    createdBy,
    recipient,
    recipientEmail,
    typeOf,
    amount,
  };

  console.log(transactionJSON);

  const transaction = await Transaction.findOneAndUpdate(
    { _id: tID, createdBy: createdBy },
    { ...transactionJSON },
    { new: true, runValidators: true },
  );

  if (!transaction) {
    throw new Error(`No transaction with id=${tID} from user=${name} found`);
  }

  res.status(201).json({ transaction });
};

// TODO: Prevent deletion of submitted transactions
const deleteTransaction = async (req, res) => {
  const tID = req.params.id;
  const { name, userID } = req.user;
  const transaction = await Transaction.findByIdAndDelete({
    _id: tID,
    createdBy: userID,
  });
  if (!transaction) {
    throw new Error(`No transaction with id=${tID} from user=${name} found`);
  }
  res.status(201).json({ transaction });
};

// NOTE: Double submission is possible
const submitTransaction = async (req, res) => {
  const tID = req.params.id;
  const { name, userID } = req.user;
  const transaction = await Transaction.findOneAndUpdate(
    { _id: tID, createdBy: userID },
    { submitted: true },
    { new: true, runValidators: true },
  );
  if (!transaction) {
    throw new Error(`No transaction with id=${tID} from user=${name} found`);
  }

  let user = await User.findOne({ _id: userID });

  if (!user) {
    throw new Error(`User not found`);
  }

  // Apply transaction to user account
  if (transaction.typeOf === "deposit") {

    // Deposit funds to user balance
    user = await User.findOneAndUpdate(
      { _id: userID },
      { $inc: { balance: transaction.amount } },
      { new: true, runValidators: true },
    );
  } else if (transaction.typeOf === "withdrawal") {
    
    // Revert submission if withdrawal would cause an overdraft
    if (transaction.amount > user.balance) {
      await Transaction.findOneAndUpdate(
        { _id: tID, createdBy: userID },
        { submitted: false },
      );
      throw new Error(`Overdraft: Transaction declined`);
    }

    // Withdraw funds from user balance
    user = await User.findOneAndUpdate(
      { _id: userID },
      { $inc: { balance: -transaction.amount } },
      { new: true, runValidators: true },
    );
  } else if (transaction.typeOf === "transfer") {

    // Revert submission if transfer would cause an overdraft
    if (transaction.amount > user.balance) {
      await Transaction.findOneAndUpdate(
        { _id: tID, createdBy: userID },
        { submitted: false },
      );
      throw new Error(`Overdraft: Transaction declined`);
    }

    // Withdraw funds from user balance
    user = await User.findOneAndUpdate(
      { _id: userID },
      { $inc: { balance: -transaction.amount } },
      { new: true, runValidators: true },
    );

    // Transfer funds to recipient balance
    await User.findOneAndUpdate(
      { _id: transaction.recipient },
      { $inc: { balance: transaction.amount } },
      { new: true, runValidators: true },
    );
  }

  res.status(201).json({ message: "Transaction complete", newBalance: user.balance });
};

module.exports = {
  getAllTransactions,
  getUserInfo,
  getTransaction,
  createTransaction,
  editTransaction,
  deleteTransaction,
  submitTransaction,
};
