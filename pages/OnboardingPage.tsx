import React, { useState, useRef } from 'react';
import { UserProfile, Language, Tier } from '../types';
import { getTranslation } from '../constants';
import Button from '../components/ui/Button';
import CrossLogo from '../components/ui/CrossLogo';
import Scanner from '../components/Scanner';
import { ArrowLeft, Check, RefreshCw, Camera, ImagePlus, X, Sparkles } from 'lucide-react';

interface Props {
    onComplete: (profile: UserProfile) => void;
    onBack: () => void;
    onHome: () => void;
    lang: Language;
    tier: Tier;
}

const TOTAL_STEPS = 10;

const StepTitle: React.FC<{ children: React.ReactNode; subtitle?: string }> = ({ children, subtitle }) => (
    <div className="mb-8">
        <h2 className="font-heading text-3xl text-text-primary">{children}</h2>
        {subtitle && <p className="text-text-secondary font-light text-sm mt-2">{subtitle}</p>}
    </div>
);

const OptionCard: React.FC<{ label: string; selected: boolean; onClick: () => void; description?: string }> = ({ label, selected, onClick, description }) => (
    <div
        onClick={onClick}
        className={`p-4 rounded-input border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${selected ? 'border-gold-primary bg-gold-5' : 'border-border-default bg-bg-surface'}`}
    >
        <div className="flex-1">
            <span className="font-body font-medium text-text-primary">{label}</span>
            {description && <p className="text-xs text-text-secondary font-light mt-0.5">{description}</p>}
        </div>
        <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${selected ? 'border-gold-primary bg-gold-primary' : 'border-text-secondary'}`}>
            {selected && <Check size={12} className="text-white" />}
        </div>
    </div>
);

const CheckboxCard: React.FC<{ label: string; checked: boolean; onClick: () => void }> = ({ label, checked, onClick }) => (
    <div
        onClick={onClick}
        className={`p-4 rounded-input border-2 cursor-pointer transition-all flex items-center gap-3 ${checked ? 'border-gold-primary bg-gold-5' : 'border-border-default bg-bg-surface'}`}
    >
        <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center ${checked ? 'border-gold-primary bg-gold-primary' : 'border-text-secondary'}`}>
            {checked && <Check size={12} className="text-white" />}
        </div>
        <span className="font-body text-sm text-text-primary">{label}</span>
    </div>
);

const OnboardingPage: React.FC<Props> = ({ onComplete, onBack, onHome, lang, tier }) => {
    const t = getTranslation(lang);
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState<UserProfile>({});

    // Photo capture state
    const [captureStep, setCaptureStep] = useState<'intro' | 'front' | 'left' | 'right' | 'review'>('intro');
    const [tempImages, setTempImages] = useState<{ front?: string; left?: string; right?: string }>({});
    const multiFileRef = useRef<HTMLInputElement>(null);

    const update = (key: keyof UserProfile, value: any) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    // Step 11 is the photo step (only for free/premium)
    const totalSteps = tier === 'guest' ? TOTAL_STEPS : TOTAL_STEPS + 1;

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
        else onComplete(profile);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
        else onBack();
    };

    const canProceed = (): boolean => {
        switch (step) {
            case 1: return !!profile.age && profile.age >= 18;
            case 2: return !!profile.name && profile.name.trim().length > 0;
            case 3: return !!profile.climate;
            case 4: return !!profile.sunExposure;
            case 5: return !!profile.skinType;
            case 6: return !!profile.sensitivity;
            case 7: return (profile.goals || []).length > 0;
            case 8: return !!profile.breakouts;
            case 9: return !!profile.hairRemoval;
            case 10: return !!profile.budget;
            default: return true;
        }
    };

    // Photo handlers
    const handlePhotoScan = (base64: string) => {
        if (captureStep === 'front') {
            const imgs = { ...tempImages, front: base64 };
            setTempImages(imgs);
            if (tier === 'premium') {
                setCaptureStep('left');
            } else {
                // Freemium: 1 photo is enough
                update('skinImages', imgs);
                setCaptureStep('review');
            }
        } else if (captureStep === 'left') {
            setTempImages(prev => ({ ...prev, left: base64 }));
            setCaptureStep('right');
        } else if (captureStep === 'right') {
            const finalImages = { ...tempImages, right: base64 };
            setTempImages(finalImages);
            update('skinImages', finalImages);
            setCaptureStep('review');
        }
    };

    const processImageFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) { reject(new Error('Not an image')); return; }
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let w = img.width, h = img.height;
                    const max = 1536;
                    if (w > max || h > max) { const s = max / Math.max(w, h); w *= s; h *= s; }
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', 0.85));
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleMultiFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, tier === 'premium' ? 3 : 1);
        const processed: { front?: string; left?: string; right?: string } = {};
        const labels: (keyof typeof processed)[] = ['front', 'left', 'right'];
        for (let i = 0; i < imageFiles.length; i++) {
            processed[labels[i]] = await processImageFile(imageFiles[i]);
        }
        setTempImages(processed);
        update('skinImages', processed);
        setCaptureStep('review');
        if (multiFileRef.current) multiFileRef.current.value = '';
    };

    const removePhoto = (key: 'front' | 'left' | 'right') => {
        const updated = { ...tempImages };
        delete updated[key];
        setTempImages(updated);
        if (!updated.front && !updated.left && !updated.right) {
            update('skinImages', undefined);
            setCaptureStep('intro');
        } else {
            update('skinImages', updated);
        }
    };

    const resetCapture = () => {
        setTempImages({});
        update('skinImages', undefined);
        setCaptureStep('intro');
    };

    const isPhotoStep = step === 11 && tier !== 'guest';

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col px-6 pt-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={onHome} className="p-1 hover:opacity-70 transition-opacity">
                        <CrossLogo size={32} />
                    </button>
                    <button onClick={prevStep} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                </div>
                {/* Progress bar */}
                <div className="flex-1 mx-4 h-1 bg-gold-20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gold-primary rounded-full transition-all duration-500"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>
                <span className="text-xs text-text-secondary font-medium">{step}/{totalSteps}</span>
            </div>

            <div className="flex-1 max-w-md mx-auto w-full animate-fade-in" key={step}>

                {/* Q1: Age */}
                {step === 1 && (
                    <>
                        <StepTitle>{t.q1Title}</StepTitle>
                        <input
                            type="number"
                            min={18}
                            max={120}
                            className="w-full bg-bg-surface border border-border-default rounded-input px-4 py-3 outline-none focus:border-gold-primary transition-colors text-center text-2xl font-heading"
                            onChange={(e) => update('age', parseInt(e.target.value) || undefined)}
                            value={profile.age || ''}
                            placeholder="18"
                        />
                        {profile.age !== undefined && profile.age < 18 && (
                            <p className="text-red-500 text-sm mt-2 text-center">{t.ageGateBlocked}</p>
                        )}
                    </>
                )}

                {/* Q2: Name */}
                {step === 2 && (
                    <>
                        <StepTitle>{t.q2Title}</StepTitle>
                        <input
                            type="text"
                            className="w-full bg-bg-surface border border-border-default rounded-input px-4 py-3 outline-none focus:border-gold-primary transition-colors"
                            onChange={(e) => update('name', e.target.value)}
                            value={profile.name || ''}
                        />
                    </>
                )}

                {/* Q3: Climate */}
                {step === 3 && (
                    <>
                        <StepTitle>{t.q3Title}</StepTitle>
                        <div className="space-y-3">
                            {([
                                { key: 'tropical', label: t.climateTropical },
                                { key: 'dry', label: t.climateDry },
                                { key: 'temperate', label: t.climateTemperate },
                                { key: 'continental', label: t.climateContinental },
                                { key: 'polar', label: t.climatePolar },
                            ] as const).map(opt => (
                                <OptionCard
                                    key={opt.key}
                                    label={opt.label}
                                    selected={profile.climate === opt.key}
                                    onClick={() => update('climate', opt.key)}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Q4: Sun exposure */}
                {step === 4 && (
                    <>
                        <StepTitle subtitle={t.q4Subtitle}>{t.q4Title}</StepTitle>
                        <div className="space-y-3">
                            {([
                                { key: 'low', label: t.sunLow },
                                { key: 'moderate', label: t.sunModerate },
                                { key: 'high', label: t.sunHigh },
                            ] as const).map(opt => (
                                <OptionCard
                                    key={opt.key}
                                    label={opt.label}
                                    selected={profile.sunExposure === opt.key}
                                    onClick={() => update('sunExposure', opt.key)}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Q5: Skin type */}
                {step === 5 && (
                    <>
                        <StepTitle>{t.q5Title}</StepTitle>
                        <div className="space-y-3">
                            {([
                                { key: 'dry', label: t.skinDry },
                                { key: 'oily', label: t.skinOily },
                                { key: 'combination', label: t.skinCombo },
                                { key: 'normal', label: t.skinNormal },
                            ] as const).map(opt => (
                                <OptionCard
                                    key={opt.key}
                                    label={opt.label}
                                    selected={profile.skinType === opt.key}
                                    onClick={() => update('skinType', opt.key)}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Q6: Sensitivity */}
                {step === 6 && (
                    <>
                        <StepTitle>{t.q6Title}</StepTitle>
                        <div className="space-y-3">
                            {([
                                { key: 'low', label: t.sensitivityLow },
                                { key: 'medium', label: t.sensitivityMedium },
                                { key: 'high', label: t.sensitivityHigh },
                            ] as const).map(opt => (
                                <OptionCard
                                    key={opt.key}
                                    label={opt.label}
                                    selected={profile.sensitivity === opt.key}
                                    onClick={() => update('sensitivity', opt.key)}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Q7: Goals (multi-select, max 3) */}
                {step === 7 && (
                    <>
                        <StepTitle subtitle={t.q7Subtitle}>{t.q7Title}</StepTitle>
                        <div className="space-y-3">
                            {([
                                { key: 'Hydration', label: t.goalHydration },
                                { key: 'Acne Control', label: t.goalAcne },
                                { key: 'Even Tone', label: t.goalEvenTone },
                                { key: 'Anti-Aging', label: t.goalAntiAging },
                                { key: 'Smooth Texture', label: t.goalTexture },
                                { key: 'Brightness', label: t.goalBrightness },
                            ]).map(opt => (
                                <OptionCard
                                    key={opt.key}
                                    label={opt.label}
                                    selected={(profile.goals || []).includes(opt.key)}
                                    onClick={() => {
                                        const current = profile.goals || [];
                                        const updated = current.includes(opt.key)
                                            ? current.filter(g => g !== opt.key)
                                            : [...current, opt.key].slice(0, 3);
                                        update('goals', updated);
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Q8: Skin concerns */}
                {step === 8 && (
                    <>
                        <StepTitle>{t.q8Title}</StepTitle>
                        <div className="space-y-3 mb-4">
                            <p className="text-sm text-text-secondary font-medium mb-2">
                                {lang === 'fr' ? 'Fréquence des boutons' : 'Breakout frequency'}
                            </p>
                            {([
                                { key: 'never', label: t.breakoutsNever },
                                { key: 'occasional', label: t.breakoutsOccasional },
                                { key: 'frequent', label: t.breakoutsFrequent },
                            ] as const).map(opt => (
                                <OptionCard
                                    key={opt.key}
                                    label={opt.label}
                                    selected={profile.breakouts === opt.key}
                                    onClick={() => update('breakouts', opt.key)}
                                />
                            ))}
                        </div>
                        <div className="space-y-3">
                            <CheckboxCard
                                label={t.pihConcern}
                                checked={profile.pihConcern || false}
                                onClick={() => update('pihConcern', !profile.pihConcern)}
                            />
                            <CheckboxCard
                                label={t.raisedScars}
                                checked={profile.raisedScars || false}
                                onClick={() => update('raisedScars', !profile.raisedScars)}
                            />
                        </div>
                    </>
                )}

                {/* Q9: Hair removal */}
                {step === 9 && (
                    <>
                        <StepTitle>{t.q9Title}</StepTitle>
                        <div className="space-y-3 mb-4">
                            {([
                                { key: 'none', label: t.hairNone },
                                { key: 'shaving', label: t.hairShaving },
                                { key: 'waxing', label: t.hairWaxing },
                                { key: 'laser', label: t.hairLaser },
                                { key: 'other', label: t.hairOther },
                            ] as const).map(opt => (
                                <OptionCard
                                    key={opt.key}
                                    label={opt.label}
                                    selected={profile.hairRemoval === opt.key}
                                    onClick={() => update('hairRemoval', opt.key)}
                                />
                            ))}
                        </div>
                        {profile.hairRemoval && profile.hairRemoval !== 'none' && (
                            <CheckboxCard
                                label={t.ingrownConcern}
                                checked={profile.ingrownConcern || false}
                                onClick={() => update('ingrownConcern', !profile.ingrownConcern)}
                            />
                        )}
                    </>
                )}

                {/* Q10: Preferences & Budget */}
                {step === 10 && (
                    <>
                        <StepTitle>{t.q10Title}</StepTitle>
                        <div className="space-y-4">
                            <CheckboxCard
                                label={t.fragranceFree}
                                checked={profile.fragranceFree || false}
                                onClick={() => update('fragranceFree', !profile.fragranceFree)}
                            />

                            <div className="mt-6">
                                <p className="text-sm text-text-secondary font-medium mb-3">{t.budgetLabel}</p>
                                <div className="bg-bg-muted p-1 rounded-xl flex gap-1">
                                    {(['budget', 'standard', 'premium'] as const).map((b) => (
                                        <button
                                            key={b}
                                            onClick={() => update('budget', b)}
                                            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${profile.budget === b ? 'bg-bg-surface shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                                        >
                                            {b.charAt(0).toUpperCase() + b.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Step 11: Photo Analysis (free/premium only) */}
                {isPhotoStep && (
                    <>
                        <StepTitle>{t.photoTitle}</StepTitle>

                        {captureStep === 'intro' && (
                            <div className="bg-bg-surface rounded-2xl p-8 text-center border border-border-default">
                                <div className="w-16 h-16 bg-gold-10 rounded-full flex items-center justify-center mx-auto mb-4 text-gold-primary">
                                    <Camera strokeWidth={1.5} size={32} />
                                </div>
                                <h3 className="text-xl font-heading mb-2">{t.analyzeYourSkin}</h3>
                                <p className="text-text-secondary font-light mb-6 text-sm leading-relaxed">
                                    {tier === 'premium' ? t.photoSubtitlePremium : t.photoSubtitleFree}
                                </p>
                                <div className="space-y-3">
                                    <Button fullWidth onClick={() => multiFileRef.current?.click()}>
                                        <ImagePlus size={18} />
                                        {t.selectPhotos}
                                    </Button>
                                    <input
                                        type="file"
                                        ref={multiFileRef}
                                        className="hidden"
                                        accept="image/*"
                                        multiple={tier === 'premium'}
                                        onChange={handleMultiFileSelect}
                                    />
                                    <Button fullWidth variant="outline" onClick={() => setCaptureStep('front')}>
                                        <Camera size={18} />
                                        {t.takePhotos}
                                    </Button>
                                    <button
                                        onClick={nextStep}
                                        className="text-sm text-text-secondary underline underline-offset-4 hover:text-text-primary transition-colors mt-2"
                                    >
                                        {t.skipPhotos}
                                    </button>
                                </div>
                            </div>
                        )}

                        {(captureStep === 'front' || captureStep === 'left' || captureStep === 'right') && (
                            <div className="w-full">
                                <p className="text-text-primary font-medium text-center mb-4 text-lg">
                                    {captureStep === 'front' && (lang === 'fr' ? '1. Visage de Face' : '1. Front Face')}
                                    {captureStep === 'left' && (lang === 'fr' ? '2. Profil Gauche' : '2. Left Profile')}
                                    {captureStep === 'right' && (lang === 'fr' ? '3. Profil Droit' : '3. Right Profile')}
                                </p>
                                <Scanner
                                    onScan={handlePhotoScan}
                                    language={lang === 'fr' ? 'fr' : 'en'}
                                    guideLabel={captureStep === 'front' ? 'FRONT' : captureStep === 'left' ? 'LEFT SIDE' : 'RIGHT SIDE'}
                                />
                            </div>
                        )}

                        {captureStep === 'review' && (
                            <div className="flex flex-col items-center">
                                <div className={`grid ${tier === 'premium' ? 'grid-cols-3' : 'grid-cols-1 max-w-[200px]'} gap-3 w-full mb-6`}>
                                    {(tier === 'premium' ? ['front', 'left', 'right'] as const : ['front'] as const).map((key) => (
                                        <div key={key} className="relative">
                                            {tempImages[key] ? (
                                                <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-gold-primary shadow-sm">
                                                    <img src={tempImages[key]} alt={key} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => removePhoto(key)}
                                                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="aspect-[3/4] rounded-xl border-2 border-dashed border-border-default flex flex-col items-center justify-center cursor-pointer hover:border-gold-primary transition-colors"
                                                    onClick={() => multiFileRef.current?.click()}
                                                >
                                                    <ImagePlus size={20} className="text-text-secondary mb-1" />
                                                    <span className="text-[10px] text-text-secondary capitalize">{key}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-3 w-full">
                                    <Button fullWidth onClick={nextStep}>{t.confirmPhotos}</Button>
                                    <button onClick={resetCapture} className="text-gold-primary font-medium text-sm flex items-center justify-center gap-2 hover:opacity-80 transition-opacity p-2">
                                        <RefreshCw size={14} /> {t.retakePhotos}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 max-w-md mx-auto w-full">
                {!isPhotoStep && (
                    <>
                        <Button fullWidth onClick={nextStep} disabled={!canProceed()}>
                            {step === totalSteps
                                ? t.generatePlan
                                : (tier === 'guest' && step === 10)
                                    ? t.generatePlan
                                    : t.following
                            }
                        </Button>
                        {/* Upsell for guest on last step */}
                        {tier === 'guest' && step === 10 && (
                            <div className="flex items-center justify-center gap-2 mt-4 text-gold-primary">
                                <Sparkles size={14} />
                                <p className="text-xs font-medium">{t.upsellAI}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default OnboardingPage;
