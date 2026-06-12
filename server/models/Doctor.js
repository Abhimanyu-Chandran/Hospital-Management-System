import { Schema, model } from 'mongoose';

const doctorSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    qualification: { type: String, required: true },
    availability: [{
        status: {
            type: String,
            required: true,
            enum: ['Available', 'Busy', 'On Leave']
        }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default model('Doctor', doctorSchema);