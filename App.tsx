import React, { useState } from 'react';
import { RoastForm } from './components/RoastForm';
import { RoastResult } from './components/RoastResult';
import { Loading } from './components/Loading';
import { roastWebsite } from './services/gemini';
import { RoastRequest, RoastResponse, RoastState } from './types';

export default function App() {
  const [state, setState] = useState<RoastState>(RoastState.IDLE);
  const [roastData, setRoastData] = useState<RoastResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRoast = async (data: RoastRequest) => {
    if (!data.image) return;

    setState(RoastState.ANALYZING);
    setError(null);

    try {
      const result = await roastWebsite(data.image, data.url);
      setRoastData(result);
      setState(RoastState.ROASTED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Even our server rejected your site.");
      setState(RoastState.ERROR);
    }
  };

  const handleReset = () => {
    setState(RoastState.IDLE);
    setRoastData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 selection:bg-danger selection:text-black">
      
      {/* Navbar-ish */}
      <header className="border-b border-border bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-danger rounded-full animate-pulse-fast"></span>
            <h1 className="text-xl font-black tracking-tighter text-white">
              ROAST_MY_SITE<span className="text-danger">.AI</span>
            </h1>
          </div>
          <a href="#" className="text-xs font-mono text-gray-500 hover:text-danger transition-colors">
            ABOUT
          </a>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 md:py-24">
        
        {state === RoastState.IDLE && (
          <div className="flex flex-col items-center space-y-12">
            <div className="text-center space-y-6 max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[0.9]">
                YOUR WEBSITE <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-danger to-orange-600">PROBABLY SUCKS.</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-light max-w-xl mx-auto">
                No sugarcoating. No "sandwich method". Just brutal AI-powered feedback to hurt your feelings and improve your conversions.
              </p>
            </div>
            
            <RoastForm onSubmit={handleRoast} isLoading={false} />
          </div>
        )}

        {state === RoastState.ANALYZING && <Loading />}

        {state === RoastState.ROASTED && roastData && (
          <RoastResult roast={roastData} onReset={handleReset} />
        )}

        {state === RoastState.ERROR && (
          <div className="max-w-md mx-auto text-center space-y-6">
             <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto text-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
             </div>
            <h3 className="text-2xl font-bold text-white">Analysis Failed</h3>
            <p className="text-gray-400">{error}</p>
            <button 
              onClick={handleReset}
              className="bg-gray-800 text-white px-6 py-3 font-mono hover:bg-gray-700 transition-colors"
            >
              TRY AGAIN
            </button>
          </div>
        )}

      </main>

      <footer className="border-t border-border py-8 text-center">
        <p className="text-gray-600 text-sm font-mono">
          BUILT WITH HATE BY GEMINI & REACT.
        </p>
      </footer>
    </div>
  );
}