import mongoose from 'mongoose';

const aiExplanationSchema = new mongoose.Schema({
  simpleExplanation: { type: String, default: '' },
  realWorldExample: { type: String, default: '' },
  interviewTip: { type: String, default: '' },
  commonMistake: { type: String, default: '' },
  keyTakeaways: { type: [String], default: [] },
}, { _id: false });

const questionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    evaluationFocus: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    order: {
      type: Number,
      default: 1,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    userAnswer: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['unanswered', 'answered', 'reviewed'],
      default: 'unanswered',
    },
    score: {
      type: Number,
      default: null,
    },
    feedback: {
      strengths: { type: [String], default: [] },
      improvements: { type: [String], default: [] },
      scoreExplanation: { type: String, default: '' },
    },
    aiExplanation: {
      type: aiExplanationSchema,
      default: null,
    },
  },
  { timestamps: true }
);

export const Question = mongoose.model('Question', questionSchema);
