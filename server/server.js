import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import patientsRouter from './routes/patients.js';
import doctorsRouter from './routes/doctors.js';
import appointmentsRouter from './routes/appointments.js';
import medicalRecordsRouter from './routes/medicalRecords.js';

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

// SPA fallback (so hard-refresh on /patients, /doctors, etc. still loads the React app)
// IMPORTANT: keep this after /api/* routes so API calls still return JSON.
app.use((req, res, next) => {
    // Only handle non-API GET requests (SPA navigation)
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api/')) return next();

    // Serve React/Vite index.html for client-side routes.
    return res.sendFile(new URL('../index.html', import.meta.url).pathname);
});

// Error handling middleware
app.use((err, req, res, _next) => { // eslint-disable-line no-unused-vars
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
