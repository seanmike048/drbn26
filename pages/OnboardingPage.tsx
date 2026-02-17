import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import Button from '../components/ui/Button';
import CrossLogo from '../components/ui/CrossLogo';
import Scanner from '../components/Scanner';
import { ArrowLeft, Check, RefreshCw, Camera, ImagePlus, X } from 'lucide-react';

interface Props {
    onComplete: (profile: UserProfile) => void;
    onBack: () => void;
    onHome: () => void;
    lang: string;
}

const StepTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="font-heading text-3xl text-text-primary mb-8">{children}</h2>
);

const OptionCard: React.FC<{ label: string, selected: boolean, onClick: () => void }> = ({ label, selected, onClick }) => (
    <div
        onClick={onClick}
        className={`p-5 rounded-input border-2 cursor-pointer transition-all flex items-center justify-between ${selected ? 'border-gold-primary bg-gold-5' : 'border-border-default bg-bg-surface'}`}
    >
        <span className="font-body font-medium text-text-primary">{label}</span>
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected ? 'border-gold-primary bg-gold-primary' : 'border-text-secondary'}`}>
            {selected && <Check size={12} className="text-white" />}
        </div>
    </div>
);

const OnboardingPage: React.FC<Props> = ({ onComplete, onBack, onHome, lang }) => {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState<UserProfile>({});

    // Photo capture state
    const [captureStep, setCaptureStep] = useState<'intro' | 'front' | 'left' | 'right' | 'review'>('intro');
    const [tempImages, setTempImages] = useState<{ front?: string; left?: string; right?: string }>({});

    // Multi-select file input ref
    const multiFileRef = useRef<HTMLInputElement>(null);

    const updateProfile = (key: keyof UserProfile, value: any) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = () => {
        if (step < 5) setStep(step + 1);
        else onComplete(profile);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
        else onBack();
    };

    const handlePhotoScan = (base64: string) => {
        if (captureStep === 'front') {
            setTempImages(prev => ({ ...prev, front: base64 }));
            setCaptureStep('left');
        } else if (captureStep === 'left') {
            setTempImages(prev => ({ ...prev, left: base64 }));
            setCaptureStep('right');
        } else if (captureStep === 'right') {
            const finalImages = { ...tempImages, right: base64 };
            setTempImages(finalImages);
            updateProfile('skinImages', finalImages);
            setCaptureStep('review');
        }
    };

    const startCapture = () => {
        setCaptureStep('front');
    };

    const resetCapture = () => {
        setTempImages({});
        updateProfile('skinImages', undefined);
        setCaptureStep('intro');
    };

    // Process a single image file to base64 with resizing
    const processImageFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Not an image file'));
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxDim = 1536;
                    if (width > maxDim || height > maxDim) {
                        const scale = maxDim / Math.max(width, height);
                        width *= scale;
                        height *= scale;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.85));
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Handle multi-file selection
    const handleMultiFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 3);

        const processed: { front?: string; left?: string; right?: string } = {};
        const labels: (keyof typeof processed)[] = ['front', 'left', 'right'];

        for (let i = 0; i < imageFiles.length; i++) {
            const base64 = await processImageFile(imageFiles[i]);
            processed[labels[i]] = base64;
        }

        setTempImages(processed);
        updateProfile('skinImages', processed);
        setCaptureStep('review');

        // Reset the input
        if (multiFileRef.current) multiFileRef.current.value = '';
    };

    // Remove a single photo from review
    const removePhoto = (key: 'front' | 'left' | 'right') => {
        const updated = { ...tempImages };
        delete updated[key];
        setTempImages(updated);

        if (!updated.front && !updated.left && !updated.right) {
            updateProfile('skinImages', undefined);
            setCaptureStep('intro');
        } else {
            updateProfile('skinImages', updated);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col px-6 pt-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <button onClick={onHome} className="p-1 hover:opacity-70 transition-opacity">
                        <CrossLogo size={32} color="#9B7542" />
                    </button>
                    <button onClick={prevStep} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                </div>
                <div className="flex gap-2">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1 w-8 rounded-full transition-all duration-500 ${i <= step ? 'bg-gold-primary' : 'bg-gold-20'}`} />
                    ))}
                </div>
                <div className="w-16" /> {/* Spacer */}
            </div>

            <div className="flex-1 max-w-md mx-auto w-full animate-fade-in" key={step}>
                {step === 1 && (
                    <>
                        <StepTitle>{lang === 'fr' ? 'A propos de vous' : 'About You'}</StepTitle>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-2">{lang === 'fr' ? 'Prenom' : 'Name'}</label>
                                <input
                                    type="text"
                                    className="w-full bg-bg-surface border border-border-default rounded-input px-4 py-3 outline-none focus:border-gold-primary transition-colors"
                                    onChange={(e) => updateProfile('name', e.target.value)}
                                    value={profile.name || ''}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-2">{lang === 'fr' ? 'Age' : 'Age'}</label>
                                <input
                                    type="number"
                                    className="w-full bg-bg-surface border border-border-default rounded-input px-4 py-3 outline-none focus:border-gold-primary transition-colors"
                                    onChange={(e) => updateProfile('age', parseInt(e.target.value))}
                                    value={profile.age || ''}
                                />
                            </div>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <StepTitle>{lang === 'fr' ? 'Votre peau' : 'Your Skin'}</StepTitle>
                        <div className="space-y-3">
                            {['Dry', 'Oily', 'Combination', 'Normal'].map(type => (
                                <OptionCard
                                    key={type}
                                    label={type}
                                    selected={profile.skinType === type.toLowerCase()}
                                    onClick={() => updateProfile('skinType', type.toLowerCase())}
                                />
                            ))}
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <StepTitle>{lang === 'fr' ? 'Analyse Photo' : 'Photo Analysis'}</StepTitle>

                        {captureStep === 'intro' && (
                            <div className="bg-bg-surface rounded-2xl p-8 text-center border border-border-default">
                                <div className="w-16 h-16 bg-gold-10 rounded-full flex items-center justify-center mx-auto mb-4 text-gold-primary">
                                    <Camera strokeWidth={1.5} size={32} />
                                </div>
                                <h3 className="text-xl font-heading mb-2">
                                    {lang === 'fr' ? 'Analysez votre peau' : 'Analyze Your Skin'}
                                </h3>
                                <p className="text-text-secondary font-light mb-6 text-sm leading-relaxed">
                                    {lang === 'fr'
                                        ? "Pour une analyse precise, nous avons besoin de 3 photos : Face, Profil Gauche, Profil Droit. Vous pouvez les selectionner toutes en une fois."
                                        : "For precise analysis, we need 3 photos: Front Face, Left Profile, Right Profile. You can select them all at once."
                                    }
                                </p>
                                <div className="space-y-3">
                                    {/* Multi-select upload button */}
                                    <Button fullWidth onClick={() => multiFileRef.current?.click()}>
                                        <ImagePlus size={18} />
                                        {lang === 'fr' ? 'Selectionner des photos' : 'Select Photos'}
                                    </Button>
                                    <input
                                        type="file"
                                        ref={multiFileRef}
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleMultiFileSelect}
                                    />

                                    {/* Camera capture option */}
                                    <Button fullWidth variant="outline" onClick={startCapture}>
                                        <Camera size={18} />
                                        {lang === 'fr' ? 'Prendre des photos' : 'Take Photos'}
                                    </Button>

                                    <button
                                        onClick={nextStep}
                                        className="text-sm text-text-secondary underline underline-offset-4 hover:text-text-primary transition-colors mt-2"
                                    >
                                        {lang === 'fr' ? 'Continuer sans photos' : 'Continue without photos'}
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
                                    guideLabel={
                                        captureStep === 'front' ? 'FRONT' :
                                        captureStep === 'left' ? 'LEFT SIDE' : 'RIGHT SIDE'
                                    }
                                />
                                <div className="flex justify-center gap-2 mt-4">
                                    <div className={`h-2 w-2 rounded-full transition-colors ${tempImages.front ? 'bg-gold-primary' : captureStep === 'front' ? 'bg-gold-primary animate-pulse' : 'bg-gold-20'}`} />
                                    <div className={`h-2 w-2 rounded-full transition-colors ${tempImages.left ? 'bg-gold-primary' : captureStep === 'left' ? 'bg-gold-primary animate-pulse' : 'bg-gold-20'}`} />
                                    <div className={`h-2 w-2 rounded-full transition-colors ${tempImages.right ? 'bg-gold-primary' : captureStep === 'right' ? 'bg-gold-primary animate-pulse' : 'bg-gold-20'}`} />
                                </div>
                            </div>
                        )}

                        {captureStep === 'review' && (
                             <div className="flex flex-col items-center">
                                <div className="grid grid-cols-3 gap-3 w-full mb-6">
                                    {(['front', 'left', 'right'] as const).map((key) => (
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
                                            <p className="text-[10px] text-text-secondary text-center mt-1 capitalize font-medium">
                                                {key === 'front' ? (lang === 'fr' ? 'Face' : 'Front') :
                                                 key === 'left' ? (lang === 'fr' ? 'Gauche' : 'Left') :
                                                 (lang === 'fr' ? 'Droit' : 'Right')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-3 w-full">
                                    <Button fullWidth onClick={nextStep}>
                                        {lang === 'fr' ? 'Valider et continuer' : 'Confirm & Continue'}
                                    </Button>
                                    <button
                                        onClick={resetCapture}
                                        className="text-gold-primary font-medium text-sm flex items-center justify-center gap-2 hover:opacity-80 transition-opacity p-2"
                                    >
                                        <RefreshCw size={14} />
                                        {lang === 'fr' ? 'Reprendre les photos' : 'Retake photos'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {step === 4 && (
                    <>
                        <StepTitle>{lang === 'fr' ? 'Objectifs' : 'Goals'}</StepTitle>
                        <div className="space-y-3">
                            {['Hydration', 'Acne Control', 'Even Tone', 'Anti-Aging'].map(goal => (
                                <OptionCard
                                    key={goal}
                                    label={goal}
                                    selected={(profile.goals || []).includes(goal)}
                                    onClick={() => {
                                        const current = profile.goals || [];
                                        const updated = current.includes(goal)
                                            ? current.filter(g => g !== goal)
                                            : [...current, goal].slice(0, 3);
                                        updateProfile('goals', updated);
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}

                {step === 5 && (
                    <>
                        <StepTitle>{lang === 'fr' ? 'Budget' : 'Budget'}</StepTitle>
                        <div className="bg-bg-muted p-1 rounded-xl flex gap-1 mb-8">
                            {['budget', 'standard', 'premium'].map((tier) => (
                                <button
                                    key={tier}
                                    onClick={() => updateProfile('budget', tier)}
                                    className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${profile.budget === tier ? 'bg-bg-surface shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="mt-8 max-w-md mx-auto w-full">
                {step !== 3 && (
                    <Button fullWidth onClick={nextStep} disabled={step === 2 && !profile.skinType}>
                        {step === 5 ? (lang === 'fr' ? 'Generer mon plan' : 'Generate Plan') : (lang === 'fr' ? 'Suivant' : 'Next')}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default OnboardingPage;
