import mongoose, { Schema, Document } from 'mongoose';
import { BloodType } from '../types';

export interface IDonationRequest extends Document {
  hospitalId: string;
  bloodType: BloodType;
  unitsNeeded: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  status: 'active' | 'fulfilled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const DonationRequestSchema = new Schema<IDonationRequest>(
  {
    hospitalId: { type: String, required: true, index: true },
    bloodType: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      required: true,
    },
    unitsNeeded: { type: Number, required: true, min: 1 },
    urgency: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'high',
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'fulfilled', 'cancelled'],
      default: 'active',
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

DonationRequestSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
DonationRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IDonationRequest>('DonationRequest', DonationRequestSchema);
