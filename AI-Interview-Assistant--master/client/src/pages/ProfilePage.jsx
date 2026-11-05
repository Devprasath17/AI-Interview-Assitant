import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-xl">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface mb-xs">Profile</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Manage your personal information and career objectives.
          </p>
        </div>
        <button
          onClick={() => navigate('/profile/edit')}
          className="hidden md:flex bg-primary text-on-primary py-sm px-lg rounded-[12px] text-label-md font-label-md font-semibold hover:bg-primary-container transition-all items-center gap-sm shadow-sm hover:-translate-y-[2px]"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
          Edit Profile
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Main Profile Card */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-surface-container-lowest rounded-xl p-xl shadow-card border border-outline-variant/30 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-container to-secondary-container opacity-20" />
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-sm mb-md z-10 bg-primary/10 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[64px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_circle
                </span>
              )}
            </div>

            <h3 className="text-headline-md font-headline-md font-bold text-on-surface z-10">
              {user?.name || 'Candidate Name'}
            </h3>
            <p className="text-body-md font-body-md text-on-surface-variant mb-lg z-10">
              {user?.email || 'user@example.com'}
            </p>

            <div className="w-full flex justify-center gap-sm mb-md z-10 flex-wrap">
              <span className="bg-surface-container-high text-on-surface-variant px-md py-xs rounded-full text-label-sm font-label-sm flex items-center gap-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">badge</span>
                {user?.experience || 'Fresher'}
              </span>
              <span className="bg-surface-container-high text-on-surface-variant px-md py-xs rounded-full text-label-sm font-label-sm flex items-center gap-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">work</span>
                {user?.targetRole || 'Software Engineer'}
              </span>
            </div>

            <button
              onClick={() => navigate('/profile/edit')}
              className="md:hidden mt-md w-full bg-primary text-on-primary py-sm px-lg rounded-[12px] text-label-md font-label-md font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-sm"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right Column: Details & Skills */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          {/* Career Info */}
          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-card border-l-4 border-primary border-y border-r border-outline-variant/30">
            <h4 className="text-label-md font-label-md font-bold text-primary mb-md uppercase tracking-wider">
              Career Objectives
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <p className="text-label-sm font-label-sm text-outline mb-xs font-semibold">Target Role</p>
                <p className="text-body-lg font-body-lg text-on-surface font-semibold">
                  {user?.targetRole || 'Software Developer'}
                </p>
              </div>
              <div>
                <p className="text-label-sm font-label-sm text-outline mb-xs font-semibold">Experience Level</p>
                <p className="text-body-lg font-body-lg text-on-surface font-semibold">
                  {user?.experience || 'Fresher (0-1 years)'}
                </p>
              </div>
            </div>
          </div>

          {/* About / Bio */}
          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-card border-l-4 border-secondary border-y border-r border-outline-variant/30">
            <h4 className="text-label-md font-label-md font-bold text-secondary mb-xs uppercase tracking-wider">
              Professional Summary
            </h4>
            <p className="text-body-md text-on-surface leading-relaxed">
              {user?.bio || 'Passionate software engineer preparing for high-impact technical and behavioral interviews.'}
            </p>
          </div>

          {/* Technical Skills */}
          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-card border-l-4 border-tertiary border-y border-r border-outline-variant/30">
            <h4 className="text-label-md font-label-md font-bold text-tertiary mb-md uppercase tracking-wider">
              Focus Skills & Technologies
            </h4>
            <div className="flex flex-wrap gap-sm">
              {['Data Structures & Algorithms', 'System Design', 'React / TypeScript', 'Node.js & Express', 'MongoDB & SQL', 'REST APIs', 'Cloud Architecture'].map((skill) => (
                <span
                  key={skill}
                  className="bg-primary-fixed text-on-primary-fixed px-md py-sm rounded-full text-label-md font-label-md border border-primary-fixed-dim font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
