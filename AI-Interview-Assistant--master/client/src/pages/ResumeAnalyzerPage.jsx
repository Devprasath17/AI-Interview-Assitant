import React, { useState } from 'react';

export const ResumeAnalyzerPage = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setAnalyzed(true);
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-xl">
      <header className="mb-md">
        <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface mb-xs">
          AI Resume & Skill Gap Analyzer
        </h2>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Upload your resume to identify missing technical keywords, match rate against target roles, and personalized question recommendations.
        </p>
      </header>

      {!analyzed ? (
        <div className="bg-surface-container-lowest rounded-2xl p-xl shadow-card border border-outline-variant/30 text-center space-y-lg">
          <div className="w-20 h-20 rounded-full bg-primary-container/10 text-primary flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[40px]">description</span>
          </div>

          <div className="space-y-xs">
            <h3 className="text-headline-md font-bold text-on-surface">Upload Your Resume (PDF or DOCX)</h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              Our AI parses your experience and generates customized interview questions based directly on your projects.
            </p>
          </div>

          <div className="border-2 border-dashed border-outline-variant rounded-2xl p-xl bg-surface-bright flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-primary transition-colors relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="material-symbols-outlined text-primary text-[36px]">cloud_upload</span>
            <p className="font-semibold text-on-surface text-sm">
              {fileName ? fileName : 'Click or drag resume file here to upload'}
            </p>
            <span className="text-xs text-on-surface-variant">Supports PDF, DOCX up to 10MB</span>
          </div>

          {analyzing && (
            <div className="flex items-center justify-center gap-sm text-primary font-semibold text-sm">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span>Analyzing resume keywords and project depth...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-lg animate-fade-up">
          <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-card border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-md">
            <div>
              <span className="text-xs font-semibold text-primary uppercase">Resume Analysis Summary</span>
              <h3 className="text-headline-md font-bold text-on-surface">{fileName || 'Resume_Software_Engineer.pdf'}</h3>
            </div>
            <button
              onClick={() => {
                setAnalyzed(false);
                setFileName('');
              }}
              className="px-md py-1.5 rounded-lg border border-outline text-xs font-bold text-on-surface hover:bg-surface-container-low"
            >
              Upload New Resume
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="p-lg rounded-xl bg-[#ecfdf5] border border-[#a7f3d0]">
              <span className="text-xs uppercase font-bold text-[#065f46]">Target Role Match</span>
              <p className="text-display-lg font-bold text-[#065f46] mt-1">88%</p>
              <span className="text-xs text-[#065f46]">High Alignment</span>
            </div>

            <div className="p-lg rounded-xl bg-surface-container-lowest border border-outline-variant/30">
              <span className="text-xs uppercase font-bold text-primary">Identified Core Skills</span>
              <p className="text-display-lg font-bold text-on-surface mt-1">14</p>
              <span className="text-xs text-on-surface-variant">Algorithms, React, Node.js, SQL</span>
            </div>

            <div className="p-lg rounded-xl bg-surface-container-lowest border border-outline-variant/30">
              <span className="text-xs uppercase font-bold text-secondary">Recommended Questions</span>
              <p className="text-display-lg font-bold text-secondary mt-1">8</p>
              <span className="text-xs text-on-surface-variant">Tailored to your projects</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
