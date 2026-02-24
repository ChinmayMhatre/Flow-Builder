import { useState, useEffect } from 'react';
import { MousePointerClick, Zap, GitCommit, FileJson, X } from 'lucide-react';
import { Button } from './ui/button';

export function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // const hasSeenOnboarding = localStorage.getItem('bolna_onboarding_seen');
        // if (!hasSeenOnboarding) {
        //     setIsOpen(true);
        // }

        // Temporarily commented for debugging
        setIsOpen(true);
    }, []);

    const handleClose = () => {
        // localStorage.setItem('bolna_onboarding_seen', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-600 shadow-sm">
                        <Zap className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Welcome to Visual Builder</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Design powerful conversational AI nodes logically passing values back and forth.
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="mt-0.5 rounded-lg bg-emerald-100 p-2 text-emerald-600">
                            <MousePointerClick className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800">Right-Click Canvas</h3>
                            <p className="text-xs text-slate-500">Easily add new nodes or toggle the MiniMap by right-clicking the background.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="mt-0.5 rounded-lg bg-orange-100 p-2 text-orange-600">
                            <GitCommit className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800">Connect & Edit</h3>
                            <p className="text-xs text-slate-500">Drag connecting lines between nodes. Click any block to open its configurable properties on the right.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="mt-0.5 rounded-lg bg-purple-100 p-2 text-purple-600">
                            <FileJson className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800">Live JSON Preview</h3>
                            <p className="text-xs text-slate-500">Watch your flow compile to perfectly strict JSON mechanically in the bottom black preview terminal.</p>
                        </div>
                    </div>
                </div>

                <Button onClick={handleClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all">
                    Start Building
                </Button>
            </div>
        </div>
    );
}
