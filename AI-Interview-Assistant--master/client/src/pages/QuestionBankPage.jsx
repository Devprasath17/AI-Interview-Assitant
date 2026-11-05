import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultQuestionBank = [
  {
    id: 1,
    category: 'OOP',
    difficulty: 'Medium',
    question: 'What is polymorphism in Object-Oriented Programming?',
    description: 'Explain the concept of polymorphism, providing real-world examples and how it is implemented in modern software systems.',
    views: '1.2k',
    type: 'Technical',
  },
  {
    id: 2,
    category: 'DSA',
    difficulty: 'Hard',
    question: 'Reverse a Linked List in Groups of Given Size',
    description: 'Given a linked list, write a function to reverse every k nodes (where k is an input to the function) with O(1) extra space.',
    views: '3.4k',
    type: 'Coding',
  },
  {
    id: 3,
    category: 'Behavioral',
    difficulty: 'Easy',
    question: 'Tell me about a time you faced a conflict at work.',
    description: 'Use the STAR method to describe a situation where you had a disagreement with a colleague and how you resolved it professionally.',
    views: '2.8k',
    type: 'Behavioral',
  },
  {
    id: 4,
    category: 'System Design',
    difficulty: 'Medium',
    question: 'Design a URL Shortening Service like Bitly',
    description: 'Discuss the architecture, database schema, hashing collisions, and handling of high traffic volume for a highly available URL shortener.',
    views: '890',
    type: 'Technical',
  },
  {
    id: 5,
    category: 'React / Frontend',
    difficulty: 'Medium',
    question: 'How does React Fiber and the Virtual DOM reconciliation algorithm work?',
    description: 'Explain the concurrency model, double buffering, workLoop, and prioritization of state updates in React 18+.',
    views: '2.1k',
    type: 'Technical',
  },
  {
    id: 6,
    category: 'DBMS / SQL',
    difficulty: 'Hard',
    question: 'Explain Database Indexing mechanisms (B-Trees vs Hash Indexes) and Query Optimization',
    description: 'Break down composite indexes, index covering, write amplification, and explain plans in relational databases.',
    views: '1.5k',
    type: 'Technical',
  },
];

export const QuestionBankPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');

  const topics = ['All Topics', 'Python', 'DSA', 'DBMS', 'OOP', 'System Design', 'React', 'Machine Learning'];

  const filtered = defaultQuestionBank.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || q.type.toLowerCase() === selectedType.toLowerCase();
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesTopic = selectedTopic === 'All Topics' || q.category.toLowerCase().includes(selectedTopic.toLowerCase());
    return matchesSearch && matchesType && matchesDiff && matchesTopic;
  });

  return (
    <div className="w-full space-y-lg">
      {/* Page Header */}
      <header className="mb-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface mb-xs">Question Bank</h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
            Browse our curated questions or dynamically generate real AI interview questions tailored to your target role.
          </p>
        </div>
        <button
          onClick={() => navigate('/interviews/create')}
          className="px-lg py-sm rounded-xl text-on-primary font-label-md font-semibold flex items-center gap-xs shadow-md hover:shadow-lg transition-all shrink-0"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #831ada)' }}
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span>Generate Questions</span>
        </button>
      </header>

      {/* Search & Filter Controls */}
      <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm mb-lg flex flex-col md:flex-row gap-md items-center border border-outline-variant/30">
        {/* Search Bar */}
        <div className="relative w-full md:flex-1">
          <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input
            className="w-full pl-[40px] pr-sm py-sm bg-surface rounded-xl border border-outline-variant text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface placeholder-outline"
            placeholder="Search questions..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex w-full md:w-auto gap-sm">
          {/* Type Filter */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none bg-surface border border-outline-variant rounded-xl py-sm pl-sm pr-xl text-label-md font-label-md text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
            >
              <option value="All">Type: All</option>
              <option value="Technical">Technical</option>
              <option value="HR">HR</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Coding">Coding</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-sm flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline">expand_more</span>
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full appearance-none bg-surface border border-outline-variant rounded-xl py-sm pl-sm pr-xl text-label-md font-label-md text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
            >
              <option value="All">Difficulty: All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-sm flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline">expand_more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Chips */}
      <div className="mb-xl flex gap-sm overflow-x-auto no-scrollbar pb-sm">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTopic(t)}
            className={`whitespace-nowrap px-md py-xs rounded-full text-label-sm font-label-sm transition-colors ${
              selectedTopic === t
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant border border-outline-variant/50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
        {filtered.map((q) => {
          const isHard = q.difficulty === 'Hard';
          const isMed = q.difficulty === 'Medium';
          return (
            <div
              key={q.id}
              className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20 hover:-translate-y-[2px] hover:shadow-md transition-all flex flex-col h-full group"
            >
              <div className="flex gap-xs mb-sm">
                <span
                  className={`px-sm py-[2px] rounded-md text-[11px] font-label-sm font-semibold uppercase tracking-wider ${
                    isHard
                      ? 'bg-error/10 text-error'
                      : isMed
                      ? 'bg-secondary/10 text-secondary'
                      : 'bg-tertiary/10 text-tertiary'
                  }`}
                >
                  {q.difficulty}
                </span>
                <span className="px-sm py-[2px] rounded-md bg-surface-container-high text-on-surface-variant text-[11px] font-label-sm font-semibold uppercase tracking-wider">
                  {q.category}
                </span>
              </div>

              <h3 className="text-headline-md font-headline-md font-bold text-on-surface mb-md flex-1 group-hover:text-primary transition-colors line-clamp-2">
                {q.question}
              </h3>

              <p className="text-body-md font-body-md text-on-surface-variant line-clamp-2 mb-md text-sm">
                {q.description}
              </p>

              <div className="mt-auto border-t border-outline-variant/30 pt-md flex justify-between items-center">
                <div className="flex items-center gap-xs text-outline text-label-sm font-label-sm">
                  <span className="material-symbols-outlined text-[16px]">visibility</span> {q.views}
                </div>
                <button
                  onClick={() => navigate('/interviews/create')}
                  className="flex items-center gap-xs bg-surface text-primary border border-primary/30 hover:bg-primary hover:text-on-primary rounded-lg px-md py-sm text-label-md font-label-md transition-colors font-semibold"
                >
                  Practice <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
