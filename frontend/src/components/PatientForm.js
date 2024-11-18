import React, { useState, useEffect } from 'react';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    healthConcerns: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patients');
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Patient registered successfully!');
        setFormData({ name: '', email: '', contact: '', healthConcerns: '' });
        fetchPatients();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error registering patient');
      }
    } catch (err) {
      setError('Error connecting to the server.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient? This will also delete all associated appointments.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${patientId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Patient deleted successfully!');
          fetchPatients();
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Error deleting patient');
        }
      } catch (err) {
        setError('Error connecting to the server.');
        console.error(err);
      }
    }
  };

  return (
    <div className="page-container bg-gray-50" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <div className="content-grid">
        {/* Registration Form Section */}
        <div className="form-section">
          <div className="registration-card" style={{ animation: 'fadeIn 0.6s ease-out 0.2s', animationFillMode: 'backwards' }}>
            <h2 className="section-title">
              Register Patient
            </h2>
            
            {error && (
              <div className="error-message" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                ⚠️ {error}
              </div>
            )}
            
            {success && (
              <div className="success-message" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                ✅ {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-group">
                <label className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input hover:border-primary focus:ring-2 focus:ring-primary/20"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter patient name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-input hover:border-primary focus:ring-2 focus:ring-primary/20"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Contact
                </label>
                <input
                  type="tel"
                  name="contact"
                  className="form-input hover:border-primary focus:ring-2 focus:ring-primary/20"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="Enter contact number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Health Concerns
                </label>
                <textarea
                  name="healthConcerns"
                  className="form-textarea hover:border-primary focus:ring-2 focus:ring-primary/20"
                  value={formData.healthConcerns}
                  onChange={handleChange}
                  placeholder="Describe any health concerns"
                  rows="4"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary relative"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="loading-spinner">
                    Registering...
                  </div>
                ) : (
                  'Register Patient'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Patient List Section */}
        <div className="list-section">
          <div className="patient-list-card" style={{ animation: 'fadeIn 0.6s ease-out 0.4s', animationFillMode: 'backwards' }}>
            <h2 className="section-title">
              Registered Patients
            </h2>
            
            {loading ? (
              <div className="loading-spinner">
                Loading patients...
              </div>
            ) : (
              <div className="patient-list">
                {patients.length === 0 ? (
                  <div className="no-patients">
                    <p>No patients registered yet.</p>
                  </div>
                ) : (
                  patients.map((patient, index) => (
                    <div 
                      key={patient._id} 
                      className="patient-item hover:bg-gray-50 transition-all"
                      style={{ 
                        animation: `fadeIn 0.5s ease-out ${0.1 * (index + 1)}s`,
                        animationFillMode: 'backwards'
                      }}
                    >
                      <div className="patient-info">
                        <div className="patient-name">
                          {patient.name}
                        </div>
                        <div className="patient-details">
                          <span>{patient.email}</span>
                          <span>{patient.contact}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(patient._id)}
                        className="btn btn-danger hover:bg-red-600 transition-colors"
                        aria-label="Delete patient"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;