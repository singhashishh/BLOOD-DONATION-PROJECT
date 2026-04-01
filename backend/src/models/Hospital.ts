import mongoose, { Schema, Document } from 'mongoose';
import { BloodInventory } from '../types';

export interface IHospital extends Document {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  email: string;
  phone: string;
  bloodInventory: BloodInventory;
  createdAt: Date;
  updatedAt: Date;
}

const HospitalSchema = new Schema<IHospital>(
  {
    name: { type: String, required: true, trim: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    bloodInventory: {
      'O+': { type: Number, default: 0 },
      'O-': { type: Number, default: 0 },
      'A+': { type: Number, default: 0 },
      'A-': { type: Number, default: 0 },
      'B+': { type: Number, default: 0 },
      'B-': { type: Number, default: 0 },
      'AB+': { type: Number, default: 0 },
      'AB-': { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

HospitalSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

export default mongoose.model<IHospital>('Hospital', HospitalSchema);
