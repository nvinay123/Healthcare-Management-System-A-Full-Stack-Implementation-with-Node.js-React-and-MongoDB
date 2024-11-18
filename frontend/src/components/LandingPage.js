import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to Healthcare Management System</h1>
        <p>Choose an option to proceed:</p>
        
        <div className="landing-buttons">
          <button 
            className="landing-button"
            onClick={() => navigate('/register')}
          >
            Register New Patient
          </button>
          
          <button 
            className="landing-button"
            onClick={() => navigate('/schedule')}
          >
            Schedule Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;