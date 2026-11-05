import { Question } from '../models/Question.js';
import { InterviewSession } from '../models/InterviewSession.js';
import { generateLearningBreakdown, generateQuestionsFromGemini, evaluateUserAnswer } from '../services/geminiService.js';

export const getLearningAssistant = async (req, res) => {
  try {
    const { questionId } = req.body;

    const question = await Question.findOne({
      _id: questionId,
      userId: req.user._id,
    }).populate('sessionId', 'role difficulty');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    // If already generated and cached on question, return it
    if (question.aiExplanation && question.aiExplanation.simpleExplanation) {
      return res.status(200).json({
        success: true,
        learning: question.aiExplanation,
        questionId: question._id,
      });
    }

    // Generate fresh breakdown via Gemini
    const learning = await generateLearningBreakdown({
      question: question.question,
      answer: question.answer,
      category: question.category,
      difficulty: question.difficulty,
      role: question.sessionId?.role || 'Software Engineer',
    });

    // Save breakdown to question document
    question.aiExplanation = learning;
    await question.save();

    res.status(200).json({
      success: true,
      learning,
      questionId: question._id,
    });
  } catch (error) {
    console.error('Learning assistant error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating learning breakdown.',
    });
  }
};

export const loadMoreQuestions = async (req, res) => {
  try {
    const { sessionId, count = 3 } = req.body;
    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const currentCount = await Question.countDocuments({ sessionId: session._id });

    const generated = await generateQuestionsFromGemini({
      role: session.role,
      experience: session.experience,
      topics: session.topics,
      difficulty: session.difficulty,
      description: session.description,
      count: Number(count) || 3,
    });

    const newQuestions = generated.map((q, idx) => ({
      sessionId: session._id,
      userId: req.user._id,
      question: q.question,
      answer: q.answer,
      category: q.category || session.topics[0] || 'Technical',
      difficulty: q.difficulty || session.difficulty,
      order: currentCount + idx + 1,
      isPinned: false,
      status: 'unanswered',
    }));

    const saved = await Question.insertMany(newQuestions);

    res.status(201).json({
      success: true,
      message: 'Added new questions to session.',
      questions: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating more questions.',
    });
  }
};

export const evaluateAnswer = async (req, res) => {
  try {
    const { question, expectedAnswer, userAnswer, role } = req.body;
    const evaluation = await evaluateUserAnswer({
      question,
      expectedAnswer,
      userAnswer,
      role: role || 'Software Engineer',
    });

    res.status(200).json({
      success: true,
      evaluation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error evaluating answer.',
    });
  }
};
