/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { JournalArticle, Language, Product } from './types';

export const BRAND_NAME = "Dr. Beauté Noire";

export const TRANSLATIONS = {
    en: {
        // Landing
        tagline: "Your beauty partner",
        subtitle: "Daily skincare coaching for melanin-rich skin",
        signIn: "Sign In",
        signUp: "Sign Up",
        continueGuest: "Continue as Guest",
        disclaimer: "Dr. Beauté Noire provides cosmetic coaching based on appearance. This is not a medical diagnosis. Consult a dermatologist for skin conditions.",
        appName: "Dr. Beauté Noire",

        // Age gate
        ageGateTitle: "Are you 18 or older?",
        ageGateSubtitle: "This app is designed for adults only.",
        yes: "Yes, I'm 18+",
        no: "No",
        ageGateBlocked: "Sorry, this app is for adults 18 and older.",

        // Questionnaire steps
        q1Title: "How old are you?",
        q2Title: "What's your name?",
        q3Title: "Where do you live?",
        q4Title: "Sun exposure",
        q4Subtitle: "How much sun do you get daily?",
        q5Title: "Your skin type",
        q6Title: "Skin sensitivity",
        q7Title: "Your goals",
        q7Subtitle: "Select up to 3",
        q8Title: "Skin concerns",
        q9Title: "Hair removal",
        q10Title: "Preferences & Budget",

        // Q3 options
        climateTropical: "Tropical / Humid",
        climateDry: "Dry / Arid",
        climateTemperate: "Temperate",
        climateContinental: "Continental",
        climatePolar: "Cold / Polar",

        // Q4 options
        sunLow: "Low (mostly indoors)",
        sunModerate: "Moderate (some outdoor time)",
        sunHigh: "High (outdoors daily)",

        // Q5 options
        skinDry: "Dry",
        skinOily: "Oily",
        skinCombo: "Combination",
        skinNormal: "Normal",

        // Q6 options
        sensitivityLow: "Low — rarely reacts",
        sensitivityMedium: "Medium — sometimes reacts",
        sensitivityHigh: "High — reacts easily",

        // Q7 options
        goalHydration: "Hydration",
        goalAcne: "Acne Control",
        goalEvenTone: "Even Tone",
        goalAntiAging: "Anti-Aging",
        goalTexture: "Smooth Texture",
        goalBrightness: "Brightness / Glow",

        // Q8 options
        breakoutsNever: "Never / Rarely",
        breakoutsOccasional: "Occasional",
        breakoutsFrequent: "Frequent",
        pihConcern: "I have dark spots after breakouts (PIH)",
        raisedScars: "I have raised or keloid scars",

        // Q9 options
        hairNone: "None",
        hairShaving: "Shaving",
        hairWaxing: "Waxing",
        hairLaser: "Laser",
        hairOther: "Other",
        ingrownConcern: "I get ingrown hairs / razor bumps",

        // Q10 options
        fragranceFree: "I prefer fragrance-free products",
        budgetLabel: "Monthly skincare budget",

        // Photo analysis
        photoTitle: "Photo Analysis",
        photoSubtitleFree: "Take a front photo for a basic AI skin analysis.",
        photoSubtitlePremium: "Take 3 photos for a complete AI analysis: Front, Left, Right.",
        startCapture: "Start Capture",
        selectPhotos: "Select Photos",
        takePhotos: "Take Photos",
        skipPhotos: "Continue without photos",
        confirmPhotos: "Confirm & Continue",
        retakePhotos: "Retake photos",
        analyzeYourSkin: "Analyze Your Skin",
        upsellAI: "Sign up free for AI-powered skin analysis",

        // Navigation
        today: "Today's Plan",
        evolution: "Evolution",
        products: "Products",
        back: "Back",
        next: "Next",
        generatePlan: "Generate Plan",
        following: "Next",

        // Products page
        yourProducts: "Your Products",
        recommendedForYou: "Recommended for you",
        fromYourRoutine: "From your routine",
        keyIngredients: "Key ingredients",
        whyThisProduct: "Why this product",
        noProducts: "Complete your routine to see personalized product recommendations.",

        // Premium
        locked: "Premium Feature",
        upgrade: "Upgrade to Unlock",
        premiumBadge: "Premium",

        // Misc
        am: "Morning",
        pm: "Evening",
        weekly: "Weekly",
        generating: "Designing your routine...",
        analyzingAI: "Analyzing your unique skin profile...",
    },
    fr: {
        // Landing
        tagline: "Votre partenaire beauté",
        subtitle: "Coaching skincare quotidien pour peaux riches en mélanine",
        signIn: "Se connecter",
        signUp: "Créer un compte",
        continueGuest: "Continuer en invité",
        disclaimer: "Dr. Beauté Noire fournit un coaching cosmétique basé sur l'apparence. Ce n'est pas un diagnostic médical. Consultez un dermatologue pour toute condition cutanée.",
        appName: "Dr. Beauté Noire",

        // Age gate
        ageGateTitle: "Avez-vous 18 ans ou plus ?",
        ageGateSubtitle: "Cette application est réservée aux adultes.",
        yes: "Oui, j'ai 18 ans+",
        no: "Non",
        ageGateBlocked: "Désolé, cette application est réservée aux adultes de 18 ans et plus.",

        // Questionnaire steps
        q1Title: "Quel âge avez-vous ?",
        q2Title: "Comment vous appelez-vous ?",
        q3Title: "Où habitez-vous ?",
        q4Title: "Exposition au soleil",
        q4Subtitle: "Combien de soleil recevez-vous par jour ?",
        q5Title: "Votre type de peau",
        q6Title: "Sensibilité de la peau",
        q7Title: "Vos objectifs",
        q7Subtitle: "Sélectionnez jusqu'à 3",
        q8Title: "Problèmes de peau",
        q9Title: "Épilation",
        q10Title: "Préférences & Budget",

        // Q3 options
        climateTropical: "Tropical / Humide",
        climateDry: "Sec / Aride",
        climateTemperate: "Tempéré",
        climateContinental: "Continental",
        climatePolar: "Froid / Polaire",

        // Q4 options
        sunLow: "Faible (surtout en intérieur)",
        sunModerate: "Modéré (un peu dehors)",
        sunHigh: "Élevé (dehors tous les jours)",

        // Q5 options
        skinDry: "Sèche",
        skinOily: "Grasse",
        skinCombo: "Mixte",
        skinNormal: "Normale",

        // Q6 options
        sensitivityLow: "Faible — réagit rarement",
        sensitivityMedium: "Moyenne — réagit parfois",
        sensitivityHigh: "Élevée — réagit facilement",

        // Q7 options
        goalHydration: "Hydratation",
        goalAcne: "Contrôle de l'acné",
        goalEvenTone: "Teint uniforme",
        goalAntiAging: "Anti-âge",
        goalTexture: "Texture lisse",
        goalBrightness: "Éclat / Luminosité",

        // Q8 options
        breakoutsNever: "Jamais / Rarement",
        breakoutsOccasional: "Occasionnel",
        breakoutsFrequent: "Fréquent",
        pihConcern: "J'ai des taches sombres après les boutons (PIH)",
        raisedScars: "J'ai des cicatrices en relief ou chéloïdes",

        // Q9 options
        hairNone: "Aucune",
        hairShaving: "Rasage",
        hairWaxing: "Épilation à la cire",
        hairLaser: "Laser",
        hairOther: "Autre",
        ingrownConcern: "J'ai des poils incarnés / boutons de rasage",

        // Q10 options
        fragranceFree: "Je préfère les produits sans parfum",
        budgetLabel: "Budget skincare mensuel",

        // Photo analysis
        photoTitle: "Analyse Photo",
        photoSubtitleFree: "Prenez une photo de face pour une analyse IA basique.",
        photoSubtitlePremium: "Prenez 3 photos pour une analyse IA complète : Face, Gauche, Droit.",
        startCapture: "Commencer la capture",
        selectPhotos: "Sélectionner des photos",
        takePhotos: "Prendre des photos",
        skipPhotos: "Continuer sans photos",
        confirmPhotos: "Valider et continuer",
        retakePhotos: "Reprendre les photos",
        analyzeYourSkin: "Analysez votre peau",
        upsellAI: "Inscrivez-vous gratuitement pour l'analyse IA",

        // Navigation
        today: "Plan du jour",
        evolution: "Évolution",
        products: "Produits",
        back: "Retour",
        next: "Suivant",
        generatePlan: "Générer mon plan",
        following: "Suivant",

        // Products page
        yourProducts: "Vos Produits",
        recommendedForYou: "Recommandés pour vous",
        fromYourRoutine: "De votre routine",
        keyIngredients: "Ingrédients clés",
        whyThisProduct: "Pourquoi ce produit",
        noProducts: "Complétez votre routine pour voir des recommandations personnalisées.",

        // Premium
        locked: "Fonctionnalité Premium",
        upgrade: "Mettre à niveau",
        premiumBadge: "Premium",

        // Misc
        am: "Matin",
        pm: "Soir",
        weekly: "Hebdo",
        generating: "Conception de votre routine...",
        analyzingAI: "Analyse de votre profil de peau...",
    }
};

export const getTranslation = (lang: Language) => TRANSLATIONS[lang];

export const JOURNAL_ARTICLES: JournalArticle[] = [
    {
        id: '1',
        title: 'The Importance of Barrier Repair',
        excerpt: 'Understanding how to maintain a healthy skin barrier for radiant skin.',
        content: 'The skin barrier is your first line of defense...',
        date: 'Oct 12, 2023',
        image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=1200'
    },
    {
        id: '2',
        title: 'Ingredients to Look For',
        excerpt: 'A guide to ingredients that benefit melanin-rich skin.',
        content: 'From Vitamin C to Ceramides, here is what you need...',
        date: 'Oct 20, 2023',
        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=1200'
    },
    {
        id: '3',
        title: 'Morning Routine Essentials',
        excerpt: 'Start your day right with these simple steps.',
        content: 'Consistency is key. Here is a simple morning routine...',
        date: 'Nov 05, 2023',
        image: 'https://images.unsplash.com/photo-1556228720-1987dcdd2a04?auto=format&fit=crop&q=80&w=1200'
    }
];

export const PRODUCTS: Product[] = [
    {
        id: 'p1',
        name: 'Gentle Hydrating Cleanser',
        brand: 'Dr. Beauté Noire',
        price: 28,
        category: 'Cleanser',
        imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1200',
        description: 'A soothing milk cleanser that removes impurities without stripping moisture.',
        features: ['Sulfate-free', 'pH Balanced', 'Fragrance-free'],
        ingredients: ['Glycerin', 'Aloe Vera', 'Ceramides']
    },
    {
        id: 'p2',
        name: 'Daily Protection SPF 50',
        brand: 'Dr. Beauté Noire',
        price: 34,
        category: 'Sunscreen',
        imageUrl: 'https://images.unsplash.com/photo-1571781565036-d3f75af8ca3a?auto=format&fit=crop&q=80&w=1200',
        description: 'Invisible protection for all skin tones.',
        features: ['No white cast', 'Non-greasy', 'Broad spectrum'],
        ingredients: ['Avobenzone', 'Homosalate', 'Vitamin E']
    },
    {
        id: 'p3',
        name: 'Night Renewal Serum',
        brand: 'Dr. Beauté Noire',
        price: 52,
        category: 'Treatment',
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200',
        description: 'Targets hyperpigmentation and fine lines while you sleep.',
        features: ['Vegan', 'Cruelty-free', 'Paraben-free'],
        ingredients: ['Retinol', 'Niacinamide', 'Hyaluronic Acid']
    }
];
