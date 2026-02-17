/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
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

// Premium AI Analysis
export const analyzeSkin = async (images: { front?: string, left?: string, right?: string }, profile: UserProfile): Promise<TodayPlan> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });

  const parts: any[] = [];
  const clean = (b64: string) => b64.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

  if (images.front) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: clean(images.front) } });
      parts.push({ text: "Image 1: Front Face View" });
  }
  if (images.left) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: clean(images.left) } });
      parts.push({ text: "Image 2: Left Profile View" });
  }
  if (images.right) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: clean(images.right) } });
      parts.push({ text: "Image 3: Right Profile View" });
  }

  parts.push({ text: `Analyze these skin images for a skincare routine. User Profile: ${JSON.stringify(profile)}` });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: `You are Dr. Beauté Noire, a skincare coaching assistant for melanin-rich skin.
        
CRITICAL SAFETY RULES:
1. NEVER diagnose diseases or medical conditions (e.g., eczema, psoriasis, cancer).
2. NEVER mention lesions, medical risk, or use clinical diagnostic terms.
3. Frame all observations as "appearance-based coaching signals" (e.g., "appears to have uneven tone" instead of "hyperpigmentation disorder").
4. Prioritize ingredients safe for Fitzpatrick IV-VI (e.g., avoid high % hydroquinone, suggest Tyrosinase inhibitors like Kojic Acid/Alpha Arbutin).
5. Always recommend SPF.

Your task is to generate a personalized skincare routine JSON based on the user's photos and profile. Look for signs of uneven tone, texture, oiliness, or dryness in the provided images to customize the product recommendations.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            morning: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepOrder: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                  timing: { type: Type.STRING },
                  productCategory: { type: Type.STRING },
                  recommendedProduct: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      brand: { type: Type.STRING },
                      keyIngredients: { type: Type.STRING },
                      whyThisProduct: { type: Type.STRING }
                    }
                  }
                },
                required: ["stepOrder", "title", "instructions", "timing", "productCategory"]
              }
            },
            evening: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepOrder: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                  timing: { type: Type.STRING },
                  productCategory: { type: Type.STRING },
                  recommendedProduct: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      brand: { type: Type.STRING },
                      keyIngredients: { type: Type.STRING },
                      whyThisProduct: { type: Type.STRING }
                    }
                  }
                },
                required: ["stepOrder", "title", "instructions", "timing", "productCategory"]
              }
            },
            weekly: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  instructions: { type: Type.STRING }
                },
                required: ["title", "frequency", "instructions"]
              }
            },
            meta: {
              type: Type.OBJECT,
              properties: {
                focus: { type: Type.STRING },
                safetyNotes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["focus", "safetyNotes"]
            }
          },
          required: ["morning", "evening", "weekly", "meta"]
        }
      }
    });
    
    if (response.text) return JSON.parse(response.text) as TodayPlan;
    throw new Error("No response");
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