import { Note } from '../models/Note.js';

export const addNote = async (req, res) => {
  try {
    const { questionId, sessionId, content } = req.body;

    if (!questionId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Question ID and note content are required.',
      });
    }

    const note = await Note.create({
      userId: req.user._id,
      questionId,
      sessionId: sessionId || null,
      content,
    });

    res.status(201).json({
      success: true,
      message: 'Note saved successfully.',
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error saving note.',
    });
  }
};

export const getNotesByQuestion = async (req, res) => {
  try {
    const notes = await Note.find({
      questionId: req.params.questionId,
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching notes.',
    });
  }
};

export const getAllUserNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id })
      .populate('questionId', 'question category difficulty')
      .populate('sessionId', 'role difficulty')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching all notes.',
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { content },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Note updated successfully.',
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating note.',
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting note.',
    });
  }
};
