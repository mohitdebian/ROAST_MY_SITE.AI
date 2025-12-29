import React from 'react';
import { RoastResponse } from '../types';

interface RoastResultProps {
  roast: RoastResponse;
  onReset: () => void;
}

export const RoastResult: React.FC<RoastResultProps> = ({ roast, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-500';
    if (score > 50) return 'text-yellow-500';
    return 'text-danger';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      
      {/* Header / Score */}
      <div className="text-center space-y-4 border-b border-border pb-8">
        <h2 className="text-gray-400 font-mono uppercase tracking-widest text-sm">Verdict</h2>
        <div className={`text-8xl font-black ${getScoreColor(roast.score)} tracking-tighter`}>
          {roast.score}/100
        </div>
        <p className="text-2xl md:text-3xl font-bold text-white max-w-2xl mx-auto leading-tight">
          "{roast.oneLiner}"
        </p>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roast.sections.map((section, idx) => (
          <div 
            key={idx} 
            className={`
              p-6 border border-border bg-panel/50 hover:bg-panel transition-colors
              ${section.severity === 'critical' ? 'border-l-4 border-l-danger' : ''}
              ${section.severity === 'bad' ? 'border-l-4 border-l-yellow-600' : ''}
              ${section.severity === 'nitpick' ? 'border-l-4 border-l-blue-600' : ''}
            `}
          >
            <div className="flex items-center gap-2 mb-3">
              {section.severity === 'critical' && (
                <span className="bg-danger/20 text-danger text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded">Critical Fail</span>
              )}
              <h3 className="font-mono text-lg font-bold text-gray-200">{section.title}</h3>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Final Verdict */}
      <div className="bg-danger/10 border border-danger p-8 text-center space-y-4">
        <h3 className="text-danger font-mono font-bold uppercase tracking-widest">Final Thoughts</h3>
        <p className="text-white text-lg font-medium">{roast.verdict}</p>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onReset}
          className="text-gray-500 hover:text-white underline decoration-danger decoration-2 underline-offset-4 font-mono transition-colors"
        >
          Roast Another Victim
        </button>
      </div>
    </div>
  );
};