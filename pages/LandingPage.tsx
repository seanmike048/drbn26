import React, { useState } from 'react';
import { getTranslation } from '../constants';
import { Language, Tier } from '../types';
import Button from '../components/ui/Button';
import BrandHeader from '../components/ui/BrandHeader';
import { AlertCircle } from 'lucide-react';

interface Props {
    onStart: (tier: Tier) => void;
    onLogin: () => void;
    onSignup: () => void;
    lang: Language;
}

/** Create a guest session in localStorage */
function createGuestSession() {
    const guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const session = {
        guestId,
        createdAt: new Date().toISOString(),
    };
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('guestSession', JSON.stringify(session));
}

const LandingPage: React.FC<Props> = ({ onStart, onLogin, onSignup, lang }) => {
    const t = getTranslation(lang);
    const [ageGate, setAgeGate] = useState<'pending' | 'confirmed' | 'blocked'>('pending');

    // Age gate — blocked
    if (ageGate === 'blocked') {
        return (
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 text-center">
                <AlertCircle size={48} className="text-gold-primary mb-4" />
                <p className="font-heading text-xl text-text-primary mb-2">{t.ageGateBlocked}</p>
            </div>
        );
    }

    // Age gate — pending
    if (ageGate === 'pending') {
        return (
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 text-center">
                <div className="animate-fade-in max-w-sm w-full">
                    <BrandHeader size="md" />
                    <div className="mt-8">
                        <h2 className="font-heading text-2xl text-text-primary mb-2">{t.ageGateTitle}</h2>
                        <p className="text-text-secondary font-light text-sm mb-8">{t.ageGateSubtitle}</p>
                        <div className="flex gap-3">
                            <Button fullWidth onClick={() => setAgeGate('confirmed')}>
                                {t.yes}
                            </Button>
                            <Button fullWidth variant="outline" onClick={() => setAgeGate('blocked')}>
                                {t.no}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main landing
    const handleGuest = () => {
        createGuestSession();
        onStart('guest');
    };

    const handleStartRoutine = () => {
        // If not logged in, go to onboarding as guest flow
        // Auth state will be checked once Firebase is wired
        onStart('guest');
    };

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none" />

            <div className="z-10 animate-fade-in max-w-sm w-full flex flex-col items-center">
                {/* Brand header: logo + DOCTEUR + BEAUTE NOIRE + description */}
                <BrandHeader size="lg" showSubtitle showDescription />

                {/* CTAs */}
                <div className="w-full mt-10 space-y-4">
                    {/* Primary CTA */}
                    <Button
                        fullWidth
                        onClick={handleStartRoutine}
                        className="h-[52px] md:h-[56px] text-base rounded-cta"
                    >
                        {t.signIn === 'Sign In' ? 'Start Your Routine' : 'Commencer votre routine'}
                    </Button>

                    {/* Secondary: Log in + Sign up side by side */}
                    <div className="flex gap-3">
                        <Button fullWidth variant="outline" onClick={onLogin} className="rounded-cta">
                            {lang === 'fr' ? 'Se connecter' : 'Log in'}
                        </Button>
                        <Button fullWidth variant="outline" onClick={onSignup} className="rounded-cta">
                            {lang === 'fr' ? "S'inscrire" : 'Sign up'}
                        </Button>
                    </div>

                    {/* Tertiary: Continue as guest */}
                    <div className="flex justify-center pt-2">
                        <button
                            onClick={handleGuest}
                            className="text-sm text-text-secondary underline underline-offset-4 decoration-border-default hover:text-text-primary hover:decoration-gold-primary transition-all duration-200 py-1"
                        >
                            {t.continueGuest}
                        </button>
                    </div>
                </div>

                {/* Disclaimer */}
                <p className="text-[10px] text-text-secondary font-light mt-10 opacity-40 max-w-[280px] leading-relaxed text-center">
                    {t.disclaimer}
                </p>
            </div>
        </div>
    );
};

export default LandingPage;
