import express from 'express';
import MedicalRecord from '../models/MedicalRecord.js';

const router = express.Router();

//GET all medical records
router.get('/', async (req, res) => {
    try {
        const records = await MedicalRecord.find()
            .populate('patientId', 'firstName lastName email')
            .populate('doctorId', 'firstName lastName specialization')
            .sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//GET single medical record
router.get('/:id', async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id)
            .populate('patientId', 'firstName lastName email')
            .populate('doctorId', 'firstName lastName specialization');
        if (!record) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//POST create medical record
router.post('/', async (req, res) => {
    try {
        const record = new MedicalRecord(req.body);
        const savedRecord = await record.save();
        res.status(201).json(savedRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//PUT update medical record
router.put('/:id', async (req, res) => {
    try {
        const record = await MedicalRecord.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!record) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//DELETE medical record
router.delete('/:id', async (req, res) => {
    try {
        const record = await MedicalRecord.findByIdAndDelete(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.json({ message: 'Medical record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;