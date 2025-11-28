'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button, InputField } from './UIComponents';
import { Mail, LockKeyhole } from 'lucide-react';

interface AuthPageProps {
  type: 'login' | 'register';
  setView: (view: string) => void;
  isRTL: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ type, setView, isRTL }) => {
  const t = useTranslations();

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              {type === 'login' ? t('welcomeBack') : t('joinUs')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {type === 'login' ? t('welcomeSub') : t('joinSub')}
            </p>
          </div>
          <div className="space-y-4">
            <InputField icon={Mail} type="email" placeholder={t('email')} isRTL={isRTL} />
            <InputField icon={LockKeyhole} type="password" placeholder={t('password')} isRTL={isRTL} />
            {type === 'register' && (
              <InputField icon={LockKeyhole} type="password" placeholder={t('confirmPassword')} isRTL={isRTL} />
            )}
            {type === 'login' && (
              <div className={`flex justify-end ${isRTL ? 'flex-row-reverse' : ''}`}>
                <a href="#" className="text-sm text-blue-500 hover:text-blue-400 font-medium">{t('forgotPass')}</a>
              </div>
            )}
            <Button className="w-full mt-2" onClick={() => setView('catalog')}>
              {type === 'login' ? t('signInBtn') : t('signUpBtn')}
            </Button>
          </div>
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              {type === 'login' ? t('noAccount') : t('hasAccount')} {' '}
              <button 
                onClick={() => setView(type === 'login' ? 'register' : 'login')}
                className="text-yellow-600 dark:text-yellow-500 font-bold hover:underline"
              >
                {type === 'login' ? t('register') : t('login')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};