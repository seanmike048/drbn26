/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import TodayPlanPage from './pages/TodayPlanPage';
import BottomTabBar from './components/layout/BottomTabBar';
import CrossLogo from './components/ui/CrossLogo';
import { UserProfile, TodayPlan } from './types';
import { generateRulesBasedPlan, analyzeSkin } from './services/geminiService';
import { Loader2 } from 'lucide-react';

type ViewState = 'landing' | 'onboarding' | 'dashboard' | 'evolution' | 'products';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentPlan, setCurrentPlan] = useState<TodayPlan | null>(null);
  const [loading, setLoading] = useState(false);

  // Simple routing for bottom tab
  const [activeTab, setActiveTab] = useState('today');

  const handleStart = () => {
    setView('onboarding');
  };

  const goHome = () => {
    setView('landing');
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setLoading(true);
    setUserProfile(profile);
    
    try {
        let plan: TodayPlan;
        
        // If we have skin images (Front/Left/Right), use AI
        if (profile.skinImages && (profile.skinImages.front || profile.skinImages.left || profile.skinImages.right)) {
            plan = await analyzeSkin(profile.skinImages, profile);
        } else {
            // Fallback to rules engine
            // Simulate slight delay for rules engine to feel "processing"
            await new Promise(resolve => setTimeout(resolve, 800));
            plan = generateRulesBasedPlan(profile);
        }

        setCurrentPlan(plan);
        setLoading(false);
        setView('dashboard');
    } catch (error) {
        console.error("Plan generation error:", error);
        // Fallback to rules on error
        const plan = generateRulesBasedPlan(profile);
        setCurrentPlan(plan);
        setLoading(false);
        setView('dashboard');
    }
  };

  const handleTabChange = (tabId: string) => {
      setActiveTab(tabId);
      if (tabId === 'today') setView('dashboard');
      else if (tabId === 'evolution') setView('evolution');
      else if (tabId === 'products') setView('products');
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-[#F6F4E8] flex flex-col items-center justify-center">
              <CrossLogo size={48} className="mb-4 animate-pulse" />
              <Loader2 className="w-6 h-6 text-[#9B7542] animate-spin mb-4" />
              <p className="font-display text-[#1F1A14] text-lg">Dr. Beauté Noire</p>
              <p className="text-[#5A5245] font-light text-sm mt-2">
                {userProfile?.skinImages ? "Analyzing your unique skin profile..." : "Designing your routine..."}
              </p>
          </div>
      );
  }

  return (
    <>
      {view === 'landing' && (
          <LandingPage onStart={handleStart} lang={lang} />
      )}

      {view === 'onboarding' && (
          <OnboardingPage
            onComplete={handleOnboardingComplete}
            onBack={() => setView('landing')}
            onHome={goHome}
            lang={lang}
          />
      )}

      {view === 'dashboard' && currentPlan && userProfile && (
          <>
            <TodayPlanPage plan={currentPlan} user={userProfile} lang={lang} onHome={goHome} />
            <BottomTabBar activeTab="today" onTabChange={handleTabChange} />
          </>
      )}

      {/* Placeholders for other tabs */}
      {view === 'evolution' && (
          <div className="min-h-screen bg-[#F6F4E8] flex flex-col p-6 text-center">
              <div className="flex items-center gap-3 mb-8">
                  <button onClick={goHome} className="p-1 hover:opacity-70 transition-opacity">
                      <CrossLogo size={28} color="#9B7542" />
                  </button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                  <div>
                      <h2 className="font-heading text-2xl text-[#1F1A14] mb-2">Evolution</h2>
                      <p className="text-[#5A5245] mb-6">Track your skin's progress over time.</p>
                      <div className="bg-white/50 p-4 rounded-xl border border-[#D9D1BC] blur-[2px] select-none">
                         Graph placeholder content showing improvement over time.
                      </div>
                      <div className="mt-6 inline-block bg-[#9B7542] text-white px-4 py-2 rounded-lg text-sm font-medium">Premium Feature</div>
                  </div>
              </div>
              <BottomTabBar activeTab="evolution" onTabChange={handleTabChange} />
          </div>
      )}

      {view === 'products' && (
          <div className="min-h-screen bg-[#F6F4E8] flex flex-col p-6 text-center">
              <div className="flex items-center gap-3 mb-8">
                  <button onClick={goHome} className="p-1 hover:opacity-70 transition-opacity">
                      <CrossLogo size={28} color="#9B7542" />
                  </button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                  <div>
                      <h2 className="font-heading text-2xl text-[#1F1A14] mb-2">Products</h2>
                      <p className="text-[#5A5245]">Your curated shelf.</p>
                  </div>
              </div>
              <BottomTabBar activeTab="products" onTabChange={handleTabChange} />
          </div>
      )}
    </>
  );
}

export default App;