import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  role: 'donor' | 'hospital' | 'admin';
  phone: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  bloodType?: string;
  donationCount: number;
  lastDonationDate?: Date;
  badges: string[];
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['donor', 'hospital', 'admin'],
      default: 'donor',
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      latitude: Number,
      longitude: Number,
    },
    bloodType: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    },
    donationCount: {
      type: Number,
      default: 0,
    },
    lastDonationDate: Date,
    badges: [
      {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password as string, salt);
    this.password = hashed;
    next();
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
