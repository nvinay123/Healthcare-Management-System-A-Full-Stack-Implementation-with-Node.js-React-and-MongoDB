# Healthcare-Management-System-A-Full-Stack-Implementation-with-Node.js-React-and-MongoDB

**Setup Instructions** ===>

Backend:

Install Dependencies:
Navigate to the backend directory (where server.js is located) and run
This installs dependencies like express, mongoose, and cors.


npm install


Start MongoDB:
Start your local MongoDB server. Alternatively, use a MongoDB cloud service like MongoDB Atlas.


mongod

Run the Server:
Start the backend server. The server will run on http://localhost:5000.

node server.js


Frontend:

Install Dependencies:
Navigate to the React app directory and install dependencies:

npm install

Start the React App:
Run the application:

npm start


The app will be available at http://localhost:3000.

-----------------

**Testing the Application** ==>

Patient Registration:
Go to the "Register Patient" page and register a new patient. Verify that the patient appears in the "Registered Patients" list.


Appointment Scheduling:
Schedule an appointment for a registered patient. Verify time conflict handling and success message.

Data Deletion:
Delete a patient or an appointment and confirm that the deletion works.

------------------
**Files Working**

1. Server.js ==>
The backend implementation is responsible for database management, utilizing MongoDB with Mongoose to handle two collections: patients and appointments. It supports full CRUD (Create, Read, Update, Delete) operations for managing patient and appointment data. The API endpoints include /api/patients, which allows fetching all patients (GET), registering a new patient with duplicate email checks (POST), and removing a patient along with their associated appointments (DELETE). Similarly, the /api/appointments endpoint supports fetching all appointments with populated patient details (GET), creating a new appointment with conflict checking (POST), verifying doctor time slot availability (POST /check-conflict), and deleting an appointment (DELETE). Middleware such as cors is configured to permit requests from the React app hosted on localhost:3000, and express.json parses incoming JSON payloads.

2. Navbar.js ==>
Navigation bar with links to "Register Patient" and "Schedule Appointment."
3. LandingPage.js ==>
A simple welcome page with buttons for patient registration and appointment scheduling.
5. PatientForm.js ==>
Handles Patient registration via a form. Displays registered patients in a list. Deletes patients, along with their appointments, upon confirmation.
7. AppointmentForm.js ==>
Scheduling new appointments. Displays existing appointments with patient and doctor details. Deletes specific appointments.




<img width="1091" alt="Screenshot 2024-11-18 164711" src="https://github.com/user-attachments/assets/5f93ab45-4fe6-4ceb-9615-8aab31f3cf12">


<img width="1103" alt="Screenshot 2024-11-18 164737" src="https://github.com/user-attachments/assets/4ceb7e15-deb9-4419-be39-4b20f45a1c5c">


<img width="1102" alt="Screenshot 2024-11-18 164805" src="https://github.com/user-attachments/assets/d8d65a5c-676b-4a76-a43d-33220cc7b524">



