import React from 'react';
import Footer from './Footer';
import { ChefHat } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  managerInfo?: { name: string, mobile: string };
  onDeveloperClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle, action, managerInfo, onDeveloperClick }) => {
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('bn-BD', dateOptions);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 shadow-xl sticky top-0 z-30 print:hidden text-white border-b-4 border-primary">
        <div className="container mx-auto px-4 py-3">
           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="bg-white/10 p-2 rounded-full border border-white/20">
                      <ChefHat size={32} className="text-primary" />
                  </div>
                  <div className="flex-1">
                      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase font-baloo">
                        {title || 'মেস ম্যানেজার প্রো'}
                      </h1>
                      <div className="flex flex-col md:flex-row flex-wrap gap-x-3 text-xs md:text-sm text-slate-300 md:items-center">
                          {subtitle && <span>{subtitle}</span>}
                          {managerInfo && (
                              <span className="bg-white/10 px-2 py-0.5 rounded text-blue-200 w-fit mt-1 md:mt-0">
                                📞 {managerInfo.mobile}
                              </span>
                          )}
                      </div>
                  </div>
              </div>
              
              <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-0 w-full md:w-auto justify-between md:justify-end">
                  <p className="text-sm text-emerald-300 font-bold bg-slate-800/50 dark:bg-black/30 px-3 py-1 rounded border border-emerald-500/30 font-baloo shadow-inner">
                    📅 {formattedDate}
                  </p>
                  <div className="md:mt-2">
                    {action}
                  </div>
              </div>
           </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-2 md:px-4 py-6 w-full max-w-7xl animate-fade-in">
        {children}
      </main>
      
      <div className="print:hidden">
        <Footer onDeveloperClick={onDeveloperClick} />
      </div>
    </div>
  );
};

export default Layout;