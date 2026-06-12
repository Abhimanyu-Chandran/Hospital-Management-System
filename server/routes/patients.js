import express from 'express';
import Patient from '../models/Patient.js';

const router = express.Router();

//GET all patients
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all patients');
        const patients = await Patient.find().sort({ createdAt: -1 });
        console.log(`Found ${patients.length} patients`);
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: error.message });
    }
});

//GET single patient
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//POST create patient
router.post('/', async (req, res) => {
    try {
        console.log('Creating patient with data:', req.body);
        const patient = new Patient(req.body);
        const savedPatient = await patient.save();
        console.log('Patient saved successfully:', savedPatient);
        res.status(201).json(savedPatient);
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(400).json({ message: error.message || 'Failed to create patient' });
    }
});

//PUT update patient
router.put('/:id', async (req, res) => {
    try {
        console.log('Updating patient:', req.params.id, 'with data:', req.body);
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        console.log('Patient updated successfully:', patient);
        res.json(patient);
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(400).json({ message: error.message || 'Failed to update patient' });
    }
});

//DELETE patient
router.delete('/:id', async (req, res) => {
    try {
        console.log('Deleting patient:', req.params.id);
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        console.log('Patient deleted successfully');
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;