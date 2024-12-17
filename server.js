const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Cross-Origin Resource Sharing for API access
const dotenv = require('dotenv');
const bodyParser = require('body-parser'); // For parsing request bodies
const userRoutes = require('./src/routes/userRoutes'); // Import user routes

dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // To parse JSON request bodies

// Database connection (MongoDB Atlas)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'Calendodb'
    }); // Connect to MongoDB
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process with failure
  }
};

// Connect to the database
connectDB();

// Routes
app.use('/api/users', userRoutes); // Use the user-related routes

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Set up the server to listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
