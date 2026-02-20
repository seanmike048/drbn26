import React, { useState, useRef, useCallback } from 'react';
import { TodayPlan, UserProfile } from '../types';
import { Sun, Moon, Calendar } from 'lucide-react';
import CrossLogo from '../components/ui/CrossLogo';

interface Props {
    plan: TodayPlan;
    user: UserProfile;
    lang: string;
    onHome: () => void;
}

const TABS = ['am', 'pm', 'weekly'] as const;
type Tab = typeof TABS[number];

const TodayPlanPage: React.FC<Props> = ({ plan, user, lang, onHome }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const tab = TABS[tabIndex];

    // Swipe handling
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const swiping = useRef(false);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        swiping.current = true;
    }, []);

    const onTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!swiping.current) return;
        swiping.current = false;

        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;

        // Only trigger if horizontal swipe is dominant and > 50px
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0 && tabIndex < TABS.length - 1) {
                setTabIndex(tabIndex + 1);
            } else if (dx > 0 && tabIndex > 0) {
                setTabIndex(tabIndex - 1);
            }
        }
    }, [tabIndex]);

    const renderRoutine = (steps: typeof plan.morning) => (
        <div className="space-y-6 pb-24">
            {steps.map((step, idx) => (
                <div key={idx} className="bg-bg-surface border-b border-border-divider last:border-0 pb-6 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-gold-primary text-text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {step.stepOrder}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-body font-medium text-lg text-text-primary mb-1">{step.title}</h4>
                            <span className="text-xs font-bold uppercase tracking-widest text-gold-accent mb-2 block">{step.productCategory} • {step.timing}</span>
                            <p className="text-text-secondary font-light leading-relaxed">{step.instructions}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Top Bar */}
            <div className="sticky top-0 bg-bg-primary/95 backdrop-blur z-20 px-5 py-4 border-b border-border-default flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={onHome} className="p-1 hover:opacity-70 transition-opacity">
                        <CrossLogo size={28} />
                    </button>
                    <h1 className="font-display text-xl text-text-primary">Today</h1>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                    {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short', day: 'numeric' })}
                </div>
            </div>

            <div className="p-5">
                {/* Greeting */}
                <div className="mb-8">
                    <h2 className="font-heading text-3xl text-text-primary mb-2">Bonjour, {user.name || 'Guest'}</h2>
                    <p className="text-text-secondary font-light">
                        {lang === 'fr' ? 'Votre focus aujourd\'hui :' : 'Your focus today:'} <span className="text-gold-primary font-medium">{plan.meta.focus}</span>
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-bg-muted p-1 rounded-xl flex gap-1 mb-8">
                    <button
                        onClick={() => setTabIndex(0)}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${tab === 'am' ? 'bg-bg-surface shadow-sm text-text-primary' : 'text-text-secondary'}`}
                    >
                        <Sun size={16} /> <span className="text-xs font-bold uppercase">AM</span>
                    </button>
                    <button
                        onClick={() => setTabIndex(1)}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${tab === 'pm' ? 'bg-bg-surface shadow-sm text-text-primary' : 'text-text-secondary'}`}
                    >
                        <Moon size={16} /> <span className="text-xs font-bold uppercase">PM</span>
                    </button>
                    <button
                        onClick={() => setTabIndex(2)}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${tab === 'weekly' ? 'bg-bg-surface shadow-sm text-text-primary' : 'text-text-secondary'}`}
                    >
                        <Calendar size={16} /> <span className="text-xs font-bold uppercase">Week</span>
                    </button>
                </div>

                {/* Swipeable Content */}
                <div
                    className="overflow-hidden"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-400 ease-out"
                        style={{ transform: `translateX(-${tabIndex * 100}%)`, transitionDuration: '350ms' }}
                    >
                        {/* AM Panel */}
                        <div className="w-full flex-shrink-0">
                            {renderRoutine(plan.morning)}
                        </div>
                        {/* PM Panel */}
                        <div className="w-full flex-shrink-0">
                            {renderRoutine(plan.evening)}
                        </div>
                        {/* Weekly Panel */}
                        <div className="w-full flex-shrink-0">
                            <div className="space-y-4 pb-24">
                                {plan.weekly.map((action, i) => (
                                    <div key={i} className="bg-bg-surface p-5 rounded-xl border border-border-default">
                                        <h4 className="font-medium text-lg mb-1">{action.title}</h4>
                                        <span className="text-xs font-bold uppercase text-gold-accent mb-2 block">{action.frequency}</span>
                                        <p className="text-text-secondary font-light">{action.instructions}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Swipe hint */}
                <div className="flex justify-center gap-1.5 mt-2 pb-4">
                    {TABS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === tabIndex ? 'w-6 bg-gold-primary' : 'w-1.5 bg-gold-20'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TodayPlanPage;
