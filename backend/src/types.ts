// Type definitions for LIFE-LINK
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Donor {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  bloodType: BloodType;
  location: Coordinates;
  isVerified: boolean;
  totalDonations: number;
  lastDonationDate?: Date;
  badges: BadgeType[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Hospital {
  _id?: string;
  name: string;
  location: Coordinates;
  email: string;
  phone: string;
  bloodInventory: BloodInventory;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BloodInventory {
  "O+": number;
  "O-": number;
  "A+": number;
  "A-": number;
  "B+": number;
  "B-": number;
  "AB+": number;
  "AB-": number;
}

export interface DonationRequest {
  _id?: string;
  hospitalId: string;
  bloodType: BloodType;
  unitsNeeded: number;
  urgency: "critical" | "high" | "medium" | "low";
  location: Coordinates;
  description: string;
  status: "active" | "fulfilled" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt?: Date;
}

export interface SOSAlert {
  _id?: string;
  donorId: string;
  location: Coordinates;
  radius: number; // in km
  timestamp: Date;
  message: string;
  recipients: string[]; // array of donor IDs who received the alert
  responses: SOSResponse[];
  expiresAt: Date;
}

export interface SOSResponse {
  donorId: string;
  status: "accepted" | "declined" | "no-response";
  respondedAt?: Date;
}

export type BloodType = "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-";
export type BadgeType = "Gold" | "Silver" | "Platinum" | "Lifesaver" | "FirstResponder";
export type UserRole = "donor" | "hospital" | "admin";
