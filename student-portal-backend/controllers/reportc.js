// student-portal-backend/controllers/reportController.js
const BullyingReport = require('../models/bullyingrp');

// Submit a new bullying report
exports.submitReport = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, rollno, room, year, hostel, description } = req.body;

    // Basic validation (Mongoose schema handles most required fields)
    if (!description || !room || !year || !hostel) {
       // This check is slightly redundant due to schema but good practice
       return res.status(400).json({ message: 'Missing required report fields (room, year, hostel, description).' });
    }

    // Create a new report instance
    const newReport = new BullyingReport({
      name,       // Will be null/undefined if not provided
      rollno,     // Will be null/undefined if not provided
      room,
      year,
      hostel,
      description
    });

    // Save the report to the database
    await newReport.save();

    // Send success response
    res.status(201).json({ message: 'Report submitted successfully.', report: newReport });

  } catch (error) {
    console.error('Error submitting report:', error);
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    // Generic server error
    res.status(500).json({ message: 'Server error while submitting report.', error: error.message });
  }
};


// Get all bullying reports
exports.getAllReports = async (req, res) => {
  console.log(`ROUTE: /api/reports (GET) - START - ${new Date().toISOString()}`);
  try {
    console.log(`DB: Finding all bullying reports... - ${new Date().toISOString()}`);
    // Sort by newest first
    const reports = await BullyingReport.find().sort({ createdAt: -1 });
    console.log(`DB: Found ${reports.length} reports. - ${new Date().toISOString()}`);

    console.log(`RESPONSE: Sending 200 response... - ${new Date().toISOString()}`);
    res.status(200).json(reports);
    console.log(`RESPONSE: Sent 200. - ${new Date().toISOString()}`);
  } catch (error) {
    console.error(`ERROR in /api/reports (GET): ${error.message} - ${new Date().toISOString()}`, error.stack);
    res.status(500).json({ message: 'Server error fetching reports', error: error.message });
  }
};

