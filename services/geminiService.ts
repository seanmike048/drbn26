/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { UserProfile, TodayPlan } from "../types";

// Fallback Rules Engine (Mocked for Guest Tier)
export const generateRulesBasedPlan = (profile: UserProfile): TodayPlan => {
    // Simple deterministic logic based on skin type
    const isDry = profile.skinType === 'dry';
    
    return {
        morning: [
            {
                stepOrder: 1,
                title: "Cleanse",
                instructions: isDry ? "Use a creamy, non-foaming cleanser." : "Use a gentle foaming cleanser.",
                timing: "60 seconds",
                productCategory: "Cleanser",
                recommendedProduct: {
                    name: isDry ? "Hydrating Milk Cleanser" : "Clarifying Gel Cleanser",
                    brand: "Generic Safe",
                    keyIngredients: isDry ? "Glycerin, Ceramides" : "Salicylic Acid, Niacinamide",
                    whyThisProduct: isDry ? "Preserves moisture barrier." : "Controls excess sebum."
                }
            },
            {
                stepOrder: 2,
                title: "Hydrate & Protect",
                instructions: "Apply moisturizer with SPF 30+.",
                timing: "30 seconds",
                productCategory: "Moisturizer + SPF",
                recommendedProduct: {
                    name: "Invisible Shield SPF 50",
                    brand: "Melanin Care",
                    keyIngredients: "Avobenzone, Vitamin E",
                    whyThisProduct: "No white cast, full protection."
                }
            }
        ],
        evening: [
            {
                stepOrder: 1,
                title: "Double Cleanse",
                instructions: "Remove SPF and pollutants thoroughly.",
                timing: "2 minutes",
                productCategory: "Oil Cleanser + Water Cleanser",
            },
            {
                stepOrder: 2,
                title: "Treat",
                instructions: "Apply active treatment for hyperpigmentation.",
                timing: "Overnight",
                productCategory: "Serum",
                recommendedProduct: {
                    name: "Brightening Serum",
                    brand: "Glow Lab",
                    keyIngredients: "Vitamin C, Alpha Arbutin",
                    whyThisProduct: "Targets dark spots safely."
                }
            }
        ],
        weekly: [
            {
                title: "Exfoliate",
                frequency: "1-2x per week",
                instructions: "Use a gentle chemical exfoliant (AHA/BHA)."
            }
        ],
        meta: {
            focus: "Hydration and Protection",
            safetyNotes: ["Always patch test new products.", "Wear SPF daily, even indoors."]
        }
    };
};

// Premium AI Analysis — calls the server endpoint /api/analyzeSkin
export const analyzeSkin = async (images: { front?: string, left?: string, right?: string }, profile: UserProfile): Promise<TodayPlan> => {
  console.log('[analyzeSkin] Sending images to server. Keys:', Object.keys(images).filter(k => !!(images as any)[k]));

  try {
    const response = await fetch('/api/analyzeSkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: images,
        profile,
      }),
    });

    console.log('[analyzeSkin] Server response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[analyzeSkin] Server error:', errorData);
      throw new Error(errorData.message || 'Server error');
    }

    const data = await response.json();
    if (data.ok && data.plan) {
      return data.plan as TodayPlan;
    }
    throw new Error('Invalid response from server');
  } catch (error) {
    console.error("AI Analysis Failed, falling back to rules:", error);
    return generateRulesBasedPlan(profile); // Fallback
  }
};

// Assistant Chat
export const sendMessageToGemini = async (history: { role: 'user' | 'model', text: string }[], message: string): Promise<string> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey });
    const chat: Chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: 'You are Dr. Beauté Noire, a helpful assistant expert in skincare for melanin-rich skin.',
        },
        history: history.map(h => ({
            role: h.role,
            parts: [{ text: h.text }]
        }))
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't generate a response.";
};