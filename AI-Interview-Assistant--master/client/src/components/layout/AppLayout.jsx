import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Mock Interview', path: '/interviews/create', icon: 'videocam' },
    { name: 'Question Practice', path: '/practice', icon: 'quiz' },
    { name: 'History & Revision', path: '/history', icon: 'history' },
    { name: 'Pinned Questions', path: '/pinned', icon: 'bookmark' },
    { name: 'My Notes', path: '/notes', icon: 'edit_note' },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: 'description' },
    { name: 'Performance', path: '/performance', icon: 'analytics' },
  ];

  return (
    <div className="min-h-screen bg-surface flex text-on-surface">
      {/* Side Navigation Bar for Desktop (Exact Stitch Structure) */}
      <nav className="fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest shadow-md flex flex-col gap-sm p-md z-40 hidden md:flex border-r border-outline-variant/30">
        {/* Brand Header */}
        <div className="flex items-center gap-sm mb-lg px-xs cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
          </div>
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-primary tracking-tight">InterviewAI</h1>
            <p className="text-label-sm font-label-sm text-on-surface-variant">AI Interview Coach</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-xs flex-grow overflow-y-auto custom-scrollbar pr-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-md rounded-lg px-md py-sm transition-all text-label-md font-label-md ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm translate-x-0.5'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-xs pt-md border-t border-surface-variant">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-md rounded-lg px-md py-sm transition-all text-label-md font-label-md ${
                isActive ? 'bg-surface-container-high text-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-md rounded-lg px-md py-sm transition-all text-label-md font-label-md ${
                isActive ? 'bg-surface-container-high text-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </NavLink>

          <button
            onClick={() => navigate('/interviews/create')}
            className="w-full mt-xs py-sm px-md bg-primary-container text-on-primary rounded-xl font-label-md text-label-md hover:bg-surface-tint shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-xs font-semibold"
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span> Start Practice
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-md text-error hover:bg-error-container/50 rounded-lg px-md py-sm transition-all mt-xs text-label-md font-label-md w-full text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-72 bg-surface-container-lowest shadow-2xl flex flex-col p-md z-10 h-full">
            <div className="flex items-center justify-between mb-lg px-xs">
              <div className="flex items-center gap-sm">
                <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary">psychology</span>
                </div>
                <div>
                  <h1 className="text-headline-md font-headline-md font-bold text-primary">InterviewAI</h1>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">AI Interview Coach</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-xs flex-grow overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-md rounded-lg px-md py-sm text-label-md font-label-md ${
                      isActive ? 'bg-primary-container text-on-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-xs pt-md border-t border-surface-variant">
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-md text-on-surface-variant hover:bg-surface-container-high rounded-lg px-md py-sm text-label-md"
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
                <span>Profile</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-md text-error hover:bg-error-container/40 rounded-lg px-md py-sm text-label-md w-full text-left"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-gutter py-md bg-surface-container-lowest border-b border-outline-variant/30 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-sm">psychology</span>
            </div>
            <h1 className="text-headline-md font-headline-md font-bold text-primary">InterviewAI</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-on-surface rounded-lg hover:bg-surface-container-high">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-margin-mobile md:p-margin-desktop max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
