import React from 'react';

export const AILearningDrawer = ({ isOpen, onClose, question, learning, loading, onAddNote }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-surface-container-lowest shadow-2xl border-l border-outline-variant/30 flex flex-col animate-fade-up">
          {/* Header */}
          <div className="px-lg py-md border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/60">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white shadow-md">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <div>
                <h2 className="text-headline-md font-headline-md font-bold text-on-surface">AI Learning Assistant</h2>
                <p className="text-label-sm font-label-sm text-on-surface-variant">Concept mastery & insider interview coaching</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-lg custom-scrollbar space-y-lg">
            {/* Target Question Card */}
            {question && (
              <div className="p-md rounded-xl bg-surface-container-low border border-outline-variant/40">
                <div className="flex items-center gap-xs text-primary font-label-sm text-label-sm font-semibold mb-xs">
                  <span className="material-symbols-outlined text-[16px]">help</span>
                  Target Question
                </div>
                <p className="text-body-md font-medium text-on-surface">{question.question}</p>
                <div className="flex items-center gap-sm mt-sm">
                  <span className="px-sm py-0.5 rounded-md text-[11px] font-semibold bg-surface-container-high text-primary">
                    {question.category || 'Technical'}
                  </span>
                  <span className="px-sm py-0.5 rounded-md text-[11px] font-semibold bg-surface-container-high text-on-surface-variant">
                    {question.difficulty || 'Intermediate'}
                  </span>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-md">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-on-surface-variant font-medium text-sm">Gemini is synthesizing deep learning insights...</p>
              </div>
            ) : learning ? (
              <div className="space-y-lg">
                {/* 1. Simple Explanation */}
                <div className="space-y-xs">
                  <div className="flex items-center gap-xs text-[#4F46E5] font-semibold text-label-md">
                    <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                    <h3>Simple Explanation</h3>
                  </div>
                  <div className="p-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body-md text-[15px] leading-relaxed shadow-sm">
                    {learning.simpleExplanation}
                  </div>
                </div>

                {/* 2. Real-World Example */}
                <div className="space-y-xs">
                  <div className="flex items-center gap-xs text-secondary font-semibold text-label-md">
                    <span className="material-symbols-outlined text-[18px]">domain</span>
                    <h3>Real-World Production Example</h3>
                  </div>
                  <div className="p-md rounded-xl bg-surface-container-low border-l-4 border-secondary text-on-surface font-body-md text-[15px] leading-relaxed">
                    {learning.realWorldExample}
                  </div>
                </div>

                {/* 3. Insider Interview Tip */}
                <div className="space-y-xs">
                  <div className="flex items-center gap-xs text-tertiary-container font-semibold text-label-md">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <h3>Bar-Raiser Interview Tip</h3>
                  </div>
                  <div className="p-md rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] font-body-md text-[15px] leading-relaxed">
                    {learning.interviewTip}
                  </div>
                </div>

                {/* 4. Common Mistake */}
                <div className="space-y-xs">
                  <div className="flex items-center gap-xs text-error font-semibold text-label-md">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    <h3>Common Mistake to Avoid</h3>
                  </div>
                  <div className="p-md rounded-xl bg-[#fff1f2] border border-[#fecdd3] text-[#9f1239] font-body-md text-[15px] leading-relaxed">
                    {learning.commonMistake}
                  </div>
                </div>

                {/* 5. Key Takeaways */}
                {learning.keyTakeaways && learning.keyTakeaways.length > 0 && (
                  <div className="space-y-xs">
                    <div className="flex items-center gap-xs text-on-surface font-semibold text-label-md">
                      <span className="material-symbols-outlined text-[18px]">checklist</span>
                      <h3>Key Takeaways</h3>
                    </div>
                    <ul className="space-y-xs p-md rounded-xl bg-surface-container-low border border-outline-variant/40">
                      {learning.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-sm text-body-md text-[14px] text-on-surface">
                          <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-on-surface-variant">
                <p>Click "Learn More" on any question to view personalized AI breakdown.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-md border-t border-outline-variant/30 bg-surface-container-low/60 flex items-center justify-between gap-sm">
            <button
              onClick={onClose}
              className="px-lg py-sm rounded-lg border border-outline text-on-surface font-label-md hover:bg-surface-container-high transition-colors"
            >
              Close
            </button>
            {onAddNote && question && (
              <button
                onClick={() => {
                  onClose();
                  onAddNote();
                }}
                className="px-lg py-sm bg-primary-container text-on-primary rounded-lg font-label-md hover:bg-surface-tint shadow-sm transition-all flex items-center gap-xs font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">note_add</span>
                Save Note on Question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
