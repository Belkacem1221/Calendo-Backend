const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Cross-Origin Resource Sharing for API access
const dotenv = require('dotenv');
const bodyParser = require('body-parser'); // For parsing request bodies
const userRoutes = require('./src/routes/userRoutes'); // Import user routes
const authRoutes = require('./src/routes/authRoutes'); // Import auth routes
const teamRoutes = require('./src/routes/teamRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const eventRoutes = require('./src/routes/eventRoutes');

dotenv.config(); // Load environment variables from .env file

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies

// Database connection (MongoDB Atlas)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'Calendodb',
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
app.use('/api/auth', authRoutes); // Use the authentication routes
app.use('/api/teams', teamRoutes); // Use the teams routes
app.use('/api/notifications', notificationRoutes); // Use the notif routes
app.use('/api/events', eventRoutes); // Use the notif routes

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(500).json({ message: 'Internal Server Error' });
});

// Set up the server to listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
