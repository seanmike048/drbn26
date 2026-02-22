import React from 'react';
import CrossLogo from './CrossLogo';

interface BrandHeaderProps {
    size?: 'sm' | 'md' | 'lg';
    showSubtitle?: boolean;
    showDescription?: boolean;
    onClick?: () => void;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({
    size = 'lg',
    showSubtitle = false,
    showDescription = false,
    onClick,
}) => {
    const logoSize = size === 'lg' ? 'h-[120px] w-[120px] md:h-[140px] md:w-[140px]'
        : size === 'md' ? 'h-[72px] w-[72px]'
        : 'h-[32px] w-[32px]';

    return (
        <div
            className={`flex flex-col items-center ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            {/* Logo */}
            <div className={`${logoSize} mb-6`}>
                <CrossLogo
                    size={size === 'lg' ? 140 : size === 'md' ? 72 : 32}
                    className="w-full h-full"
                />
            </div>

            {/* Typography */}
            {(size === 'lg' || size === 'md') && (
                <>
                    {showSubtitle && (
                        <p className="text-gold-accent text-xs font-bold uppercase tracking-[0.3em] mb-2">
                            Docteur
                        </p>
                    )}
                    <h1 className={`font-display text-text-primary leading-tight ${
                        size === 'lg' ? 'text-4xl md:text-5xl' : 'text-2xl'
                    }`}>
                        Beaute Noire
                    </h1>
                </>
            )}

            {showDescription && (
                <div className="mt-6 space-y-2 max-w-xs text-center">
                    <p className="text-text-secondary text-sm font-light leading-relaxed">
                        Get a personalized routine for melanin-rich skin in under 5 minutes.
                    </p>
                    <p className="text-text-secondary text-xs font-light leading-relaxed opacity-60">
                        Quick quiz and photo analysis to refine your results with AI.
                    </p>
                </div>
            )}
        </div>
    );
};

export default BrandHeader;
