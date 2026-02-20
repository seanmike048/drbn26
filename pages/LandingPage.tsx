import React, { useState } from 'react';
import { BRAND_NAME, getTranslation } from '../constants';
import { Language, Tier } from '../types';
import Button from '../components/ui/Button';
import CrossLogo from '../components/ui/CrossLogo';
import { AlertCircle } from 'lucide-react';

interface Props {
    onStart: (tier: Tier) => void;
    lang: Language;
}

const LandingPage: React.FC<Props> = ({ onStart, lang }) => {
    const t = getTranslation(lang);
    const [ageGate, setAgeGate] = useState<'pending' | 'confirmed' | 'blocked'>('pending');

    if (ageGate === 'blocked') {
        return (
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 text-center">
                <AlertCircle size={48} className="text-gold-primary mb-4" />
                <p className="font-heading text-xl text-text-primary mb-2">{t.ageGateBlocked}</p>
            </div>
        );
    }

    if (ageGate === 'pending') {
        return (
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 text-center">
                <div className="animate-fade-in max-w-sm w-full">
                    <CrossLogo size={72} className="mx-auto mb-6" />
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
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent" />

            <div className="z-10 animate-fade-in max-w-md w-full flex flex-col items-center">
                {/* Cross Logo */}
                <div className="mb-8">
                    <CrossLogo size={120} />
                </div>

                <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-2 leading-tight">
                    {BRAND_NAME}
                </h1>

                <p className="font-body text-text-secondary text-base font-light mb-2">
                    {t.tagline}
                </p>
                <p className="font-body text-text-secondary text-sm font-light mb-10 opacity-70">
                    {t.subtitle}
                </p>

                <div className="space-y-3 w-full">
                    {/* Sign In — future Firebase Auth */}
                    <Button fullWidth onClick={() => onStart('free')}>
                        {t.signIn}
                    </Button>

                    {/* Sign Up — future Firebase Auth */}
                    <Button fullWidth variant="outline" onClick={() => onStart('free')}>
                        {t.signUp}
                    </Button>

                    {/* Guest */}
                    <button
                        onClick={() => onStart('guest')}
                        className="w-full text-sm text-text-secondary underline underline-offset-4 hover:text-text-primary transition-colors py-2"
                    >
                        {t.continueGuest}
                    </button>
                </div>

                <p className="text-[10px] text-text-secondary font-light mt-8 opacity-50 max-w-xs leading-relaxed">
                    {t.disclaimer}
                </p>
            </div>
        </div>
    );
};

export default LandingPage;
