import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth, className = '', ...props }) => {
    const base = "h-[44px] md:h-[56px] px-6 rounded-button font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    
    const variants = {
        primary: "bg-gold-primary text-text-onGold hover:bg-gold-accent shadow-cta",
        outline: "border border-border-default text-text-primary hover:border-gold-primary hover:text-gold-primary",
        ghost: "bg-transparent text-text-secondary hover:text-text-primary"
    };

    return (
        <button 
            className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;