/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { X, Key, Check, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiKey, onSave }) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white dark:bg-[#1f1625] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-fade-in-up border border-white/10">
        <div className="p-6 border-b border-neutral-100 dark:border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Key size={20} className="text-purple-500" />
            Settings
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <label className="block text-sm font-medium mb-2 opacity-80">Google Gemini API Key</label>
          <input 
            type="password" 
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-neutral-100 dark:bg-white/5 border border-transparent focus:border-purple-500 outline-none rounded-lg px-4 py-3 text-sm transition-all"
          />
          <p className="text-xs mt-3 opacity-60 leading-relaxed">
            Your API key is stored locally on your device. 
            <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noreferrer" className="text-purple-500 hover:underline inline-flex items-center gap-1 ml-1">
              Get a free key <ExternalLink size={10} />
            </a>
          </p>
        </div>

        <div className="p-6 bg-neutral-50 dark:bg-white/5 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            >
                Cancel
            </button>
            <button 
                onClick={() => {
                    onSave(keyInput);
                    onClose();
                }}
                className="px-6 py-2 rounded-lg sunset-gradient-bg text-white text-sm font-semibold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-opacity flex items-center gap-2"
            >
                <Check size={16} /> Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
