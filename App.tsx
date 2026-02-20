/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import TodayPlanPage from './pages/TodayPlanPage';
import ProductsPage from './pages/ProductsPage';
import BottomTabBar from './components/layout/BottomTabBar';
import CrossLogo from './components/ui/CrossLogo';
import { UserProfile, TodayPlan, Tier, Language } from './types';
import { generateRulesBasedPlan, analyzeSkin } from './services/geminiService';
import { getTranslation } from './constants';
import { Loader2, Lock, TrendingUp } from 'lucide-react';

type ViewState = 'landing' | 'onboarding' | 'dashboard' | 'evolution' | 'products';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [lang, setLang] = useState<Language>('en');
  const [tier, setTier] = useState<Tier>('guest');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentPlan, setCurrentPlan] = useState<TodayPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('today');

  const t = getTranslation(lang);

  const handleStart = (selectedTier: Tier) => {
    setTier(selectedTier);
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

        // Guest: always rule-based (0 AI)
        // Free/Premium with images: use AI
        // Free/Premium without images: use rules
        if (tier === 'guest') {
            await new Promise(resolve => setTimeout(resolve, 800));
            plan = generateRulesBasedPlan(profile);
        } else if (profile.skinImages && (profile.skinImages.front || profile.skinImages.left || profile.skinImages.right)) {
            plan = await analyzeSkin(profile.skinImages, profile);
        } else {
            await new Promise(resolve => setTimeout(resolve, 800));
            plan = generateRulesBasedPlan(profile);
        }

        setCurrentPlan(plan);
        setLoading(false);
        setView('dashboard');
        setActiveTab('today');
    } catch (error) {
        console.error("Plan generation error:", error);
        const plan = generateRulesBasedPlan(profile);
        setCurrentPlan(plan);
        setLoading(false);
        setView('dashboard');
        setActiveTab('today');
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
              <CrossLogo size={56} className="mb-6 animate-pulse" />
              <Loader2 className="w-6 h-6 text-[#9B7542] animate-spin mb-4" />
              <p className="font-display text-[#1F1A14] text-lg">Dr. Beaute Noire</p>
              <p className="text-[#5A5245] font-light text-sm mt-2">
                {tier !== 'guest' && userProfile?.skinImages ? t.analyzingAI : t.generating}
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
            tier={tier}
          />
      )}

      {view === 'dashboard' && currentPlan && userProfile && (
          <>
            <TodayPlanPage plan={currentPlan} user={userProfile} lang={lang} onHome={goHome} />
            <BottomTabBar activeTab="today" onTabChange={handleTabChange} />
          </>
      )}

      {view === 'evolution' && (
          <div className="min-h-screen bg-[#F6F4E8] flex flex-col">
              {/* Top Bar */}
              <div className="sticky top-0 bg-[#F6F4E8]/95 backdrop-blur z-20 px-5 py-4 border-b border-[#D9D1BC] flex items-center gap-3">
                  <button onClick={goHome} className="p-1 hover:opacity-70 transition-opacity">
                      <CrossLogo size={28} />
                  </button>
                  <h1 className="font-display text-xl text-[#1F1A14]">{t.evolution}</h1>
              </div>
              <div className="flex-1 flex items-center justify-center p-6 text-center">
                  <div>
                      <div className="w-16 h-16 bg-[rgba(155,117,66,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                          {tier === 'premium' ? (
                              <TrendingUp size={28} className="text-[#9B7542]" />
                          ) : (
                              <Lock size={28} className="text-[#9B7542]" />
                          )}
                      </div>
                      <h2 className="font-heading text-2xl text-[#1F1A14] mb-2">{t.evolution}</h2>
                      <p className="text-[#5A5245] mb-6 font-light">
                          {lang === 'fr'
                              ? "Suivez l'evolution de votre peau au fil du temps."
                              : "Track your skin's progress over time."
                          }
                      </p>
                      {tier !== 'premium' && (
                          <div className="inline-block bg-[#9B7542] text-white px-4 py-2 rounded-lg text-sm font-medium">
                              {t.locked}
                          </div>
                      )}
                  </div>
              </div>
              <BottomTabBar activeTab="evolution" onTabChange={handleTabChange} />
          </div>
      )}

      {view === 'products' && (
          <>
            <ProductsPage plan={currentPlan} lang={lang} onHome={goHome} />
            <BottomTabBar activeTab="products" onTabChange={handleTabChange} />
          </>
      )}
    </>
  );
}

export default App;
