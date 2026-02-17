/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, X, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../constants';

interface ScannerProps {
  onScan: (base64: string) => void;
  language: Language;
  guideLabel?: string;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, language, guideLabel }) => {
  const t = getTranslation(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
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
             onScan(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints = { 
        video: { 
            facingMode: 'user', // Front camera for selfies as per spec
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setShowCamera(true);
      
      setTimeout(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Play error:", e));
        }
      }, 100);

    } catch (err) {
      console.error("Camera error:", err);
      let errorMessage = "Unable to access camera.";
      if (err instanceof DOMException) {
          if (err.name === 'NotAllowedError') {
              errorMessage = "Camera permission denied. Please allow access.";
          } else if (err.name === 'NotFoundError') {
              errorMessage = "No camera found on this device.";
          } else if (err.name === 'NotReadableError') {
             errorMessage = "Camera is currently in use by another application.";
          }
      }
      setCameraError(errorMessage);
      setTimeout(() => setCameraError(null), 5000);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
        // Screen Flash Effect
        setIsFlashing(true);
        
        // Wait for flash to max brightness (simulate light assist)
        await new Promise(resolve => setTimeout(resolve, 800));

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Mirror image for front camera if needed
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(videoRef.current, 0, 0);
            
            const base64 = canvas.toDataURL('image/jpeg', 0.85);
            
            setIsFlashing(false);
            stopCamera();
            onScan(base64);
        } else {
            setIsFlashing(false);
        }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center flex-1 min-h-[40vh] animate-fade-in relative">
        
        {/* Error Notification */}
        {cameraError && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-6 py-3 rounded-full flex items-center gap-3 shadow-lg z-10 transition-all">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">{cameraError}</span>
            </div>
        )}

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-6">
          
          {/* Option 1: Upload */}
          <div 
            className={`
              group relative aspect-[4/5] md:aspect-square flex flex-col items-center justify-center 
              border border-dashed rounded-2xl transition-all duration-500 cursor-pointer
              ${isHovering 
                  ? 'border-neutral-400 bg-black/5 dark:bg-white/5' 
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'}
            `}
            onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
            onDragLeave={() => setIsHovering(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
             <div className="mb-4 p-4 rounded-full bg-white dark:bg-[#27272A] shadow-lg shadow-black/5 transition-transform duration-500 group-hover:scale-110">
               <Upload strokeWidth={1} className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
             </div>
             <p className="text-base font-medium text-neutral-900 dark:text-neutral-100 tracking-wide">{t.upload}</p>
             <p className="mt-1 text-xs text-neutral-400 font-light">{t.dragDrop}</p>
             <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />
          </div>

          {/* Option 2: Camera */}
          <div 
             onClick={startCamera}
             className="group relative aspect-[4/5] md:aspect-square flex flex-col items-center justify-center border border-neutral-200 dark:border-neutral-800 rounded-2xl cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-500 bg-white/50 dark:bg-white/5"
          >
             <div className="mb-4 p-4 rounded-full bg-neutral-900 dark:bg-white shadow-lg transition-transform duration-500 group-hover:scale-110">
               <Camera strokeWidth={1} className="w-6 h-6 text-white dark:text-neutral-900" />
             </div>
             <p className="text-base font-medium text-neutral-900 dark:text-neutral-100 tracking-wide">{t.camera}</p>
          </div>

        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in">
             {/* Flash Overlay */}
             <div 
                className={`absolute inset-0 bg-white pointer-events-none z-[110] transition-opacity duration-300 ${isFlashing ? 'opacity-100' : 'opacity-0'}`}
             />

             {/* Close Button */}
             <button 
                onClick={stopCamera} 
                className="absolute top-6 right-6 p-3 bg-neutral-800/50 backdrop-blur-md rounded-full text-white hover:bg-neutral-700 transition-colors z-20"
             >
                <X size={24} />
             </button>

             {/* Video Feed */}
             <div className="relative w-full h-full md:max-w-2xl md:h-auto md:aspect-[3/4] md:rounded-2xl overflow-hidden bg-black shadow-2xl">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]" // Mirror preview
                />
                
                {/* Guide Overlay */}
                {guideLabel && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none border-2 border-white/30 m-8 rounded-full border-dashed">
                        <div className="bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                            <span className="text-white font-bold uppercase tracking-widest text-sm">{guideLabel}</span>
                        </div>
                    </div>
                )}
             </div>
             
             {/* Controls */}
             <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-6 z-20">
                 {isFlashing ? (
                    <p className="text-black font-bold text-lg z-[120]">Capturing...</p>
                 ) : (
                    <p className="text-white/70 font-light tracking-widest uppercase text-xs shadow-black drop-shadow-md">
                        {guideLabel || t.camera}
                    </p>
                 )}
                <button 
                    onClick={capturePhoto}
                    disabled={isFlashing}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                    <div className="w-16 h-16 bg-white rounded-full"></div>
                </button>
             </div>
          </div>
      )}
    </>
  );
};

export default Scanner;