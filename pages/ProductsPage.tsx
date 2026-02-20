import React from 'react';
import { TodayPlan, RoutineStep, Language } from '../types';
import { getTranslation } from '../constants';
import { Droplet, Sun, Moon } from 'lucide-react';
import CrossLogo from '../components/ui/CrossLogo';

interface Props {
    plan: TodayPlan | null;
    lang: Language;
    onHome: () => void;
}

interface RecommendedProduct {
    name: string;
    brand: string;
    keyIngredients: string;
    whyThisProduct: string;
    category: string;
    period: 'am' | 'pm';
}

const ProductsPage: React.FC<Props> = ({ plan, lang, onHome }) => {
    const t = getTranslation(lang);

    // Extract recommended products from the plan
    const products: RecommendedProduct[] = [];
    if (plan) {
        const extract = (steps: RoutineStep[], period: 'am' | 'pm') => {
            steps.forEach(step => {
                if (step.recommendedProduct) {
                    products.push({
                        ...step.recommendedProduct,
                        category: step.productCategory,
                        period,
                    });
                }
            });
        };
        extract(plan.morning, 'am');
        extract(plan.evening, 'pm');
    }

    return (
        <div className="min-h-screen bg-bg-primary pb-24">
            {/* Top Bar */}
            <div className="sticky top-0 bg-bg-primary/95 backdrop-blur z-20 px-5 py-4 border-b border-border-default flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={onHome} className="p-1 hover:opacity-70 transition-opacity">
                        <CrossLogo size={28} />
                    </button>
                    <h1 className="font-display text-xl text-text-primary">{t.products}</h1>
                </div>
                <Droplet size={20} className="text-gold-primary" />
            </div>

            <div className="p-5">
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-gold-10 rounded-full flex items-center justify-center mb-4">
                            <Droplet size={28} className="text-gold-primary" />
                        </div>
                        <p className="text-text-secondary font-light max-w-xs">{t.noProducts}</p>
                    </div>
                ) : (
                    <>
                        <p className="text-text-secondary font-light text-sm mb-6">{t.recommendedForYou}</p>

                        <div className="space-y-4">
                            {products.map((product, i) => (
                                <div
                                    key={i}
                                    className="bg-bg-surface rounded-xl border border-border-default p-5 animate-fade-in"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-body font-medium text-text-primary text-lg">{product.name}</h3>
                                            <p className="text-xs text-text-secondary mt-0.5">{product.brand}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gold-10 px-2 py-1 rounded-lg">
                                            {product.period === 'am' ? (
                                                <Sun size={12} className="text-gold-primary" />
                                            ) : (
                                                <Moon size={12} className="text-gold-primary" />
                                            )}
                                            <span className="text-[10px] font-bold uppercase text-gold-primary">
                                                {product.period === 'am' ? 'AM' : 'PM'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Category badge */}
                                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gold-accent bg-gold-5 px-2 py-1 rounded-md mb-3">
                                        {product.category}
                                    </span>

                                    {/* Key ingredients */}
                                    <div className="mb-3">
                                        <p className="text-[10px] font-bold uppercase text-text-secondary mb-1">{t.keyIngredients}</p>
                                        <p className="text-sm text-text-primary font-light">{product.keyIngredients}</p>
                                    </div>

                                    {/* Why this product */}
                                    <div className="bg-bg-primary rounded-lg p-3">
                                        <p className="text-[10px] font-bold uppercase text-gold-primary mb-1">{t.whyThisProduct}</p>
                                        <p className="text-sm text-text-secondary font-light italic">"{product.whyThisProduct}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
