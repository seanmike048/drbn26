/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

export type Language = 'en' | 'fr';

export interface UserProfile {
    name?: string;
    age?: number;
    gender?: string;
    location?: string;
    climate?: string;
    skinType?: string;
    sensitivity?: 'low' | 'medium' | 'high';
    shaving?: string;
    skinHistory?: string;
    goals?: string[];
    currentRoutine?: string;
    budget?: 'budget' | 'standard' | 'premium';
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

export interface AnalysisData {
    meta: {
        title: string;
        artist: string;
        year: string;
        movement: string;
    };
    technical_dashboard: {
        tags: string[];
        color_palette_hex: string[];
        influences: string[];
        similar_artists: string[];
    };
    narrative: {
        the_scene: string;
        the_context: string;
        the_soul: string;
    }
}

export interface AnalysisResult {
    imageBase64: string;
    data: AnalysisData;
}