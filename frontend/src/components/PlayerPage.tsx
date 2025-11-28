'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './UIComponents';
import { Play, Award, BookOpen, CheckCircle, Lock } from 'lucide-react';

interface PlayerPageProps {
  isRTL: boolean;
}

export const PlayerPage: React.FC<PlayerPageProps> = ({ isRTL }) => {
  const t = useTranslations();

  return (
    <div className={`flex flex-col lg:flex-row h-[calc(100vh-80px)] ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
      <div className="flex-1 bg-black flex flex-col overflow-y-auto lg:overflow-hidden">
        <div className="aspect-video bg-slate-900 relative group w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
              <Play className="text-white fill-white ml-1" size={32} />
            </div>
          </div>
          <div className="absolute top-10 left-10 opacity-20 pointer-events-none text-white text-xs font-mono animate-pulse">
            ID: 84392-AX
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
            <div className="h-full bg-yellow-500 w-1/3 relative">
              <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform ${isRTL ? 'left-0' : 'right-0'}`} />
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-6">
          <div className={`flex items-start justify-between mb-6 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <div>
              <h1 className="text-2xl font-bold mb-2">{isRTL ? 'مقدمة في هندسة MVP مع WinDev' : 'Introduction au Modèle MVP dans WinDev'}</h1>
              <p className="text-slate-500 text-sm">{isRTL ? 'الفصل 1 / الدرس 2' : 'Chapitre 1 / Leçon 2'}</p>
            </div>
            <Button variant="secondary" className="hidden md:flex">
              <Award size={18} /> {isRTL ? 'شهادة' : 'Certificat'}
            </Button>
          </div>
          <div className={`flex gap-6 border-b border-slate-200 dark:border-slate-800 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {['overview', 'qa', 'resources'].map(tab => (
              <button key={tab} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === 'overview' ? 'border-yellow-500 text-yellow-600 dark:text-yellow-500' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                {t(tab)}
              </button>
            ))}
          </div>
          <div className={`prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 ${isRTL ? 'text-right' : ''}`}>
            <p>{isRTL 
              ? 'في هذا الدرس، سوف نستكشف البنية الأساسية لمشروع WinDev الموجه نحو MVP (النموذج-العرض-المقدم). تسمح هذه الهندسة بفصل واضح بين واجهة المستخدم ومنطق العمل.' 
              : 'Dans cette leçon, nous allons explorer la structure fondamentale d\'un projet WinDev orienté MVP (Modèle-Vue-Présenteur). Cette architecture permet une séparation claire entre l\'interface utilisateur et la logique métier.'}
            </p>
          </div>
        </div>
      </div>
      <div className={`w-full lg:w-96 bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden ${isRTL ? 'border-r border-l-0' : 'border-l'}`}>
        <div className={`p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${isRTL ? 'text-right' : ''}`}>
          <h3 className="font-bold text-lg">{t('courseContent')}</h3>
          <div className="text-xs text-slate-500 mt-1">45 {t('lessons')} • 12 {t('hours')}</div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {[1, 2, 3, 4, 5].map((module) => (
            <div key={module} className="rounded-xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className={`p-3 bg-slate-100 dark:bg-slate-800 font-semibold text-sm flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{isRTL ? `الوحدة ${module}: الهندسة` : `Module ${module} : Architecture`}</span>
              </div>
              <div>
                {[1, 2, 3].map((lesson) => (
                  <div 
                    key={lesson} 
                    className={`p-3 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-l-2 ${module === 1 && lesson === 2 ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500' : 'border-transparent'} ${isRTL ? 'flex-row-reverse text-right border-l-0 border-r-2' : 'text-left border-l-2'}`}
                  >
                    <div className="mt-1">
                      {module === 1 && lesson === 1 ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : module === 1 && lesson === 2 ? (
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        </div>
                      ) : (
                        <Lock size={16} className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${module === 1 && lesson === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {isRTL ? 'إعداد المشروع' : 'Mise en place du projet'}
                      </p>
                      <span className="text-xs text-slate-500">15 min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};