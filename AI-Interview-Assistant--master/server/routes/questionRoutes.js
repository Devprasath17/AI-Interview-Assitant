import express from 'express';
import {
  getQuestionsBySession,
  getQuestionById,
  togglePinQuestion,
  getPinnedQuestions,
  submitAnswer,
} from '../controllers/questionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/pinned', getPinnedQuestions);
router.get('/session/:sessionId', getQuestionsBySession);
router.get('/:id', getQuestionById);
router.patch('/:id/pin', togglePinQuestion);
router.post('/:id/answer', submitAnswer);

export default router;
