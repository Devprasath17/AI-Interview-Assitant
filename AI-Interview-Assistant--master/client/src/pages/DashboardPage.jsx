import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get('/interviews');
        if (res.data && res.data.sessions) {
          setSessions(res.data.sessions);
        }
      } catch (err) {
        console.error('Error fetching dashboard sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalInterviews = sessions.length;
  const totalQuestions = sessions.reduce((acc, s) => acc + (s.totalQuestions || 0), 0);
  const avgScore = totalInterviews > 0
    ? Math.round(sessions.reduce((acc, s) => acc + (s.score || 80), 0) / totalInterviews)
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-md">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-on-surface-variant font-medium text-sm">Loading your interview dashboard...</p>
      </div>
    );
  }

  // EMPTY STATE: If no interviews created yet, render Stitch exact empty state
  if (totalInterviews === 0) {
    return (
      <div className="w-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-xl">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface font-bold">
              Welcome to AI Interview Coach, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1">
              Let's get you prepared for your next big opportunity.
            </p>
          </div>
        </header>

        {/* Stats Overview (Empty State) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-surface-variant flex items-center justify-between">
            <div>
              <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Interviews Completed
              </p>
              <p className="text-headline-lg font-headline-lg text-on-surface font-bold mt-sm">0</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">work_history</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-surface-variant flex items-center justify-between">
            <div>
              <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Average Score
              </p>
              <p className="text-headline-lg font-headline-lg text-on-surface font-bold mt-sm">--</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">grade</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-surface-variant flex items-center justify-between">
            <div>
              <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Questions Practiced
              </p>
              <p className="text-headline-lg font-headline-lg text-on-surface font-bold mt-sm">0</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">question_answer</span>
            </div>
          </div>
        </section>

        {/* Empty State Hero */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-xl flex flex-col items-center justify-center text-center min-h-[420px]">
          <div className="mb-lg w-28 h-28 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
          </div>
          <h3 className="text-headline-md font-headline-md font-bold text-on-surface mb-sm">
            Ready to ace your next interview?
          </h3>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-md mb-xl">
            You haven't completed any interviews yet. Start a mock interview to get personalized AI feedback on your performance, communication, and technical skills.
          </p>
          <button
            onClick={() => navigate('/interviews/create')}
            className="bg-primary-container text-on-primary font-label-md text-label-md py-md px-xl rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center gap-sm font-semibold"
          >
            <span className="material-symbols-outlined">play_arrow</span>
            Start Your First Interview
          </button>
        </section>
      </div>
    );
  }

  // POPULATED STATE: Exact Stitch Populated Dashboard Screen
  return (
    <div className="w-full">
      {/* Top Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-on-surface font-bold">
            Good Morning, {user?.name?.split(' ')[0] || 'Candidate'}! 👋
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">
            Ready for your next interview preparation session?
          </p>
        </div>
        <button
          onClick={() => navigate('/interviews/create')}
          className="bg-[#4F46E5] hover:bg-primary-container text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg transition-all shadow-sm ambient-shadow hover:-translate-y-0.5 flex items-center gap-xs font-semibold"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            play_arrow
          </span>
          Start Mock Interview
        </button>
      </header>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-md ambient-shadow hover:-translate-y-0.5 transition-transform flex flex-col justify-between h-full border border-outline-variant/30">
          <div className="flex justify-between items-center mb-sm">
            <span className="font-label-md text-label-md text-on-surface-variant">Interview Score</span>
            <span className="material-symbols-outlined text-primary">analytics</span>
          </div>
          <div className="flex items-end gap-sm mt-auto">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">{avgScore}%</span>
            <span className="font-label-sm text-label-sm text-tertiary mb-xs font-semibold">+6%</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-md ambient-shadow hover:-translate-y-0.5 transition-transform flex flex-col justify-between h-full border-l-4 border-[#4F46E5] border-y border-r border-outline-variant/30">
          <div className="flex justify-between items-center mb-sm">
            <span className="font-label-md text-label-md text-on-surface-variant">Interviews Completed</span>
            <span className="material-symbols-outlined text-secondary">videocam</span>
          </div>
          <div className="flex items-end gap-sm mt-auto">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">{totalInterviews}</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-md ambient-shadow hover:-translate-y-0.5 transition-transform flex flex-col justify-between h-full border-l-4 border-secondary border-y border-r border-outline-variant/30">
          <div className="flex justify-between items-center mb-sm">
            <span className="font-label-md text-label-md text-on-surface-variant">Questions Practiced</span>
            <span className="material-symbols-outlined text-tertiary-container">quiz</span>
          </div>
          <div className="flex items-end gap-sm mt-auto">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">{totalQuestions}</span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-md ambient-shadow hover:-translate-y-0.5 transition-transform flex flex-col justify-between h-full border border-outline-variant/30">
          <div className="flex justify-between items-center mb-sm">
            <span className="font-label-md text-label-md text-on-surface-variant">Current Streak</span>
            <span className="material-symbols-outlined text-error">local_fire_department</span>
          </div>
          <div className="flex items-end gap-sm mt-auto">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">7 Days</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mb-xs">🔥</span>
          </div>
        </div>
      </section>

      {/* Main Content Area: Skills & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-xl">
        {/* Your Skills Section */}
        <section className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow lg:col-span-1 border border-outline-variant/30">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md font-bold">Your Skills</h2>
          <div className="flex flex-col gap-md">
            <div>
              <div className="flex justify-between mb-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Technical Depth</span>
                <span className="font-label-sm text-label-sm text-on-surface font-bold">85%</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2">
                <div className="bg-gradient-to-r from-[#4F46E5] to-[#9333EA] h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Communication Clarity</span>
                <span className="font-label-sm text-label-sm text-on-surface font-bold">78%</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2">
                <div className="bg-gradient-to-r from-[#4F46E5] to-[#9333EA] h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant">System Architecture</span>
                <span className="font-label-sm text-label-sm text-on-surface font-bold">82%</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2">
                <div className="bg-gradient-to-r from-[#4F46E5] to-[#9333EA] h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Problem Solving</span>
                <span className="font-label-sm text-label-sm text-on-surface font-bold">88%</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2">
                <div className="bg-gradient-to-r from-[#4F46E5] to-[#9333EA] h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Chart Section */}
        <section className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow lg:col-span-2 relative overflow-hidden flex flex-col border border-outline-variant/30">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Interview Performance</h2>
            <button
              onClick={() => navigate('/performance')}
              className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold flex items-center gap-1"
            >
              <span>View Analytics</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="flex-1 w-full h-full min-h-[200px] relative mt-sm">
            <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 50">
              <line stroke="#F3F4F6" strokeWidth="0.5" x1="0" x2="100" y1="10" y2="10" />
              <line stroke="#F3F4F6" strokeWidth="0.5" x1="0" x2="100" y1="25" y2="25" />
              <line stroke="#F3F4F6" strokeWidth="0.5" x1="0" x2="100" y1="40" y2="40" />
              <path
                d="M0,40 Q10,30 20,35 T40,25 T60,15 T80,20 T100,5"
                fill="none"
                stroke="url(#lineGradient)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M0,40 Q10,30 20,35 T40,25 T60,15 T80,20 T100,5 L100,50 L0,50 Z"
                fill="url(#areaGradient)"
                opacity="0.5"
              />
              <defs>
                <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#9333EA" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F9FAFB" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 pb-1">
              <span className="font-label-sm text-[10px] text-outline">Session 1</span>
              <span className="font-label-sm text-[10px] text-outline">Session 2</span>
              <span className="font-label-sm text-[10px] text-outline">Session 3</span>
              <span className="font-label-sm text-[10px] text-outline">Session 4</span>
              <span className="font-label-sm text-[10px] text-outline">Latest</span>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Section: Recommended & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Recommended Practice */}
        <section className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
            <div className="bg-surface-container-lowest rounded-xl p-md ambient-shadow hover:-translate-y-0.5 transition-transform flex flex-col justify-between h-full border-l-4 border-[#4F46E5] border-y border-r border-outline-variant/30">
              <div>
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-sm">
                  <span className="material-symbols-outlined text-primary">code</span>
                </div>
                <h3 className="font-label-md text-label-md font-bold text-on-surface">System Architecture</h3>
                <p className="font-body-md text-label-sm text-on-surface-variant mt-xs line-clamp-2">
                  Focus on distributed caching, sharding, and resilience patterns.
                </p>
              </div>
              <button
                onClick={() => navigate('/interviews/create')}
                className="mt-md font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors flex items-center gap-xs font-semibold"
              >
                Start Module <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-md ambient-shadow hover:-translate-y-0.5 transition-transform flex flex-col justify-between h-full border-l-4 border-secondary border-y border-r border-outline-variant/30">
              <div>
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-sm">
                  <span className="material-symbols-outlined text-secondary">forum</span>
                </div>
                <h3 className="font-label-md text-label-md font-bold text-on-surface">Communication</h3>
                <p className="font-body-md text-label-sm text-on-surface-variant mt-xs line-clamp-2">
                  Improve clarity and conciseness in technical trade-off explanations.
                </p>
              </div>
              <button
                onClick={() => navigate('/interviews/create')}
                className="mt-md font-label-sm text-label-sm text-secondary hover:text-secondary-container transition-colors flex items-center gap-xs font-semibold"
              >
                Start Module <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-md ambient-shadow hover:-translate-y-0.5 transition-transform flex flex-col justify-between h-full border-l-4 border-tertiary-container border-y border-r border-outline-variant/30">
              <div>
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-sm">
                  <span className="material-symbols-outlined text-tertiary-container">psychology</span>
                </div>
                <h3 className="font-label-md text-label-md font-bold text-on-surface">HR & Behavioral</h3>
                <p className="font-body-md text-label-sm text-on-surface-variant mt-xs line-clamp-2">
                  Master behavioral questions using the structured STAR method.
                </p>
              </div>
              <button
                onClick={() => navigate('/interviews/create')}
                className="mt-md font-label-sm text-label-sm text-tertiary-container hover:text-tertiary transition-colors flex items-center gap-xs font-semibold"
              >
                Start Module <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow lg:col-span-1 border border-outline-variant/30">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md font-bold">Recent Sessions</h2>
          <div className="flex flex-col divide-y divide-[#F3F4F6]">
            {sessions.slice(0, 3).map((sess) => (
              <div
                key={sess._id}
                onClick={() => navigate(`/interviews/${sess._id}/practice`)}
                className="py-sm flex items-start gap-sm cursor-pointer hover:bg-surface-container-low px-1 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-xs">
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body-md text-[14px] text-on-surface font-semibold truncate">{sess.role}</p>
                  <p className="font-label-sm text-[11px] text-on-surface-variant">
                    {sess.difficulty} • {new Date(sess.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/history')}
            className="mt-md w-full font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors py-xs font-semibold"
          >
            View All Previous Sessions
          </button>
        </section>
      </div>
    </div>
  );
};
