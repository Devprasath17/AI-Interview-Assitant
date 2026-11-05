import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const EditProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Developer');
  const [experience, setExperience] = useState(user?.experience || '1-2 years');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateUserProfile({
        name,
        targetRole,
        experience,
        bio,
        avatar,
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      console.error('Update profile error:', err);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-xl">
      <header className="flex justify-between items-center mb-md">
        <div>
          <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface mb-xs">Edit Profile</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Update your personal details and target interview role.
          </p>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="text-on-surface-variant hover:text-primary font-semibold text-sm flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Cancel
        </button>
      </header>

      {message && (
        <div className="p-md bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-[#065f46] text-sm font-semibold flex items-center gap-sm">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-2xl p-lg md:p-xl shadow-card border border-outline-variant/30 space-y-lg">
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-surface-bright border border-outline-variant rounded-xl px-md py-sm text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="targetRole">
              Target Role
            </label>
            <input
              id="targetRole"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              required
              className="w-full bg-surface-bright border border-outline-variant rounded-xl px-md py-sm text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="experience">
              Experience Level
            </label>
            <select
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-surface-bright border border-outline-variant rounded-xl px-md py-sm text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
            >
              <option value="Student / Fresher">Student / Fresher</option>
              <option value="0-1 years">0-1 years</option>
              <option value="1-2 years">1-2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="avatar">
            Avatar Image URL (Optional)
          </label>
          <input
            id="avatar"
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://..."
            className="w-full bg-surface-bright border border-outline-variant rounded-xl px-md py-sm text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="bio">
            Professional Bio & Focus
          </label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-surface-bright border border-outline-variant rounded-xl p-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-y"
          />
        </div>

        <div className="flex items-center justify-end gap-sm pt-md border-t border-outline-variant/30">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-lg py-sm border border-outline rounded-xl font-semibold text-on-surface hover:bg-surface-container-low"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-xl py-sm bg-primary text-on-primary rounded-xl font-semibold hover:bg-primary-container transition-all shadow-sm disabled:opacity-50 flex items-center gap-xs"
          >
            {saving ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
