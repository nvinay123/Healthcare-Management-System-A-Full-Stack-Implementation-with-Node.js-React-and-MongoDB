import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PatientForm from './components/PatientForm';
import AppointmentForm from './components/AppointmentForm';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<PatientForm />} />
          <Route path="/schedule" element={<AppointmentForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;