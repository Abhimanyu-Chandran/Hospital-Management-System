import { Schema, model, Types } from 'mongoose';

const medicalRecordSchema = new Schema({
    patientId: { type: Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    recordType: {
        type: String,
        enum: ['Consultation', 'Lab Results', 'Imaging', 'Surgery Report', 'Prescription'],
        required: true,
    },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    prescription: [{
        medicine: { type: String, required: true },
        dosage: { type: String, required: true },
        duration: { type: String, required: true }
    }],
    notes: { type: String },
    followUpDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default model('MedicalRecord', medicalRecordSchema);