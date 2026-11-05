import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-gutter">
      {/* Main Container */}
      <main className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-soft p-lg md:p-xl flex flex-col gap-xl transition-shadow duration-300 border border-outline-variant/30">
        {/* Header */}
        <header className="flex flex-col items-center text-center gap-sm">
          <Link to="/" className="flex items-center gap-sm text-primary mb-sm">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
              AI Interview Coach
            </span>
          </Link>
          <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Welcome Back 👋</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Continue your interview preparation.</p>
        </header>

        {error && (
          <div className="p-sm bg-error-container/30 border border-error/30 rounded-lg text-error text-label-sm font-medium flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          {/* Email Field */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded-[12px] border border-outline-variant bg-surface-container-lowest px-md py-sm font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none input-focus-ring transition-all duration-200"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="password">
              Password
            </label>
            <input
              className="w-full rounded-[12px] border border-outline-variant bg-surface-container-lowest px-md py-sm font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none input-focus-ring transition-all duration-200"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-between mt-xs mb-sm">
            <div className="flex items-center gap-sm">
              <input
                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary-container"
                id="remember"
                name="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="font-label-sm text-label-sm text-on-surface-variant font-medium cursor-pointer" htmlFor="remember">
                Remember me
              </label>
            </div>
            <a className="font-label-sm text-label-sm text-primary hover:text-surface-tint transition-colors" href="#">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full rounded-[12px] bg-primary-container py-md px-lg font-label-md text-label-md text-on-primary hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 transition-colors duration-200 shadow-sm flex justify-center items-center gap-sm font-semibold disabled:opacity-50"
            type="submit"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Login</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Footer / Link */}
        <div className="text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Don't have an account?
            <Link className="font-label-md text-label-md text-primary hover:text-surface-tint transition-colors ml-xs font-semibold" to="/register">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};
