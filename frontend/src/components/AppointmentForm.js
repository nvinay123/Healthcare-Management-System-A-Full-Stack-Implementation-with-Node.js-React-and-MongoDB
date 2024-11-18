import React, { useState, useEffect } from 'react';

const AppointmentForm = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctor: '',
    date: '',
    time: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [patientsResponse, appointmentsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/patients'),
          fetch('http://localhost:5000/api/appointments')
        ]);

        if (!patientsResponse.ok || !appointmentsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const patientsData = await patientsResponse.json();
        const appointmentsData = await appointmentsResponse.json();

        if (Array.isArray(patientsData) && Array.isArray(appointmentsData)) {
          setPatients(patientsData);
          setAppointments(appointmentsData);
        } else {
          throw new Error('Received invalid data format');
        }
      } catch (err) {
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // First check for conflicts
      const checkResponse = await fetch('http://localhost:5000/api/appointments/check-conflict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor: formData.doctor,
          date: new Date(formData.date).toISOString(),
          time: formData.time,
        }),
      });

      const checkData = await checkResponse.json();

      if (checkResponse.status === 409) {
        setError(`${checkData.message} Please choose a different time slot or doctor.`);
        return;
      }

      // If no conflict, proceed with appointment creation
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Appointment scheduled successfully!');
        setFormData({ patientId: '', doctor: '', date: '', time: '' });
        // Refresh appointments list
        const updatedAppointments = await fetch('http://localhost:5000/api/appointments').then(res => res.json());
        setAppointments(updatedAppointments);
      } else {
        throw new Error(data.error || 'Failed to schedule appointment');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Appointment deleted successfully!');
          // Update appointments list
          setAppointments(appointments.filter(apt => apt._id !== appointmentId));
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete appointment');
        }
      } catch (err) {
        setError(`Error deleting appointment: ${err.message}`);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="form-card loading-spinner">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="content-grid">
        {/* Appointment Booking Form Section */}
        <div className="form-section">
          <div className="form-card">
            <h2>Schedule Appointment</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {patients.length === 0 && !loading && !error && (
              <div className="warning-message">
                No patients found. Please register a patient first.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Select Patient</label>
                <select
                  name="patientId"
                  className="form-select"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a patient</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} - {patient.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Doctor</label>
                <select
                  name="doctor"
                  className="form-select"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a doctor</option>
                  <option value="Dr. Smith">Dr. Smith</option>
                  <option value="Dr. Johnson">Dr. Johnson</option>
                  <option value="Dr. Williams">Dr. Williams</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Appointment Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Appointment Time</label>
                <input
                  type="time"
                  name="time"
                  className="form-input"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Schedule Appointment
              </button>
            </form>
          </div>
        </div>

        {/* Appointments List Section */}
        <div className="list-section">
          <div className="form-card">
            <h2>Scheduled Appointments</h2>
            {appointments.length === 0 ? (
              <div className="no-appointments">No appointments scheduled yet.</div>
            ) : (
              <div className="appointment-list">
                {appointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-item">
                    <div className="appointment-info">
                      <div className="appointment-header">
                        <span className="patient-name">
                          {appointment.patientId?.name || 'Unknown Patient'}
                        </span>
                        <span className="appointment-doctor">{appointment.doctor}</span>
                      </div>
                      <div className="appointment-details">
                        <span>{formatDate(appointment.date)}</span>
                        <span>{appointment.time}</span>
                        <span className={`appointment-status status-${appointment.status.toLowerCase()}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAppointment(appointment._id)}
                      className="btn btn-danger"
                      aria-label="Delete appointment"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;