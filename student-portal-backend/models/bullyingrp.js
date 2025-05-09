// student-portal-backend/models/BullyingReport.js
const mongoose = require('mongoose');

const BullyingReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false // Assuming name might be optional for anonymity
  },
  rollno: {
    type: String,
    required: false // Assuming roll number might be optional
  },
  room: {
    type: String,
    required: [true, 'Room number is required'] // Match HTML 'required'
  },
  year: {
    type: String,
    required: [true, 'College year is required'] // Match HTML 'required'
  },
  hostel: {
    type: String,
    required: [true, 'Hostel number is required'] // Match HTML 'required'
  },
  description: {
    type: String,
    required: [true, 'Description of the incident is required'] // Match HTML 'required'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Optional: You might add a status field later (e.g., 'Received', 'Investigating')
  // status: { type: String, default: 'Received' }
});

module.exports = mongoose.model('BullyingReport', BullyingReportSchema);