const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');

const app = express();

// CORS middleware should be before any routes
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// MongoDB Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/healthcare', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// GET all patients route
app.get('/api/patients', async (req, res) => {
  try {
    console.log('GET /api/patients request received'); // Debug log
    const patients = await Patient.find({});
    console.log('Patients found:', patients); // Debug log
    res.status(200).json(patients);
  } catch (err) {
    console.error('Error fetching patients:', err); // Debug log
    res.status(500).json({ error: err.message });
  }
});

// Create a new patient
app.post('/api/patients', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    const savedPatient = await patient.save();
    
    // Log new patient registration
    console.log('\n=== New Patient Registered ===');
    console.log('Name:', savedPatient.name);
    console.log('Email:', savedPatient.email);
    console.log('Contact:', savedPatient.contact);
    console.log('Health Concerns:', savedPatient.healthConcerns || 'None');
    console.log('Patient ID:', savedPatient._id);
    console.log('============================\n');
    
    res.status(201).json(savedPatient);
  } catch (err) {
    if (err.code === 11000) {
      console.error('Duplicate email error:', err);
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error('Error creating patient:', err);
      res.status(400).json({ error: err.message });
    }
  }
});

// Check for appointment conflicts
app.post('/api/appointments/check-conflict', async (req, res) => {
  try {
    const { doctor, date, time } = req.body;
    
    // Convert date and time to a comparable format
    const appointmentDate = new Date(date);
    const startOfDay = new Date(appointmentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(appointmentDate.setHours(23, 59, 59, 999));

    // Check for existing appointments
    const existingAppointment = await Appointment.findOne({
      doctor: doctor,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      time: time,
      status: { $ne: 'Cancelled' } // Ignore cancelled appointments
    });

    if (existingAppointment) {
      res.status(409).json({
        conflict: true,
        message: 'This time slot is already booked for the selected doctor.'
      });
    } else {
      res.status(200).json({ conflict: false });
    }
  } catch (err) {
    console.error('Error checking appointment conflicts:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create an appointment with conflict checking
app.post('/api/appointments', async (req, res) => {
  try {
    // Check for conflicts first
    const { doctor, date, time } = req.body;
    const appointmentDate = new Date(date);
    const startOfDay = new Date(appointmentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(appointmentDate.setHours(23, 59, 59, 999));

    const existingAppointment = await Appointment.findOne({
      doctor: doctor,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      time: time,
      status: { $ne: 'Cancelled' }
    });

    if (existingAppointment) {
      return res.status(409).json({
        error: 'This time slot is already booked for the selected doctor.'
      });
    }

    // If no conflict, create the appointment
    const appointment = new Appointment(req.body);
    const savedAppointment = await appointment.save();
    
    // Fetch patient details for logging
    const patient = await Patient.findById(req.body.patientId);
    
    // Create detailed log message
    console.log('\n=== New Appointment Scheduled ===');
    console.log('Patient Name:', patient.name);
    console.log('Patient Email:', patient.email);
    console.log('Doctor:', req.body.doctor);
    console.log('Date:', new Date(req.body.date).toLocaleDateString());
    console.log('Time:', req.body.time);
    console.log('Status:', savedAppointment.status);
    console.log('Appointment ID:', savedAppointment._id);
    console.log('================================\n');

    res.status(201).json(savedAppointment);
  } catch (err) {
    console.error('Error scheduling appointment:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patientId');
    console.log('Fetched appointments:', appointments.length);
    res.status(200).json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    // First delete all appointments associated with this patient
    await Appointment.deleteMany({ patientId: req.params.id });
    // Then delete the patient
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient and associated appointments deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});