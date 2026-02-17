
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { AnalysisResult, Language } from '../types';
import { getTranslation } from '../constants';
import { ArrowLeft } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
  language: Language;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset, language }) => {
  const { data } = result;
  const t = getTranslation(language);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full max-w-[1200px] mx-auto pb-32 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      
      <button 
        onClick={onReset}
        className="group mb-12 flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors uppercase tracking-widest"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
        <span>{t.back}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
        
        {/* Left Column: Image */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <div className="bg-white dark:bg-[#27272A] p-2 shadow-2xl shadow-black/5 rounded-sm">
             <div className="aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
                <img 
                    src={result.imageBase64} 
                    alt={data.meta.title} 
                    className="w-full h-full object-cover"
                />
             </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-3">
             {/* Display tags from technical_dashboard */}
            {data.technical_dashboard?.tags?.map((tag, i) => (
                <span key={i} className="px-4 py-1.5 border border-neutral-200 dark:border-neutral-700 text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400 rounded-full">
                    {tag}
                </span>
            ))}
          </div>
        </div>

        {/* Right Column: Editorial & Dashboard */}
        <div className="lg:col-span-7 flex flex-col gap-12 pt-8">
            
            {/* 1. HEADER */}
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                <span className="block text-xs font-bold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500 mb-6">
                    {data.meta.movement} • {data.meta.year}
                </span>
                <h1 className="text-5xl md:text-7xl font-light tracking-tighter leading-[1.1] mb-6 text-[#000000] dark:text-[#E4E4E7]">
                    {data.meta.title}
                </h1>
                <p className="text-xl md:text-2xl font-light text-neutral-500 dark:text-neutral-400">
                    by {data.meta.artist}
                </p>
            </div>

            {/* 2. TECHNICAL DASHBOARD */}
            <div className="bg-neutral-50 dark:bg-neutral-800/30 p-8 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
                
                {/* Color Palette */}
                {data.technical_dashboard?.color_palette_hex && data.technical_dashboard.color_palette_hex.length > 0 && (
                    <div>
                         <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-4">{t.palette}</h3>
                         <div className="flex gap-3 flex-wrap">
                            {data.technical_dashboard.color_palette_hex.map((color, i) => (
                                <div 
                                    key={i} 
                                    className="w-10 h-10 rounded-full shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Influences */}
                {data.technical_dashboard?.influences && data.technical_dashboard.influences.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-4">{t.influences}</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.technical_dashboard.influences.map((inf, i) => (
                                <span key={i} className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-300 rounded-full">
                                    {inf}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Similar Artists */}
                {data.technical_dashboard?.similar_artists && data.technical_dashboard.similar_artists.length > 0 && (
                    <div>
                         <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-4">{t.similar}</h3>
                         <div className="flex flex-wrap gap-2">
                            {data.technical_dashboard.similar_artists.map((artist, i) => (
                                <button 
                                    key={i} 
                                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-xs font-medium uppercase tracking-wider text-neutral-800 dark:text-neutral-200 rounded-full hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
                                >
                                    {artist}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 3. NARRATIVE */}
            
            {/* Chapter 1: The Scene */}
            <div className="pt-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-300 mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-neutral-300 dark:bg-neutral-700"></span>
                    {t.scene}
                </h3>
                <p className="text-lg md:text-xl font-light leading-loose text-neutral-600 dark:text-neutral-400 max-w-2xl">
                    {data.narrative.the_scene}
                </p>
            </div>

            {/* Chapter 2: The Context */}
            <div className="pt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-300 mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-neutral-300 dark:bg-neutral-700"></span>
                    {t.context}
                </h3>
                <p className="text-lg md:text-xl font-light leading-loose text-neutral-600 dark:text-neutral-400 max-w-2xl">
                    {data.narrative.the_context}
                </p>
            </div>

            {/* Chapter 3: The Soul */}
            <div className="pt-8 animate-fade-in" style={{ animationDelay: '700ms' }}>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-300 mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-neutral-300 dark:bg-neutral-700"></span>
                    {t.soul}
                </h3>
                <p className="text-2xl md:text-3xl font-normal leading-tight text-neutral-900 dark:text-neutral-200 max-w-2xl italic font-serif pl-8 border-l-2 border-neutral-200 dark:border-neutral-800">
                    {data.narrative.the_soul}
                </p>
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
