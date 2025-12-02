"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Moon, Sun, Globe, Play, Lock, CheckCircle,
  Search, BookOpen, Menu, X,
  ChevronRight, ChevronLeft, LayoutGrid, Award,
  Mail, LockKeyhole, ArrowRight, Home, List, Phone,
  Star, Filter, Monitor, Smartphone, Database, Code, Package, Layers, Loader2
} from 'lucide-react';

const TRANSLATIONS = {
  fr: { brand: "WindevExpert Academy", login: "Connexion", register: "Inscription", catalog: "Formations", navHome: "Accueil", navCategories: "Catégories", navContact: "Contact", myLearning: "Mon Apprentissage", email: "Adresse Email", password: "Mot de passe", confirmPassword: "Confirmer le mot de passe", forgotPass: "Mot de passe oublié ?", signInBtn: "Se connecter", signUpBtn: "Créer un compte", noAccount: "Pas encore de compte ?", hasAccount: "Déjà membre ?", welcomeBack: "Ravi de vous revoir !", welcomeSub: "Prêt à maîtriser le WLangage ?", joinUs: "Rejoignez l'élite", joinSub: "Accédez aux meilleures ressources WinDev.", searchPlaceholder: "Rechercher un cours (ex: HFSQL, Mobile...)", popularCourses: "Formations Populaires", startLearning: "Commencer", courseContent: "Contenu du cours", overview: "Aperçu", resources: "Ressources", qa: "Q&A", instructor: "Formateur", free: "Gratuit", premium: "Premium", hours: "heures", lessons: "leçons", level: "Niveau", version: "Version", beginner: "Débutant", intermediate: "Intermédiaire", expert: "Expert", filterBy: "Filtrer par", category: "Catégorie", price: "Prix", all: "Tout", reviews: "avis" },
  en: { brand: "WindevExpert Academy", login: "Login", register: "Register", catalog: "Courses", navHome: "Home", navCategories: "Categories", navContact: "Contact", myLearning: "My Learning", email: "Email Address", password: "Password", confirmPassword: "Confirm Password", forgotPass: "Forgot Password?", signInBtn: "Sign In", signUpBtn: "Create Account", noAccount: "No account yet?", hasAccount: "Already a member?", welcomeBack: "Welcome Back!", welcomeSub: "Ready to master WLangage?", joinUs: "Join the Elite", joinSub: "Access the best WinDev resources.", searchPlaceholder: "Search course (e.g., HFSQL, Mobile...)", popularCourses: "Popular Courses", startLearning: "Start Learning", courseContent: "Course Content", overview: "Overview", resources: "Resources", qa: "Q&A", instructor: "Instructor", free: "Free", premium: "Premium", hours: "hours", lessons: "lessons", level: "Level", version: "Version", beginner: "Beginner", intermediate: "Intermediate", expert: "Expert", filterBy: "Filter by", category: "Category", price: "Price", all: "All", reviews: "reviews" },
  ar: { brand: "أكاديمية وينديف إكسبرت", login: "دخول", register: "تسجيل جديد", catalog: "الدورات التدريبية", navHome: "الرئيسية", navCategories: "التصنيفات", navContact: "اتصل بنا", myLearning: "مسار تعلمي", email: "البريد الإلكتروني", password: "كلمة المرور", confirmPassword: "تأكيد كلمة المرور", forgotPass: "هل نسيت كلمة المرور؟", signInBtn: "تسجيل الدخول", signUpBtn: "إنشاء حساب جديد", noAccount: "ليس لديك حساب بعد؟", hasAccount: "لديك حساب بالفعل؟", welcomeBack: "أهلاً بك مجدداً!", welcomeSub: "مستعد لاحتراف لغة WLangage؟", joinUs: "انضم إلى النخبة", joinSub: "احصل على أفضل موارد WinDev التعليمية.", searchPlaceholder: "ابحث عن دورة (مثال: HFSQL، Mobile...)", popularCourses: "الدورات الأكثر طلباً", startLearning: "ابدأ الآن", courseContent: "محتوى الدورة", overview: "نظرة عامة", resources: "الموارد والملفات", qa: "أسئلة وأجوبة", instructor: "المدرب", free: "مجاني", premium: "مدفوع", hours: "ساعات", lessons: "دروس", level: "المستوى", version: "إصدار", beginner: "مبتدأ", intermediate: "متوسط", expert: "خبير", filterBy: "تصفية حسب", category: "التصنيف", price: "السعر", all: "الكل", reviews: "تقييم" }
} as const;

const CATEGORIES_DATA = [
  { id: 'WINDEV', label: 'WINDEV', icon: Monitor, color: 'from-blue-500 to-blue-700' },
  { id: 'WEBDEV', label: 'WEBDEV', icon: Globe, color: 'from-purple-500 to-purple-700' },
  { id: 'MOBILE', label: 'WINDEV MOBILE', icon: Smartphone, color: 'from-green-500 to-green-700' },
  { id: 'HFSQL', label: 'HFSQL', icon: Database, color: 'from-yellow-500 to-yellow-700' },
  { id: 'WLANGAGE', label: 'WLANGAGE', icon: Code, color: 'from-red-500 to-red-700' },
  { id: 'PACKS', label: 'PACKS', icon: Package, color: 'from-gray-600 to-gray-800' }
];

const MOCK_COURSES = [
  { id: 1, title: { fr: "WinDev 2025 : Architecture MVP", en: "WinDev 2025 : MVP Architecture", ar: "WinDev 2025 : هندسة MVP البرمجية" }, author: { fr: "Dr. WLangage", en: "Dr. WLangage", ar: "د. WLangage" }, price: "PREMIUM", duration: "12", lessonsCount: 45, image: "bg-gradient-to-br from-blue-600 to-indigo-900", progress: 0, level: "expert", version: "25+", rating: 4.9, reviewsCount: 124, category: "WINDEV" },
  { id: 2, title: { fr: "WebDev & SaaS Multi-tenant", en: "WebDev & SaaS Multi-tenant", ar: "WebDev & SaaS : تطبيقات متعددة المستأجرين" }, author: { fr: "Dr. WLangage", en: "Dr. WLangage", ar: "د. WLangage" }, price: "PREMIUM", duration: "8", lessonsCount: 32, image: "bg-gradient-to-br from-purple-600 to-pink-900", progress: 15, level: "expert", version: "28+", rating: 4.7, reviewsCount: 89, category: "WEBDEV" },
  { id: 3, title: { fr: "Débuter avec HFSQL", en: "Getting Started with HFSQL", ar: "البداية مع قواعد بيانات HFSQL" }, author: { fr: "Dr. WLangage", en: "Dr. WLangage", ar: "د. WLangage" }, price: "FREE", duration: "2", lessonsCount: 10, image: "bg-gradient-to-br from-emerald-500 to-teal-800", progress: 0, level: "beginner", version: "24+", rating: 4.5, reviewsCount: 210, category: "HFSQL" },
  { id: 4, title: { fr: "Android & iOS avec WinDev Mobile", en: "Android & iOS with WinDev Mobile", ar: "Android & iOS مع WinDev Mobile" }, author: { fr: "Dr. WLangage", en: "Dr. WLangage", ar: "د. WLangage" }, price: "PREMIUM", duration: "15", lessonsCount: 60, image: "bg-gradient-to-br from-green-600 to-teal-900", progress: 0, level: "intermediate", version: "26+", rating: 4.8, reviewsCount: 156, category: "MOBILE" }
];

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2";
  const variants: Record<string, string> = {
    primary: "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40",
    secondary: "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700",
    ghost: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
    outline: "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const InputField = ({ icon: Icon, type, placeholder, isRTL, value, onChange }: any) => (
  <div className="relative group">
    <div className={`absolute inset-y-0 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors ${isRTL ? 'right-0 pr-4' : 'left-0 pl-4'}`}>
      <Icon size={20} />
    </div>
    <input 
      type={type} 
      className={`w-full py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-900 dark:text-white placeholder-slate-400 ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
      placeholder={placeholder}
      dir={isRTL ? 'rtl' : 'ltr'}
      value={value}
      onChange={onChange}
    />
  </div>
);

const RatingStars = ({ rating }: any) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} 
      />
    ))}
  </div>
);

type AuthFormProps = {
  type: 'login' | 'register';
  isRTL: boolean;
  t: any;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  setView: (v: any) => void;
  API_URL: string;
};

function AuthForm({ type, isRTL, t, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, setView, API_URL }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="w-full max-w-md z-10">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">{type === 'login' ? t.welcomeBack : t.joinUs}</h1>
            <p className="text-slate-500 dark:text-slate-400">{type === 'login' ? t.welcomeSub : t.joinSub}</p>
          </div>
          <div className="space-y-4">
            <InputField icon={Mail} type="email" placeholder={t.email} isRTL={isRTL} value={email} onChange={(e: any) => setEmail(e.target.value)} />
            <InputField icon={LockKeyhole} type="password" placeholder={t.password} isRTL={isRTL} value={password} onChange={(e: any) => setPassword(e.target.value)} />
            {type === 'register' && <InputField icon={LockKeyhole} type="password" placeholder={t.confirmPassword} isRTL={isRTL} value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} />}
            {type === 'login' && (
              <div className={`flex justify-end ${isRTL ? 'flex-row-reverse' : ''}`}>
                <a href="#" className="text-sm text-blue-500 hover:text-blue-400 font-medium">{t.forgotPass}</a>
              </div>
            )}
            <Button className={`w-full mt-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={isSubmitting} onClick={async () => {
              try {
                setAuthError('');
                setIsSubmitting(true);
                if (type === 'login') {
                  const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
                  localStorage.setItem('token', res.data.access_token);
                  axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
                  setView('catalog');
                } else {
                  if (password !== confirmPassword) return;
                  await axios.post(`${API_URL}/api/auth/register`, { email, password, role: 'STUDENT' });
                  setView('login');
                }
              } catch (e) {
                setAuthError('Action impossible, vérifie les données.');
              } finally {
                setIsSubmitting(false);
              }
            }}>{isSubmitting ? <><Loader2 className="animate-spin" size={16} /> {type === 'login' ? t.signInBtn : t.signUpBtn}</> : (type === 'login' ? t.signInBtn : t.signUpBtn)}</Button>
            {authError && <div className="text-red-500 text-sm mt-2">{authError}</div>}
          </div>
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              {type === 'login' ? t.noAccount : t.hasAccount} {' '}
              <button onClick={() => setView(type === 'login' ? 'register' : 'login')} className="text-yellow-600 dark:text-yellow-500 font-bold hover:underline">{type === 'login' ? t.register : t.login}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WindevExpertAcademy() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'fr' | 'en' | 'ar'>('fr');
  const [view, setView] = useState<'login' | 'register' | 'catalog' | 'categories' | 'player'>('login');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filters, setFilters] = useState({ category: 'ALL', level: 'ALL', price: 'ALL' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [courses, setCourses] = useState<any[]>(MOCK_COURSES);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const handleCategorySelect = (catId: string) => {
    setFilters(prev => ({ ...prev, category: catId }));
    setView('catalog');
  };

  const filteredCourses = (courses && courses.length ? courses : MOCK_COURSES).filter((course: any) => {
    const matchCat = filters.category === 'ALL' || course.category === filters.category;
    const matchLevel = filters.level === 'ALL' || course.level === filters.level;
    const matchPrice = filters.price === 'ALL' || (filters.price === 'FREE' && course.price === 'FREE') || (filters.price === 'PREMIUM' && course.price === 'PREMIUM');
    return matchCat && matchLevel && matchPrice;
  });

  const appWrapperClass = `min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} ${isRTL ? 'font-cairo' : 'font-sans'}`;

  const Navbar = () => (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('catalog')}>
          <img 
            src={theme === 'dark' ? "https://saashub.online/windevexpertacademy/WndevExpertAcademy_sombre.png" : "https://saashub.online/windevexpertacademy/WndevExpertAcademy_claire.png"}
            alt={t.brand}
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </div>
        <div className={`hidden md:flex items-center gap-8 font-medium text-sm text-slate-600 dark:text-slate-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button onClick={() => setView('catalog')} className={`hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors ${view === 'catalog' ? 'text-yellow-600 dark:text-yellow-500 font-bold' : ''}`}>{t.navHome}</button>
          <button onClick={() => setView('categories')} className={`hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors ${view === 'categories' ? 'text-yellow-600 dark:text-yellow-500 font-bold' : ''}`}>{t.navCategories}</button>
          <button className="hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors">{t.navContact}</button>
        </div>
        <div className={`hidden md:flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 mx-2">
            {['fr','ar','en'].map(l => (
              <button key={l} onClick={() => setLang(l as any)} className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${lang === l ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {view !== 'login' && view !== 'register' && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 ml-4 border-2 border-white dark:border-slate-800 cursor-pointer shadow-md" />
          )}
        </div>
        <button className="md:hidden p-2 text-slate-600 dark:text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <button onClick={() => { setView('catalog'); setIsMenuOpen(false); }} className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${isRTL ? 'flex-row-reverse text-right' : ''}`}><Home size={20} className="text-yellow-500" /> {t.navHome}</button>
          <button onClick={() => { setView('categories'); setIsMenuOpen(false); }} className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${isRTL ? 'flex-row-reverse text-right' : ''}`}><List size={20} className="text-yellow-500" /> {t.navCategories}</button>
          <button onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${isRTL ? 'flex-row-reverse text-right' : ''}`}><Phone size={20} className="text-yellow-500" /> {t.navContact}</button>
          <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {['fr','ar','en'].map(l => (
                <button key={l} onClick={() => setLang(l as any)} className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${lang === l ? 'bg-slate-100 dark:bg-slate-800 text-blue-500' : 'text-slate-500'}`}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-slate-600 dark:text-slate-400">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
          </div>
        </div>
      )}
    </nav>
  );

  const CategoriesPage = () => (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <h1 className={`text-3xl font-bold mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>{t.navCategories}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES_DATA.map(cat => (
          <div key={cat.id} onClick={() => handleCategorySelect(cat.id)} className="group relative h-48 w-full rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-800">
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} transition-transform duration-500 group-hover:scale-110`} />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm mb-4 group-hover:bg-white/30 transition-colors duration-300 shadow-inner"><cat.icon size={36} className="text-white drop-shadow-md" /></div>
              <h3 className="text-2xl font-bold tracking-wider drop-shadow-lg text-center uppercase">{cat.label}</h3>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 text-xs font-bold bg-white/20 px-4 py-2 rounded-full backdrop-blur-md uppercase tracking-wide">{t.startLearning}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  const CatalogPage = () => (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className={`flex flex-col md:flex-row justify-between items-center mb-8 gap-6 ${isRTL ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
        <div>
          <h1 className="text-3xl font-bold mb-2">{t.catalog}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t.welcomeSub}</p>
        </div>
        <div className="relative w-full md:w-96 group">
          <div className={`absolute inset-y-0 flex items-center px-4 pointer-events-none text-slate-400 ${isRTL ? 'right-0' : 'left-0'}`}><Search size={20} /></div>
          <input type="text" placeholder={t.searchPlaceholder} className={`w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`} dir={isRTL ? 'rtl' : 'ltr'} />
        </div>
      </div>
      <div className={`flex flex-wrap gap-4 mb-10 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center gap-2 text-slate-500 font-medium"><Filter size={18} /> {t.filterBy}:</div>
        <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-500">
          <option value="ALL">{t.category}: {t.all}</option>
          {CATEGORIES_DATA.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={filters.level} onChange={e => setFilters({ ...filters, level: e.target.value })} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-500">
          <option value="ALL">{t.level}: {t.all}</option>
          <option value="beginner">{t.beginner}</option>
          <option value="intermediate">{t.intermediate}</option>
          <option value="expert">{t.expert}</option>
        </select>
        <select value={filters.price} onChange={e => setFilters({ ...filters, price: e.target.value })} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-500">
          <option value="ALL">{t.price}: {t.all}</option>
          <option value="FREE">{t.free}</option>
          <option value="PREMIUM">{t.premium}</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoadingCourses && Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse">
            <div className="h-48 bg-slate-200 dark:bg-slate-800" />
            <div className="p-5">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-2" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            </div>
          </div>
        ))}
        {filteredCourses.map(course => (
          <div key={course.id} onClick={() => setView('player')} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 cursor-pointer flex flex-col h-full">
            <div className={`h-48 ${course.image} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-300">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"><Play className="text-white fill-white" /></div>
              </div>
              <span className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20`}>{course.price === 'FREE' ? t.free : t.premium}</span>
              <span className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'} bg-blue-600/90 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}>{course.category}</span>
            </div>
            <div className={`p-5 flex-1 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${course.level === 'beginner' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : course.level === 'intermediate' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'}`}>{t[course.level as 'beginner'|'intermediate'|'expert']}</span>
                <span className="flex items-center gap-1 text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"><Layers size={12} /> v{course.version}</span>
              </div>
              <h3 className="text-lg font-bold mb-1 group-hover:text-blue-500 transition-colors line-clamp-2">{course.title[lang]}</h3>
              <p className="text-xs text-slate-500 mb-3">{t.instructor}: {course.author[lang]}</p>
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="font-bold text-yellow-500 text-sm">{course.rating}</span>
                <RatingStars rating={course.rating} />
                <span className="text-xs text-slate-400">({course.reviewsCount})</span>
              </div>
              <div className={`mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}><BookOpen size={14} /> {course.lessonsCount} {t.lessons}</div>
                <div>{course.duration} {t.hours}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PlayerPage = () => (
    <div className={`flex flex-col lg:flex-row h-[calc(100vh-80px)] ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
      <div className="flex-1 bg-black flex flex-col overflow-y-auto lg:overflow-hidden">
        <div className="aspect-video bg-slate-900 relative group w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
              <Play className="text-white fill-white ml-1" size={32} />
            </div>
          </div>
          <div className="absolute top-10 left-10 opacity-20 pointer-events-none text-white text-xs font-mono animate-pulse">ID: 84392-AX</div>
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
            <Button variant="secondary" className="hidden md:flex"><Award size={18} /> {isRTL ? 'شهادة' : 'Certificat'}</Button>
          </div>
          <div className={`flex gap-6 border-b border-slate-200 dark:border-slate-800 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {['overview','qa','resources'].map(tab => (
              <button key={tab} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === 'overview' ? 'border-yellow-500 text-yellow-600 dark:text-yellow-500' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>{t[tab as 'overview'|'qa'|'resources']}</button>
            ))}
          </div>
          <div className={`prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 ${isRTL ? 'text-right' : ''}`}>
            <p>{isRTL ? 'في هذا الدرس، سوف نستكشف البنية الأساسية لمشروع WinDev الموجه نحو MVP (النموذج-العرض-المقدم). تسمح هذه الهندسة بفصل واضح بين واجهة المستخدم ومنطق العمل.' : "Dans cette leçon, nous allons explorer la structure fondamentale d'un projet WinDev orienté MVP (Modèle-Vue-Présenteur). Cette architecture permet une séparation claire entre l'interface utilisateur et la logique métier."}</p>
          </div>
        </div>
      </div>
      <div className={`w-full lg:w-96 bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden ${isRTL ? 'border-r border-l-0' : 'border-l'}`}>
        <div className={`p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${isRTL ? 'text-right' : ''}`}>
          <h3 className="font-bold text-lg">{t.courseContent}</h3>
          <div className="text-xs text-slate-500 mt-1">45 {t.lessons} • 12 {t.hours}</div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {[1,2,3,4,5].map(module => (
            <div key={module} className="rounded-xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className={`p-3 bg-slate-100 dark:bg-slate-800 font-semibold text-sm flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{isRTL ? `الوحدة ${module}: الهندسة` : `Module ${module} : Architecture`}</span>
              </div>
              <div>
                {[1,2,3].map(lesson => (
                  <div key={lesson} className={`p-3 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-l-2 ${module === 1 && lesson === 2 ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500' : 'border-transparent'} ${isRTL ? 'flex-row-reverse text-right border-l-0 border-r-2' : 'text-left border-l-2'}`}>
                    <div className="mt-1">
                      {module === 1 && lesson === 1 ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : module === 1 && lesson === 2 ? (
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /></div>
                      ) : (
                        <Lock size={16} className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${module === 1 && lesson === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{isRTL ? 'إعداد المشروع' : 'Mise en place du projet'}</p>
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
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoadingCourses(true);
        const res = await axios.get(`${API_URL}/api/courses`);
        const normalize = (c: any) => {
          const title = typeof c?.title === 'object' && c.title !== null
            ? c.title
            : { fr: String(c?.title ?? ''), en: String(c?.title ?? ''), ar: String(c?.title ?? '') };
          const author = typeof c?.author === 'object' && c.author !== null
            ? c.author
            : { fr: 'WindevExpert', en: 'WindevExpert', ar: 'وينديف إكسبرت' };
          const sections = Array.isArray(c?.sections) ? c.sections : [];
          const lessonsCount = sections.reduce((sum: number, s: any) => sum + (Array.isArray(s?.lessons) ? s.lessons.length : 0), 0);
          return {
            id: c?.id ?? Math.random(),
            title,
            author,
            price: c?.accessType === 'FREE' ? 'FREE' : 'PREMIUM',
            duration: String(c?.duration ?? 0),
            lessonsCount,
            image: 'bg-gradient-to-br from-blue-600 to-indigo-900',
            progress: 0,
            level: 'beginner',
            version: '25+',
            rating: 4.8,
            reviewsCount: 0,
            category: 'WINDEV',
          };
        };
        const data = Array.isArray(res.data) ? res.data.map(normalize) : [];
        setCourses(data);
      } catch (e) {}
      finally {
        setIsLoadingCourses(false);
      }
    };
    load();
  }, []);

  return (
    <div className={appWrapperClass} dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap'); .font-cairo { font-family: 'Cairo', sans-serif; }`}</style>
      <Navbar />
      <main className="flex-1 flex flex-col">
        {view === 'login' && (
          <AuthForm type="login" isRTL={isRTL} t={t} email={email} setEmail={setEmail} password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} setView={setView} API_URL={API_URL} />
        )}
        {view === 'register' && (
          <AuthForm type="register" isRTL={isRTL} t={t} email={email} setEmail={setEmail} password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} setView={setView} API_URL={API_URL} />
        )}
        {view === 'catalog' && <CatalogPage />}
        {view === 'categories' && <CategoriesPage />}
        {view === 'player' && <PlayerPage />}
      </main>
    </div>
  );
}
