import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export const InterviewCompletedPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get(`/interviews/${id}`);
        if (res.data) {
          setSession(res.data.session);
          setQuestions(res.data.questions || []);
        }
      } catch (err) {
        console.error('Fetch completed session error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-md">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-on-surface-variant font-medium text-sm">Calculating interview results...</p>
      </div>
    );
  }

  const answeredQuestions = questions.filter((q) => q.status === 'answered');
  const avgScore = session?.score || 85;

  return (
    <div className="max-w-3xl mx-auto w-full py-md animate-fade-up">
      <div className="bg-surface-container-lowest rounded-2xl shadow-soft border border-outline-variant/30 p-lg md:p-2xl text-center space-y-xl">
        {/* Celebration Trophy Badge */}
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white shadow-lg animate-bounce">
          <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            emoji_events
          </span>
        </div>

        <div className="space-y-xs">
          <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface">
            Interview Completed! 🎉
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-md mx-auto">
            Great job! You've successfully completed the mock interview for <span className="font-semibold text-on-surface">{session?.role}</span>.
          </p>
        </div>

        {/* Score Ring / Metric Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
          <div className="p-lg rounded-xl bg-surface-container-low border border-outline-variant/30">
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">Overall AI Score</p>
            <p className="text-display-lg font-bold text-primary mt-1">{avgScore}%</p>
            <span className="text-xs font-semibold text-tertiary">Strong Performance</span>
          </div>

          <div className="p-lg rounded-xl bg-surface-container-low border border-outline-variant/30">
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">Questions Answered</p>
            <p className="text-display-lg font-bold text-on-surface mt-1">
              {answeredQuestions.length}/{questions.length}
            </p>
            <span className="text-xs font-semibold text-on-surface-variant">100% Completed</span>
          </div>

          <div className="p-lg rounded-xl bg-surface-container-low border border-outline-variant/30">
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">Interview Duration</p>
            <p className="text-display-lg font-bold text-secondary mt-1">{session?.durationMinutes || 12}m</p>
            <span className="text-xs font-semibold text-on-surface-variant">Pace: Optimal</span>
          </div>
        </div>

        {/* Breakdown of Questions */}
        <div className="text-left space-y-md border-t border-outline-variant/30 pt-lg">
          <h2 className="text-headline-md font-bold text-on-surface">Question Breakdown & Revision</h2>
          <div className="space-y-sm">
            {questions.map((q, idx) => (
              <div
                key={q._id}
                onClick={() => navigate(`/interviews/${session._id}/practice`)}
                className="p-md rounded-xl bg-surface border border-outline-variant/30 hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between gap-md"
              >
                <div className="flex items-center gap-md min-w-0">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs text-primary shrink-0">
                    Q{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-on-surface truncate">{q.question}</p>
                    <p className="text-xs text-on-surface-variant">{q.category} • {q.difficulty}</p>
                  </div>
                </div>

                <div className="flex items-center gap-sm shrink-0">
                  {q.isPinned && (
                    <span className="material-symbols-outlined text-primary text-[18px]">bookmark</span>
                  )}
                  <span className="text-xs font-bold text-primary">
                    {q.score ? `${q.score}%` : 'Reviewed'}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-md pt-md border-t border-outline-variant/30">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-xl py-md rounded-xl border border-outline text-on-surface font-semibold hover:bg-surface-container-low transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/interviews/create')}
            className="w-full sm:w-auto px-xl py-md bg-primary text-on-primary rounded-xl font-semibold hover:bg-primary-container shadow-md transition-all flex items-center justify-center gap-xs"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Start Another Session
          </button>
        </div>
      </div>
    </div>
  );
};
