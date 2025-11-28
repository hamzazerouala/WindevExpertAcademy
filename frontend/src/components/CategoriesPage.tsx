'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Monitor, Globe, Smartphone, Database, Code, Package } from 'lucide-react';

interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
}

const CATEGORIES_DATA: Category[] = [
  { id: 'WINDEV', label: 'WINDEV', icon: Monitor, color: 'from-blue-500 to-blue-700' },
  { id: 'WEBDEV', label: 'WEBDEV', icon: Globe, color: 'from-purple-500 to-purple-700' },
  { id: 'MOBILE', label: 'WINDEV MOBILE', icon: Smartphone, color: 'from-green-500 to-green-700' },
  { id: 'HFSQL', label: 'HFSQL', icon: Database, color: 'from-yellow-500 to-yellow-700' },
  { id: 'WLANGAGE', label: 'WLANGAGE', icon: Code, color: 'from-red-500 to-red-700' },
  { id: 'PACKS', label: 'PACKS', icon: Package, color: 'from-gray-600 to-gray-800' }
];

interface CategoriesPageProps {
  handleCategorySelect: (catId: string) => void;
  isRTL: boolean;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ handleCategorySelect, isRTL }) => {
  const t = useTranslations();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <h1 className={`text-3xl font-bold mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>{t('navCategories')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES_DATA.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <div 
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="group relative h-48 w-full rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-800"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} transition-transform duration-500 group-hover:scale-110`} />
              
              {/* Overlay for better text contrast */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-6">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm mb-4 group-hover:bg-white/30 transition-colors duration-300 shadow-inner">
                  <IconComponent size={36} className="text-white drop-shadow-md" />
                </div>
                <h3 className="text-2xl font-bold tracking-wider drop-shadow-lg text-center uppercase">{cat.label}</h3>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 text-xs font-bold bg-white/20 px-4 py-2 rounded-full backdrop-blur-md uppercase tracking-wide">
                  {t('startLearning')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};