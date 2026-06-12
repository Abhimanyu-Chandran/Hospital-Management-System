import express from 'express';
import Doctor from '../models/Doctor.js';

const router = express.Router();

//GET All Doctors
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all doctors');
        const doctors = await Doctor.find().sort({ createdAt: -1 });
        console.log(`Found ${doctors.length} doctors`);
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: error.message });
    }
});

//GET Single Doctor
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//POST Create Doctor
router.post('/', async (req, res) => {
    try {
        console.log('Creating doctor with data:', req.body);
        const doctor = new Doctor(req.body);
        const savedDoctor = await doctor.save();
        console.log('Doctor saved successfully:', savedDoctor);
        res.status(201).json(savedDoctor);
    } catch (error) {
        console.error('Error creating doctor:', error);
        res.status(400).json({ message: error.message || 'Failed to create doctor' });
    }
});

//PUT Update Doctor
router.put('/:id', async (req, res) => {
    try {
        console.log('Updating doctor:', req.params.id, 'with data:', req.body);
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        console.log('Doctor updated successfully:', doctor);
        res.json(doctor);
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(400).json({ message: error.message || 'Failed to update doctor' });
    }
});

//DELETE Doctor
router.delete('/:id', async (req, res) => {
    try {
        console.log('Deleting doctor:', req.params.id);
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        console.log('Doctor deleted successfully');
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;

