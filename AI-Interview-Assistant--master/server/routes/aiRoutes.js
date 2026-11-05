import express from 'express';
import {
  getLearningAssistant,
  loadMoreQuestions,
  evaluateAnswer,
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/learn', getLearningAssistant);
router.post('/load-more', loadMoreQuestions);
router.post('/evaluate', evaluateAnswer);

export default router;
