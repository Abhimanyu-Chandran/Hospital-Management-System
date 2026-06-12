import { Schema, model } from 'mongoose';

const patientSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: false },
  address: { type: String, required: false },
  bloodGroup: { type: String, required: false },
  emergencyContact: { type: String, required: false },
  lastVisit: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default model('Patient', patientSchema);