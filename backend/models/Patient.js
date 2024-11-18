const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  healthConcerns: { type: String },
});

module.exports = mongoose.model('Patient', patientSchema);
