import mongoose, { Schema, Document } from 'mongoose';
import { BloodType, BadgeType } from '../types';

export interface IDonor extends Document {
  name: string;
  email: string;
  phone: string;
  bloodType: BloodType;
  location: {
    latitude: number;
    longitude: number;
  };
  isVerified: boolean;
  totalDonations: number;
  lastDonationDate?: Date;
  badges: BadgeType[];
  createdAt: Date;
  updatedAt: Date;
}

const DonorSchema = new Schema<IDonor>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    bloodType: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      required: true,
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    isVerified: { type: Boolean, default: false },
    totalDonations: { type: Number, default: 0 },
    lastDonationDate: { type: Date },
    badges: [
      {
        type: String,
        enum: ['Gold', 'Silver', 'Platinum', 'Lifesaver', 'FirstResponder'],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IDonor>('Donor', DonorSchema);
