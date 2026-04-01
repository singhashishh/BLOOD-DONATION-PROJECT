import { Request, Response } from 'express';
import DonationRequest from '../models/DonationRequest';

// Create donation request
export const createDonationRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hospitalId, bloodType, unitsNeeded, urgency, location, description } = req.body;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // expires in 24 hours

    const donationRequest = new DonationRequest({
      hospitalId,
      bloodType,
      unitsNeeded,
      urgency,
      location,
      description,
      status: 'active',
      expiresAt,
    });

    await donationRequest.save();

    res.status(201).json({
      message: 'Donation request created successfully',
      donationRequest,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create donation request' });
  }
};

// Get all active donation requests
export const getActiveDonationRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await DonationRequest.find({ status: 'active' }).lean();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donation requests' });
  }
};

// Get donation request by ID
export const getDonationRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const request = await DonationRequest.findById(req.params.id).lean();

    if (!request) {
      res.status(404).json({ error: 'Donation request not found' });
      return;
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donation request' });
  }
};

// Update donation request status
export const updateDonationRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'fulfilled', 'cancelled'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const request = await DonationRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!request) {
      res.status(404).json({ error: 'Donation request not found' });
      return;
    }

    res.status(200).json({
      message: 'Donation request updated successfully',
      donationRequest: request,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update donation request' });
  }
};

// Delete donation request
export const deleteDonationRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const request = await DonationRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      res.status(404).json({ error: 'Donation request not found' });
      return;
    }

    res.status(200).json({
      message: 'Donation request deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete donation request' });
  }
};
