import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  getUserById,
} from '../controllers/authController';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateProfile);
router.get('/user/:id', authMiddleware, getUserById);

export default router;
