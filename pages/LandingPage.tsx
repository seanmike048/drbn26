import React from 'react';
import { BRAND_NAME } from '../constants';
import Button from '../components/ui/Button';
import CrossLogo from '../components/ui/CrossLogo';

interface Props {
    onStart: () => void;
    lang: string;
}

const LandingPage: React.FC<Props> = ({ onStart, lang }) => {
    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>

            <div className="z-10 animate-fade-in max-w-md w-full flex flex-col items-center">
                {/* Cross Logo */}
                <div className="mb-8">
                    <CrossLogo size={96} color="#9B7542" />
                </div>

                <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-3 leading-tight">
                    {BRAND_NAME}
                </h1>

                <p className="font-body text-text-secondary text-lg font-light mb-12">
                    {lang === 'fr' ? 'Votre partenaire beauté expert des peaux riches en mélanine.' : 'Your beauty partner for melanin-rich skin.'}
                </p>

                <div className="space-y-4 w-full">
                    <Button onClick={onStart} fullWidth className="rounded-cta text-lg">
                        {lang === 'fr' ? 'Commencer' : 'Start Your Routine'}
                    </Button>
                    <p className="text-xs text-text-secondary font-light mt-6 opacity-60">
                        {lang === 'fr' ? 'Coaching cosmétique uniquement. Pas de conseils médicaux.' : 'Cosmetic coaching only. No medical advice.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
