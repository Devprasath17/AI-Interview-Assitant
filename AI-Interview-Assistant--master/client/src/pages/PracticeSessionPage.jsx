import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AILearningDrawer } from '../components/common/AILearningDrawer';

export const PracticeSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // AI Learning Assistant Drawer state
  const [learningDrawerOpen, setLearningDrawerOpen] = useState(false);
  const [learningData, setLearningData] = useState(null);
  const [loadingLearning, setLoadingLearning] = useState(false);

  // Note Modal state
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [notes, setNotes] = useState([]);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await API.get(`/interviews/${id}`);
        if (res.data) {
          setSession(res.data.session);
          setQuestions(res.data.questions || []);
          if (res.data.questions && res.data.questions.length > 0) {
            setUserAnswer(res.data.questions[0].userAnswer || '');
            if (res.data.questions[0].feedback?.scoreExplanation) {
              setEvaluation({
                score: res.data.questions[0].score,
                strengths: res.data.questions[0].feedback.strengths,
                improvements: res.data.questions[0].feedback.improvements,
                scoreExplanation: res.data.questions[0].feedback.scoreExplanation,
              });
            }
          }
        }
      } catch (err) {
        console.error('Fetch session error:', err);
        setError('Failed to load interview session.');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  const handleSelectQuestion = (index) => {
    setCurrentIndex(index);
    setShowModelAnswer(false);
    const q = questions[index];
    setUserAnswer(q.userAnswer || '');
    if (q.feedback?.scoreExplanation) {
      setEvaluation({
        score: q.score,
        strengths: q.feedback.strengths,
        improvements: q.feedback.improvements,
        scoreExplanation: q.feedback.scoreExplanation,
      });
    } else {
      setEvaluation(null);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQ || !userAnswer.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await API.post(`/questions/${currentQ._id}/answer`, {
        userAnswer,
      });

      if (res.data && res.data.question) {
        // update questions state
        const updated = [...questions];
        updated[currentIndex] = res.data.question;
        setQuestions(updated);
        setEvaluation(res.data.evaluation);
      }
    } catch (err) {
      console.error('Submit answer error:', err);
      setError('Error submitting answer for AI evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePin = async () => {
    if (!currentQ) return;
    try {
      const res = await API.patch(`/questions/${currentQ._id}/pin`);
      if (res.data) {
        const updated = [...questions];
        updated[currentIndex].isPinned = res.data.isPinned;
        setQuestions(updated);
      }
    } catch (err) {
      console.error('Toggle pin error:', err);
    }
  };

  const handleOpenLearnMore = async () => {
    if (!currentQ) return;
    setLearningDrawerOpen(true);
    setLoadingLearning(true);
    setLearningData(null);

    try {
      const res = await API.post('/ai/learn', {
        questionId: currentQ._id,
      });
      if (res.data && res.data.learning) {
        setLearningData(res.data.learning);
      }
    } catch (err) {
      console.error('Learning breakdown error:', err);
    } finally {
      setLoadingLearning(false);
    }
  };

  const handleSaveNote = async () => {
    if (!currentQ || !noteContent.trim()) return;
    setSavingNote(true);

    try {
      const res = await API.post('/notes', {
        questionId: currentQ._id,
        sessionId: session._id,
        content: noteContent,
      });
      if (res.data && res.data.note) {
        setNotes([res.data.note, ...notes]);
        setNoteContent('');
        setNoteModalOpen(false);
      }
    } catch (err) {
      console.error('Save note error:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleFinishInterview = async () => {
    try {
      const answeredCount = questions.filter((q) => q.status === 'answered').length;
      const calculatedScore = answeredCount > 0
        ? Math.round(questions.reduce((acc, q) => acc + (q.score || 75), 0) / answeredCount)
        : 85;

      await API.post(`/interviews/${id}/complete`, {
        score: calculatedScore,
        durationMinutes: Math.max(1, Math.round(timerSeconds / 60)),
      });

      navigate(`/interviews/${id}/completed`);
    } catch (err) {
      console.error('Complete interview error:', err);
      navigate(`/interviews/${id}/completed`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-md">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-on-surface-variant font-medium text-sm">Preparing your AI interview session...</p>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="text-center py-16">
        <p className="text-on-surface-variant mb-md">No questions found in this session.</p>
        <button onClick={() => navigate('/interviews/create')} className="px-lg py-sm bg-primary text-white rounded-lg">
          Create New Session
        </button>
      </div>
    );
  }

  const answeredCount = questions.filter((q) => q.status === 'answered').length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="max-w-5xl mx-auto w-full space-y-lg">
      {/* Top Session Progress Bar & Meta */}
      <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md">
        <div className="flex items-center gap-md">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              videocam
            </span>
          </div>
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-on-surface">{session?.role}</h1>
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              {session?.experience} • {session?.difficulty} • {questions.length} Questions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-lg w-full sm:w-auto justify-between sm:justify-end">
          {/* Live Timer */}
          <div className="flex items-center gap-xs text-on-surface font-mono font-bold text-sm bg-surface-container-low px-md py-1.5 rounded-lg border border-outline-variant/40">
            <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <button
            onClick={handleFinishInterview}
            className="px-md py-1.5 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white font-label-md text-label-md transition-colors font-semibold"
          >
            Finish Interview
          </button>
        </div>
      </div>

      {/* Progress Dots / Question Navigator */}
      <div className="flex items-center gap-sm overflow-x-auto no-scrollbar py-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = q.status === 'answered';
          return (
            <button
              key={q._id}
              onClick={() => handleSelectQuestion(idx)}
              className={`flex items-center gap-xs px-md py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                isCurrent
                  ? 'bg-primary-container text-on-primary shadow-md scale-105'
                  : isAnswered
                  ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                  : 'bg-surface-container-low text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container-high'
              }`}
            >
              <span>Q{idx + 1}</span>
              {q.isPinned && <span className="material-symbols-outlined text-[14px]">bookmark</span>}
              {isAnswered && <span className="material-symbols-outlined text-[14px]">check</span>}
            </button>
          );
        })}
      </div>

      {/* Main Question Workspace Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-lg md:p-xl shadow-soft border border-outline-variant/30 space-y-lg relative">
        {/* Header Badges & Pin Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-xs">
            <span className="px-sm py-1 rounded-md text-xs font-semibold bg-surface-container-high text-primary">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="px-sm py-1 rounded-md text-xs font-semibold bg-secondary/10 text-secondary">
              {currentQ.category || 'General'}
            </span>
            <span className="px-sm py-1 rounded-md text-xs font-semibold bg-surface-container-low text-on-surface-variant">
              {currentQ.difficulty || 'Intermediate'}
            </span>
            <button
              type="button"
              onClick={() => setShowModelAnswer((prev) => !prev)}
              className="flex items-center gap-xs px-sm py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
              title="View Gemini AI Topic Primer and Model Answer"
            >
              <span className="material-symbols-outlined text-[16px]">help_outline</span>
              <span>{showModelAnswer ? 'Hide Topic Primer' : 'View Topic Primer'}</span>
            </button>
          </div>

          <div className="flex items-center gap-xs">
            <button
              onClick={handleTogglePin}
              title={currentQ.isPinned ? 'Unpin Question' : 'Pin Question for Revision'}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${
                currentQ.isPinned
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={currentQ.isPinned ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                bookmark
              </span>
              <span>{currentQ.isPinned ? 'Pinned' : 'Pin'}</span>
            </button>

            <button
              onClick={() => setNoteModalOpen(true)}
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
              <span>Add Note</span>
            </button>

            <button
              onClick={handleOpenLearnMore}
              className="px-md py-1.5 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Learn More</span>
            </button>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="space-y-xs">
          <h2 className="text-headline-lg md:text-display-lg text-on-surface font-bold leading-snug">
            {currentQ.question}
          </h2>
        </div>

        {/* Evaluation Focus (As in mockup) */}
        {currentQ.evaluationFocus && (
          <div className="p-md rounded-xl bg-surface-container-low border border-primary/20 flex items-start gap-sm">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
              psychology
            </span>
            <div className="text-body-sm font-body-sm text-on-surface">
              <span className="font-bold text-primary mr-1">Evaluation Focus:</span>
              <span className="text-on-surface-variant">{currentQ.evaluationFocus}</span>
            </div>
          </div>
        )}

        {/* Topic Primer & AI Model Answer Panel */}
        {showModelAnswer && (
          <div className="p-lg rounded-xl bg-surface-container-low border border-primary/30 space-y-md animate-fade-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-[22px]">auto_awesome</span>
                <h3 className="font-bold text-on-surface text-base">Gemini AI Model Answer & Topic Primer</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModelAnswer(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed bg-surface-container-lowest p-md rounded-lg border border-outline-variant/30">
              {currentQ.answer}
            </div>
          </div>
        )}

        {/* Candidate Answer Box */}
        <div className="space-y-xs">
          <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
            <span>Your Technical Formulation:</span>
            <span className="text-xs font-normal text-on-surface-variant">
              {userAnswer.length} / 2000 characters • {userAnswer.split(/\s+/).filter(Boolean).length} words
            </span>
          </label>
          <textarea
            rows={7}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Structure your spoken or written answer methodically: declaration semantics, runtime mechanics, and clean code best practices..."
            className="w-full bg-surface-bright border border-outline-variant rounded-xl p-md font-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y"
          />
        </div>

        {error && (
          <div className="p-sm bg-error-container/30 border border-error/30 rounded-lg text-error text-label-sm font-medium">
            {error}
          </div>
        )}

        {/* Submit & Next Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-md pt-sm border-t border-outline-variant/30">
          <div className="flex items-center gap-sm">
            <button
              disabled={currentIndex === 0}
              onClick={() => handleSelectQuestion(currentIndex - 1)}
              className="px-lg py-sm rounded-xl border border-outline text-on-surface text-label-md font-semibold hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Previous Question
            </button>

            {userAnswer.trim() && (
              <button
                type="button"
                onClick={() => setUserAnswer('')}
                className="px-md py-sm rounded-xl border border-outline-variant text-on-surface-variant hover:text-error hover:border-error/40 transition-colors text-label-sm font-semibold flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Clear Draft</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-sm w-full sm:w-auto">
            <button
              disabled={submitting || !userAnswer.trim()}
              onClick={handleSubmitAnswer}
              className="flex-1 sm:flex-initial px-xl py-sm bg-primary-container text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:bg-surface-tint shadow-sm transition-all flex items-center justify-center gap-xs disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Submit for Evaluation</span>
                </>
              )}
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => handleSelectQuestion(currentIndex + 1)}
                className="flex-1 sm:flex-initial px-xl py-sm bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:bg-surface-tint shadow-sm transition-all flex items-center justify-center gap-xs"
              >
                <span>Next</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={handleFinishInterview}
                className="flex-1 sm:flex-initial px-xl py-sm bg-tertiary-container text-white rounded-xl font-label-md text-label-md font-semibold hover:opacity-90 shadow-sm transition-all flex items-center justify-center gap-xs"
              >
                <span>Complete Interview</span>
                <span className="material-symbols-outlined text-[18px]">emoji_events</span>
              </button>
            )}
          </div>
        </div>

        {/* AI Evaluation Card (When answered) */}
        {evaluation && (
          <div className="mt-xl p-lg rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-md animate-fade-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {evaluation.score}%
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-base">Gemini Bar-Raiser Feedback</h3>
                  <p className="text-xs text-on-surface-variant">Instant AI performance critique</p>
                </div>
              </div>
              <span className={`px-sm py-1 rounded-full text-xs font-bold ${
                evaluation.score >= 80 ? 'bg-[#ecfdf5] text-[#065f46]' : 'bg-[#fff7ed] text-[#c2410c]'
              }`}>
                {evaluation.score >= 80 ? 'Strong Hire' : 'Needs Practice'}
              </span>
            </div>

            <p className="text-body-md text-[14px] text-on-surface leading-relaxed">
              {evaluation.scoreExplanation}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-xs">
              <div className="p-md rounded-lg bg-surface-container-lowest border border-[#a7f3d0]/60 space-y-xs">
                <h4 className="font-semibold text-xs text-[#065f46] uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                  Key Strengths
                </h4>
                <ul className="text-xs space-y-1 text-on-surface">
                  {evaluation.strengths?.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-[#065f46]">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-md rounded-lg bg-surface-container-lowest border border-[#fed7aa]/60 space-y-xs">
                <h4 className="font-semibold text-xs text-[#c2410c] uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  Areas for Improvement
                </h4>
                <ul className="text-xs space-y-1 text-on-surface">
                  {evaluation.improvements?.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-[#c2410c]">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Model Benchmark Answer Dropdown */}
            <details className="mt-md p-md rounded-lg bg-surface-container-lowest border border-outline-variant/30 cursor-pointer">
              <summary className="font-semibold text-sm text-primary flex items-center gap-1 select-none">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>View Standard Model Answer</span>
              </summary>
              <div className="mt-md text-sm text-on-surface whitespace-pre-wrap leading-relaxed border-t border-outline-variant/20 pt-md">
                {currentQ.answer}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* AI Learning Assistant Drawer */}
      <AILearningDrawer
        isOpen={learningDrawerOpen}
        onClose={() => setLearningDrawerOpen(false)}
        question={currentQ}
        learning={learningData}
        loading={loadingLearning}
        onAddNote={() => setNoteModalOpen(true)}
      />

      {/* Add Note Modal */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-lg shadow-2xl border border-outline-variant/40 space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-headline-md font-headline-md font-bold text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">edit_note</span>
                Add Personal Note
              </h3>
              <button onClick={() => setNoteModalOpen(false)} className="text-on-surface-variant p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Save key insights, reminder tips, or code snippets for: "{currentQ.question}"
            </p>

            <textarea
              rows={5}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your personal study note here..."
              className="w-full bg-surface-bright border border-outline-variant rounded-xl p-md text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex items-center justify-end gap-sm pt-xs">
              <button
                onClick={() => setNoteModalOpen(false)}
                className="px-md py-sm rounded-lg border border-outline text-sm font-semibold text-on-surface"
              >
                Cancel
              </button>
              <button
                disabled={savingNote || !noteContent.trim()}
                onClick={handleSaveNote}
                className="px-lg py-sm bg-primary-container text-on-primary rounded-lg text-sm font-semibold hover:bg-surface-tint disabled:opacity-50"
              >
                {savingNote ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
