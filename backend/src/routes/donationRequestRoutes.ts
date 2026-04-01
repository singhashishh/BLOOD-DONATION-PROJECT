import { Router } from 'express';
import * as donationController from '../controllers/donationRequestController';

const router = Router();

router.post('/create', donationController.createDonationRequest);
router.get('/active', donationController.getActiveDonationRequests);
router.get('/:id', donationController.getDonationRequestById);
router.put('/:id/status', donationController.updateDonationRequestStatus);
router.delete('/:id', donationController.deleteDonationRequest);

export default router;
