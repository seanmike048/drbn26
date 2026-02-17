/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { JournalArticle, Language, Product } from './types';

export const BRAND_NAME = "Dr. Beauté Noire";

export const TRANSLATIONS = {
    en: {
        tagline: "Your beauty partner",
        start: "Start Your Routine",
        continueGuest: "Continue as Guest",
        createAccount: "Create Account",
        signIn: "Sign In",
        ageGateTitle: "Are you 18 or older?",
        yes: "Yes",
        no: "No",
        profileTitle: "Tell us about yourself",
        skinTitle: "Your Skin Profile",
        goalsTitle: "What are your goals?",
        habitsTitle: "Habits & Budget",
        generating: "Designing your routine...",
        today: "Today's Plan",
        evolution: "Evolution",
        products: "Products",
        locked: "Premium Feature",
        upgrade: "Upgrade to Unlock",
        snapshot: "Snapshot",
        am: "Morning",
        pm: "Evening",
        weekly: "Weekly",
        savePlan: "Save my plan",
        back: "Back",
        next: "Next",
        disclaimer: "Dr. Beauté Noire provides cosmetic coaching based on appearance. This is not a medical diagnosis. Consult a dermatologist for skin conditions.",
        appName: "Dr. Beauté Noire",
        upload: "Upload Photo",
        dragDrop: "Drag & drop or click to upload",
        camera: "Camera",
        palette: "Color Palette",
        influences: "Influences",
        similar: "Similar Artists",
        scene: "The Scene",
        context: "The Context",
        soul: "The Soul",
    },
    fr: {
        tagline: "Votre partenaire beauté",
        start: "Commencer votre routine",
        continueGuest: "Continuer en invité",
        createAccount: "Créer un compte",
        signIn: "Se connecter",
        ageGateTitle: "Avez-vous 18 ans ou plus ?",
        yes: "Oui",
        no: "Non",
        profileTitle: "Parlez-nous de vous",
        skinTitle: "Votre profil de peau",
        goalsTitle: "Quels sont vos objectifs ?",
        habitsTitle: "Habitudes et Budget",
        generating: "Conception de votre routine...",
        today: "Plan du jour",
        evolution: "Évolution",
        products: "Produits",
        locked: "Fonctionnalité Premium",
        upgrade: "Mettre à niveau",
        snapshot: "Aperçu",
        am: "Matin",
        pm: "Soir",
        weekly: "Hebdo",
        savePlan: "Sauvegarder mon plan",
        back: "Retour",
        next: "Suivant",
        disclaimer: "Dr. Beauté Noire fournit un coaching cosmétique basé sur l'apparence. Ce n'est pas un diagnostic médical. Consultez un dermatologue pour toute condition cutanée.",
        appName: "Dr. Beauté Noire",
        upload: "Télécharger une photo",
        dragDrop: "Glisser-déposer ou cliquer",
        camera: "Appareil photo",
        palette: "Palette de couleurs",
        influences: "Influences",
        similar: "Artistes similaires",
        scene: "La Scène",
        context: "Le Contexte",
        soul: "L'Âme",
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
