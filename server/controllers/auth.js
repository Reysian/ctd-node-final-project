const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    console.log(req.body);
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(201).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new Error("Missing email");
  }
  if (!password) {
    throw new Error("Missing password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }

  const token = user.createJWT();
  res.status(200).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
