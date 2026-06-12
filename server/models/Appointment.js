import { Schema, model, Types } from 'mongoose';

const appointmentSchema = new Schema({
    // Keep references for relational integrity (optional because UI stores denormalized fields)
    patientId: { type: Types.ObjectId, ref: 'Patient', required: false },
    doctorId: { type: Types.ObjectId, ref: 'Doctor', required: false },

    // UI-friendly denormalized fields (saved in DB)
    patientName: { type: String, required: true },
    doctor: { type: String, required: true },
    department: { type: String, required: true },
    type: { type: String, required: true },

    // Scheduling
    date: { type: Date, required: true },
    time: { type: String, required: true },

    // Status values shown in UI
    status: {
        type: String,
        required: true,
        enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },

    // Additional details
    reason: { type: String, required: false },
    notes: { type: String },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default model('Appointment', appointmentSchema);