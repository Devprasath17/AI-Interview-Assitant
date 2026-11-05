import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export const InterviewHistoryPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/interviews');
        if (res.data && res.data.sessions) {
          setSessions(res.data.sessions);
        }
      } catch (err) {
        console.error('Error fetching interview history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' ||
      s.description?.toLowerCase().includes(selectedType.toLowerCase()) ||
      s.role?.toLowerCase().includes(selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full space-y-lg">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-md">
        <div>
          <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">
            Interview History
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-xs max-w-2xl">
            Review your past mock sessions, track your AI-generated scores, and review question feedback.
          </p>
        </div>
        <button
          onClick={() => navigate('/interviews/create')}
          className="px-lg py-sm bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:bg-primary-container transition-all shadow-sm flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-sm">play_arrow</span>
          Start Practice
        </button>
      </header>

      {/* Controls: Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-md items-center justify-between w-full bg-surface-container-lowest p-sm rounded-xl shadow-card border border-surface-variant">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            className="w-full pl-xl pr-md py-sm bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim focus:outline-none transition-all text-body-md font-body-md text-on-surface placeholder:text-outline"
            placeholder="Search by role or keyword..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-sm w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {['All', 'Technical', 'Behavioral', 'HR'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex items-center gap-xs px-md py-sm rounded-full text-label-sm font-label-sm whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                  : 'bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-variant'
              }`}
            >
              {type === 'All' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Data List */}
      <div className="w-full">
        {/* List Header (Desktop Only) */}
        <div className="hidden md:grid grid-cols-12 gap-md px-lg py-sm mb-sm text-label-md font-label-md text-outline uppercase tracking-wider font-semibold">
          <div className="col-span-3">Session Date</div>
          <div className="col-span-3">Interview Role & Type</div>
          <div className="col-span-3 text-center">AI Score</div>
          <div className="col-span-3 text-right">Status & Action</div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-md">
            <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-on-surface-variant text-sm font-medium">Loading session history...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant/30 text-center py-16 space-y-md">
            <div className="w-16 h-16 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[32px]">history</span>
            </div>
            <h3 className="text-headline-md font-bold text-on-surface">No Interview Sessions Found</h3>
            <p className="text-body-md text-on-surface-variant max-w-sm mx-auto">
              {searchTerm ? 'No sessions match your search criteria.' : 'Create your first interview session to start tracking history.'}
            </p>
            <button
              onClick={() => navigate('/interviews/create')}
              className="px-lg py-sm bg-primary text-white rounded-xl font-semibold shadow-sm hover:bg-primary-container transition-all"
            >
              Start New Mock Interview
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            {filteredSessions.map((s) => {
              const score = s.score || 82;
              const isGood = score >= 75;
              const dateFormatted = new Date(s.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const timeFormatted = new Date(s.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={s._id}
                  onClick={() => navigate(`/interviews/${s._id}/practice`)}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-md items-center bg-surface-container-lowest p-lg rounded-xl shadow-card hover:shadow-card-hover border-l-4 border-l-primary transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer border-y border-r border-outline-variant/30"
                >
                  {/* Date */}
                  <div className="col-span-1 md:col-span-3 flex flex-col">
                    <span className="text-label-sm font-label-sm text-outline md:hidden mb-1 font-semibold">
                      Session Date
                    </span>
                    <span className="text-body-md font-body-md text-on-surface font-semibold">{dateFormatted}</span>
                    <span className="text-label-sm font-label-sm text-on-surface-variant">
                      {timeFormatted} ({s.durationMinutes || 15}m)
                    </span>
                  </div>

                  {/* Type / Role */}
                  <div className="col-span-1 md:col-span-3 flex items-center gap-sm">
                    <span className="text-label-sm font-label-sm text-outline md:hidden w-24 font-semibold">Type</span>
                    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[18px]">terminal</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-body-md font-body-md text-on-surface font-semibold block truncate">
                        {s.role}
                      </span>
                      <span className="text-xs text-on-surface-variant">{s.difficulty}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-1 md:col-span-3 flex items-center md:justify-center gap-md">
                    <span className="text-label-sm font-label-sm text-outline md:hidden w-24 font-semibold">Score</span>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle className="stroke-surface-variant" cx="18" cy="18" fill="none" r="16" strokeWidth="3" />
                        <circle
                          className={isGood ? 'stroke-primary' : 'stroke-error'}
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeDasharray="100"
                          strokeDashoffset={100 - score}
                          strokeLinecap="round"
                          strokeWidth="3"
                        />
                      </svg>
                      <span className="absolute text-label-sm font-label-sm text-on-surface font-bold">
                        {score}<span className="text-[10px]">%</span>
                      </span>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="col-span-1 md:col-span-3 flex items-center md:justify-end gap-md">
                    <span className="text-label-sm font-label-sm text-outline md:hidden w-24 font-semibold">Status</span>
                    <div className={`flex items-center gap-xs px-sm py-1 rounded-full border text-xs font-bold ${
                      isGood
                        ? 'bg-tertiary-container/20 text-tertiary-container border-tertiary-container/30'
                        : 'bg-error-container/30 text-error border-error/20'
                    }`}>
                      <span className="material-symbols-outlined text-[16px]">
                        {isGood ? 'check_circle' : 'warning'}
                      </span>
                      <span>{isGood ? 'Completed' : 'In Progress'}</span>
                    </div>

                    <button className="w-8 h-8 rounded-full bg-surface-variant text-on-surface hover:bg-primary-container hover:text-white flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
