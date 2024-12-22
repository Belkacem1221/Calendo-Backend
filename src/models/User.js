const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

// Hash password before saving user document
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10); // 10 salt rounds
      this.password = await bcrypt.hash(this.password, salt);
      next(); // Proceed with saving the user
    } catch (err) {
      next(err); // Handle errors
    }
  } else {
    next(); // Proceed if password is not modified
  }
});

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
