import { Router } from 'express';
import * as donorController from '../controllers/donorController';

const router = Router();

router.post('/register', donorController.registerDonor);
router.get('/', donorController.getAllDonors);
router.get('/nearby', donorController.getDonorsNearLocation);
router.get('/:id', donorController.getDonorById);
router.put('/:id', donorController.updateDonor);
router.post('/:id/record-donation', donorController.recordDonation);

export default router;
