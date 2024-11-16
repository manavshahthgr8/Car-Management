const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;


const bodyParser = require('body-parser');
const addCarRoutes = require('./backend/routes/auth'); // Adjust the path if needed

// Middleware

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use('/api', addCarRoutes); // Map `/api` to addCarRoutes

// Middleware
app.use(express.json());
app.use(cors());

// Example API Routes
const authRoutes = require('./backend/routes/auth');  // Make sure this path is correct
app.use('/api/auth', authRoutes);  // This will add '/api/auth' to the route

// Serve Frontend Files
app.use(express.static(path.join(__dirname, 'frontend')));

// Fallback Route to Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// ---------------------------------------------------------------------

//const authRoutes = require('./backend/routes/auth');  // Import the authentication routes
const carRoutes = require('./backend/routes/cars');  // Import the car routes

// Middleware setup
app.use(bodyParser.json());  // Parse JSON bodies
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());  // Enable Cross-Origin Resource Sharing

// API Routes
app.use('/api/auth', authRoutes);  // API route for authentication
app.use('/api/cars', carRoutes);  // API route for cars

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// Fallback route to serve index.html if no API match
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});