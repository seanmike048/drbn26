import React, { useState } from 'react';
import { TodayPlan, UserProfile } from '../types';
import { Sun, Moon, Calendar } from 'lucide-react';

interface Props {
    plan: TodayPlan;
    user: UserProfile;
    lang: string;
}

const TodayPlanPage: React.FC<Props> = ({ plan, user, lang }) => {
    const [tab, setTab] = useState<'am' | 'pm' | 'weekly'>('am');

    const renderRoutine = (steps: typeof plan.morning) => (
        <div className="space-y-6 animate-fade-in pb-24">
            {steps.map((step, idx) => (
                <div key={idx} className="bg-bg-surface border-b border-border-divider last:border-0 pb-6 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-gold-primary text-text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {step.stepOrder}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-body font-medium text-lg text-text-primary mb-1">{step.title}</h4>
                            <span className="text-xs font-bold uppercase tracking-widest text-gold-accent mb-2 block">{step.productCategory} • {step.timing}</span>
                            <p className="text-text-secondary font-light leading-relaxed mb-4">{step.instructions}</p>
                            
                            {step.recommendedProduct && (
                                <div className="bg-bg-product-card p-4 rounded-card border border-border-light">
                                    <span className="text-xs font-bold uppercase text-gold-primary mb-1 block">Recommended</span>
                                    <div className="font-medium text-text-primary">{step.recommendedProduct.name}</div>
                                    <div className="text-xs text-text-secondary mt-1">{step.recommendedProduct.brand}</div>
                                    <div className="text-xs text-text-primary mt-2 italic">"{step.recommendedProduct.whyThisProduct}"</div>
                                </div>
                            )}
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
                <h1 className="font-display text-xl text-text-primary">Today</h1>
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
                        onClick={() => setTab('am')} 
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${tab === 'am' ? 'bg-bg-surface shadow-sm text-text-primary' : 'text-text-secondary'}`}
                    >
                        <Sun size={16} /> <span className="text-xs font-bold uppercase">AM</span>
                    </button>
                    <button 
                        onClick={() => setTab('pm')} 
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${tab === 'pm' ? 'bg-bg-surface shadow-sm text-text-primary' : 'text-text-secondary'}`}
                    >
                        <Moon size={16} /> <span className="text-xs font-bold uppercase">PM</span>
                    </button>
                    <button 
                        onClick={() => setTab('weekly')} 
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${tab === 'weekly' ? 'bg-bg-surface shadow-sm text-text-primary' : 'text-text-secondary'}`}
                    >
                        <Calendar size={16} /> <span className="text-xs font-bold uppercase">Week</span>
                    </button>
                </div>

                {/* Content */}
                {tab === 'am' && renderRoutine(plan.morning)}
                {tab === 'pm' && renderRoutine(plan.evening)}
                {tab === 'weekly' && (
                    <div className="space-y-4">
                        {plan.weekly.map((action, i) => (
                            <div key={i} className="bg-bg-surface p-5 rounded-xl border border-border-default">
                                <h4 className="font-medium text-lg mb-1">{action.title}</h4>
                                <span className="text-xs font-bold uppercase text-gold-accent mb-2 block">{action.frequency}</span>
                                <p className="text-text-secondary font-light">{action.instructions}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodayPlanPage;