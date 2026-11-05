import { InterviewSession } from '../models/InterviewSession.js';
import { Question } from '../models/Question.js';
import { Note } from '../models/Note.js';
import { User } from '../models/User.js';
import { generateQuestionsFromGemini } from '../services/geminiService.js';

export const createInterview = async (req, res) => {
  let session = null;
  try {
    const { role, experience, topics, difficulty, description, questionCount = 5 } = req.body;

    if (!role || !experience) {
      return res.status(400).json({
        success: false,
        message: 'Target role and experience level are required.',
      });
    }

    // 1. Create Interview Session Document
    session = await InterviewSession.create({
      userId: req.user._id,
      role,
      experience,
      topics: Array.isArray(topics) ? topics : (topics ? [topics] : []),
      difficulty: difficulty || 'Intermediate',
      description: description || '',
      questionCount: Number(questionCount) || 5,
      status: 'in_progress',
    });

    // 2. Generate Questions via Gemini API
    const generatedQuestions = await generateQuestionsFromGemini({
      role,
      experience,
      topics: session.topics,
      difficulty: session.difficulty,
      description: session.description,
      count: session.questionCount,
    });

    // 3. Save Questions in MongoDB
    const questionsToInsert = generatedQuestions.map((q, idx) => ({
      sessionId: session._id,
      userId: req.user._id,
      question: q.question,
      answer: q.answer,
      evaluationFocus: q.evaluationFocus || '',
      category: q.category || session.topics[0] || 'Technical',
      difficulty: q.difficulty || session.difficulty,
      order: idx + 1,
      isPinned: false,
      status: 'unanswered',
    }));

    const savedQuestions = await Question.insertMany(questionsToInsert);

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.interviewsCompleted': 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Interview session created successfully.',
      session,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error('Create interview error:', error);
    if (session && session._id) {
      await InterviewSession.findByIdAndDelete(session._id).catch(() => {});
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating questions with Gemini API.',
    });
  }
};

export const getInterviews = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Attach question counts and progress
    const sessionsWithDetails = await Promise.all(
      sessions.map(async (sess) => {
        const questions = await Question.find({ sessionId: sess._id }).lean();
        const answeredCount = questions.filter((q) => q.status === 'answered' || q.status === 'reviewed').length;
        const pinnedCount = questions.filter((q) => q.isPinned).length;
        return {
          ...sess,
          totalQuestions: questions.length,
          answeredQuestions: answeredCount,
          pinnedQuestions: pinnedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      sessions: sessionsWithDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching interview sessions.',
    });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    const questions = await Question.find({ sessionId: session._id }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      session,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching interview session.',
    });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const session = await InterviewSession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    // Delete associated questions and notes
    await Question.deleteMany({ sessionId: session._id });
    await Note.deleteMany({ sessionId: session._id });

    res.status(200).json({
      success: true,
      message: 'Interview session deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting interview session.',
    });
  }
};

export const completeInterview = async (req, res) => {
  try {
    const { score, durationMinutes, feedbackSummary } = req.body;
    const session = await InterviewSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        status: 'completed',
        score: score || 85,
        durationMinutes: durationMinutes || 15,
        feedbackSummary: feedbackSummary || 'Interview completed successfully.',
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Interview marked as completed.',
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error completing interview.',
    });
  }
};
