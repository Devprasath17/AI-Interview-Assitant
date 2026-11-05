import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export const CreateSessionPage = () => {
  const navigate = useNavigate();
  const [interviewType, setInterviewType] = useState('technical');
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [customRole, setCustomRole] = useState('');
  const [experience, setExperience] = useState('3-5 years');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [numQuestions, setNumQuestions] = useState(5);
  const [topics, setTopics] = useState('Data Structures, System Design, REST APIs');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const finalRole = targetRole === 'custom' ? customRole : targetRole;
      const topicsList = topics
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await API.post('/interviews', {
        role: finalRole,
        experience,
        topics: topicsList.length > 0 ? topicsList : [interviewType],
        difficulty,
        description: `${interviewType} interview. ${description}`.trim(),
        questionCount: numQuestions,
      });

      if (res.data && res.data.session) {
        navigate(`/interviews/${res.data.session._id}`);
      }
    } catch (err) {
      console.error('Create interview error:', err);
      setError(err.response?.data?.message || err.message || 'Error generating interview session. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-xl">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-xs ai-gradient-text font-bold">
          Generate AI Interview Questions
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Select your target role and experience level. Gemini AI will dynamically generate customized interview questions and model answers.
        </p>
      </div>

      {loading && (
        <div className="mb-lg p-md bg-primary/10 border border-primary/30 rounded-xl text-primary text-label-md font-medium flex items-center gap-md">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin shrink-0" />
          <span>Gemini AI is analyzing your role and crafting customized interview questions... Please wait a few seconds.</span>
        </div>
      )}

      {error && (
        <div className="mb-lg p-md bg-error-container/30 border border-error/30 rounded-xl text-error text-label-sm font-medium flex items-center gap-sm">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Configuration Form */}
      <div className="bg-surface-container-lowest rounded-xl p-lg card-shadow glass-panel relative overflow-hidden border border-outline-variant/30">
        {/* Decorative AI Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-container rounded-full blur-3xl opacity-20 pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-xl relative z-10">
          {/* 1. Select Interview Type */}
          <div>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-md font-bold">
              1. Select Interview Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {/* Technical */}
              <label className="cursor-pointer group relative">
                <input
                  type="radio"
                  name="interview_type"
                  value="technical"
                  checked={interviewType === 'technical'}
                  onChange={() => setInterviewType('technical')}
                  className="peer sr-only"
                />
                <div className="p-md rounded-xl border border-outline-variant bg-surface-bright peer-checked:border-primary peer-checked:bg-surface-container-low transition-all h-full flex flex-col items-start gap-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center peer-checked:bg-primary-container transition-colors">
                    <span className="material-symbols-outlined text-primary peer-checked:text-on-primary">code</span>
                  </div>
                  <div>
                    <h3 className="text-label-md font-label-md font-semibold text-on-surface peer-checked:text-primary">
                      Technical
                    </h3>
                    <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">
                      Focus on algorithms, system architecture, and domain-specific code.
                    </p>
                  </div>
                </div>
                {interviewType === 'technical' && (
                  <div className="absolute top-md right-md">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                )}
              </label>

              {/* HR / Culture Fit */}
              <label className="cursor-pointer group relative">
                <input
                  type="radio"
                  name="interview_type"
                  value="hr"
                  checked={interviewType === 'hr'}
                  onChange={() => setInterviewType('hr')}
                  className="peer sr-only"
                />
                <div className="p-md rounded-xl border border-outline-variant bg-surface-bright peer-checked:border-primary peer-checked:bg-surface-container-low transition-all h-full flex flex-col items-start gap-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center peer-checked:bg-primary-container transition-colors">
                    <span className="material-symbols-outlined text-primary peer-checked:text-on-primary">group</span>
                  </div>
                  <div>
                    <h3 className="text-label-md font-label-md font-semibold text-on-surface peer-checked:text-primary">
                      HR / Culture Fit
                    </h3>
                    <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">
                      Questions about your background, career motivations, and company alignment.
                    </p>
                  </div>
                </div>
                {interviewType === 'hr' && (
                  <div className="absolute top-md right-md">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                )}
              </label>

              {/* Behavioral */}
              <label className="cursor-pointer group relative">
                <input
                  type="radio"
                  name="interview_type"
                  value="behavioral"
                  checked={interviewType === 'behavioral'}
                  onChange={() => setInterviewType('behavioral')}
                  className="peer sr-only"
                />
                <div className="p-md rounded-xl border border-outline-variant bg-surface-bright peer-checked:border-primary peer-checked:bg-surface-container-low transition-all h-full flex flex-col items-start gap-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center peer-checked:bg-primary-container transition-colors">
                    <span className="material-symbols-outlined text-primary peer-checked:text-on-primary">psychology_alt</span>
                  </div>
                  <div>
                    <h3 className="text-label-md font-label-md font-semibold text-on-surface peer-checked:text-primary">
                      Behavioral
                    </h3>
                    <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">
                      STAR method leadership, conflict resolution, and teamwork questions.
                    </p>
                  </div>
                </div>
                {interviewType === 'behavioral' && (
                  <div className="absolute top-md right-md">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="h-px bg-outline-variant/40 w-full" />

          {/* 2. Target Role & Experience */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
            <div>
              <h2 className="text-headline-md font-headline-md text-on-surface mb-md font-bold">2. Target Role</h2>
              <div className="relative">
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full appearance-none bg-surface-bright border border-outline-variant text-on-surface rounded-xl px-md py-sm text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow cursor-pointer"
                >
                  <option value="Software Developer">Software Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Frontend Engineer (React/TypeScript)">Frontend Engineer (React/TypeScript)</option>
                  <option value="Backend Engineer (Node.js/Python)">Backend Engineer (Node.js/Python)</option>
                  <option value="Data Analyst / Engineer">Data Analyst / Engineer</option>
                  <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="custom">Custom Role / Title...</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-md pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
                </div>
              </div>
              {targetRole === 'custom' && (
                <input
                  type="text"
                  placeholder="Enter custom role title..."
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  required
                  className="mt-xs w-full bg-surface-bright border border-outline-variant text-on-surface rounded-xl px-md py-sm text-body-md"
                />
              )}
              <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs ml-xs">
                The Gemini AI will generate questions matching this target position.
              </p>
            </div>

            {/* Experience Selection */}
            <div>
              <h2 className="text-headline-md font-headline-md text-on-surface mb-md font-bold">
                3. Experience Level
              </h2>
              <div className="relative">
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full appearance-none bg-surface-bright border border-outline-variant text-on-surface rounded-xl px-md py-sm text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow cursor-pointer"
                >
                  <option value="Student / Fresher (0 years)">Student / Fresher (0 years)</option>
                  <option value="Junior (1-2 years)">Junior (1-2 years)</option>
                  <option value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</option>
                  <option value="Senior (5+ years)">Senior (5+ years)</option>
                  <option value="Staff / Lead (8+ years)">Staff / Lead (8+ years)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-md pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
                </div>
              </div>
              <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs ml-xs">
                Calibrates the interview depth and evaluation bar.
              </p>
            </div>
          </div>

          {/* 3. Difficulty Level & Number of Questions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
            <div>
              <h2 className="text-headline-md font-headline-md text-on-surface mb-md font-bold">
                4. Difficulty Level
              </h2>
              <div className="flex gap-sm">
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`flex-1 text-center py-sm px-xs rounded-lg border text-label-md font-label-md transition-all font-medium ${
                      difficulty === lvl
                        ? 'bg-surface-container-highest text-on-surface border-primary font-bold shadow-sm'
                        : 'border-outline-variant bg-surface-bright text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-headline-md font-headline-md text-on-surface mb-md font-bold">
                5. Number of Questions
              </h2>
              <div className="flex gap-md items-center">
                {[3, 5, 10].map((count) => (
                  <button
                    type="button"
                    key={count}
                    onClick={() => setNumQuestions(count)}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center text-label-md font-label-md transition-all font-bold ${
                      numQuestions === count
                        ? 'bg-primary-container text-on-primary border-primary shadow-sm scale-105'
                        : 'border-outline-variant bg-surface-bright text-on-surface-variant hover:border-primary hover:text-primary'
                    }`}
                  >
                    {count}
                  </button>
                ))}
                <span className="text-label-sm font-label-sm text-on-surface-variant ml-sm">
                  ~{numQuestions * 3} min estimated duration
                </span>
              </div>
            </div>
          </div>

          {/* 4. Core Topics / Focus Keywords */}
          <div>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-xs font-bold">
              6. Topics / Focus Keywords (Optional)
            </h2>
            <input
              type="text"
              placeholder="e.g. System Design, Concurrency, React Hooks, SQL Optimization"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              className="w-full bg-surface-bright border border-outline-variant text-on-surface rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Actions */}
          <div className="mt-xl pt-lg border-t border-outline-variant/40 flex flex-col md:flex-row items-center justify-between gap-md">
            <div className="flex items-center gap-xs text-label-sm font-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">info</span>
              <span>Gemini AI will synthesize customized questions in real-time.</span>
            </div>
            <button
              disabled={loading}
              className="w-full md:w-auto px-xl py-md text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-sm disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #831ada)' }}
              type="submit"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Questions with Gemini...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  <span>Generate Questions</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
