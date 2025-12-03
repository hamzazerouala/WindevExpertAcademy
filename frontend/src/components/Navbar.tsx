'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { Button } from './UIComponents';
import { Moon, Sun, Menu, X, Home, List, Phone } from 'lucide-react';

interface NavbarProps {
  theme: string;
  lang: string;
  view: string;
  setTheme: (theme: string) => void;
  setLang: (lang: string) => void;
  setView: (view: string) => void;
  isRTL: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  theme, 
  lang, 
  view, 
  setTheme, 
  setLang, 
  setView, 
  isRTL 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations();

  // Toggle Theme
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView('catalog')}
        >
          <img 
            src={theme === 'dark' 
              ? "https://saashub.online/windevexpertacademy/WndevExpertAcademy_sombre.png" 
              : "https://saashub.online/windevexpertacademy/WndevExpertAcademy_claire.png"
            }
            alt={t('brand')} 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </div>

        <div className={`hidden md:flex items-center gap-8 font-medium text-sm text-slate-600 dark:text-slate-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={() => setView('catalog')} 
            className={`hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors ${view === 'catalog' ? 'text-yellow-600 dark:text-yellow-500 font-bold' : ''}`}
          >
            {t('navHome')}
          </button>
          <button 
            onClick={() => setView('categories')} 
            className={`hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors ${view === 'categories' ? 'text-yellow-600 dark:text-yellow-500 font-bold' : ''}`}
          >
            {t('navCategories')}
          </button>
          <button 
            className="hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors"
          >
            {t('navContact')}
          </button>
        </div>

        <div className={`hidden md:flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 mx-2">
            {['fr', 'ar', 'en'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${lang === l ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {view !== 'login' && view !== 'register' && (
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('token');
                  delete axios.defaults.headers.common['Authorization'];
                } catch {}
                setView('login');
              }}
              className="ml-4 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm"
            >
              Déconnexion
            </button>
          )}
        </div>

        <button className="md:hidden p-2 text-slate-600 dark:text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <button 
            onClick={() => { setView('catalog'); setIsMenuOpen(false); }} 
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
          >
            <Home size={20} className="text-yellow-500" /> {t('navHome')}
          </button>
          <button 
            onClick={() => { setView('categories'); setIsMenuOpen(false); }} 
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
          >
            <List size={20} className="text-yellow-500" /> {t('navCategories')}
          </button>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
          >
            <Phone size={20} className="text-yellow-500" /> {t('navContact')}
          </button>
          
          <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {['fr', 'ar', 'en'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${lang === l ? 'bg-slate-100 dark:bg-slate-800 text-blue-500' : 'text-slate-500'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
