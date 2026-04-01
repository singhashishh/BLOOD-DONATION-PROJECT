import { Request, Response } from 'express';
import Donor from '../models/Donor';
import { getDistance } from 'geolib';

// Register donor
export const registerDonor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, bloodType, location } = req.body;

    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      res.status(400).json({ error: 'Donor already exists' });
      return;
    }

    const donor = new Donor({
      name,
      email,
      phone,
      bloodType,
      location,
      isVerified: false,
      totalDonations: 0,
      badges: [],
    });

    await donor.save();

    res.status(201).json({
      message: 'Donor registered successfully',
      donor,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register donor' });
  }
};

// Get all donors
export const getAllDonors = async (req: Request, res: Response): Promise<void> => {
  try {
    const donors = await Donor.find().lean();
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donors' });
  }
};

// Get donor by ID
export const getDonorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const donor = await Donor.findById(req.params.id).lean();

    if (!donor) {
      res.status(404).json({ error: 'Donor not found' });
      return;
    }

    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donor' });
  }
};

// Get donors near location (within 5km)
export const getDonorsNearLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      res.status(400).json({ error: 'Latitude and longitude required' });
      return;
    }

    const donors = await Donor.find().lean();

    const filteredDonors = donors.filter((donor) => {
      const distance = getDistance(
        { latitude: Number(latitude), longitude: Number(longitude) },
        { latitude: donor.location.latitude, longitude: donor.location.longitude }
      );

      return distance <= Number(radius) * 1000; // convert km to meters
    });

    res.status(200).json(filteredDonors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby donors' });
  }
};

// Update donor
export const updateDonor = async (req: Request, res: Response): Promise<void> => {
  try {
    const donorId = req.params.id;
    const updateData = req.body;

    const donor = await Donor.findByIdAndUpdate(donorId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!donor) {
      res.status(404).json({ error: 'Donor not found' });
      return;
    }

    res.status(200).json({
      message: 'Donor updated successfully',
      donor,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update donor' });
  }
};

// Record donation
export const recordDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const donorId = req.params.id;

    const donor = await Donor.findById(donorId);

    if (!donor) {
      res.status(404).json({ error: 'Donor not found' });
      return;
    }

    donor.totalDonations += 1;
    donor.lastDonationDate = new Date();

    // Award badges
    if (donor.totalDonations === 1 && !donor.badges.includes('Lifesaver')) {
      donor.badges.push('Lifesaver');
    }
    if (donor.totalDonations >= 5 && !donor.badges.includes('Gold')) {
      donor.badges.push('Gold');
    }
    if (donor.totalDonations >= 3 && !donor.badges.includes('Silver')) {
      donor.badges.push('Silver');
    }
    if (donor.totalDonations >= 10 && !donor.badges.includes('Platinum')) {
      donor.badges.push('Platinum');
    }

    await donor.save();

    res.status(200).json({
      message: 'Donation recorded successfully',
      donor,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record donation' });
  }
};
