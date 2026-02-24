import { useState, useEffect } from 'react';
import { MousePointerClick, GitCommit, FileJson, X } from 'lucide-react';
import { Button } from './ui/button';

export function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('bolna_onboarding_seen');
        if (!hasSeenOnboarding) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('bolna_onboarding_seen', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-md bg-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] animate-in zoom-in-95 duration-500 overflow-hidden ring-1 ring-slate-200">

                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-10 rounded-md p-1.5 text-slate-400 hover:bg-slate-100/80 hover:text-slate-700 transition-colors bg-white/50 backdrop-blur-md"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="relative z-10 mb-8 flex flex-col items-center text-center mt-2">
                    <div className="mb-5">
                        <img src="/favicon.svg" alt="Flow Builder Logo" className="h-[4.5rem] w-[4.5rem] drop-shadow-sm rounded-[14px]" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Flow Builder</h2>
                    <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-[300px]">
                        Design powerful conversational AI nodes logically passing values back and forth.
                    </p>
                </div>

                <div className="relative z-10 space-y-3 mb-8">
                    <div className="flex items-start gap-4 p-3 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <div className="mt-0.5 rounded-md bg-emerald-100/60 p-2.5 text-emerald-500">
                            <MousePointerClick className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Right-Click Canvas</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Easily add new nodes by right-clicking the background.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <div className="mt-0.5 rounded-md bg-orange-100/60 p-2.5 text-orange-500">
                            <GitCommit className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Connect & Edit</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Drag connecting lines between nodes. Click any block to open its configurable properties on the right.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <div className="mt-0.5 rounded-md bg-purple-100/60 p-2.5 text-purple-500">
                            <FileJson className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Live JSON Preview</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Watch your flow compile to perfectly strict JSON mechanically in the bottom black preview terminal.</p>
                        </div>
                    </div>
                </div>

                <Button onClick={handleClose} className="relative z-10 w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-6 rounded-md shadow-lg shadow-slate-900/20 transition-all text-sm tracking-wide">
                    Start Building
                </Button>
            </div>
        </div>
    );
}
