const User = require('../models/User');

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = new User({
      name,
      email,
      password, // Don't forget to hash the password before saving in production
      role
    });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};
