import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-on-surface">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-on-surface/80 backdrop-blur-md shadow-sm border-b-0">
        <div className="flex justify-between items-center px-gutter py-md max-w-7xl mx-auto">
          <div className="flex items-center gap-sm cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[20px]" data-icon="school">
                school
              </span>
            </div>
            <span className="text-headline-md font-headline-md font-bold text-on-surface">AI Interview Coach</span>
          </div>
          <nav className="hidden md:flex items-center gap-lg">
            <a className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md" href="#">
              Home
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md" href="#features">
              Features
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md" href="#how-it-works">
              How It Works
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md" href="#about">
              About
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-sm">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-lg py-sm text-label-md font-label-md font-medium bg-primary text-on-primary rounded-xl hover:bg-surface-tint shadow-md transition-all hover:-translate-y-[2px]"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-lg py-sm text-label-md font-label-md font-medium text-primary hover:bg-surface-container-high rounded-xl transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-lg py-sm text-label-md font-label-md font-medium bg-primary text-on-primary rounded-xl hover:bg-surface-tint shadow-md transition-all hover:-translate-y-[2px]"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
          <button onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')} className="md:hidden text-on-surface p-2">
            <span className="material-symbols-outlined" data-icon="menu">menu</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[88px]">
        {/* Hero Section */}
        <section className="relative px-gutter py-xl md:py-2xl max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-xl md:gap-2xl">
          {/* Background Decorative Blob */}
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="flex-1 flex flex-col items-start gap-lg z-10 w-full md:w-1/2">
            <div className="inline-flex items-center gap-xs px-md py-xs rounded-full bg-surface-container-high border border-outline-variant text-label-sm font-label-sm text-primary">
              <span className="material-symbols-outlined text-[16px]" data-icon="auto_awesome">
                auto_awesome
              </span>
              AI-Powered Interview Preparation
            </div>
            <h1 className="text-display-lg font-display-lg text-on-surface">
              Ace Your Next Interview with <span className="ai-gradient-text">AI</span>
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-lg">
              Practice interviews, improve your answers, and build confidence with your personal AI interview coach. Get instant, actionable feedback to land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row gap-md w-full sm:w-auto mt-sm">
              <button
                onClick={() => navigate(isAuthenticated ? '/interviews/create' : '/register')}
                className="px-xl py-md text-label-md font-label-md font-medium bg-primary text-on-primary rounded-xl shadow-md hover:-translate-y-[2px] transition-all flex items-center justify-center gap-sm font-semibold"
              >
                Start Practicing
                <span className="material-symbols-outlined text-[20px]" data-icon="arrow_forward">
                  arrow_forward
                </span>
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigate(isAuthenticated ? '/dashboard' : '/login');
                }}
                className="px-xl py-md text-label-md font-label-md font-medium bg-transparent border border-outline text-on-surface rounded-xl hover:bg-surface-container-low transition-colors flex items-center justify-center gap-sm"
              >
                Explore Features
              </button>
            </div>

            <div className="flex items-center gap-sm mt-md opacity-80">
              <div className="flex -space-x-2">
                <img
                  className="w-8 h-8 rounded-full border-2 border-surface object-cover z-30"
                  alt="Student user"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-surface object-cover z-20"
                  alt="Graduate user"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-surface object-cover z-10"
                  alt="Tech graduate"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                />
              </div>
              <span className="text-label-sm font-label-sm text-on-surface-variant">Built for students, developers and professionals</span>
            </div>
          </div>

          <div className="flex-1 w-full md:w-1/2 relative flex justify-center z-10">
            {/* The Hero Card & Score Preview */}
            <div className="w-full max-w-lg rounded-2xl shadow-xl p-lg bg-surface-container-lowest border border-outline-variant/50 glass-card">
              <div className="flex items-center justify-between pb-md border-b border-outline-variant/30 mb-md">
                <div className="flex items-center gap-sm">
                  <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface text-sm">Interactive AI Mock Session</h3>
                    <p className="text-xs text-on-surface-variant">Real-time role-based questions</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-tertiary-container/10 text-tertiary">
                  Live Preview
                </span>
              </div>

              <div className="space-y-sm">
                <div className="p-sm rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs">
                  <p className="font-semibold text-primary mb-1">Q: How do you handle high-load system failures?</p>
                  <p className="text-on-surface-variant line-clamp-2">"I isolate critical services with circuit breakers, utilize idempotent retries, and route non-critical workflows through decoupled message queues..."</p>
                </div>
                <div className="p-sm rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] text-xs flex items-center justify-between">
                  <span className="text-[#065f46] font-medium">AI Feedback: Strong architectural reasoning</span>
                  <span className="font-bold text-[#065f46]">92%</span>
                </div>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 glass-card p-sm rounded-xl flex items-center gap-sm shadow-lg border border-outline-variant/40 bg-white/90">
              <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-tertiary-container text-[20px]" data-icon="check_circle">
                  check_circle
                </span>
              </div>
              <div>
                <p className="text-label-sm font-label-sm font-bold text-on-surface">Communication Score</p>
                <p className="text-label-sm font-label-sm text-tertiary font-semibold">92% - Excellent</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-2xl px-gutter max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-xl">
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-xs">
              Everything You Need to Get Hired
            </h2>
            <p className="text-body-md text-on-surface-variant">
              From automated role-tailored questions to deep coaching breakdowns and personal notes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/40 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
              </div>
              <h3 className="text-headline-sm font-bold text-on-surface mb-xs">Gemini AI Question Generation</h3>
              <p className="text-body-md text-on-surface-variant">
                Generate real interview questions tailored to your exact target role, experience level, and difficulty.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/40 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </div>
              <h3 className="text-headline-sm font-bold text-on-surface mb-xs">AI Learning Assistant</h3>
              <p className="text-body-md text-on-surface-variant">
                Understand the 'why' behind questions with simple explanations, real-world examples, insider tips, and key takeaways.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/40 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container/10 text-tertiary flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-[24px]">bookmark</span>
              </div>
              <h3 className="text-headline-sm font-bold text-on-surface mb-xs">Pin Questions & Custom Notes</h3>
              <p className="text-body-md text-on-surface-variant">
                Pin tough questions to your revision bank and write structured notes to reinforce your learning.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full mt-auto border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-gutter py-xl gap-md">
          <div className="flex flex-col gap-xs mb-md md:mb-0">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary text-[20px]" data-icon="school">
                school
              </span>
              <span className="text-label-md font-label-md font-bold text-on-surface">PrepWise AI</span>
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant text-sm">
              Practice Smart. Perform Better. Get Hired.
            </p>
          </div>
          <div className="flex flex-wrap gap-md md:gap-lg justify-center md:justify-end">
            <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
