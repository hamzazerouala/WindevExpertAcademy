'use client';

import React from 'react';
import { 
  Moon, Sun, Globe, Play, Lock, CheckCircle, 
  Search, BookOpen, User, LogOut, Menu, X,
  ChevronRight, ChevronLeft, LayoutGrid, Award,
  Mail, LockKeyhole, ArrowRight, Home, List, Phone,
  Star, Filter, Monitor, Smartphone, Database, Code, Package, Layers
} from 'lucide-react';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2";
  const variants = {
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

// Input Field Component
interface InputFieldProps {
  icon: React.ComponentType<{ size?: number }>;
  type: string;
  placeholder: string;
  isRTL?: boolean;
  className?: string;
  [key: string]: any;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  icon: Icon, 
  type, 
  placeholder, 
  isRTL, 
  className = '',
  ...props 
}) => (
  <div className={`relative group ${className}`}>
    <div className={`absolute inset-y-0 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors ${isRTL ? 'right-0 pr-4' : 'left-0 pl-4'}`}>
      <Icon size={20} />
    </div>
    <input 
      type={type} 
      className={`w-full py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-900 dark:text-white placeholder-slate-400 ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
      placeholder={placeholder}
      dir={isRTL ? 'rtl' : 'ltr'}
      {...props}
    />
  </div>
);

// Rating Stars Component
interface RatingStarsProps {
  rating: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  return (
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
};

// Export all icons for convenience
export {
  Moon, Sun, Globe, Play, Lock, CheckCircle, 
  Search, BookOpen, User, LogOut, Menu, X,
  ChevronRight, ChevronLeft, LayoutGrid, Award,
  Mail, LockKeyhole, ArrowRight, Home, List, Phone,
  Star, Filter, Monitor, Smartphone, Database, Code, Package, Layers
};