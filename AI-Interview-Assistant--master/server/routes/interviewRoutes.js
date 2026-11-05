import express from 'express';
import {
  createInterview,
  getInterviews,
  getInterviewById,
  deleteInterview,
  completeInterview,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createInterview)
  .get(getInterviews);

router.route('/:id')
  .get(getInterviewById)
  .delete(deleteInterview);

router.post('/:id/complete', completeInterview);

export default router;
