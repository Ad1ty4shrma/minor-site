// server.js

console.log("✅ Starting server...");

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // You might need path if not already required
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
console.log("Connecting to DB...");
connectDB();

const app = express();

// --- Middleware ---
// Enable CORS for all origins (adjust in production if needed)
app.use(cors());
// Parse JSON request bodies
app.use(express.json());
// Serve static files (like uploaded images) from the 'uploads' directory
// Ensure the 'uploads' directory exists at the project root where server.js is
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Use path.join for robustness

// --- API Routes ---
app.use('/api/users', require('./routes/userRoutes')); 
console.log(">>> Mounting API routes...");
// Base route for testing
app.get('/', (req, res) => {
  res.send('✅ Server is up and running!');
});

// Outpass routes
app.use('/api/outpass', require('./routes/outpassRoutes'));
console.log("    Mounted /api/outpass");

// Report routes <--- MAKE SURE THIS IS BEFORE THE 404 HANDLER
app.use('/api/reports', require('./routes/reportr'));
console.log("   Mounted /api/reports");

// --- Catch-all 404 Handler ---
// This should come AFTER all specific API routes
app.use((req, res, next) => { // Use next() if you might add error handling middleware later
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `❌ Route not found: ${req.method} ${req.originalUrl}` });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});