'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, BookOpen, Layers, Play } from 'lucide-react';
import { RatingStars } from './UIComponents';

interface Course {
  id: number;
  title: { fr: string; en: string; ar: string };
  author: { fr: string; en: string; ar: string };
  price: string;
  duration: string;
  lessonsCount: number;
  image: string;
  progress: number;
  level: string;
  version: string;
  rating: number;
  reviewsCount: number;
  category: string;
}

const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: { fr: "WinDev 2025 : Architecture MVP", en: "WinDev 2025 : MVP Architecture", ar: "WinDev 2025 : هندسة MVP البرمجية" },
    author: { fr: "Dr. WLangage", en: "Dr. WLangage", ar: "د. WLangage" },
    price: "PREMIUM",
    duration: "12",
    lessonsCount: 45,
    image: "bg-gradient-to-br from-blue-600 to-indigo-900",
    progress: 0,
    level: "expert",
    version: "25+",
    rating: 4.9,
    reviewsCount: 124,
    category: "WINDEV"
  },
  {
    id: 2,
    title: { fr: "WebDev & SaaS Multi-tenant", en: "WebDev & SaaS Multi-tenant", ar: "WebDev & SaaS : تطبيقات متعددة المستأجرين" },
    author: { fr: "Dr. WLangage", en: "Dr. WLangage", ar: "د. WLangage" },
    price: "PREMIUM",
    duration: "8",
    lessonsCount: 32,
    image: "bg-gradient-to-br from-purple-600 to-pink-900",
    progress: 15,
    level: "expert",
    version: "28+",
    rating: 4.7,
    reviewsCount: 89,
    category: "WEBDEV"
  },
  {
    id: 3,
    title: { fr: "Débuter avec HFSQL", en: "Getting Started with HFSQL", ar: "البداية مع قواعد بيانات HFSQL" },
    author: { fr: "Dr. WLangage", en: "Dr. WLangage", ar: "د. WLangage" },
    price: "FREE",
    duration: "2",
    lessonsCount: 10,
    image: "bg-gradient-to-br from-emerald-500 to-teal-800",
    progress: 0,
    level: "beginner",
    version: "24+",
    rating: 4.5,
    reviewsCount: 210,
    category: "HFSQL"
  },
  {
    id: 4,
    title: { fr: "Android & iOS avec WinDev Mobile", en: "Android & iOS with WinDev Mobile", ar: "Android & iOS مع WinDev Mobile" },
    author: { fr: "Dr. WLangage", en: "Dr. WLangage", ar: "د. WLangage" },
    price: "PREMIUM",
    duration: "15",
    lessonsCount: 60,
    image: "bg-gradient-to-br from-green-600 to-teal-900",
    progress: 0,
    level: "intermediate",
    version: "26+",
    rating: 4.8,
    reviewsCount: 156,
    category: "MOBILE"
  }
];

interface Filters {
  category: string;
  level: string;
  price: string;
}

interface CatalogPageProps {
  setView: (view: string) => void;
  isRTL: boolean;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ setView, isRTL }) => {
  const t = useTranslations();
  
  // États des filtres
  const [filters, setFilters] = useState<Filters>({
    category: 'ALL',
    level: 'ALL',
    price: 'ALL'
  });

  // Filter Logic
  const filteredCourses = MOCK_COURSES.filter(course => {
    const matchCat = filters.category === 'ALL' || course.category === filters.category;
    const matchLevel = filters.level === 'ALL' || course.level === filters.level;
    const matchPrice = filters.price === 'ALL' || 
                      (filters.price === 'FREE' && course.price === 'FREE') ||
                      (filters.price === 'PREMIUM' && course.price === 'PREMIUM');
    return matchCat && matchLevel && matchPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Search Header */}
      <div className={`flex flex-col md:flex-row justify-between items-center mb-8 gap-6 ${isRTL ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('catalog')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('welcomeSub')}</p>
        </div>
        <div className="relative w-full md:w-96 group">
          <div className={`absolute inset-y-0 flex items-center px-4 pointer-events-none text-slate-400 ${isRTL ? 'right-0' : 'left-0'}`}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            className={`w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className={`flex flex-wrap gap-4 mb-10 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <Search size={18} /> {t('filterBy')}:
        </div>
        
        {/* Category Filter */}
        <select 
          value={filters.category} 
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="ALL">{t('category')}: {t('all')}</option>
          <option value="WINDEV">WINDEV</option>
          <option value="WEBDEV">WEBDEV</option>
          <option value="MOBILE">WINDEV MOBILE</option>
          <option value="HFSQL">HFSQL</option>
          <option value="WLANGAGE">WLANGAGE</option>
          <option value="PACKS">PACKS</option>
        </select>

        {/* Level Filter */}
        <select 
          value={filters.level}
          onChange={(e) => setFilters({...filters, level: e.target.value})}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="ALL">{t('level')}: {t('all')}</option>
          <option value="beginner">{t('beginner')}</option>
          <option value="intermediate">{t('intermediate')}</option>
          <option value="expert">{t('expert')}</option>
        </select>

        {/* Price Filter */}
        <select 
          value={filters.price}
          onChange={(e) => setFilters({...filters, price: e.target.value})}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="ALL">{t('price')}: {t('all')}</option>
          <option value="FREE">{t('free')}</option>
          <option value="PREMIUM">{t('premium')}</option>
        </select>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <div 
            key={course.id}
            onClick={() => setView('player')}
            className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 cursor-pointer flex flex-col h-full"
          >
            {/* Thumbnail */}
            <div className={`h-48 ${course.image} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-300">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Play className="text-white fill-white" />
                </div>
              </div>
              <span className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20`}>
                {course.price === 'FREE' ? t('free') : t('premium')}
              </span>
              <span className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'} bg-blue-600/90 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}>
                {course.category}
              </span>
            </div>

            {/* Content */}
            <div className={`p-5 flex-1 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                  course.level === 'beginner' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                  course.level === 'intermediate' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                  'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'
                }`}>
                  {t(course.level)}
                </span>
                <span className="flex items-center gap-1 text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  <Layers size={12} /> v{course.version}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-1 group-hover:text-blue-500 transition-colors line-clamp-2">
                {course.title[t('lang') as keyof typeof course.title] || course.title.fr}
              </h3>
              <p className="text-xs text-slate-500 mb-3">{t('instructor')}: {course.author[t('lang') as keyof typeof course.author] || course.author.fr}</p>
              
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="font-bold text-yellow-500 text-sm">{course.rating}</span>
                <RatingStars rating={course.rating} />
                <span className="text-xs text-slate-400">({course.reviewsCount})</span>
              </div>

              <div className={`mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <BookOpen size={14} /> {course.lessonsCount} {t('lessons')}
                </div>
                <div>{course.duration} {t('hours')}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};