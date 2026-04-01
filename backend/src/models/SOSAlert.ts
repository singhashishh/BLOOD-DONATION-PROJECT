import mongoose, { Schema, Document } from 'mongoose';

export interface ISOSAlert extends Document {
  donorId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  timestamp: Date;
  message: string;
  recipients: string[];
  responses: {
    donorId: string;
    status: 'accepted' | 'declined' | 'no-response';
    respondedAt?: Date;
  }[];
  expiresAt: Date;
}

const ResponseSchema = new Schema(
  {
    donorId: { type: String, required: true },
    status: {
      type: String,
      enum: ['accepted', 'declined', 'no-response'],
      default: 'no-response',
    },
    respondedAt: { type: Date },
  },
  { _id: false }
);

const SOSAlertSchema = new Schema<ISOSAlert>(
  {
    donorId: { type: String, required: true, index: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    radius: { type: Number, required: true, default: 5 }, // in km
    timestamp: { type: Date, required: true, default: Date.now },
    message: { type: String, required: true },
    recipients: [{ type: String }],
    responses: [ResponseSchema],
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

SOSAlertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ISOSAlert>('SOSAlert', SOSAlertSchema);
