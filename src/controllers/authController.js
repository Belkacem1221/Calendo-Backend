const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create a new user with the hashed password (handled by the pre-save hook)
      const newUser = new User({ name, email, password });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  };
  
  exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email' });
      }
  
      // Compare the input password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      res.json({ message: 'Login successful', user });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  };
  
// Logout user
exports.logoutUser = (req, res) => {
  // For logout, token is removed client-side, e.g., from localStorage or cookies
  res.json({ message: 'User logged out successfully' });
};
