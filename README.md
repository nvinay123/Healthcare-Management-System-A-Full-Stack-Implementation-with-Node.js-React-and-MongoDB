# Healthcare-Management-System-A-Full-Stack-Implementation-with-Node.js-React-and-MongoDB

Setup Instructions ===>

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

Testing the Application

Patient Registration:
Go to the "Register Patient" page and register a new patient. Verify that the patient appears in the "Registered Patients" list.


Appointment Scheduling:
Schedule an appointment for a registered patient. Verify time conflict handling and success message.


Data Deletion:
Delete a patient or an appointment and confirm that the deletion works.
