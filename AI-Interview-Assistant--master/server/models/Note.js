import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
      default: null,
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

export const Note = mongoose.model('Note', noteSchema);
