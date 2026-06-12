import { Schema, model, Types } from 'mongoose';

const appointmentSchema = new Schema({
    patientId: { type: Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
    reason: { type: String, required: true },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default model('Appointment', appointmentSchema);