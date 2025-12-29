import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Analyzing your terrible font choices...",
  "Trying not to vomit...",
  "Checking if this layout is legal...",
  "Consulting with actual designers...",
  "Laughing at your color palette...",
  "Searching for a single redeeming quality...",
  "Why did you align it like that?",
  "Calculating emotional damage...",
];

export const Loading: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-danger/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-danger border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-danger animate-pulse">
          LOADING
        </div>
      </div>
      <p className="text-xl font-mono text-gray-400 animate-pulse text-center max-w-md">
        {MESSAGES[msgIndex]}
      </p>
    </div>
  );
};