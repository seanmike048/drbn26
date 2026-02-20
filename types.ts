/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

export type Language = 'en' | 'fr';
export type Tier = 'guest' | 'free' | 'premium';

// 10-question onboarding profile
export interface UserProfile {
    // Q1: Age (18+ gate)
    age?: number;
    // Q2: Name
    name?: string;
    // Q3: Country + Climate
    country?: string;
    climate?: 'tropical' | 'dry' | 'temperate' | 'continental' | 'polar';
    // Q4: Sun exposure
    sunExposure?: 'low' | 'moderate' | 'high';
    // Q5: Skin type
    skinType?: string;
    // Q6: Sensitivity
    sensitivity?: 'low' | 'medium' | 'high';
    // Q7: Goals (multi-select, max 3)
    goals?: string[];
    // Q8: Breakouts / PIH / raised scars
    breakouts?: 'never' | 'occasional' | 'frequent';
    pihConcern?: boolean;
    raisedScars?: boolean;
    // Q9: Hair removal method
    hairRemoval?: 'none' | 'shaving' | 'waxing' | 'laser' | 'other';
    ingrownConcern?: boolean;
    // Q10: Preferences & Budget
    fragranceFree?: boolean;
    budget?: 'budget' | 'standard' | 'premium';
    knownActives?: string[];

    // Legacy fields
    gender?: string;
    location?: string;
    shaving?: string;
    skinHistory?: string;
    currentRoutine?: string;

    // Photos
    skinImages?: {
        front?: string;
        left?: string;
        right?: string;
    };
}

export interface RoutineStep {
    stepOrder: number;
    title: string;
    instructions: string;
    timing: string;
    productCategory: string;
    recommendedProduct?: {
        name: string;
        brand: string;
        keyIngredients: string;
        whyThisProduct: string;
    };
}

export interface WeeklyAction {
    title: string;
    frequency: string;
    instructions: string;
}

export interface TodayPlan {
    morning: RoutineStep[];
    evening: RoutineStep[];
    weekly: WeeklyAction[];
    meta: {
        focus: string;
        safetyNotes: string[];
    }
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  longDescription?: string;
  features: string[];
  ingredients?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface JournalArticle {
  id: string;
  title: string;
  excerpt: string;
  content: React.ReactNode | string;
  date: string;
  image: string;
}
