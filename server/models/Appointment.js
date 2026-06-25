import { Schema, model, Types } from 'mongoose';

const appointmentSchema = new Schema({
    patientId: { type: Types.ObjectId, ref: 'Patient', required: false },
    doctorId: { type: Types.ObjectId, ref: 'Doctor', required: false },
    patientName: { type: String, required: true },
    doctor: { type: String, required: true },
    department: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    reason: { type: String, required: false },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default model('Appointment', appointmentSchema);