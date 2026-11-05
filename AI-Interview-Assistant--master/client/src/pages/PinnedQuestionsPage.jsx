import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AILearningDrawer } from '../components/common/AILearningDrawer';

export const PinnedQuestionsPage = () => {
  const navigate = useNavigate();
  const [pinnedQuestions, setPinnedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [learningDrawerOpen, setLearningDrawerOpen] = useState(false);
  const [learningData, setLearningData] = useState(null);
  const [loadingLearning, setLoadingLearning] = useState(false);

  useEffect(() => {
    fetchPinned();
  }, []);

  const fetchPinned = async () => {
    try {
      const res = await API.get('/questions/pinned');
      if (res.data && res.data.questions) {
        setPinnedQuestions(res.data.questions);
      }
    } catch (err) {
      console.error('Error fetching pinned questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnpin = async (id, e) => {
    e.stopPropagation();
    try {
      await API.patch(`/questions/${id}/pin`);
      setPinnedQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error('Unpin error:', err);
    }
  };

  const handleOpenLearnMore = async (q, e) => {
    e.stopPropagation();
    setSelectedQuestion(q);
    setLearningDrawerOpen(true);
    setLoadingLearning(true);
    setLearningData(null);

    try {
      const res = await API.post('/ai/learn', { questionId: q._id });
      if (res.data && res.data.learning) {
        setLearningData(res.data.learning);
      }
    } catch (err) {
      console.error('Learning breakdown error:', err);
    } finally {
      setLoadingLearning(false);
    }
  };

  return (
    <div className="w-full space-y-lg">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-md">
        <div>
          <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">
            Pinned Questions & Revision Bank
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-xs max-w-2xl">
            Questions you have bookmarked for high-priority study and revision before real-world interview rounds.
          </p>
        </div>
        <button
          onClick={() => navigate('/practice')}
          className="px-lg py-sm bg-primary-container text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:bg-surface-tint transition-all shadow-sm flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-sm">quiz</span>
          Browse Question Bank
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-md">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-on-surface-variant text-sm font-medium">Loading pinned questions...</p>
        </div>
      ) : pinnedQuestions.length === 0 ? (
        <div className="bg-surface-container-lowest p-xl rounded-2xl border border-outline-variant/30 text-center py-20 space-y-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">bookmark_border</span>
          </div>
          <h3 className="text-headline-md font-bold text-on-surface">No Pinned Questions Yet</h3>
          <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
            While practicing mock interviews, click the bookmark icon on any challenging question to save it here for fast revision.
          </p>
          <button
            onClick={() => navigate('/interviews/create')}
            className="px-lg py-sm bg-primary text-white rounded-xl font-semibold shadow-sm hover:bg-primary-container transition-all"
          >
            Start Practice Session
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {pinnedQuestions.map((q) => (
            <div
              key={q._id}
              onClick={() => q.sessionId && navigate(`/interviews/${q.sessionId._id || q.sessionId}/practice`)}
              className="bg-surface-container-lowest rounded-xl p-lg shadow-card hover:shadow-card-hover border border-outline-variant/30 hover:-translate-y-1 transition-all flex flex-col justify-between cursor-pointer space-y-md"
            >
              <div className="space-y-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-xs">
                    <span className="px-sm py-0.5 rounded-md bg-secondary/10 text-secondary text-[11px] font-bold uppercase">
                      {q.category || 'Technical'}
                    </span>
                    <span className="px-sm py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-[11px] font-bold uppercase">
                      {q.difficulty || 'Intermediate'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleUnpin(q._id, e)}
                    title="Unpin Question"
                    className="p-1 rounded-md text-primary hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      bookmark
                    </span>
                  </button>
                </div>

                <h3 className="text-headline-md font-headline-md font-bold text-on-surface line-clamp-2">
                  {q.question}
                </h3>

                <p className="text-body-md text-on-surface-variant text-sm line-clamp-3">
                  {q.answer}
                </p>
              </div>

              <div className="border-t border-outline-variant/30 pt-md flex items-center justify-between">
                <button
                  onClick={(e) => handleOpenLearnMore(q, e)}
                  className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span>AI Breakdown</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (q.sessionId) navigate(`/interviews/${q.sessionId._id || q.sessionId}/practice`);
                  }}
                  className="px-md py-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-white transition-colors text-xs font-bold flex items-center gap-1"
                >
                  <span>Practice</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AILearningDrawer
        isOpen={learningDrawerOpen}
        onClose={() => setLearningDrawerOpen(false)}
        question={selectedQuestion}
        learning={learningData}
        loading={loadingLearning}
      />
    </div>
  );
};
