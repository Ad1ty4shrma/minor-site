const mongoose = require('mongoose');

const OutpassSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  reason: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  status: { type: String, default: 'Pending' }, // Options: Pending, Approved, Rejected
  createdAt: { type: Date, default: Date.now },
  image: { type: String }, // Path to the uploaded file
});

module.exports = mongoose.model('Outpass', OutpassSchema);
