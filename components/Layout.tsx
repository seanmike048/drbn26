/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../constants';
import { Sun, Moon, Aperture } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  onHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  language, 
  onLanguageChange, 
  isDark, 
  onThemeToggle,
  onHome 
}) => {
  const t = getTranslation(language);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-700 ${isDark ? 'dark' : ''}`}>
      {/* Background container to handle transition smoothly */}
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#18181b] text-[#000000] dark:text-[#E4E4E7] transition-colors duration-700">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#F5F5F7]/80 dark:bg-[#18181b]/80 backdrop-blur-xl px-6 md:px-12 py-6 flex justify-between items-center transition-colors duration-700">
          <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={onHome}
          >
            <Aperture strokeWidth={1} size={24} className="opacity-80 group-hover:rotate-90 transition-transform duration-700" />
            <h1 className="text-xl font-medium tracking-tight font-serif">
              {t.appName}
            </h1>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            {/* Language Toggle */}
            <div className="flex items-center gap-1 text-xs font-medium tracking-widest uppercase">
              <button 
                onClick={() => onLanguageChange('en')}
                className={`transition-opacity ${language === 'en' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
              >
                EN
              </button>
              <span className="opacity-20">/</span>
              <button 
                onClick={() => onLanguageChange('fr')}
                className={`transition-opacity ${language === 'fr' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
              >
                FR
              </button>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={onThemeToggle}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              {isDark ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 md:p-12 relative z-10 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
