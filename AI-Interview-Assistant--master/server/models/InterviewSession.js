import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: [true, 'Target role is required'],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, 'Years of experience is required'],
    },
    topics: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    description: {
      type: String,
      default: '',
    },
    questionCount: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'completed'],
      default: 'in_progress',
    },
    score: {
      type: Number,
      default: 0,
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
    feedbackSummary: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
