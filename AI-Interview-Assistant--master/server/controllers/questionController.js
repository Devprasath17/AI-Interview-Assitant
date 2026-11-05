import { Question } from '../models/Question.js';
import { Note } from '../models/Note.js';
import { User } from '../models/User.js';
import { evaluateUserAnswer } from '../services/geminiService.js';

export const getQuestionsBySession = async (req, res) => {
  try {
    const questions = await Question.find({
      sessionId: req.params.sessionId,
      userId: req.user._id,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching questions.',
    });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('sessionId', 'role experience difficulty topics');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    const notes = await Note.find({
      questionId: question._id,
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      question,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching question.',
    });
  }
};

export const togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(200).json({
      success: true,
      message: question.isPinned ? 'Question pinned to revision list.' : 'Question unpinned.',
      isPinned: question.isPinned,
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error toggling pin status.',
    });
  }
};

export const getPinnedQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      userId: req.user._id,
      isPinned: true,
    })
      .populate('sessionId', 'role difficulty createdAt')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching pinned questions.',
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { userAnswer } = req.body;
    const question = await Question.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('sessionId', 'role experience');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    // Evaluate answer with Gemini
    const evaluation = await evaluateUserAnswer({
      question: question.question,
      expectedAnswer: question.answer,
      userAnswer: userAnswer || '',
      role: question.sessionId?.role || 'Software Engineer',
    });

    question.userAnswer = userAnswer;
    question.status = 'answered';
    question.score = evaluation.score;
    question.feedback = {
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      scoreExplanation: evaluation.scoreExplanation,
    };

    await question.save();

    // Increment user answered questions count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.questionsAnswered': 1 },
    });

    res.status(200).json({
      success: true,
      message: 'Answer submitted and evaluated.',
      question,
      evaluation,
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error evaluating answer.',
    });
  }
};
