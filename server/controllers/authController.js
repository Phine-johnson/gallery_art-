const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER A NEW DESIGNER
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if the email is already in use
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new account
    user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'designer' // Defaults to designer so they show up in 'Hire'
    });

    await user.save();

    // Create a token so they are logged in immediately after signing up
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, fullName, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// LOGIN EXISTING USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare the provided password with the hashed one in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Provide a new session token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, fullName: user.fullName, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};