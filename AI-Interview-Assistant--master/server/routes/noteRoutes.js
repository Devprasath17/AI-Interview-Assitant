import express from 'express';
import {
  addNote,
  getNotesByQuestion,
  getAllUserNotes,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(addNote)
  .get(getAllUserNotes);

router.get('/question/:questionId', getNotesByQuestion);

router.route('/:id')
  .put(updateNote)
  .delete(deleteNote);

export default router;
