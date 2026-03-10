const User = require("../models/User");
const jwt = require("jsonwebtoken");
const CustomError = require("../errors/custom-error");

// register a new user
const register = async (req, res) => {
  console.log(req.body);
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(201).json({ user: { name: user.name }, token });
};

// login an existing user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new CustomError(400, "Missing email");
  }
  if (!password) {
    throw new CustomError(400, "Missing password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError(401, "Invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError(401, "Invalid credentials");
  }

  const token = user.createJWT();
  res.status(200).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
