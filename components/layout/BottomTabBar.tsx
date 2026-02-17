import React from 'react';
import { Sun, TrendingUp, Droplet } from 'lucide-react';

interface Props {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const BottomTabBar: React.FC<Props> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'today', icon: Sun, label: 'Today' },
        { id: 'evolution', icon: TrendingUp, label: 'Evolution' },
        { id: 'products', icon: Droplet, label: 'Products' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 h-[80px] bg-bg-primary border-t border-border-default flex items-start justify-around pt-3 pb-6 z-50">
            {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                    <button 
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex flex-col items-center gap-1 w-16 ${isActive ? 'text-gold-primary' : 'text-text-secondary'}`}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                        <span className="text-[10px] font-medium tracking-wide uppercase">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomTabBar;