import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import patientsRouter from './routes/patients.js';
import doctorsRouter from './routes/doctors.js';
import appointmentsRouter from './routes/appointments.js';
import medicalRecordsRouter from './routes/medicalRecords.js';
import authRouter from './routes/auth.js';

dotenv.config();

//Connect to MongoDB
connectDB();

//Express setup
const app = express();

//Middleware
app.use(cors());
app.use(json());

//Routes
app.use('/api/patients', patientsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/medical-records', medicalRecordsRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});