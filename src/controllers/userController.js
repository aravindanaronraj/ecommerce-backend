const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "staff"].includes(role)) {
      return res.status(400).json({ message: "Role must be user or staff" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Admin roles cannot be changed here" });

    user.role = role;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, shippingAddress } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: "user", shippingAddress });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, shippingAddress: user.shippingAddress, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, shippingAddress: user.shippingAddress, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginUser, getUsers, registerUser, updateUserRole };
