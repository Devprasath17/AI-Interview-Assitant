import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [aiDifficultyAutoAdjust, setAiDifficultyAutoAdjust] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-xl">
      <header className="mb-md">
        <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface mb-xs">Settings</h2>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Configure application preferences, AI evaluation parameters, and notifications.
        </p>
      </header>

      {saved && (
        <div className="p-md bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-[#065f46] text-sm font-semibold flex items-center gap-sm">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Preferences updated successfully.</span>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-outline-variant/30 divide-y divide-outline-variant/20">
        {/* Account Settings */}
        <div className="p-lg space-y-md">
          <h3 className="text-headline-md font-bold text-on-surface flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">person</span>
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md text-sm">
            <div>
              <span className="text-on-surface-variant block mb-1 font-medium">Logged in as</span>
              <span className="text-on-surface font-semibold">{user?.email || 'user@example.com'}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block mb-1 font-medium">Role Target</span>
              <span className="text-on-surface font-semibold">{user?.targetRole || 'Software Engineer'}</span>
            </div>
          </div>
        </div>

        {/* AI Parameters */}
        <div className="p-lg space-y-md">
          <h3 className="text-headline-md font-bold text-on-surface flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary">psychology</span>
            AI Interview & Feedback Settings
          </h3>
          <div className="space-y-sm">
            <div className="flex items-center justify-between py-sm">
              <div>
                <p className="text-sm font-semibold text-on-surface">Adaptive Question Difficulty</p>
                <p className="text-xs text-on-surface-variant">Automatically increase question depth based on response quality</p>
              </div>
              <input
                type="checkbox"
                checked={aiDifficultyAutoAdjust}
                onChange={(e) => setAiDifficultyAutoAdjust(e.target.checked)}
                className="w-5 h-5 rounded text-primary focus:ring-primary-container"
              />
            </div>
            <div className="flex items-center justify-between py-sm">
              <div>
                <p className="text-sm font-semibold text-on-surface">Gemini Model Tier</p>
                <p className="text-xs text-on-surface-variant">Defaulting to high-performance Gemini Flash model</p>
              </div>
              <span className="px-sm py-1 rounded-md bg-surface-container-high text-xs font-bold text-primary">
                Gemini 2.5 Flash
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-lg space-y-md">
          <h3 className="text-headline-md font-bold text-on-surface flex items-center gap-sm">
            <span className="material-symbols-outlined text-tertiary">notifications</span>
            Notifications & Reminders
          </h3>
          <div className="flex items-center justify-between py-sm">
            <div>
              <p className="text-sm font-semibold text-on-surface">Weekly Practice Reminders</p>
              <p className="text-xs text-on-surface-variant">Receive email reminders to maintain your interview streak</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-5 h-5 rounded text-primary focus:ring-primary-container"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="p-lg flex justify-end">
          <button
            onClick={handleSave}
            className="px-xl py-sm bg-primary text-on-primary rounded-xl font-semibold hover:bg-primary-container transition-all shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
