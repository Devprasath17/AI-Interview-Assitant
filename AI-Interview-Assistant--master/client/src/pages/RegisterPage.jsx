import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobRole, setJobRole] = useState('full-stack-developer');
  const [experienceLevel, setExperienceLevel] = useState('1-2');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        name: fullName,
        email,
        password,
        role: jobRole,
        targetRole: jobRole.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        experience: experienceLevel,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-gutter">
      <main className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-card p-xl relative overflow-hidden group border border-outline-variant/30">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all duration-500 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-xl">
          <div className="text-center flex flex-col gap-xs">
            <Link to="/" className="inline-flex items-center justify-center gap-xs text-primary mb-xs">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
              <span className="font-bold text-on-surface">AI Interview Coach</span>
            </Link>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">Create Your Account</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Start preparing for your next interview.</p>
          </div>

          {error && (
            <div className="p-sm bg-error-container/30 border border-error/30 rounded-lg text-error text-label-sm font-medium flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-background font-semibold" htmlFor="fullName">
                Full Name
              </label>
              <input
                className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface placeholder:text-outline input-focus-ring transition-shadow duration-200"
                id="fullName"
                name="fullName"
                placeholder="Jane Doe"
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-background font-semibold" htmlFor="email">
                Email
              </label>
              <input
                className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface placeholder:text-outline input-focus-ring transition-shadow duration-200"
                id="email"
                name="email"
                placeholder="jane@example.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-background font-semibold" htmlFor="password">
                Password
              </label>
              <input
                className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface placeholder:text-outline input-focus-ring transition-shadow duration-200"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-background font-semibold" htmlFor="jobRole">
                Target Job Role
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-surface border border-outline-variant rounded-lg px-md py-sm pr-xl font-body-md text-body-md text-on-surface input-focus-ring transition-shadow duration-200 cursor-pointer"
                  id="jobRole"
                  name="jobRole"
                  required
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                >
                  <option value="software-developer">Software Developer</option>
                  <option value="full-stack-developer">Full Stack Developer</option>
                  <option value="frontend-engineer">Frontend Engineer</option>
                  <option value="backend-engineer">Backend Engineer</option>
                  <option value="data-analyst">Data Analyst</option>
                  <option value="machine-learning-engineer">Machine Learning Engineer</option>
                  <option value="devops-cloud-engineer">DevOps / Cloud Engineer</option>
                  <option value="product-manager">Product Manager</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-background font-semibold" htmlFor="experienceLevel">
                Experience Level
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-surface border border-outline-variant rounded-lg px-md py-sm pr-xl font-body-md text-body-md text-on-surface input-focus-ring transition-shadow duration-200 cursor-pointer"
                  id="experienceLevel"
                  name="experienceLevel"
                  required
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="student">Student / Fresher</option>
                  <option value="0-1">0–1 Years</option>
                  <option value="1-2">1–2 Years</option>
                  <option value="3-5">3–5 Years</option>
                  <option value="5+">5+ Years (Senior)</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-primary-container text-on-primary font-label-md text-label-md font-bold py-sm px-md rounded-[12px] mt-sm hover:bg-surface-tint transition-colors shadow-sm hover:shadow-card hover:-translate-y-[2px] active:translate-y-0 duration-200 flex items-center justify-center gap-xs disabled:opacity-50"
              type="submit"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-xs">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account?{' '}
              <Link className="text-primary font-semibold hover:text-secondary transition-colors underline decoration-primary/30" to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
