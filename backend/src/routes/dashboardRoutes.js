import express from 'express';
const router = express.Router();
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

// GET /api/dashboard/stats
// This matches what the frontend is calling
router.get('/stats', protect, getDashboardStats);

export default router;