import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// Parse JSON bodies — increase limit for base64 images
app.use(express.json({ limit: '50mb' }));

// CORS for development and Firebase App Hosting
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8080',
  ];
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.firebaseapp.com') || origin.endsWith('.hosted.app') || origin.endsWith('.web.app'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// ─── POST /api/analyzeSkin ───────────────────────────────────────────────────
app.post('/api/analyzeSkin', async (req, res) => {
  console.log('[analyzeSkin] Received request, body keys:', Object.keys(req.body || {}));

  const { imageBase64, profile } = req.body;

  if (!imageBase64) {
    console.log('[analyzeSkin] Missing imageBase64 field');
    res.status(400).json({ ok: false, message: 'Missing imageBase64' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[analyzeSkin] GEMINI_API_KEY not set');
    res.status(500).json({ ok: false, message: 'Server configuration error' });
    return;
  }

  try {
    // Dynamic import to avoid bundling issues
    const { GoogleGenAI, Type } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    // imageBase64 can be a single string or an object { front?, left?, right? }
    const images: { front?: string; left?: string; right?: string } =
      typeof imageBase64 === 'string'
        ? { front: imageBase64 }
        : imageBase64;

    const clean = (b64: string) => b64.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, '');

    const parts: any[] = [];
    if (images.front) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: clean(images.front) } });
      parts.push({ text: 'Image 1: Front Face View' });
    }
    if (images.left) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: clean(images.left) } });
      parts.push({ text: 'Image 2: Left Profile View' });
    }
    if (images.right) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: clean(images.right) } });
      parts.push({ text: 'Image 3: Right Profile View' });
    }

    parts.push({ text: `Analyze these skin images for a skincare routine. User Profile: ${JSON.stringify(profile || {})}` });

    console.log('[analyzeSkin] Calling Gemini with', parts.length, 'parts');

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { parts },
      config: {
        systemInstruction: `You are Dr. Beauté Noire, a skincare coaching assistant for melanin-rich skin.

CRITICAL SAFETY RULES:
1. NEVER diagnose diseases or medical conditions (e.g., eczema, psoriasis, cancer).
2. NEVER mention lesions, medical risk, or use clinical diagnostic terms.
3. Frame all observations as "appearance-based coaching signals" (e.g., "appears to have uneven tone" instead of "hyperpigmentation disorder").
4. Prioritize ingredients safe for Fitzpatrick IV-VI (e.g., avoid high % hydroquinone, suggest Tyrosinase inhibitors like Kojic Acid/Alpha Arbutin).
5. Always recommend SPF.

Your task is to generate a personalized skincare routine JSON based on the user's photos and profile. Look for signs of uneven tone, texture, oiliness, or dryness in the provided images to customize the product recommendations.`,
        responseMimeType: 'application/json',
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
                      whyThisProduct: { type: Type.STRING },
                    },
                  },
                },
                required: ['stepOrder', 'title', 'instructions', 'timing', 'productCategory'],
              },
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
                      whyThisProduct: { type: Type.STRING },
                    },
                  },
                },
                required: ['stepOrder', 'title', 'instructions', 'timing', 'productCategory'],
              },
            },
            weekly: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                },
                required: ['title', 'frequency', 'instructions'],
              },
            },
            meta: {
              type: Type.OBJECT,
              properties: {
                focus: { type: Type.STRING },
                safetyNotes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['focus', 'safetyNotes'],
            },
          },
          required: ['morning', 'evening', 'weekly', 'meta'],
        },
      },
    });

    if (response.text) {
      const plan = JSON.parse(response.text);
      console.log('[analyzeSkin] Success, returning plan');
      res.json({ ok: true, plan });
    } else {
      throw new Error('No response text from Gemini');
    }
  } catch (error: any) {
    console.error('[analyzeSkin] Error:', error.message || error);
    res.status(500).json({ ok: false, message: 'Analysis failed', error: error.message });
  }
});

// ─── Static files & SPA fallback (production) ───────────────────────────────
if (NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // In development, Vite dev server handles the frontend on port 3000
  app.get('/', (_req, res) => {
    res.send('Dev server running. Frontend is served by Vite on port 3000.');
  });
}

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] Dr. Beauté Noire server running on http://0.0.0.0:${PORT} (${NODE_ENV})`);
});
