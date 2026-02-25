import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, FileText, ShoppingCart, Settings, LogOut, 
  Trash2, PlusCircle, Edit2, Save, X, Activity, DollarSign, Calendar, ChevronRight,
  Copy, UserCircle, Phone, Droplet, LayoutDashboard, Utensils, Eye, EyeOff, List, ArrowRight, ShieldCheck, ClipboardList,
  Download, CheckCircle, MessageCircle, Mail, Globe, Share2, Facebook, CalendarDays, UserPlus, Moon, Sun, ArrowUp, ArrowDown, Star
} from 'lucide-react';

import { Manager, Border, Expense, MONTHS, YEARS, Deposit, RiceDeposit, SystemDailyEntry, BazaarShift, BazaarShopper, RiceConfig } from './types';
import * as dbService from './services/firebaseService';
import Layout from './components/Layout';
import Reports from './components/Reports';
import IftaarManagement from './components/IftaarManagement';
import RamadanSchedule from './components/RamadanSchedule';
import { FACEBOOK_LINK, DEVELOPER_NAME } from './constants';

// --- RAMADAN & EID GREETINGS ---
const RamadanGreeting = () => {
    const [show, setShow] = React.useState(false);
    
    React.useEffect(() => {
        const today = new Date();
        const startRamadan = new Date(2026, 1, 19); // Feb 19, 2026
        const endRamadan = new Date(2026, 2, 20); // March 20, 2026
        
        if (today >= startRamadan && today <= endRamadan) {
            setShow(true);
            if ((window as any).confetti) {
                (window as any).confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#10b981', '#fbbf24', '#ffffff']
                });
            }
        }
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative border-4 border-emerald-400/30 text-center p-8 text-white">
                <button onClick={() => setShow(false)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                    <X size={20} />
                </button>
                
                <div className="mb-6 relative">
                    <div className="w-24 h-24 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Moon size={48} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="absolute -top-2 right-1/4 animate-bounce">
                        <Star size={20} className="text-yellow-200 fill-yellow-200" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold font-baloo mb-2">রমজান মোবারক!</h2>
                <p className="text-emerald-100 text-lg mb-6">পবিত্র মাহে রমজানের শুভেচ্ছা - শরিফুল</p>
                
                <div className="space-y-3">
                    <div className="bg-white/10 py-3 px-4 rounded-xl border border-white/10 text-sm font-medium">
                        আল্লাহ আমাদের সকল রোজা ও ইবাদত কবুল করুন।
                    </div>
                </div>

                <button onClick={() => setShow(false)} className="mt-8 w-full bg-yellow-400 hover:bg-yellow-500 text-emerald-900 py-4 rounded-2xl font-bold text-lg shadow-lg transition-transform active:scale-95">
                    ধন্যবাদ
                </button>
            </div>
        </div>
    );
};

const EidGreeting = () => {
    const [show, setShow] = React.useState(false);
    
    React.useEffect(() => {
        const today = new Date();
        const eidDay = new Date(2026, 2, 21); // March 21, 2026
        
        if (today.getFullYear() === eidDay.getFullYear() && 
            today.getMonth() === eidDay.getMonth() && 
            today.getDate() === eidDay.getDate()) {
            setShow(true);
            
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 300 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 50 * (timeLeft / duration);
                if ((window as any).confetti) {
                    (window as any).confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                    (window as any).confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
                }
            }, 250);
        }
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[200] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(14,165,233,0.3)] relative text-center p-10 border border-slate-200 dark:border-slate-800">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <button onClick={() => setShow(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <X size={28} />
                </button>
                
                <div className="mb-8">
                    <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"></div>
                        <Moon size={64} className="text-primary" />
                    </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-black font-baloo mb-4 text-slate-800 dark:text-white">ঈদ মোবারক!</h2>
                <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full"></div>
                
                <p className="text-xl md:text-2xl font-bold text-primary mb-8">পবিত্র ঈদ-উল-ফিতরের শুভেচ্ছা - শরিফুল</p>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 mb-8">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "ঈদ নিয়ে আসুক আপনার জীবনে অনাবিল আনন্দ, সুখ ও সমৃদ্ধি।"
                    </p>
                </div>

                <button onClick={() => setShow(false)} className="w-full bg-slate-900 dark:bg-primary text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                    ঈদ মোবারক
                </button>
            </div>
        </div>
    );
};

// --- DEVELOPER MODAL ---
const DeveloperModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative transform transition-all scale-100">
                <button onClick={onClose} className="absolute top-3 right-3 bg-white/20 hover:bg-black/10 p-2 rounded-full text-slate-600 dark:text-slate-300 transition-colors z-10">
                    <X size={24} />
                </button>
                
                {/* Header / Cover */}
                <div className="h-32 bg-gradient-to-r from-primary to-blue-600 relative">
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                         <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-700 bg-slate-200 shadow-lg overflow-hidden flex items-center justify-center">
                             <img src="https://i.imgur.com/mm2jLrd.png" alt="Developer" className="w-full h-full object-cover" />
                         </div>
                    </div>
                </div>
                
                <div className="pt-14 pb-8 px-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-baloo">MD SHARIFUL ISLAM</h2>
                    <p className="text-xs font-bold text-primary tracking-widest uppercase mb-4">Professional Web Designer & Developer</p>
                    
                    <div className="space-y-3 text-left bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-6">
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <Phone size={18} className="text-primary" />
                            <a href="tel:+8801735757133" className="hover:text-primary font-medium">+8801735757133</a>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <MessageCircle size={18} className="text-green-500" />
                            <a href="https://wa.me/8801735757133" target="_blank" rel="noreferrer" className="hover:text-green-600 font-medium">WhatsApp Me</a>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <Mail size={18} className="text-red-500" />
                            <a href="mailto:msharifulvisionary@gmail.com" className="hover:text-red-600 font-medium text-sm">msharifulvisionary@gmail.com</a>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <Facebook size={18} className="text-blue-600" />
                            <a href="https://www.facebook.com/share/16omXd7dE2/" target="_blank" rel="noreferrer" className="hover:text-blue-700 font-medium">Facebook Profile</a>
                        </div>
                    </div>

                    <button onClick={onClose} className="w-full bg-slate-900 dark:bg-black text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                        Close Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- PWA INSTALL PROMPT ---
const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setTimeout(() => setIsVisible(true), 5000);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:max-w-md z-[90] animate-bounce-in">
            <div className="bg-white border-l-4 border-primary p-4 rounded-r shadow-2xl flex items-center justify-between gap-4">
                <div>
                    <h4 className="font-bold text-slate-800">অ্যাপটি ইন্সটল করুন!</h4>
                    <p className="text-xs text-slate-500">আরও ভালো অভিজ্ঞতার জন্য ওয়েব অ্যাপ হিসেবে ব্যবহার করুন।</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={18}/></button>
                    <button onClick={handleInstall} className="bg-primary text-white px-4 py-2 rounded font-bold text-sm shadow hover:bg-sky-600 flex items-center gap-2">
                        <Download size={16}/> Install
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- LANDING PAGE ---
const LandingPage = ({ onStart, onDevClick }: { onStart: () => void, onDevClick: () => void }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
            {/* Navbar */}
            <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 dark:border-slate-700">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-primary font-bold text-xl font-baloo">
                        <Utensils size={28} /> মেস ম্যানেজার
                    </div>
                    <button onClick={onStart} className="bg-slate-900 dark:bg-primary text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-slate-800 transition-colors">
                        লগইন / রেজিস্টার
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white py-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                     <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
                     <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                </div>
                
                <div className="container mx-auto text-center relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 mb-6 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-xs font-bold tracking-wider">SMART MESS MANAGEMENT SYSTEM</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight font-baloo">
                        মেসের হিসাব-নিকাশ এখন <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">হাতের মুঠোয়</span>
                    </h1>
                    <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                        মিল, বাজার, টাকা জমা এবং যাবতীয় খরচের হিসাব রাখার ঝামেলা থেকে মুক্তি পান। অটোমেটেড রিপোর্ট জেনারেশন এবং স্বচ্ছ হিসাবের জন্য সেরা সমাধান।
                    </p>
                    <button 
                        onClick={onStart}
                        className="group bg-primary hover:bg-sky-500 text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-primary/50 transition-all flex items-center justify-center gap-3 mx-auto"
                    >
                        এখনই শুরু করুন <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 px-4 bg-white dark:bg-slate-900">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4 font-baloo">কেন ব্যবহার করবেন?</h2>
                        <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Calendar, title: "সহজ মিল ম্যানেজমেন্ট", desc: "প্রতিদিনের মিল এবং চালের হিসাব খুব সহজেই এন্ট্রি এবং আপডেট করার সুবিধা।" },
                            { icon: FileText, title: "অটোমেটেড রিপোর্ট", desc: "মাস শেষে এক ক্লিকেই সম্পূর্ণ মাসের আয়-ব্যয়ের পিডিএফ এবং ইমেজ রিপোর্ট।" },
                            { icon: ShieldCheck, title: "স্বচ্ছ ও নিরাপদ", desc: "ম্যানেজার এবং বর্ডার উভয়ের জন্যই আলাদা ড্যাশবোর্ড এবং স্বচ্ছ হিসাব ব্যবস্থা।" }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-700 text-center group">
                                <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full shadow-md flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon size={32} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Stats/CTA Section (RESTORED) */}
            <div className="bg-slate-900 text-white py-16 px-4 border-t border-slate-800">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2 font-baloo">আপনার মেস ম্যানেজ করতে প্রস্তুত?</h2>
                        <p className="text-slate-400">আজই রেজিস্ট্রেশন করুন এবং ডিজিটাল অভিজ্ঞতা নিন।</p>
                    </div>
                    <button onClick={onStart} className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                        ফ্রি-তে ব্যবহার করুন
                    </button>
                </div>
            </div>

            <footer className="bg-slate-950 text-slate-400 py-8 text-center border-t border-slate-900">
                <div className="container mx-auto px-4">
                    <p className="text-sm font-baloo mb-2">Design and Developed By</p>
                    <button onClick={onDevClick} className="text-primary font-bold text-lg hover:text-sky-300 transition-colors underline decoration-dotted underline-offset-4">{DEVELOPER_NAME}</button>
                    <p className="text-xs text-slate-600 mt-4">© {new Date().getFullYear()} Mess Manager Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

// --- SUB-COMPONENTS ---

// Bazaar Schedule Component
const BazaarSchedulePage = ({ manager, borders, isManager, currentUser, onUpdate }: { manager: Manager, borders: Border[], isManager: boolean, currentUser?: Border, onUpdate: (m: Manager) => void }) => {
    // ... (No changes here, keeping existing code) ...
    const [interval, setInterval] = useState(2);
    const [startDayInput, setStartDayInput] = useState(''); // Changed to date string
    const [manualDateInput, setManualDateInput] = useState('');
    const [editDateData, setEditDateData] = useState<{oldDate: number, newDateInput: string} | null>(null);
    
    const sortedDays = Object.values(manager.bazaarSchedule || {}).sort((a, b) => a.date - b.date);

    const getMonthIndex = (monthName: string) => {
        const idx = MONTHS.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
        return idx !== -1 ? idx : 0;
    };
    
    const getDayName = (day: number) => {
        const date = new Date(manager.year, getMonthIndex(manager.month), day);
        return date.toLocaleDateString('bn-BD', { weekday: 'long' });
    };

    const getFullDateString = (day: number) => {
        const month = getMonthIndex(manager.month) + 1;
        const mStr = month < 10 ? `0${month}` : month;
        const dStr = day < 10 ? `0${day}` : day;
        return `${manager.year}-${mStr}-${dStr}`;
    }

    const getDayFromDateString = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.getDate();
    }

    const generateSchedule = async () => {
        if(!startDayInput) return alert("শুরুর তারিখ সিলেক্ট করুন");
        if(!window.confirm("সতর্কতা: এটি আগের বাজার লিস্ট মুছে নতুন লিস্ট তৈরি করবে। আপনি কি নিশ্চিত?")) return;

        const monthIdx = getMonthIndex(manager.month);
        const daysInMonth = new Date(manager.year, monthIdx + 1, 0).getDate();
        const newSchedule: { [day: number]: BazaarShift } = {};

        const start = getDayFromDateString(startDayInput);
        const intv = Number(interval);

        for (let d = start; d <= daysInMonth; d += intv) {
            newSchedule[d] = { date: d, shoppers: [] };
        }

        updateSchedule(newSchedule);
    };

    const addSingleDate = () => {
        if(!manualDateInput) return alert("তারিখ সিলেক্ট করুন");
        const day = getDayFromDateString(manualDateInput);
        const currentSchedule = { ...manager.bazaarSchedule };
        if(currentSchedule[day]) return alert("এই তারিখটি ইতিমধ্যে আছে!");
        currentSchedule[day] = { date: day, shoppers: [] };
        updateSchedule(currentSchedule);
        setManualDateInput('');
    };

    const saveEditedDate = () => {
        if(!editDateData || !editDateData.newDateInput) return;
        const newDay = getDayFromDateString(editDateData.newDateInput);
        const oldDay = editDateData.oldDate;
        if(newDay === oldDay) { setEditDateData(null); return; }
        const currentSchedule = { ...manager.bazaarSchedule };
        if(currentSchedule[newDay]) { alert("এই তারিখটি ইতিমধ্যে আছে!"); return; }
        currentSchedule[newDay] = { ...currentSchedule[oldDay], date: newDay };
        delete currentSchedule[oldDay];
        updateSchedule(currentSchedule);
        setEditDateData(null);
    };

    const deleteDate = (date: number) => {
        if(!window.confirm(`${date} তারিখের বাজার বাতিল করতে চান?`)) return;
        const currentSchedule = { ...manager.bazaarSchedule };
        delete currentSchedule[date];
        updateSchedule(currentSchedule);
    };

    const addShopperToDate = (date: number, borderId: string) => {
        if(!borderId) return;
        const border = borders.find(b => b.id === borderId);
        if(!border) return;
        const currentSchedule = { ...manager.bazaarSchedule };
        if(!currentSchedule[date]) return;
        const shift = { ...currentSchedule[date] };
        const shoppers = [...(shift.shoppers || [])];
        if(shoppers.find(s => s.id === borderId)) return alert("এই মেম্বার ইতিমধ্যে যুক্ত আছে");
        shoppers.push({ id: border.id, name: border.name });
        shift.shoppers = shoppers; 
        currentSchedule[date] = shift;
        updateSchedule(currentSchedule);
    };

    const removeShopperFromDate = (date: number, shopperId: string) => {
        if(!window.confirm("মুছে ফেলতে চান?")) return;
        const currentSchedule = { ...manager.bazaarSchedule };
        if(!currentSchedule[date]) return;
        const shift = { ...currentSchedule[date] };
        shift.shoppers = shift.shoppers.filter(s => s.id !== shopperId);
        currentSchedule[date] = shift;
        updateSchedule(currentSchedule);
    };

    const bookSlot = (date: number) => {
        if(!currentUser) return;
        if(!window.confirm(`${date} তারিখে বাজার টিমে যুক্ত হতে চান?`)) return;
        const currentSchedule = { ...manager.bazaarSchedule };
        if(!currentSchedule[date]) return;
        const shift = { ...currentSchedule[date] };
        const shoppers = [...(shift.shoppers || [])];
        if(shoppers.find(s => s.id === currentUser.id)) return alert("আপনি ইতিমধ্যে যুক্ত আছেন");
        shoppers.push({ id: currentUser.id, name: currentUser.name });
        shift.shoppers = shoppers;
        currentSchedule[date] = shift;
        updateSchedule(currentSchedule);
    };

    const updateSchedule = async (newSchedule: { [day: number]: BazaarShift }) => {
        const updatedManager = { ...manager, bazaarSchedule: newSchedule };
        try {
            await dbService.updateManager(manager.username, { bazaarSchedule: newSchedule });
            onUpdate(updatedManager);
        } catch(e) { console.error(e); alert("আপডেট ব্যর্থ হয়েছে!"); }
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-4 md:p-6 animate-fade-in relative">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-6 border-b pb-4 dark:border-slate-700">
                <CalendarDays className="text-primary"/> বাজার লিস্ট (শিডিউল)
            </h2>

            {editDateData && (
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm">
                        <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">তারিখ পরিবর্তন করুন</h3>
                        <p className="text-sm text-slate-500 mb-2">বর্তমান: {editDateData.oldDate} তারিখ</p>
                        <input type="date" className="w-full p-3 border rounded-lg font-bold mb-4 dark:bg-slate-700 dark:text-white" value={editDateData.newDateInput} onChange={(e) => setEditDateData({...editDateData, newDateInput: e.target.value})} />
                        <div className="flex gap-2">
                            <button onClick={() => setEditDateData(null)} className="flex-1 bg-slate-200 py-2 rounded font-bold text-slate-700">বন্ধ করুন</button>
                            <button onClick={saveEditedDate} className="flex-1 bg-primary text-white py-2 rounded font-bold shadow">সেভ করুন</button>
                        </div>
                    </div>
                </div>
            )}

            {isManager && (
                <div className="space-y-4 mb-8">
                    <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg border border-blue-100 dark:border-slate-600 flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-auto">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">কত দিন পর পর?</label>
                            <select value={interval} onChange={e => setInterval(parseInt(e.target.value))} className="w-full md:w-32 p-2 border rounded font-bold dark:bg-slate-800">
                                <option value={1}>প্রতিদিন</option>
                                <option value={2}>২ দিন পর পর</option>
                                <option value={3}>৩ দিন পর পর</option>
                                <option value={4}>৪ দিন পর পর</option>
                                <option value={5}>৫ দিন পর পর</option>
                            </select>
                        </div>
                        <div className="w-full md:w-auto">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">শুরু হবে কত তারিখে?</label>
                            <input type="date" value={startDayInput} onChange={e => setStartDayInput(e.target.value)} className="w-full md:w-40 p-2 border rounded font-bold dark:bg-slate-800" />
                        </div>
                        <button onClick={generateSchedule} className="bg-blue-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-blue-700 w-full md:w-auto">অটোমেটিক জেনারেট</button>
                    </div>

                    <div className="bg-emerald-50 dark:bg-slate-700 p-4 rounded-lg border border-emerald-100 dark:border-slate-600 flex items-center gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block mb-1">নতুন তারিখ যোগ করুন (ক্যালেন্ডার)</label>
                            <div className="flex gap-2">
                                <input type="date" value={manualDateInput} onChange={e => setManualDateInput(e.target.value)} className="w-full md:w-auto p-2 border rounded font-bold flex-1 dark:bg-slate-800" />
                                <button onClick={addSingleDate} className="bg-emerald-600 text-white px-3 py-2 rounded font-bold hover:bg-emerald-700 flex items-center gap-1"><PlusCircle size={18}/> যোগ করুন</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-600">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <th className="p-3 w-1/4">তারিখ & বার</th>
                            <th className="p-3 w-1/2">বাজারকারী টিম</th>
                            {isManager && <th className="p-3 w-1/4 text-center">অ্যাকশন</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {sortedDays.length === 0 ? (
                            <tr><td colSpan={3} className="p-8 text-center text-slate-400">কোন শিডিউল নেই।</td></tr>
                        ) : (
                            sortedDays.map((shift) => (
                                <tr key={shift.date} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <td className="p-3 align-top">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-lg font-baloo text-slate-800 dark:text-white">{shift.date} তারিখ</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded w-fit">{getDayName(shift.date)}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 align-top">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {shift.shoppers && shift.shoppers.length > 0 ? (
                                                shift.shoppers.map((shopper: BazaarShopper) => (
                                                    <span key={shopper.id} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-bold border border-primary/20">
                                                        {shopper.name}
                                                        {isManager && (
                                                            <button onClick={() => removeShopperFromDate(shift.date, shopper.id)} className="text-red-500 hover:text-red-700 ml-1"><X size={14}/></button>
                                                        )}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-400 italic text-xs">কাউকে দেওয়া হয়নি</span>
                                            )}
                                        </div>
                                        <div className="mt-2">
                                            {!isManager && currentUser && !shift.shoppers?.find(s => s.id === currentUser.id) && (
                                                <button onClick={() => bookSlot(shift.date)} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-bold hover:bg-green-200 border border-green-200 transition-colors flex items-center gap-1 w-fit"><UserPlus size={14}/> আমি বাজার করবো</button>
                                            )}
                                        </div>
                                    </td>
                                    {isManager && (
                                        <td className="p-3 text-center align-top">
                                            <div className="flex flex-col gap-2 items-center">
                                                <div className="flex gap-1 w-full max-w-[200px]">
                                                    <select className="p-1.5 border rounded text-xs bg-white dark:bg-slate-800 w-full outline-none focus:ring-1" value="" onChange={(e) => { if(e.target.value) addShopperToDate(shift.date, e.target.value); }}>
                                                        <option value="">+ মেম্বার যুক্ত করুন</option>
                                                        {borders.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setEditDateData({ oldDate: shift.date, newDateInput: getFullDateString(shift.date) })} className="text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-1 text-xs font-bold border border-transparent hover:border-blue-100"><Edit2 size={16}/> এডিট</button>
                                                    <button onClick={() => deleteDate(shift.date)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors flex items-center gap-1 text-xs font-bold border border-transparent hover:border-red-100"><Trash2 size={16}/> ডিলিট</button>
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// New: System Daily Entry Component (Updated)
const SystemDailyEntryPage = ({ manager, onUpdate }: { manager: Manager, onUpdate: (m: Manager) => void }) => {
    // ... (No changes here) ...
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const [localData, setLocalData] = useState(manager.systemDaily || {});
    const [riceConfig, setRiceConfig] = useState<RiceConfig>(manager.riceConfig || { morningDiff: -2, lunchDiff: 0, dinnerDiff: 0 });
    const [prevRice, setPrevRice] = useState<number>(manager.prevRiceBalance || 0);
    
    // Auto-save logic
    const handleChange = (day: number, shift: 'morning'|'lunch'|'dinner', field: 'meal'|'rice', value: number) => {
        const newData = { ...localData };
        if(!newData[day]) newData[day] = { morning: {meal:0, rice:0}, lunch: {meal:0, rice:0}, dinner: {meal:0, rice:0} };
        
        newData[day][shift][field] = value;

        // Auto Calc Logic using Rice Config
        if(field === 'meal') {
            const diff = shift === 'morning' ? riceConfig.morningDiff : shift === 'lunch' ? riceConfig.lunchDiff : riceConfig.dinnerDiff;
            newData[day][shift].rice = value > 0 ? Math.max(0, value + diff) : 0;
        }

        setLocalData(newData);
    };

    const handleConfigChange = (field: keyof RiceConfig, val: string) => {
        setRiceConfig({ ...riceConfig, [field]: parseFloat(val) || 0 });
    }

    const handleSave = async () => {
        try {
            const dataToSave = { ...localData };
            
            const updatedManager = { 
                ...manager, 
                systemDaily: dataToSave, 
                riceConfig, 
                prevRiceBalance: prevRice 
            };

            await dbService.updateManager(manager.username, { 
                systemDaily: dataToSave, 
                riceConfig, 
                prevRiceBalance: prevRice 
            });
            
            // Critical: Update both state and localStorage
            onUpdate(updatedManager);
            localStorage.setItem('messManager', JSON.stringify(updatedManager));
            
            setLocalData(dataToSave);
            alert("সংরক্ষিত হয়েছে!");
        } catch(e) { 
            console.error("Save error:", e);
            alert("সেভ করতে সমস্যা হয়েছে!"); 
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-4 overflow-hidden">
            <div className="flex flex-col xl:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white"><ClipboardList/> দৈনিক মিল ও চাল হিসাব</h2>
                
                <div className="flex flex-wrap items-center gap-4">
                    {/* Previous Rice Input */}
                    <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded border border-yellow-200 dark:border-yellow-800">
                        <span className="text-xs font-bold text-yellow-800 dark:text-yellow-200">গত মাসের চাল (পট):</span>
                        <input type="number" step="0.1" value={prevRice} onChange={(e) => setPrevRice(parseFloat(e.target.value)||0)} className="w-16 p-1 border rounded text-center dark:bg-slate-700 dark:text-white font-bold" />
                    </div>

                    {/* Rice Diff Config */}
                    <div className="flex gap-2 text-xs items-center bg-slate-100 dark:bg-slate-700 p-2 rounded">
                        <span className="font-bold">চাল পার্থক্য:</span>
                        <div className="flex items-center gap-1">সকাল <input type="number" value={riceConfig.morningDiff} onChange={e => handleConfigChange('morningDiff', e.target.value)} className="w-10 p-1 border rounded text-center" /></div>
                        <div className="flex items-center gap-1">দুপুর <input type="number" value={riceConfig.lunchDiff} onChange={e => handleConfigChange('lunchDiff', e.target.value)} className="w-10 p-1 border rounded text-center" /></div>
                        <div className="flex items-center gap-1">রাত <input type="number" value={riceConfig.dinnerDiff} onChange={e => handleConfigChange('dinnerDiff', e.target.value)} className="w-10 p-1 border rounded text-center" /></div>
                    </div>

                    <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded shadow font-bold flex gap-2"><Save size={18}/> সেভ করুন</button>
                </div>
            </div>
            <div className="overflow-x-auto max-h-[70vh]">
                <table className="w-full text-sm text-center border-collapse">
                    <thead className="bg-slate-800 text-white sticky top-0 z-10">
                        <tr>
                            <th rowSpan={2} className="p-2 border border-slate-600 min-w-[50px]">তাং</th>
                            <th colSpan={2} className="p-1 border border-slate-600 bg-orange-600">সকাল</th>
                            <th colSpan={2} className="p-1 border border-slate-600 bg-blue-600">দুপুর</th>
                            <th colSpan={2} className="p-1 border border-slate-600 bg-purple-600">রাত</th>
                        </tr>
                        <tr>
                            <th className="p-1 border border-slate-600 text-[10px] w-12">মিল</th><th className="p-1 border border-slate-600 text-[10px] w-12">চাল</th>
                            <th className="p-1 border border-slate-600 text-[10px] w-12">মিল</th><th className="p-1 border border-slate-600 text-[10px] w-12">চাল</th>
                            <th className="p-1 border border-slate-600 text-[10px] w-12">মিল</th><th className="p-1 border border-slate-600 text-[10px] w-12">চাল</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-700">
                        {days.map(d => {
                            const entry = localData[d] || { morning: {meal:0, rice:0}, lunch: {meal:0, rice:0}, dinner: {meal:0, rice:0} };
                            return (
                                <tr key={d} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <td className="p-2 font-bold bg-slate-100 dark:bg-slate-600 border border-slate-200 dark:border-slate-500">{d}</td>
                                    
                                    <td className="p-1 border dark:border-slate-600"><input type="number" className="w-full text-center outline-none bg-transparent dark:text-white" value={entry.morning?.meal||''} placeholder="-" onChange={e => handleChange(d, 'morning', 'meal', parseFloat(e.target.value)||0)} /></td>
                                    <td className="p-1 border bg-orange-50 dark:bg-slate-900/50 dark:border-slate-600"><input type="number" step="0.1" className="w-full text-center outline-none bg-transparent font-bold text-orange-700 dark:text-orange-500" value={entry.morning?.rice||''} placeholder="-" onChange={e => handleChange(d, 'morning', 'rice', parseFloat(e.target.value)||0)} /></td>
                                    
                                    <td className="p-1 border dark:border-slate-600"><input type="number" className="w-full text-center outline-none bg-transparent dark:text-white" value={entry.lunch?.meal||''} placeholder="-" onChange={e => handleChange(d, 'lunch', 'meal', parseFloat(e.target.value)||0)} /></td>
                                    <td className="p-1 border bg-blue-50 dark:bg-slate-900/50 dark:border-slate-600"><input type="number" step="0.1" className="w-full text-center outline-none bg-transparent font-bold text-blue-700 dark:text-blue-500" value={entry.lunch?.rice||''} placeholder="-" onChange={e => handleChange(d, 'lunch', 'rice', parseFloat(e.target.value)||0)} /></td>
                                    
                                    <td className="p-1 border dark:border-slate-600"><input type="number" className="w-full text-center outline-none bg-transparent dark:text-white" value={entry.dinner?.meal||''} placeholder="-" onChange={e => handleChange(d, 'dinner', 'meal', parseFloat(e.target.value)||0)} /></td>
                                    <td className="p-1 border bg-purple-50 dark:bg-slate-900/50 dark:border-slate-600"><input type="number" step="0.1" className="w-full text-center outline-none bg-transparent font-bold text-purple-700 dark:text-purple-500" value={entry.dinner?.rice||''} placeholder="-" onChange={e => handleChange(d, 'dinner', 'rice', parseFloat(e.target.value)||0)} /></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// 1. Manager Overview Stats Component
const ManagerOverview = ({ manager, borders, expenses }: { manager: Manager, borders: Border[], expenses: Expense[] }) => {
    // ... (No changes here, keeping existing code) ...
    const totalMoney = borders.reduce((acc, b) => acc + b.deposits.reduce((s, d) => s + d.amount, 0), 0);
    const totalMeals = borders.reduce((acc, b) => acc + Object.values(b.dailyUsage).reduce((s, u: any) => s + (u.meals || 0), 0), 0);
    const totalRiceDeposited = borders.reduce((acc, b) => acc + b.riceDeposits.reduce((s, d) => s + (d.amount || 0), 0), 0);
    const totalRiceConsumed = borders.reduce((acc, b) => acc + Object.values(b.dailyUsage).reduce((s, u: any) => s + (u.rice || 0), 0), 0);
    
    // System Totals
    let systemMeals = 0;
    let systemRice = 0;
    
    // Daily Specific Stats
    const [viewDay, setViewDay] = useState(new Date().getDate());
    const maxDaysInMonth = MONTHS.find((_, i) => MONTHS[i] === manager.month) ? new Date(manager.year, MONTHS.indexOf(manager.month) + 1, 0).getDate() : 31;
    
    const handlePrevDay = () => setViewDay(prev => prev > 1 ? prev - 1 : maxDaysInMonth);
    const handleNextDay = () => setViewDay(prev => prev < maxDaysInMonth ? prev + 1 : 1);

    const todayStats = manager.systemDaily?.[viewDay] || { morning: {meal:0, rice:0}, lunch: {meal:0, rice:0}, dinner: {meal:0, rice:0} };

    if(manager.systemDaily) {
        Object.values(manager.systemDaily).forEach(d => {
            systemMeals += (d.morning?.meal||0) + (d.lunch?.meal||0) + (d.dinner?.meal||0);
            systemRice += (d.morning?.rice||0) + (d.lunch?.rice||0) + (d.dinner?.rice||0);
        });
    }

    const marketCost = expenses.filter(e => e.type === 'market').reduce((acc, e) => acc + e.amount, 0);
    const extraCost = expenses.filter(e => e.type === 'extra').reduce((acc, e) => acc + e.amount, 0);
    const totalCost = marketCost + extraCost;
    const currentCashBalance = totalMoney - totalCost;
    // Updated Rice Balance Logic: Total Deposit - Total Consumed + Previous Month Balance
    const currentRiceBalance = totalRiceDeposited - totalRiceConsumed + (manager.prevRiceBalance || 0);
    
    // Calc Meal Rate
    const calcMealRate = totalMeals > 0 ? (marketCost / totalMeals) : 0;

    const [showBorderList, setShowBorderList] = useState(false);
    const [showDailyMealReport, setShowDailyMealReport] = useState(false);
    const [showDailyRiceReport, setShowDailyRiceReport] = useState(false);

    const copyCreds = () => {
        const text = `মেস লগইন তথ্য:\nইউজারনেম: ${manager.username}\nপাসওয়ার্ড: ${manager.borderPassword}`;
        navigator.clipboard.writeText(text);
        alert("লগইন তথ্য কপি হয়েছে!");
    };

    if (showBorderList) {
        return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">বর্ডারদের তথ্য</h2>
                    <button onClick={() => setShowBorderList(false)} className="bg-slate-100 text-slate-600 px-3 py-1 rounded hover:bg-slate-200">বন্ধ করুন</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th className="p-2">নাম</th>
                                <th className="p-2">মোবাইল</th>
                                <th className="p-2">রক্তের গ্রুপ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borders.map(b => (
                                <tr key={b.id} className="border-b hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700">
                                    <td className="p-2 font-semibold">{b.name}</td>
                                    <td className="p-2">{b.mobile || '-'}</td>
                                    <td className="p-2 text-red-600 font-bold">{b.bloodGroup || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    if (showDailyMealReport) {
        return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">দৈনিক মিল আপডেট (১-{MONTHS.find((_, i) => MONTHS[i] === manager.month) ? new Date(manager.year, MONTHS.indexOf(manager.month) + 1, 0).getDate() : 31} তারিখ)</h2>
                    <button onClick={() => setShowDailyMealReport(false)} className="bg-slate-100 text-slate-600 px-3 py-1 rounded hover:bg-slate-200">বন্ধ করুন</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-center text-sm border-collapse">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="p-2 border border-slate-600">বর্ডার নাম</th>
                                {Array.from({ length: new Date(manager.year, MONTHS.indexOf(manager.month) + 1, 0).getDate() }, (_, i) => i + 1).map(d => (
                                    <th key={d} className="p-1 border border-slate-600 text-[10px] min-w-[25px]">{d}</th>
                                ))}
                                <th className="p-2 border border-slate-600 bg-blue-700">মোট</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borders.map(b => (
                                <tr key={b.id} className="border-b hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700">
                                    <td className="p-2 font-semibold text-left border dark:border-slate-600 sticky left-0 bg-white dark:bg-slate-800 z-10">{b.name}</td>
                                    {Array.from({ length: new Date(manager.year, MONTHS.indexOf(manager.month) + 1, 0).getDate() }, (_, i) => i + 1).map(d => (
                                        <td key={d} className="p-1 border dark:border-slate-600 font-mono text-[11px]">
                                            {b.dailyUsage[d]?.meals || '-'}
                                        </td>
                                    ))}
                                    <td className="p-2 font-bold border dark:border-slate-600 bg-blue-50 dark:bg-blue-900/20">
                                        {Object.values(b.dailyUsage).reduce((acc, curr: any) => acc + (curr.meals || 0), 0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (showDailyRiceReport) {
        return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">দৈনিক চাল আপডেট (১-{MONTHS.find((_, i) => MONTHS[i] === manager.month) ? new Date(manager.year, MONTHS.indexOf(manager.month) + 1, 0).getDate() : 31} তারিখ)</h2>
                    <button onClick={() => setShowDailyRiceReport(false)} className="bg-slate-100 text-slate-600 px-3 py-1 rounded hover:bg-slate-200">বন্ধ করুন</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-center text-sm border-collapse">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="p-2 border border-slate-600">বর্ডার নাম</th>
                                {Array.from({ length: new Date(manager.year, MONTHS.indexOf(manager.month) + 1, 0).getDate() }, (_, i) => i + 1).map(d => (
                                    <th key={d} className="p-1 border border-slate-600 text-[10px] min-w-[25px]">{d}</th>
                                ))}
                                <th className="p-2 border border-slate-600 bg-orange-700">মোট</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borders.map(b => (
                                <tr key={b.id} className="border-b hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700">
                                    <td className="p-2 font-semibold text-left border dark:border-slate-600 sticky left-0 bg-white dark:bg-slate-800 z-10">{b.name}</td>
                                    {Array.from({ length: new Date(manager.year, MONTHS.indexOf(manager.month) + 1, 0).getDate() }, (_, i) => i + 1).map(d => (
                                        <td key={d} className="p-1 border dark:border-slate-600 font-mono text-[11px]">
                                            {b.dailyUsage[d]?.rice || '-'}
                                        </td>
                                    ))}
                                    <td className="p-2 font-bold border dark:border-slate-600 bg-orange-50 dark:bg-orange-900/20">
                                        {Object.values(b.dailyUsage).reduce((acc, curr: any) => acc + (curr.rice || 0), 0).toFixed(1)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setShowDailyMealReport(true)} className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-lg flex items-center justify-center gap-3 font-bold transition-all transform hover:scale-[1.02]">
                    <Calendar size={24} /> দৈনিক মিল আপডেট
                </button>
                <button onClick={() => setShowDailyRiceReport(true)} className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-xl shadow-lg flex items-center justify-center gap-3 font-bold transition-all transform hover:scale-[1.02]">
                    <Utensils size={24} /> দৈনিক চাল আপডেট
                </button>
            </div>

            {/* Credentials Card */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-blue-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">বর্ডার লগইন ক্রেডেনশিয়াল</h3>
                    <div className="flex gap-4 mt-1 text-slate-800 dark:text-white">
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">ইউজারনেম: <b>{manager.username}</b></span>
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">পাসওয়ার্ড: <b>{manager.borderPassword}</b></span>
                    </div>
                </div>
                <button onClick={copyCreds} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition-colors">
                    <Copy size={18} /> কপি করুন
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 <div onClick={() => setShowBorderList(true)} className="cursor-pointer bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-5 rounded-xl shadow-lg relative overflow-hidden transition-transform hover:scale-[1.02]">
                     <h3 className="text-blue-100 text-sm font-medium">মোট বর্ডার</h3>
                     <p className="text-3xl font-bold mt-1 font-baloo">{borders.length} জন</p>
                     <p className="text-[10px] mt-1 opacity-80">বিস্তারিত দেখতে ক্লিক করুন</p>
                     <Users className="absolute right-3 bottom-3 text-white/20" size={40} />
                 </div>
                 <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-5 rounded-xl shadow-lg relative overflow-hidden">
                     <h3 className="text-green-100 text-sm font-medium">বর্তমান ক্যাশ</h3>
                     <p className="text-3xl font-bold mt-1 font-baloo">{currentCashBalance} ৳</p>
                     <p className="text-[10px] mt-1 opacity-80">মোট জমা: {totalMoney} | খরচ: {totalCost}</p>
                     <DollarSign className="absolute right-3 bottom-3 text-white/20" size={40} />
                 </div>
                 <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-xl shadow-lg relative overflow-hidden">
                     <h3 className="text-orange-100 text-sm font-medium">চালের মজুদ</h3>
                     <p className="text-3xl font-bold mt-1 font-baloo">{currentRiceBalance.toFixed(1)} পট</p>
                     <p className="text-[10px] mt-1 opacity-80">জমা: {totalRiceDeposited} | খাওয়া: {totalRiceConsumed}</p>
                     <Utensils className="absolute right-3 bottom-3 text-white/20" size={40} />
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow border border-slate-200 dark:border-slate-700">
                     <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">মোট মিল (বর্ডার)</h3>
                     <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white font-baloo">{totalMeals}</p>
                 </div>
                 
                 {/* Secondary Stats with Meal Rate */}
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow border border-slate-100 dark:border-slate-700 col-span-2 md:col-span-3">
                     <h4 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-3">বাজার ও মিল রেট সারাংশ</h4>
                     <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">সাধারণ বাজার</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-white font-baloo">{marketCost} ৳</p>
                        </div>
                        <div>
                            <p className="text-xs text-red-500">অতিরিক্ত বাজার</p>
                            <p className="text-xl font-bold text-red-600 font-baloo">{extraCost} ৳</p>
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 font-bold">মিল রেট (রান)</p>
                            <p className="text-xl font-bold text-blue-700 font-baloo">{calcMealRate.toFixed(2)} ৳</p>
                        </div>
                     </div>
                 </div>
                 
                 {/* System Daily Stats (With Date Navigation) */}
                 <div className="col-span-2 md:col-span-3 bg-slate-800 text-white p-4 rounded-xl shadow border border-slate-600">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-600 pb-2">
                        <h4 className="text-slate-300 text-xs font-bold uppercase">সিস্টেম ডেইলি হিসাব ({viewDay} তারিখ)</h4>
                        <div className="flex items-center gap-2">
                            <button onClick={(e) => { e.stopPropagation(); handlePrevDay(); }} className="p-1 hover:bg-slate-700 rounded transition-colors">
                                <ArrowUp size={16} className="-rotate-90" />
                            </button>
                            <span className="text-xs bg-slate-600 px-2 py-0.5 rounded">{viewDay} তারিখ</span>
                            <button onClick={(e) => { e.stopPropagation(); handleNextDay(); }} className="p-1 hover:bg-slate-700 rounded transition-colors">
                                <ArrowUp size={16} className="rotate-90" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-orange-900/30 p-2 rounded">
                            <span className="text-[10px] text-orange-200 block uppercase">সকাল</span>
                            <span className="font-bold text-lg">{todayStats.morning?.meal || 0}</span>
                        </div>
                        <div className="bg-blue-900/30 p-2 rounded">
                            <span className="text-[10px] text-blue-200 block uppercase">দুপুর</span>
                            <span className="font-bold text-lg">{todayStats.lunch?.meal || 0}</span>
                        </div>
                        <div className="bg-purple-900/30 p-2 rounded">
                            <span className="text-[10px] text-purple-200 block uppercase">রাত</span>
                            <span className="font-bold text-lg">{todayStats.dinner?.meal || 0}</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

// 2. Border Management List (Updated with Balance & Shuffle)
const BorderList = ({ borders, onAdd, onEdit, onDelete, onReorder, mealRate, expenses }: any) => {
    const [name, setName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Calculate balance logic
    const getBalance = (b: Border) => {
        const totalDeposit = b.deposits.reduce((acc, curr) => acc + curr.amount, 0);
        const totalMeals = Object.values(b.dailyUsage).reduce((acc, curr) => acc + (curr.meals || 0), 0);
        // Explicit logic: Meal Cost + Personal Extra + Guest Cost (Shared Extra EXCLUDED per request)
        const mealCost = Math.round(totalMeals * mealRate);
        const totalCost = mealCost + b.extraCost + b.guestCost;
        return (totalDeposit - totalCost).toFixed(0);
    }

    const moveBorder = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === borders.length - 1)) return;
        const newBorders = [...borders];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newBorders[index], newBorders[targetIndex]] = [newBorders[targetIndex], newBorders[index]];
        // Call parent to save new order (usually done by updating 'order' field or re-saving array)
        onReorder(newBorders);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-700 border-b dark:border-slate-600 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-700 dark:text-white">বর্ডার তালিকা ({borders.length})</h2>
                <button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow hover:bg-sky-600 text-sm">
                    <PlusCircle size={16} /> নতুন বর্ডার
                </button>
            </div>

            {isAdding && (
                <div className="p-4 bg-blue-50 dark:bg-slate-600 border-b flex gap-2 animate-fade-in">
                    <input className="border border-blue-300 p-2 rounded flex-1 focus:outline-none dark:bg-slate-700 dark:text-white" placeholder="নাম লিখুন..." value={name} onChange={e => setName(e.target.value)} autoFocus />
                    <button onClick={() => { onAdd(name); setName(''); setIsAdding(false); }} className="bg-green-600 text-white px-4 rounded font-medium shadow">সেভ</button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase text-xs font-bold">
                        <tr>
                            <th className="p-3 w-10">#</th>
                            <th className="p-3">নাম & তথ্য</th>
                            <th className="p-3 text-right">টাকা জমা</th>
                            <th className="p-3 text-right">চাল জমা</th>
                            <th className="p-3 text-right">অবশিষ্ট টাকা</th>
                            <th className="p-3 text-center">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-600">
                        {borders.map((b: Border, idx: number) => (
                            <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                <td className="p-3">
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => moveBorder(idx, 'up')} className="text-slate-400 hover:text-primary"><ArrowUp size={14}/></button>
                                        <button onClick={() => moveBorder(idx, 'down')} className="text-slate-400 hover:text-primary"><ArrowDown size={14}/></button>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="font-semibold text-slate-800 dark:text-white">{b.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 flex gap-2 mt-0.5">
                                        {b.mobile && <span>📞 {b.mobile}</span>}
                                        {b.bloodGroup && <span className="text-red-500">🩸 {b.bloodGroup}</span>}
                                    </div>
                                </td>
                                <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">{b.deposits.reduce((acc, curr) => acc + curr.amount, 0)} ৳</td>
                                <td className="p-3 text-right font-mono text-orange-600 dark:text-orange-400 font-bold">{b.riceDeposits.reduce((acc, curr) => acc + curr.amount, 0)} পট</td>
                                <td className={`p-3 text-right font-mono font-bold ${Number(getBalance(b)) < 0 ? 'text-red-500' : 'text-green-600'}`}>{getBalance(b)} ৳</td>
                                <td className="p-3 text-center flex justify-center gap-2">
                                    <button onClick={() => onEdit(b)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors" title="এডিট">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => { if(window.confirm('সত্যিই কি মুছে ফেলতে চান?')) onDelete(b.id); }} className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors" title="ডিলিট">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ... (Rest of the components: DailyEntry, MarketView, BorderDetailModal, LoginRegister remain unchanged) ...
// 3. Daily Entry
const DailyEntry = ({ borders, onSave, manager, onUpdateManager }: any) => {
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [localUsage, setLocalUsage] = useState<{[borderId: string]: {meals: string, rice: string}}>({});
    const [showAutoConfig, setShowAutoConfig] = useState(false);

    useEffect(() => {
        const initialLocal: any = {};
        borders.forEach((b: Border) => {
            initialLocal[b.id] = {
                meals: (b.dailyUsage[selectedDay]?.meals || 0).toString(),
                rice: (b.dailyUsage[selectedDay]?.rice || 0).toString()
            };
        });
        setLocalUsage(initialLocal);
    }, [selectedDay, borders]);

    const handleLocalChange = (borderId: string, field: 'meals' | 'rice', value: string) => {
        setLocalUsage(prev => {
            let newRice = prev[borderId]?.rice;
            
            if (field === 'meals' && manager.autoRiceEnabled) {
                const mealVal = parseFloat(value) || 0;
                const rule = manager.autoRiceRules?.find((r: any) => r.meal === mealVal);
                if (rule) {
                    newRice = rule.rice.toString();
                }
            } else if (field === 'rice') {
                newRice = value;
            }

            return {
                ...prev,
                [borderId]: {
                    ...prev[borderId],
                    [field]: value,
                    rice: newRice
                }
            };
        });
    };

    const handleBlur = (border: Border, field: 'meals' | 'rice') => {
        const meals = parseFloat(localUsage[border.id]?.meals) || 0;
        const rice = parseFloat(localUsage[border.id]?.rice) || 0;
        onSave(border, selectedDay, meals, rice);
    };

    const toggleAutoRice = async () => {
        const newState = !manager.autoRiceEnabled;
        await onUpdateManager({ autoRiceEnabled: newState });
    };

    const addRule = async () => {
        const rules = [...(manager.autoRiceRules || []), { meal: 0, rice: 0 }];
        await onUpdateManager({ autoRiceRules: rules });
    };

    const updateRule = async (index: number, field: 'meal' | 'rice', value: number) => {
        const rules = [...(manager.autoRiceRules || [])];
        rules[index] = { ...rules[index], [field]: value };
        await onUpdateManager({ autoRiceRules: rules });
    };

    const removeRule = async (index: number) => {
        const rules = (manager.autoRiceRules || []).filter((_: any, i: number) => i !== index);
        await onUpdateManager({ autoRiceRules: rules });
    };

    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white"><Calendar className="text-primary"/> দৈনিক মিল ও চাল এন্ট্রি</h2>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <button 
                            onClick={() => setShowAutoConfig(!showAutoConfig)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm transition-colors ${manager.autoRiceEnabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}
                        >
                            <Settings size={16} /> অটো চাল হিসাব: {manager.autoRiceEnabled ? 'ON' : 'OFF'}
                        </button>

                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
                            <label className="text-slate-600 dark:text-slate-300 font-medium">তারিখ:</label>
                            <select value={selectedDay} onChange={e => setSelectedDay(parseInt(e.target.value))} className="bg-white dark:bg-slate-800 border p-1.5 rounded font-bold outline-none font-baloo dark:text-white">
                                {days.map(d => <option key={d} value={d}>{d} তারিখ</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {showAutoConfig && (
                    <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <Activity size={18} className="text-primary" /> অটো চাল হিসাব সেটিংস
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">স্ট্যাটাস:</span>
                                <button 
                                    onClick={toggleAutoRice}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${manager.autoRiceEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${manager.autoRiceEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">এখানে মিল অনুযায়ী কত চাল হবে তা সেট করে দিন। মিল লিখলে অটো চালের হিসাব বসে যাবে।</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {(manager.autoRiceRules || []).map((rule: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border dark:border-slate-700 shadow-sm">
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase font-bold text-slate-400 block">মিল</label>
                                            <input type="number" step="0.5" value={rule.meal} onChange={e => updateRule(idx, 'meal', parseFloat(e.target.value)||0)} className="w-full bg-transparent font-bold text-blue-600 outline-none" />
                                        </div>
                                        <ArrowRight size={14} className="text-slate-300" />
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase font-bold text-slate-400 block">চাল</label>
                                            <input type="number" step="0.1" value={rule.rice} onChange={e => updateRule(idx, 'rice', parseFloat(e.target.value)||0)} className="w-full bg-transparent font-bold text-orange-600 outline-none" />
                                        </div>
                                        <button onClick={() => removeRule(idx)} className="text-red-400 hover:text-red-600 p-1"><X size={16}/></button>
                                    </div>
                                ))}
                                <button onClick={addRule} className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-400 hover:text-primary hover:border-primary transition-all font-bold text-sm">
                                    <PlusCircle size={16} /> নিয়ম যোগ করুন
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {borders.map((b: Border) => (
                        <div key={b.id} className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-4 shadow-sm hover:shadow-md flex flex-col gap-3">
                            <div className="font-bold text-lg text-slate-800 dark:text-white border-b dark:border-slate-700 pb-2">{b.name}</div>
                            <div className="flex justify-between items-center">
                                 <div className="flex flex-col gap-1 w-[48%]">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">মিল</span>
                                    <input type="number" step="0.5" className="w-full p-2 border rounded text-center font-bold text-blue-600 outline-none focus:ring-1 font-baloo dark:bg-slate-800"
                                      value={localUsage[b.id]?.meals || ''}
                                      onChange={(e) => handleLocalChange(b.id, 'meals', e.target.value)}
                                      onBlur={() => handleBlur(b, 'meals')} />
                                 </div>
                                 <div className="flex flex-col gap-1 w-[48%]">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">চাল (পট)</span>
                                    <input type="number" step="0.1" className="w-full p-2 border rounded text-center font-bold text-orange-600 outline-none focus:ring-1 font-baloo dark:bg-slate-800"
                                      value={localUsage[b.id]?.rice || ''} 
                                      onChange={(e) => handleLocalChange(b.id, 'rice', e.target.value)}
                                      onBlur={() => handleBlur(b, 'rice')} />
                                 </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 4. MarketView component
const formatBengaliDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const bengaliMonths = [
        "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
        "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];

    const bengaliDigits: { [key: string]: string } = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };

    const toBengaliDigits = (num: number) => {
        return num.toString().split('').map(d => bengaliDigits[d] || d).join('');
    };

    return `${toBengaliDigits(day)} ${bengaliMonths[month]} ${toBengaliDigits(year)}`;
};

const MarketView = ({ expenses, onAdd, onDelete, onUpdate }: any) => {
    const [form, setForm] = useState<Partial<Expense>>({ date: new Date().toISOString().split('T')[0], type: 'market', amount: 0, shopper: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [filterType, setFilterType] = useState<'all'|'market'|'extra'>('all');

    const handleSubmit = () => {
        if (!form.amount || !form.date) return alert("টাকার পরিমাণ এবং তারিখ আবশ্যক");
        
        if (isEditing && onUpdate) {
            onUpdate(form.id, form);
            setIsEditing(false);
        } else {
            const { id, ...cleanForm } = form as any;
            onAdd(cleanForm);
        }
        setForm({ date: new Date().toISOString().split('T')[0], type: 'market', amount: 0, shopper: '' });
    };

    const handleEdit = (e: Expense) => {
        setForm(e);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id?: string) => {
        if(!id) return;
        if(window.confirm('সত্যিই কি মুছে ফেলতে চান?')) {
            onDelete(id);
            if(isEditing) {
                setIsEditing(false);
                setForm({ date: new Date().toISOString().split('T')[0], type: 'market', amount: 0, shopper: '' });
            }
        }
    }

    const filteredExpenses = expenses.filter((e: Expense) => filterType === 'all' ? true : e.type === filterType);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 h-fit">
                <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white border-b pb-2 flex items-center gap-2">
                    <ShoppingCart size={20} className="text-primary"/> {isEditing ? 'খরচ এডিট করুন' : 'খরচ যুক্ত করুন'}
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300 mb-1 block">খরচের ধরণ</label>
                        <select className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white" value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}>
                            <option value="market">বাজার</option>
                            <option value="extra">অতিরিক্ত বাজার</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300 mb-1 block">তারিখ</label>
                        <input type="date" className="w-full p-2.5 border rounded-lg bg-slate-50 font-baloo dark:bg-slate-700 dark:text-white" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300 mb-1 block">বিবরণ / নাম</label>
                        <input placeholder="..." className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white" value={form.shopper} onChange={e => setForm({...form, shopper: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300 mb-1 block">টাকার পরিমাণ</label>
                        <input type="number" placeholder="0" className="w-full p-2.5 border rounded-lg bg-slate-50 font-bold font-baloo dark:bg-slate-700 dark:text-white" value={form.amount || ''} onChange={e => setForm({...form, amount: parseFloat(e.target.value)})} />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSubmit} className="flex-1 bg-primary text-white py-3 rounded-lg font-bold shadow hover:bg-sky-600">
                             {isEditing ? 'আপডেট করুন' : 'যোগ করুন'}
                        </button>
                        {isEditing && (
                            <>
                             <button onClick={() => handleDelete(form.id)} className="bg-red-500 text-white px-3 rounded text-sm hover:bg-red-600"><Trash2 size={18}/></button>
                             <button onClick={() => {setIsEditing(false); setForm({amount:0, date: new Date().toISOString().split('T')[0], type: 'market'})}} className="bg-gray-300 px-3 rounded text-gray-700">X</button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 flex flex-col h-[600px]">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">খরচের তালিকা</h3>
                    <div className="flex gap-2">
                        <button onClick={() => setFilterType('all')} className={`px-3 py-1 text-xs rounded-full ${filterType === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 dark:bg-slate-700 dark:text-slate-300'}`}>সব</button>
                        <button onClick={() => setFilterType('market')} className={`px-3 py-1 text-xs rounded-full ${filterType === 'market' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400'}`}>বাজার</button>
                        <button onClick={() => setFilterType('extra')} className={`px-3 py-1 text-xs rounded-full ${filterType === 'extra' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 dark:bg-slate-700 dark:text-red-400'}`}>অতিরিক্ত</button>
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 pr-2">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-white dark:bg-slate-800 shadow-sm z-10">
                            <tr className="text-left text-slate-500 dark:text-slate-400 border-b">
                                <th className="py-2">তারিখ</th>
                                <th className="py-2">ধরণ</th>
                                <th className="py-2">বিবরণ</th>
                                <th className="py-2 text-right">টাকা</th>
                                <th className="py-2 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredExpenses.map((e: Expense) => (
                                <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 group">
                                    <td className="py-3 text-slate-600 dark:text-slate-300 font-baloo">{formatBengaliDate(e.date)}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${e.type === 'extra' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                                            {e.type === 'extra' ? 'অতিরিক্ত' : 'বাজার'}
                                        </span>
                                    </td>
                                    <td className="py-3 font-medium dark:text-slate-200">{e.shopper}</td>
                                    <td className="py-3 font-bold text-right font-baloo dark:text-white">{e.amount}</td>
                                    <td className="py-3 text-right flex justify-end gap-2">
                                        <button onClick={() => handleEdit(e)} className="text-blue-500 hover:text-blue-700"><Edit2 size={16}/></button>
                                        <button onClick={() => handleDelete(e.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// 5. BorderDetailModal
const BorderDetailModal = ({ 
    border, onClose, onUpdateDeposits, onUpdateRice, onUpdateExtra, onUpdateGuest, onDeleteBorder 
}: any) => {
    // ... (Existing code kept same) ...
    const [moneyForm, setMoneyForm] = useState<{amount: number, date: string, id?: string}>({amount: 0, date: new Date().toISOString().split('T')[0]});
    const [riceForm, setRiceForm] = useState<{amount: number, date: string, type: 'deposit'|'previous_balance', id?: string}>({amount: 0, date: new Date().toISOString().split('T')[0], type: 'deposit'});
    const [isEditingMoney, setIsEditingMoney] = useState(false);
    const [isEditingRice, setIsEditingRice] = useState(false);

    if(!border) return null;

    // Money Handlers
    const saveMoney = () => {
        if(!moneyForm.amount) return;
        let newDeposits = [...border.deposits];
        if (isEditingMoney && moneyForm.id) {
            newDeposits = newDeposits.map(d => d.id === moneyForm.id ? { ...d, amount: moneyForm.amount, date: moneyForm.date } : d);
        } else {
            newDeposits.push({ id: Date.now().toString(), amount: moneyForm.amount, date: moneyForm.date });
        }
        onUpdateDeposits(newDeposits);
        setMoneyForm({ amount: 0, date: new Date().toISOString().split('T')[0] });
        setIsEditingMoney(false);
    };

    const deleteMoney = (id: string) => { if(window.confirm("নিশ্চিত?")) onUpdateDeposits(border.deposits.filter((d:any) => d.id !== id)); };
    const editMoney = (d: Deposit) => { setMoneyForm({ amount: d.amount, date: d.date, id: d.id }); setIsEditingMoney(true); };

    // Rice Handlers
    const saveRice = () => {
        if(!riceForm.amount) return;
        let newRice = [...border.riceDeposits];
        if (isEditingRice && riceForm.id) {
            newRice = newRice.map(d => d.id === riceForm.id ? { ...d, amount: riceForm.amount, date: riceForm.date, type: riceForm.type } : d);
        } else {
            newRice.push({ id: Date.now().toString(), amount: riceForm.amount, date: riceForm.date, type: riceForm.type });
        }
        onUpdateRice(newRice);
        setRiceForm({ amount: 0, date: new Date().toISOString().split('T')[0], type: 'deposit' });
        setIsEditingRice(false);
    };
    
    const deleteRice = (id: string) => { if(window.confirm("নিশ্চিত?")) onUpdateRice(border.riceDeposits.filter((d:any) => d.id !== id)); };
    const editRice = (d: RiceDeposit) => { setRiceForm({ amount: d.amount, date: d.date, type: d.type, id: d.id }); setIsEditingRice(true); };

    const deleteThisBorder = () => {
        if(window.confirm("সতর্কতা: এই বর্ডার এবং তার সকল তথ্য (জমা, মিল) ডিলিট হয়ে যাবে। আপনি কি নিশ্চিত?")) {
            onDeleteBorder(border.id);
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto relative shadow-2xl flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors z-20"><X size={20} /></button>
                
                <div className="p-6 border-b dark:border-slate-700 flex-shrink-0">
                    {/* Fixed Text Label */}
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">ম্যানেজ : <span className="text-primary">{border.name}</span></h2>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
                    {/* Left Col */}
                    <div className="space-y-6">
                         {/* Money Section */}
                        <div className="bg-emerald-50 dark:bg-slate-700 rounded-xl border border-emerald-100 dark:border-slate-600 overflow-hidden">
                            <div className="bg-emerald-100 dark:bg-slate-600 p-3 px-5 border-b border-emerald-200 dark:border-slate-500 flex justify-between items-center">
                                <h3 className="font-bold flex items-center gap-2 text-emerald-800 dark:text-emerald-300"><DollarSign size={18}/> টাকা জমা</h3>
                                <span className="text-sm font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-400">মোট: {border.deposits.reduce((a:number,b:any)=>a+b.amount,0)} ৳</span>
                            </div>
                            <div className="p-4 bg-white/50 dark:bg-slate-800/50">
                                <div className="flex gap-2 mb-2">
                                    <input type="date" value={moneyForm.date} onChange={e => setMoneyForm({...moneyForm, date: e.target.value})} className="border p-1.5 rounded text-sm w-1/3 font-baloo dark:bg-slate-700 dark:text-white" />
                                    <input type="number" placeholder="পরিমাণ" value={moneyForm.amount || ''} onChange={e => setMoneyForm({...moneyForm, amount: parseFloat(e.target.value)})} className="border p-1.5 rounded w-1/3 font-bold font-baloo dark:bg-slate-700 dark:text-white" />
                                    <button onClick={saveMoney} className="bg-emerald-600 text-white px-3 rounded flex-1 font-bold">{isEditingMoney ? 'আপডেট' : 'জমা'}</button>
                                </div>
                                <div className="max-h-40 overflow-y-auto">
                                    <table className="w-full text-sm"><tbody>
                                        {border.deposits.map((d:any) => (
                                            <tr key={d.id} className="border-b last:border-0 hover:bg-emerald-100/50 dark:border-slate-600">
                                                <td className="py-2 font-baloo dark:text-white">{d.date}</td>
                                                <td className="py-2 font-bold text-emerald-700 dark:text-emerald-400 font-baloo">{d.amount}</td>
                                                <td className="py-2 text-right flex justify-end gap-2">
                                                    <button onClick={() => editMoney(d)} className="dark:text-white"><Edit2 size={14}/></button>
                                                    <button onClick={() => deleteMoney(d.id)} className="dark:text-white"><Trash2 size={14}/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody></table>
                                </div>
                            </div>
                        </div>

                        {/* Extra Costs */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                             <h3 className="font-bold text-slate-700 dark:text-white mb-3">অতিরিক্ত খরচ সমূহ</h3>
                             <div className="space-y-3">
                                 <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">গেস্ট মিল খরচ (শুধুমাত্র মিলের জন্য)</label>
                                    <div className="flex gap-2">
                                        <input type="number" value={border.guestCost} onChange={e => onUpdateGuest(parseFloat(e.target.value))} className="w-full p-2 border rounded font-bold text-blue-600 bg-blue-50 dark:bg-slate-700 font-baloo" />
                                    </div>
                                 </div>
                                 <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">অতিরিক্ত খরচ</label>
                                    <div className="flex gap-2">
                                        <input type="number" value={border.extraCost} onChange={e => onUpdateExtra(parseFloat(e.target.value))} className="w-full p-2 border rounded font-bold text-red-600 bg-red-50 dark:bg-slate-700 font-baloo" />
                                    </div>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Right Col: Rice */}
                    <div className="bg-orange-50 dark:bg-slate-700 rounded-xl border border-orange-100 dark:border-slate-600 overflow-hidden h-fit">
                        <div className="bg-orange-100 dark:bg-slate-600 p-3 px-5 border-b border-orange-200 dark:border-slate-500 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2 text-orange-800 dark:text-orange-300"><Droplet size={18}/> চাল জমা</h3>
                            <span className="text-sm font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-orange-700 dark:text-orange-400">মোট: {border.riceDeposits.reduce((a:number,b:any)=>a+b.amount,0)} পট</span>
                        </div>
                        <div className="p-4 bg-white/50 dark:bg-slate-800/50">
                            <div className="flex flex-col gap-2 mb-2">
                                <div className="flex gap-2">
                                    <select value={riceForm.type} onChange={e => setRiceForm({...riceForm, type: e.target.value as any})} className="border p-1.5 rounded text-xs dark:bg-slate-700 dark:text-white outline-none">
                                        <option value="deposit">নতুন জমা</option>
                                        <option value="previous_balance">পূর্বের জের</option>
                                    </select>
                                    <input type="date" value={riceForm.date} onChange={e => setRiceForm({...riceForm, date: e.target.value})} className="border p-1.5 rounded text-sm w-full font-baloo dark:bg-slate-700 dark:text-white outline-none" />
                                </div>
                                <div className="flex gap-2">
                                    <input type="number" step="0.1" placeholder="পরিমাণ (পট)" value={riceForm.amount || ''} onChange={e => setRiceForm({...riceForm, amount: parseFloat(e.target.value)})} className="border p-1.5 rounded w-full font-bold font-baloo dark:bg-slate-700 dark:text-white outline-none" />
                                    <button onClick={saveRice} className="bg-orange-600 text-white px-3 rounded font-bold hover:bg-orange-700 transition-colors">{isEditingRice ? 'আপডেট' : 'জমা'}</button>
                                </div>
                            </div>
                            <div className="max-h-40 overflow-y-auto custom-scrollbar">
                                <table className="w-full text-sm"><tbody>
                                    {border.riceDeposits.map((d:any) => (
                                        <tr key={d.id} className="border-b last:border-0 hover:bg-orange-100/50 dark:border-slate-600">
                                            <td className="py-2 font-baloo dark:text-white">{d.date}</td>
                                            <td className="py-2 font-bold text-orange-700 dark:text-orange-400 font-baloo">{d.amount} ({d.type === 'previous_balance' ? 'জের' : 'জমা'})</td>
                                            <td className="py-2 text-right flex justify-end gap-2">
                                                <button onClick={() => editRice(d)} className="text-blue-500 hover:bg-blue-50 rounded p-1 dark:hover:bg-slate-700"><Edit2 size={14}/></button>
                                                <button onClick={() => deleteRice(d.id)} className="text-red-500 hover:bg-red-50 rounded p-1 dark:hover:bg-slate-700"><Trash2 size={14}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody></table>
                            </div>
                        </div>
                    </div>
                </div>
            
                <div className="p-6 border-t bg-slate-50 dark:bg-slate-700 dark:border-slate-600 flex justify-between items-center sticky bottom-0 z-10 flex-shrink-0">
                    <button onClick={deleteThisBorder} className="text-red-600 hover:text-red-800 text-sm font-bold flex items-center gap-1 px-3 py-2 rounded hover:bg-red-50 dark:hover:bg-slate-600 transition-colors"><Trash2 size={16}/> বর্ডার ডিলিট</button>
                    <button onClick={onClose} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-black transition-colors">বন্ধ করুন</button>
                </div>
            </div>
        </div>
    );
};

// Login/Register Component
const LoginRegister = ({ setManager, setBorderView }: any) => {
  const [isRegister, setIsRegister] = useState(false);
  const [activeTab, setActiveTab] = useState<'manager' | 'border'>('border');
  const [showPass, setShowPass] = useState(false);
  
  const [regForm, setRegForm] = useState<Manager>({ username: '', password: '', name: '', messName: '', year: 2025, month: MONTHS[0], mobile: '', mealRate: 0, borderUsername: '', borderPassword: '', bloodGroup: '' });
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [borderCreds, setBorderCreds] = useState({ username: '', password: '' });
  const [borderList, setBorderList] = useState<Border[]>([]);
  const [selectedBorderId, setSelectedBorderId] = useState('');
  const [showBorderSelect, setShowBorderSelect] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await dbService.registerManager(regForm); alert("রেজিস্ট্রেশন সফল!"); setIsRegister(false); } catch (err: any) { alert("সমস্যা: " + err.message); } finally { setLoading(false); }
  };

  const handleManagerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const mgr = await dbService.loginManager(loginCreds.username.trim(), loginCreds.password);
      if (mgr) { setManager(mgr); localStorage.setItem('messManager', JSON.stringify(mgr)); } else { alert("ভুল তথ্য"); }
    } catch (err) { alert("লগইন এরর"); } finally { setLoading(false); }
  };

  const verifyBorderLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const username = borderCreds.username.trim();
        const docRef = dbService.doc(dbService.db, "managers", username);
        const docSnap = await dbService.getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data() as Manager;
            if (data.borderPassword === borderCreds.password) {
                const borders = await dbService.getBorders(data.username);
                setBorderList(borders);
                setShowBorderSelect(true);
            } else { alert("গ্রুপ পাসওয়ার্ড ভুল"); }
        } else { alert("ম্যানেজার ইউজারনেম পাওয়া যায়নি"); }
    } catch (e) { alert("সার্ভার এরর"); } finally { setLoading(false); }
  };

  if (showBorderSelect) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl w-full max-w-md text-center">
                  <h2 className="text-xl font-bold mb-4 dark:text-white">আপনার নাম সিলেক্ট করুন</h2>
                  <select className="w-full p-3 border rounded mb-4 dark:bg-slate-700 dark:text-white" value={selectedBorderId} onChange={e => setSelectedBorderId(e.target.value)}>
                      <option value="">-- নাম বাছাই করুন --</option>
                      {borderList.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <button onClick={() => { const b = borderList.find(x => x.id === selectedBorderId); if(b) setBorderView(b); }} disabled={!selectedBorderId} className="w-full bg-primary text-white py-3 rounded font-bold">ড্যাশবোর্ড দেখুন</button>
              </div>
          </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-xl max-w-md w-full animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-primary mb-6 font-baloo">মেস ম্যানেজার প্রো</h1>
        <div className="flex mb-6 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
          <button className={`flex-1 py-2 rounded font-bold ${activeTab === 'border' ? 'bg-white dark:bg-slate-800 shadow' : 'text-slate-500'}`} onClick={() => setActiveTab('border')}>বর্ডার</button>
          <button className={`flex-1 py-2 rounded font-bold ${activeTab === 'manager' ? 'bg-white dark:bg-slate-800 shadow' : 'text-slate-500'}`} onClick={() => setActiveTab('manager')}>ম্যানেজার</button>
        </div>

        {activeTab === 'manager' ? (
          isRegister ? (
            <form onSubmit={handleRegister} className="space-y-3 h-96 overflow-y-auto custom-scrollbar">
               <input required placeholder="নাম" className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} />
               <input required placeholder="মেসের নাম" className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={regForm.messName} onChange={e => setRegForm({...regForm, messName: e.target.value})} />
               <input required placeholder="মোবাইল" className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={regForm.mobile} onChange={e => setRegForm({...regForm, mobile: e.target.value})} />
               <input required placeholder="রক্তের গ্রুপ" className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={regForm.bloodGroup || ''} onChange={e => setRegForm({...regForm, bloodGroup: e.target.value})} />
               <input required placeholder="ইউজারনেম" className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={regForm.username} onChange={e => setRegForm({...regForm, username: e.target.value})} />
               <input required type="password" placeholder="পাসওয়ার্ড" className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} />
               <hr/>
               <p className="text-xs dark:text-white">বর্ডার লগইন:</p>
               <input required placeholder="গ্রুপ ইউজারনেম" className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={regForm.borderUsername} onChange={e => setRegForm({...regForm, borderUsername: e.target.value})} />
               <input required placeholder="গ্রুপ পাসওয়ার্ড" className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={regForm.borderPassword} onChange={e => setRegForm({...regForm, borderPassword: e.target.value})} />
               <button type="submit" className="w-full bg-primary text-white py-3 rounded font-bold mt-2">রেজিস্ট্রেশন</button>
               <p className="text-center text-sm text-blue-500 mt-2 cursor-pointer hover:underline" onClick={() => setIsRegister(false)}>লগইন করুন</p>
            </form>
          ) : (
            <form onSubmit={handleManagerLogin} className="space-y-4">
              <input required placeholder="ইউজারনেম" className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={loginCreds.username} onChange={e => setLoginCreds({...loginCreds, username: e.target.value})} />
              <div className="relative">
                  <input required type={showPass ? "text" : "password"} placeholder="পাসওয়ার্ড" className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={loginCreds.password} onChange={e => setLoginCreds({...loginCreds, password: e.target.value})} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-500">{showPass ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-sky-600 transition-colors">{loading ? '...' : 'লগইন'}</button>
              <p className="text-center text-sm text-blue-500 mt-2 cursor-pointer hover:underline" onClick={() => setIsRegister(true)}>নতুন রেজিস্ট্রেশন</p>
            </form>
          )
        ) : (
          <form onSubmit={verifyBorderLogin} className="space-y-4">
             <input required placeholder="ম্যানেজার ইউজারনেম" className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={borderCreds.username} onChange={e => setBorderCreds({...borderCreds, username: e.target.value})} />
             <div className="relative">
                <input required type={showPass ? "text" : "password"} placeholder="গ্রুপ পাসওয়ার্ড" className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={borderCreds.password} onChange={e => setBorderCreds({...borderCreds, password: e.target.value})} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-500">{showPass ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
             </div>
             <button type="submit" disabled={loading} className="w-full bg-accent text-white py-3 rounded font-bold hover:bg-emerald-600 transition-colors">{loading ? '...' : 'পরবর্তী'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- APP COMPONENT ---

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [manager, setManager] = useState<Manager | null>(null);
  const [borderView, setBorderView] = useState<Border | null>(null);
  const [managerInfoForBorder, setManagerInfoForBorder] = useState<Manager | null>(null);
  
  const [borders, setBorders] = useState<Border[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard'|'daily'|'market'|'system'|'reports'|'settings'|'borders'|'schedule'|'iftaar'>('dashboard');
  const [activeBorderTab, setActiveBorderTab] = useState<'overview'|'meals'|'market'|'profile'|'schedule'|'iftaar'|'reports'|'system'>('overview');
	  const [showBorderDailyMealReport, setShowBorderDailyMealReport] = useState(false);
	  const [showBorderDailyRiceReport, setShowBorderDailyRiceReport] = useState(false);
  
  const [editingBorder, setEditingBorder] = useState<Border | null>(null);
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState<Manager>({} as Manager);
  const [borderProfileForm, setBorderProfileForm] = useState({ mobile: '', bloodGroup: '' });

  // Dark Mode
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  // Developer Modal State
  const [showDevModal, setShowDevModal] = useState(false);

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Restore session
  useEffect(() => {
      const stored = localStorage.getItem('messManager');
      if(stored) {
          try {
             const parsed = JSON.parse(stored);
             if(parsed && parsed.username) {
                 setManager(parsed);
                 setProfileForm(parsed);
                 setHasStarted(true);
             }
          } catch(e) { localStorage.removeItem('messManager'); }
      }
  }, []);

  // Fetch Manager Data (Load once when manager is available)
  const hasLoadedRef = React.useRef(false);
  useEffect(() => {
      if(manager && !hasLoadedRef.current) {
          loadData();
          hasLoadedRef.current = true;
      }
  }, [manager]);

  const loadData = async () => {
      if(!manager) return;
      try {
        // Fetch fresh manager data to ensure systemDaily is up to date
        const managerDoc = await dbService.getDoc(dbService.doc(dbService.db, "managers", manager.username));
        if (managerDoc.exists()) {
            const freshManager = managerDoc.data() as Manager;
            setManager(freshManager);
            setProfileForm(freshManager);
            localStorage.setItem('messManager', JSON.stringify(freshManager));
        }

        const [b, e] = await Promise.all([
            dbService.getBorders(manager.username),
            dbService.getExpenses(manager.username)
        ]);
        // Sort borders based on order if exists
        const sortedB = b.sort((a,b) => (a.order || 0) - (b.order || 0));
        setBorders(sortedB);
        setExpenses(e);
      } catch(err) { console.error(err); }
  };

  // Border View Setup
  const handleSetBorderView = async (border: Border) => {
      setBorderView(border);
      setHasStarted(true); // Ensure we leave landing page
      setBorderProfileForm({ mobile: border.mobile || '', bloodGroup: border.bloodGroup || '' });
      // Fetch manager info for rates
      if(border.managerId) {
          try {
            const snap = await dbService.getDoc(dbService.doc(dbService.db, 'managers', border.managerId));
            if(snap.exists()) {
                setManagerInfoForBorder(snap.data() as Manager);
            }
          } catch(e) { console.error(e); }
      }
      const exp = await dbService.getExpenses(border.managerId);
      setExpenses(exp);
      const allBorders = await dbService.getBorders(border.managerId);
      setBorders(allBorders);
  };

  // CRUD Operations
  const handleAddBorder = async (name: string) => {
      if(!manager) return;
      try {
        const newB = await dbService.addBorder(manager.username, name);
        // Add order to new border
        const updatedNewB = { ...newB, order: borders.length };
        await dbService.updateBorder(newB.id, { order: borders.length });
        
        setBorders([...borders, updatedNewB as Border]);
      } catch(e) { alert("Error adding border"); }
  };

  const handleUpdateBorder = async (borderId: string, data: Partial<Border>) => {
      try {
          await dbService.updateBorder(borderId, data);
          setBorders(prev => prev.map(b => b.id === borderId ? { ...b, ...data } : b));
          if(editingBorder && editingBorder.id === borderId) {
              setEditingBorder(prev => prev ? { ...prev, ...data } : null);
          }
          if(borderView && borderView.id === borderId) {
              setBorderView(prev => prev ? { ...prev, ...data } : null);
          }
      } catch(e) { console.error(e); }
  };

  const handleReorderBorders = async (newBorders: Border[]) => {
      setBorders(newBorders); // Optimistic update
      // Update order in firebase
      newBorders.forEach((b, idx) => {
          dbService.updateBorder(b.id, { order: idx });
      });
  }

  const handleUpdateManagerProfile = async () => {
      if(!manager) return;
      try {
          await dbService.updateManager(manager.username, profileForm);
          setManager(profileForm);
          setProfileEdit(false);
          alert("প্রোফাইল আপডেট হয়েছে!");
      } catch(e) { alert("Error updating profile"); }
  }

  const handleBorderProfileUpdate = async () => {
      if(!borderView) return;
      try {
          await dbService.updateBorder(borderView.id, borderProfileForm);
          alert("আপডেট হয়েছে!");
      } catch(e) { alert("Error"); }
  }

  const handleDeleteBorder = async (id: string) => {
      try {
          await dbService.deleteBorder(id);
          setBorders(prev => prev.filter(b => b.id !== id));
      } catch(e) { alert("Error deleting border"); }
  };

  const handleDailySave = async (border: Border, day: number, meals: number, rice: number) => {
      const updatedUsage = { ...border.dailyUsage, [day]: { meals, rice } };
      await handleUpdateBorder(border.id, { dailyUsage: updatedUsage });
  };

  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
      if(!manager) return;
      try {
          const newE = await dbService.addExpense({ ...expense, managerId: manager.username });
          setExpenses(prev => [...prev, newE as Expense]);
      } catch(e) { alert("Error adding expense"); }
  };

  const handleUpdateExpense = async (id: string, data: Partial<Expense>) => {
      try {
          await dbService.updateExpense(id, data);
          setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
      } catch(e) { alert("Error updating expense"); }
  };

  const handleDeleteExpense = async (id: string) => {
      try {
          await dbService.deleteExpense(id);
          setExpenses(prev => prev.filter(e => e.id !== id));
      } catch(e) { alert("Error deleting expense"); }
  };

  // Logouts
  const handleLogout = () => {
      setManager(null);
      localStorage.removeItem('messManager');
      setBorders([]);
      setExpenses([]);
      setHasStarted(true); // Go to login
  };

  const handleBorderLogout = () => {
      setBorderView(null);
      setManagerInfoForBorder(null);
      setBorders([]);
      setExpenses([]);
  };

  // Calc Meal Rate (Total Market Cost / Total Meals)
  const calcTotalMeals = borders.reduce((acc, b) => acc + Object.values(b.dailyUsage).reduce((s, u: any) => s + (u.meals || 0), 0), 0);
  const calcMarketCost = expenses.filter(e => e.type === 'market').reduce((acc, e) => acc + e.amount, 0);
  const dynamicMealRate = calcTotalMeals > 0 ? calcMarketCost / calcTotalMeals : 0;
  // Border Balance Summary Logic (Updated Calculation)
  const getBorderSummaryBalance = (b: Border) => {
      const totalDeposit = b.deposits.reduce((acc, curr) => acc + curr.amount, 0);
      const totalMeals = Object.values(b.dailyUsage).reduce((acc, curr) => acc + (curr.meals || 0), 0);
      
      const rateToUse = managerInfoForBorder ? managerInfoForBorder.mealRate : 0;
      // Updated Formula: Cost = Round(Meals * Rate) + Extra + Guest (Shared Extra excluded)
      const mealCost = Math.round(totalMeals * rateToUse);
      const cost = mealCost + b.extraCost + b.guestCost;
      return (totalDeposit - cost).toFixed(0);
  }

  return (
      <>
        {/* Global Components */}
        <PWAInstallPrompt />
        <DeveloperModal isOpen={showDevModal} onClose={() => setShowDevModal(false)} />

        {/* Conditional Views */}
        {!hasStarted ? (
            <LandingPage onStart={() => setHasStarted(true)} onDevClick={() => setShowDevModal(true)} />
        ) : (
            <>
                {borderView && managerInfoForBorder ? (
                    <Layout 
                        title="বর্ডার ড্যাশবোর্ড" 
                        subtitle={`স্বাগতম, ${borderView.name}`} 
                        action={
                            <div className="flex flex-row items-center gap-2 mt-0">
                                <button onClick={toggleDarkMode} className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full text-slate-700 dark:text-white transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"><Moon size={18}/></button>
                                <button onClick={handleBorderLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-full font-bold flex gap-2 items-center hover:bg-red-100 transition-colors border border-red-100"><LogOut size={18}/> বের হন</button>
                            </div>
                        }
                        onDeveloperClick={() => setShowDevModal(true)}
                    >
                        <RamadanGreeting />
                        <EidGreeting />
                         <div className="flex bg-white dark:bg-slate-800 p-1 rounded mb-6 border dark:border-slate-700 overflow-x-auto sticky top-20 z-20 shadow-sm">
{['overview','meals','market','schedule','iftaar','reports','system','profile'].map(v => (
		                                 <button key={v} onClick={() => setActiveBorderTab(v as any)} className={`flex-1 py-2 px-4 rounded font-bold capitalize whitespace-nowrap ${activeBorderTab === v ? 'bg-primary text-white' : 'text-slate-500 dark:text-slate-400'}`}>
		                                     {v === 'overview' ? 'সামারি' : v === 'meals' ? 'মিল চার্ট' : v === 'market' ? 'বাজার' : v === 'schedule' ? 'বাজার লিস্ট' : v === 'iftaar' ? 'ইফতার হিসাব' : v === 'reports' ? 'রিপোর্ট' : v === 'system' ? 'ডেইলি আপডেট' : 'প্রোফাইল'}
		                                 </button>
		                             ))}
                         </div>

                         {activeBorderTab === 'reports' && (
                             <div className="animate-fade-in">
                                 <Reports manager={managerInfoForBorder} borders={borders} expenses={expenses} />
                             </div>
                         )}

                         {activeBorderTab === 'system' && (
                             <div className="animate-fade-in space-y-6">
                                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border dark:border-slate-700">
                                     <div className="flex items-center gap-3 mb-6 border-b dark:border-slate-700 pb-4">
                                         <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                             <Activity size={24} />
                                         </div>
                                         <div>
                                             <h3 className="text-xl font-bold text-slate-800 dark:text-white">দৈনিক মিল ও চাল আপডেট</h3>
                                             <p className="text-sm text-slate-500 dark:text-slate-400">ম্যানেজার কর্তৃক এন্ট্রি করা প্রতিদিনের হিসাব</p>
                                         </div>
                                     </div>
                                     
                                     <div className="overflow-x-auto">
                                         <table className="w-full text-sm border-collapse">
                                             <thead>
                                                 <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300">
                                                     <th className="p-3 text-left border dark:border-slate-700">তারিখ</th>
                                                     <th className="p-3 text-center border dark:border-slate-700 bg-orange-50/50 dark:bg-orange-900/10">সকাল (মিল/চাল)</th>
                                                     <th className="p-3 text-center border dark:border-slate-700 bg-blue-50/50 dark:bg-blue-900/10">দুপুর (মিল/চাল)</th>
                                                     <th className="p-3 text-center border dark:border-slate-700 bg-purple-50/50 dark:bg-purple-900/10">রাত (মিল/চাল)</th>
                                                     <th className="p-3 text-center border dark:border-slate-700 bg-emerald-50/50 dark:bg-emerald-900/10 font-bold">মোট</th>
                                                 </tr>
                                             </thead>
                                             <tbody className="divide-y dark:divide-slate-700">
                                                 {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                                                     const entry = managerInfoForBorder.systemDaily?.[day];
                                                     if (!entry) return null;
                                                     
                                                     const totalM = (entry.morning?.meal || 0) + (entry.lunch?.meal || 0) + (entry.dinner?.meal || 0);
                                                     const totalR = (entry.morning?.rice || 0) + (entry.lunch?.rice || 0) + (entry.dinner?.rice || 0);
                                                     
                                                     if (totalM === 0 && totalR === 0) return null;

                                                     return (
                                                         <tr key={day} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                             <td className="p-3 border dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">{day} তারিখ</td>
                                                             <td className="p-3 border dark:border-slate-700 text-center">
                                                                 <span className="font-bold text-orange-600">{entry.morning?.meal || 0}</span>
                                                                 <span className="mx-1 text-slate-300">/</span>
                                                                 <span className="text-slate-600 dark:text-slate-400">{entry.morning?.rice || 0}</span>
                                                             </td>
                                                             <td className="p-3 border dark:border-slate-700 text-center">
                                                                 <span className="font-bold text-blue-600">{entry.lunch?.meal || 0}</span>
                                                                 <span className="mx-1 text-slate-300">/</span>
                                                                 <span className="text-slate-600 dark:text-slate-400">{entry.lunch?.rice || 0}</span>
                                                             </td>
                                                             <td className="p-3 border dark:border-slate-700 text-center">
                                                                 <span className="font-bold text-purple-600">{entry.dinner?.meal || 0}</span>
                                                                 <span className="mx-1 text-slate-300">/</span>
                                                                 <span className="text-slate-600 dark:text-slate-400">{entry.dinner?.rice || 0}</span>
                                                             </td>
                                                             <td className="p-3 border dark:border-slate-700 text-center bg-emerald-50/30 dark:bg-emerald-900/5">
                                                                 <span className="font-bold text-emerald-600">{totalM}</span>
                                                                 <span className="mx-1 text-slate-300">/</span>
                                                                 <span className="font-bold text-slate-700 dark:text-slate-300">{totalR}</span>
                                                             </td>
                                                         </tr>
                                                     );
                                                 })}
                                             </tbody>
                                         </table>
                                     </div>
                                 </div>
                             </div>
                         )}

{activeBorderTab === 'overview' && (
	                             <div className="space-y-6">
	                                  <RamadanSchedule />
	                                  {/* Action Buttons for Border */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <button onClick={() => setShowBorderDailyMealReport(true)} className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-lg flex items-center justify-center gap-3 font-bold transition-all transform hover:scale-[1.02]">
                                          <Calendar size={24} /> দৈনিক মিল আপডেট
                                      </button>
                                      <button onClick={() => setShowBorderDailyRiceReport(true)} className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-xl shadow-lg flex items-center justify-center gap-3 font-bold transition-all transform hover:scale-[1.02]">
                                          <Utensils size={24} /> দৈনিক চাল আপডেট
                                      </button>
                                  </div>

                                  {/* Daily Meal Report View for Border */}
                                  {showBorderDailyMealReport && (
                                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                                          <div className="flex justify-between items-center mb-4 border-b pb-2">
                                              <h2 className="text-xl font-bold text-slate-800 dark:text-white">দৈনিক মিল আপডেট (১-{MONTHS.find((_, i) => MONTHS[i] === managerInfoForBorder.month) ? new Date(managerInfoForBorder.year, MONTHS.indexOf(managerInfoForBorder.month) + 1, 0).getDate() : 31} তারিখ)</h2>
                                              <button onClick={() => setShowBorderDailyMealReport(false)} className="bg-slate-100 text-slate-600 px-3 py-1 rounded hover:bg-slate-200">বন্ধ করুন</button>
                                          </div>
                                          <div className="overflow-x-auto">
                                              <table className="w-full text-center text-sm border-collapse">
                                                  <thead className="bg-slate-800 text-white">
                                                      <tr>
                                                          <th className="p-2 border border-slate-600">বর্ডার নাম</th>
                                                          {Array.from({ length: new Date(managerInfoForBorder.year, MONTHS.indexOf(managerInfoForBorder.month) + 1, 0).getDate() }, (_, i) => i + 1).map(d => (
                                                              <th key={d} className="p-1 border border-slate-600 text-[10px] min-w-[25px]">{d}</th>
                                                          ))}
                                                          <th className="p-2 border border-slate-600 bg-blue-700">মোট</th>
                                                      </tr>
                                                  </thead>
                                                  <tbody>
                                                      {borders.map(b => (
                                                          <tr key={b.id} className="border-b hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700">
                                                              <td className="p-2 font-semibold text-left border dark:border-slate-600 sticky left-0 bg-white dark:bg-slate-800 z-10">{b.name}</td>
                                                              {Array.from({ length: new Date(managerInfoForBorder.year, MONTHS.indexOf(managerInfoForBorder.month) + 1, 0).getDate() }, (_, i) => i + 1).map(d => (
                                                                  <td key={d} className="p-1 border dark:border-slate-600 font-mono text-[11px]">
                                                                      {b.dailyUsage[d]?.meals || '-'}
                                                                  </td>
                                                              ))}
                                                              <td className="p-2 font-bold border dark:border-slate-600 bg-blue-50 dark:bg-blue-900/20">
                                                                  {Object.values(b.dailyUsage).reduce((acc, curr: any) => acc + (curr.meals || 0), 0)}
                                                              </td>
                                                          </tr>
                                                      ))}
                                                  </tbody>
                                              </table>
                                          </div>
                                      </div>
                                  )}

                                  {/* Daily Rice Report View for Border */}
                                  {showBorderDailyRiceReport && (
                                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                                          <div className="flex justify-between items-center mb-4 border-b pb-2">
                                              <h2 className="text-xl font-bold text-slate-800 dark:text-white">দৈনিক চাল আপডেট (১-{MONTHS.find((_, i) => MONTHS[i] === managerInfoForBorder.month) ? new Date(managerInfoForBorder.year, MONTHS.indexOf(managerInfoForBorder.month) + 1, 0).getDate() : 31} তারিখ)</h2>
                                              <button onClick={() => setShowBorderDailyRiceReport(false)} className="bg-slate-100 text-slate-600 px-3 py-1 rounded hover:bg-slate-200">বন্ধ করুন</button>
                                          </div>
                                          <div className="overflow-x-auto">
                                              <table className="w-full text-center text-sm border-collapse">
                                                  <thead className="bg-slate-800 text-white">
                                                      <tr>
                                                          <th className="p-2 border border-slate-600">বর্ডার নাম</th>
                                                          {Array.from({ length: new Date(managerInfoForBorder.year, MONTHS.indexOf(managerInfoForBorder.month) + 1, 0).getDate() }, (_, i) => i + 1).map(d => (
                                                              <th key={d} className="p-1 border border-slate-600 text-[10px] min-w-[25px]">{d}</th>
                                                          ))}
                                                          <th className="p-2 border border-slate-600 bg-orange-700">মোট</th>
                                                      </tr>
                                                  </thead>
                                                  <tbody>
                                                      {borders.map(b => (
                                                          <tr key={b.id} className="border-b hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700">
                                                              <td className="p-2 font-semibold text-left border dark:border-slate-600 sticky left-0 bg-white dark:bg-slate-800 z-10">{b.name}</td>
                                                              {Array.from({ length: new Date(managerInfoForBorder.year, MONTHS.indexOf(managerInfoForBorder.month) + 1, 0).getDate() }, (_, i) => i + 1).map(d => (
                                                                  <td key={d} className="p-1 border dark:border-slate-600 font-mono text-[11px]">
                                                                      {b.dailyUsage[d]?.rice || '-'}
                                                                  </td>
                                                              ))}
                                                              <td className="p-2 font-bold border dark:border-slate-600 bg-orange-50 dark:bg-orange-900/20">
                                                                  {Object.values(b.dailyUsage).reduce((acc, curr: any) => acc + (curr.rice || 0), 0).toFixed(1)}
                                                              </td>
                                                          </tr>
                                                      ))}
                                                  </tbody>
                                              </table>
                                          </div>
                                      </div>
                                  )}
                                  {/* Manager Info Card for Border */}
                                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow border border-blue-100 dark:border-slate-700 flex items-center gap-4">
                                      <div className="bg-blue-100 p-3 rounded-full text-blue-600"><UserCircle size={24}/></div>
                                      <div>
                                          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">ম্যানেজার তথ্য</p>
                                          <h3 className="font-bold text-slate-800 dark:text-white">{managerInfoForBorder.name}</h3>
                                          <div className="text-sm text-slate-600 dark:text-slate-300 flex gap-4">
                                              <span>📞 {managerInfoForBorder.mobile}</span>
                                              {managerInfoForBorder.bloodGroup && <span className="text-red-500 font-bold">🩸 {managerInfoForBorder.bloodGroup}</span>}
                                          </div>
                                      </div>
                                  </div>

                                  {/* Stats Grid for Border View */}
                                  {(() => {
                                      // Calculate breakdown for Border View
                                      const bTotalMeals: number = Object.values(borderView.dailyUsage).reduce<number>((a, b: any) => a + (Number(b.meals) || 0), 0);
                                      const bMealRate: number = managerInfoForBorder.mealRate;
                                      
                                      // Updated: Round meal cost
                                      const bMealCost: number = Math.round(bTotalMeals * bMealRate);
                                      
                                      const bTotalExtraBazaar: number = expenses.filter(e => e.type === 'extra').reduce((sum, e) => sum + e.amount, 0);
                                      const bSharedExtra: number = borders.length > 0 ? bTotalExtraBazaar / borders.length : 0;
                                      
                                      // Updated: Exclude shared extra from total cost calculation
                                      const bTotalCost: number = bMealCost + (borderView.extraCost||0) + (borderView.guestCost||0);
                                      
                                      const bTotalDeposit: number = borderView.deposits.reduce((a: number,b: Deposit) => a + Number(b.amount), 0);
                                      const bBalance: number = bTotalDeposit - bTotalCost;

                                      return (
                                        <>
                                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                              <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                                                  <h3 className="text-emerald-100 text-xs">মোট জমা টাকা</h3>
                                                  <p className="text-2xl font-bold font-baloo">{bTotalDeposit} ৳</p>
                                                  <DollarSign className="absolute bottom-2 right-2 opacity-20"/>
                                              </div>
                                              <div className="bg-orange-600 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                                                  <h3 className="text-orange-100 text-xs">মোট জমা চাল</h3>
                                                  <p className="text-2xl font-bold font-baloo">{borderView.riceDeposits.reduce((a: number,b: RiceDeposit) => a + (Number(b.amount)||0), 0)} পট</p>
                                                  <Utensils className="absolute bottom-2 right-2 opacity-20"/>
                                              </div>
                                              <div className={`p-4 rounded-xl shadow-lg text-white relative overflow-hidden ${bBalance < 0 ? 'bg-red-600' : 'bg-blue-600'}`}>
                                                  <h3 className="text-white/80 text-xs">বর্তমান ব্যালেন্স</h3>
                                                  <p className="text-2xl font-bold font-baloo mt-1">{bBalance.toFixed(0)} ৳</p>
                                                  <p className="text-[10px] bg-white/20 inline-block px-1 rounded mt-1">মিল রেট: {bMealRate} ৳</p>
                                              </div>
                                              <div className="bg-yellow-600 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                                                  <h3 className="text-yellow-100 text-xs">চাল খাওয়া</h3>
                                                  <p className="text-2xl font-bold font-baloo">{(Object.values(borderView.dailyUsage).reduce<number>((a, b: any) => a + (Number(b.rice) || 0), 0)).toFixed(1)} পট</p>
                                              </div>
                                          </div>

                                          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-700">
                                              <h3 className="font-bold border-b dark:border-slate-700 pb-3 mb-4 text-slate-800 dark:text-white">খরচের বিস্তারিত</h3>
                                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                                                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                                                      <p className="text-xs text-slate-500 dark:text-slate-400">মিল সংখ্যা</p>
                                                      <p className="font-bold font-baloo dark:text-white">{bTotalMeals}</p>
                                                  </div>
                                                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
                                                      <p className="text-xs text-slate-500 dark:text-slate-400">মিল রেট</p>
                                                      <p className="font-bold font-baloo text-orange-600 dark:text-orange-400">{bMealRate} ৳</p>
                                                  </div>
                                                  {/* Meal Cost Section */}
                                                  <div className="p-3 bg-blue-50 dark:bg-slate-700 rounded border border-blue-100 dark:border-slate-600">
                                                      <p className="text-xs text-slate-500 dark:text-slate-400">মিল খরচ</p>
                                                      <p className="font-bold font-baloo text-blue-700 dark:text-blue-400">{bMealCost.toFixed(0)} ৳</p>
                                                  </div>
                                                  <div className="p-3 bg-purple-50 dark:bg-slate-700 rounded">
                                                      <p className="text-xs text-slate-500 dark:text-slate-400">গেস্ট খরচ</p>
                                                      <p className="font-bold font-baloo text-purple-600 dark:text-purple-400">{borderView.guestCost} ৳</p>
                                                  </div>
                                                  <div className="p-3 bg-red-50 dark:bg-slate-700 rounded">
                                                      <p className="text-xs text-slate-500 dark:text-slate-400">অতিরিক্ত (নিজ)</p>
                                                      <p className="font-bold font-baloo text-red-600 dark:text-red-400">{borderView.extraCost} ৳</p>
                                                  </div>
                                                  <div className="p-3 bg-orange-50 dark:bg-slate-700 rounded opacity-70" title="এই খরচ আপনার ব্যালেন্স থেকে কাটা হচ্ছে না">
                                                      <p className="text-xs text-slate-500 dark:text-slate-400">বাজার এক্সট্রা (ভাগ)</p>
                                                      <p className="font-bold font-baloo text-orange-600 dark:text-orange-400">{bSharedExtra.toFixed(0)} ৳</p>
                                                  </div>
                                              </div>
                                              <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-900 rounded text-center">
                                                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                                      মোট খরচ = {bMealCost.toFixed(0)} (মিল) + {borderView.guestCost} (গেস্ট) + {borderView.extraCost} (নিজ) = <span className="text-red-600 dark:text-red-400 text-lg">{bTotalCost.toFixed(0)} ৳</span>
                                                  </p>
                                                  <p className="text-xs text-slate-400 mt-1 italic">* বাজার এক্সট্রা (ভাগ) বর্তমান ব্যালেন্স থেকে বাদ দেওয়া হয়নি।</p>
                                              </div>
                                          </div>
                                        </>
                                      );
                                  })()}

                                  {/* Transaction History Tables */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border dark:border-slate-700">
                                           <h3 className="font-bold border-b pb-3 mb-4 text-emerald-600 dark:text-emerald-400">টাকা জমা ইতিহাস</h3>
                                           <div className="max-h-60 overflow-y-auto">
                                              <table className="w-full text-sm">
                                                  <thead className="bg-slate-50 dark:bg-slate-700 text-xs"><tr><th className="p-2 text-left dark:text-slate-300">তারিখ</th><th className="p-2 text-right dark:text-slate-300">পরিমাণ</th></tr></thead>
                                                  <tbody className="divide-y dark:divide-slate-700">
                                                      {borderView.deposits.map(d => (<tr key={d.id} className="dark:text-white"><td className="p-2 font-baloo">{d.date}</td><td className="p-2 text-right font-bold text-emerald-600 dark:text-emerald-400 font-baloo">{d.amount} ৳</td></tr>))}
                                                  </tbody>
                                              </table>
                                           </div>
                                      </div>
                                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border dark:border-slate-700">
                                           <h3 className="font-bold border-b pb-3 mb-4 text-orange-600 dark:text-orange-400">চাল জমা ইতিহাস</h3>
                                           <div className="max-h-60 overflow-y-auto">
                                              <table className="w-full text-sm">
                                                  <thead className="bg-slate-50 dark:bg-slate-700 text-xs"><tr><th className="p-2 text-left dark:text-slate-300">তারিখ/ধরণ</th><th className="p-2 text-right dark:text-slate-300">পরিমাণ</th></tr></thead>
                                                  <tbody className="divide-y dark:divide-slate-700">
                                                      {borderView.riceDeposits.map(d => (<tr key={d.id} className="dark:text-white"><td className="p-2 font-baloo text-xs">{d.type === 'previous_balance' ? 'পূর্বের জের' : d.date}</td><td className="p-2 text-right font-bold text-orange-600 dark:text-orange-400 font-baloo">{d.amount} পট</td></tr>))}
                                                  </tbody>
                                              </table>
                                           </div>
                                      </div>
                                  </div>
                             </div>
                         )}

                         {/* ... (Other Border Tabs remain mostly same, just ensuring data flows) ... */}
                         {activeBorderTab === 'meals' && (
                             <div className="bg-white dark:bg-slate-800 rounded-xl shadow border dark:border-slate-700 overflow-hidden">
                                  <div className="p-4 bg-slate-50 dark:bg-slate-700 font-bold text-slate-700 dark:text-white">মিল চার্ট</div>
                                  <div className="max-h-[600px] overflow-y-auto">
                                      <table className="w-full text-sm text-center">
                                          <thead className="bg-slate-100 dark:bg-slate-900 sticky top-0 dark:text-white"><tr><th className="p-2">তারিখ</th><th className="p-2">মিল</th><th className="p-2">চাল</th></tr></thead>
                                          <tbody className="divide-y dark:divide-slate-700">{Array.from({length: 31}, (_, i) => i + 1).map(d => borderView.dailyUsage[d]?.meals || borderView.dailyUsage[d]?.rice ? (<tr key={d} className="dark:text-slate-300"><td className="p-2 font-baloo">{d}</td><td className="p-2 font-bold text-blue-600 dark:text-blue-400 font-baloo">{borderView.dailyUsage[d]?.meals}</td><td className="p-2 font-bold text-orange-600 dark:text-orange-400 font-baloo">{borderView.dailyUsage[d]?.rice}</td></tr>) : null)}</tbody>
                                      </table>
                                  </div>
                             </div>
                         )}
                         {activeBorderTab === 'market' && (
                              <div className="bg-white dark:bg-slate-800 rounded-xl shadow border dark:border-slate-700 overflow-hidden">
                                  <div className="max-h-[600px] overflow-y-auto">
                                      <table className="w-full text-sm text-left">
                                          <thead className="bg-slate-100 dark:bg-slate-900 sticky top-0 dark:text-white"><tr><th className="p-3">তারিখ</th><th className="p-3">বিবরণ</th><th className="p-3 text-right">টাকা</th></tr></thead>
                                          <tbody className="divide-y dark:divide-slate-700">
                                              {expenses.map(e => (
                                                  <tr key={e.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300 ${e.type === 'extra' ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                                                      <td className="p-3 font-baloo">{e.date}</td>
                                                      <td className="p-3">{e.shopper} {e.type === 'extra' && <span className="text-[10px] bg-red-200 dark:bg-red-800 px-1 rounded">অতিরিক্ত বাজার :</span>}</td>
                                                      <td className="p-3 text-right font-bold font-baloo">{e.amount}</td>
                                                  </tr>
                                              ))}
                                          </tbody>
                                      </table>
                                  </div>
                              </div>
                         )}
                         {activeBorderTab === 'schedule' && (
                             <BazaarSchedulePage 
                                manager={managerInfoForBorder} 
                                borders={borders} 
                                isManager={false} 
                                currentUser={borderView}
                                onUpdate={(m) => setManagerInfoForBorder(m)}
                             />
                         )}
                         {activeBorderTab === 'iftaar' && (
                             <IftaarManagement 
                                manager={managerInfoForBorder!} 
                                isManager={false} 
                                onBack={() => setActiveBorderTab('overview')}
                             />
                         )}
                         {activeBorderTab === 'profile' && (
                              <div className="bg-white dark:bg-slate-800 rounded-xl shadow border dark:border-slate-700 p-6 max-w-lg mx-auto">
                                  <h3 className="font-bold mb-4 dark:text-white">প্রোফাইল আপডেট</h3>
                                  <div className="space-y-3">
                                      <input className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={borderProfileForm.mobile} onChange={e => setBorderProfileForm({...borderProfileForm, mobile: e.target.value})} placeholder="মোবাইল" />
                                      <select className="w-full p-3 border rounded dark:bg-slate-700 dark:text-white" value={borderProfileForm.bloodGroup} onChange={e => setBorderProfileForm({...borderProfileForm, bloodGroup: e.target.value})}>
                                          <option value="">রক্তের গ্রুপ</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="O+">O+</option><option value="O-">O-</option><option value="AB+">AB+</option><option value="AB-">AB-</option>
                                      </select>
                                      <button onClick={handleBorderProfileUpdate} className="w-full bg-primary text-white py-3 rounded font-bold">আপডেট করুন</button>
                                  </div>
                              </div>
                         )}
                    </Layout>
                ) : manager ? (
                    <Layout 
                        title={manager.messName} 
                        subtitle={`ম্যানেজার: ${manager.name}`} 
                        managerInfo={{name: manager.name, mobile: manager.mobile}}
                        action={
                            <div className="flex flex-row items-center gap-2 mt-0">
                                <button onClick={toggleDarkMode} className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full text-slate-700 dark:text-white transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"><Moon size={18}/></button>
                                <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold border border-white/20">
                                    <LogOut size={16} /> <span className="hidden md:inline">লগ আউট</span>
                                </button>
                            </div>
                        }
                        onDeveloperClick={() => setShowDevModal(true)}
                    >
                        <RamadanGreeting />
                        <EidGreeting />
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Sidebar / Tabs (Desktop) & Mobile Nav */}
                            <div className="lg:w-64 flex-shrink-0">
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-2 sticky top-24 flex lg:flex-col flex-row gap-1 overflow-x-auto lg:overflow-visible">
                                    {[
                                        {id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard},
                                        {id: 'borders', label: 'বর্ডার তালিকা', icon: Users},
                                        {id: 'schedule', label: 'বাজার লিস্ট', icon: CalendarDays},
                                        {id: 'iftaar', label: 'ইফতার', icon: Utensils},
                                        {id: 'daily', label: 'দৈনিক মিল', icon: Calendar},
                                        {id: 'system', label: 'বাবুর্চি হিসাব', icon: ClipboardList},
                                        {id: 'market', label: 'বাজার খরচ', icon: ShoppingCart},
                                        {id: 'reports', label: 'রিপোর্ট', icon: FileText},
                                        {id: 'settings', label: 'সেটিংস', icon: Settings},
                                    ].map(item => (
                                        <button 
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id as any)} 
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all whitespace-nowrap lg:w-full text-left
                                                ${activeTab === item.id 
                                                    ? 'bg-primary text-white shadow-md' 
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                        >
                                            <item.icon size={20}/> <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
{activeTab === 'dashboard' && (
	                                    <div className="space-y-6 animate-fade-in">
	                                        <RamadanSchedule />
	                                        <ManagerOverview manager={manager} borders={borders} expenses={expenses} />
	                                    </div>
	                                )}
                                {activeTab === 'borders' && <div className="animate-fade-in"><BorderList borders={borders} onAdd={handleAddBorder} onEdit={setEditingBorder} onDelete={handleDeleteBorder} onReorder={handleReorderBorders} mealRate={manager.mealRate} expenses={expenses} /></div>}
                                {activeTab === 'schedule' && <div className="animate-fade-in"><BazaarSchedulePage manager={manager} borders={borders} isManager={true} currentUser={undefined} onUpdate={(m) => setManager(m)} /></div>}
                                {activeTab === 'daily' && <div className="animate-fade-in"><DailyEntry borders={borders} onSave={handleDailySave} manager={manager} onUpdateManager={(data: any) => {
                                    const updated = { ...manager, ...data };
                                    setManager(updated);
                                    dbService.updateManager(manager.username, data);
                                }} /></div>}
                                    {activeTab === 'system' && <div className="animate-fade-in"><SystemDailyEntryPage manager={manager} onUpdate={(m) => {
                                        setManager(m);
                                        localStorage.setItem('messManager', JSON.stringify(m));
                                    }} /></div>}
                                {activeTab === 'market' && <div className="animate-fade-in"><MarketView expenses={expenses} onAdd={handleAddExpense} onDelete={handleDeleteExpense} onUpdate={handleUpdateExpense} /></div>}
                                {activeTab === 'iftaar' && <div className="animate-fade-in"><IftaarManagement manager={manager} isManager={true} onBack={() => setActiveTab('dashboard')} /></div>}
                                {activeTab === 'reports' && <div className="animate-fade-in"><Reports manager={manager} borders={borders} expenses={expenses} /></div>}
                                {activeTab === 'settings' && (
                                    <div className="animate-fade-in bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700 max-w-xl mx-auto">
                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 pb-4 border-b dark:border-slate-700 dark:text-white"><Settings className="text-slate-700 dark:text-slate-200"/> সিস্টেম সেটিংস</h2>
                                        
                                        {/* Manager Profile Edit */}
                                        <div className="mb-8 border-b dark:border-slate-700 pb-6">
                                           <div className="flex justify-between items-center mb-4">
                                               <h3 className="font-bold text-slate-700 dark:text-white">ম্যানেজার প্রোফাইল & ক্রেডেনশিয়াল</h3>
                                               <button onClick={() => setProfileEdit(!profileEdit)} className="text-blue-600 text-sm hover:underline">{profileEdit ? 'বন্ধ করুন' : 'এডিট করুন'}</button>
                                           </div>
                                           {profileEdit ? (
                                               <div className="space-y-3 bg-slate-50 dark:bg-slate-700 p-4 rounded">
                                                   <label className="text-xs font-bold block mt-2 dark:text-white">ব্যক্তিগত তথ্য</label>
                                                   <input placeholder="নাম" className="w-full p-2 border rounded dark:bg-slate-600 dark:text-white" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                                                   <input placeholder="মেসের নাম" className="w-full p-2 border rounded dark:bg-slate-600 dark:text-white" value={profileForm.messName} onChange={e => setProfileForm({...profileForm, messName: e.target.value})} />
                                                   <input placeholder="মোবাইল" className="w-full p-2 border rounded dark:bg-slate-600 dark:text-white" value={profileForm.mobile} onChange={e => setProfileForm({...profileForm, mobile: e.target.value})} />
                                                   <input placeholder="রক্তের গ্রুপ" className="w-full p-2 border rounded dark:bg-slate-600 dark:text-white" value={profileForm.bloodGroup || ''} onChange={e => setProfileForm({...profileForm, bloodGroup: e.target.value})} />
                                                   
                                                   <label className="text-xs font-bold block mt-4 text-red-600">ক্রেডেনশিয়াল আপডেট (সাবধানে পরিবর্তন করুন)</label>
                                                   <input placeholder="আপনার নতুন পাসওয়ার্ড" className="w-full p-2 border rounded border-red-200 dark:bg-slate-600 dark:text-white" value={profileForm.password} onChange={e => setProfileForm({...profileForm, password: e.target.value})} />
                                                   <input placeholder="বর্ডার গ্রুপ ইউজারনেম" className="w-full p-2 border rounded border-red-200 dark:bg-slate-600 dark:text-white" value={profileForm.borderUsername} onChange={e => setProfileForm({...profileForm, borderUsername: e.target.value})} />
                                                   <input placeholder="বর্ডার গ্রুপ পাসওয়ার্ড" className="w-full p-2 border rounded border-red-200 dark:bg-slate-600 dark:text-white" value={profileForm.borderPassword} onChange={e => setProfileForm({...profileForm, borderPassword: e.target.value})} />
                                                   
                                                   <button onClick={handleUpdateManagerProfile} className="bg-green-600 text-white px-4 py-2 rounded w-full font-bold mt-2 shadow">সেভ করুন</button>
                                               </div>
                                           ) : (
                                               <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                                                   <p>নাম: <b>{manager.name}</b></p>
                                                   <p>মেস: <b>{manager.messName}</b></p>
                                                   <p>মোবাইল: <b>{manager.mobile}</b></p>
                                                   <p>রক্তের গ্রুপ: <b>{manager.bloodGroup || '-'}</b></p>
                                               </div>
                                           )}
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-white mb-2">বর্তমান মিল রেট (ফিক্সড)</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-bold text-blue-600">৳</span>
                                                    <input type="number" step="0.01" className="flex-1 border-2 border-blue-100 dark:border-slate-600 p-3 rounded-lg text-lg font-bold text-slate-700 dark:text-white dark:bg-slate-700 focus:border-blue-500 outline-none transition-colors" 
                                                        value={manager.mealRate} 
                                                        onChange={e => setManager({...manager, mealRate: parseFloat(e.target.value) || 0})}
                                                        onBlur={() => dbService.updateManager(manager.username, { mealRate: manager.mealRate })}
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">⚠️ মিল রেট পরিবর্তন করলে সকল বর্ডারের খরচের হিসাব সাথে সাথে আপডেট হয়ে যাবে।</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 dark:text-white mb-2">মাস</label>
                                                    <select className="w-full border p-3 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white font-semibold" value={manager.month} onChange={e => {
                                                        const m = e.target.value;
                                                        setManager({...manager, month: m});
                                                        dbService.updateManager(manager.username, { month: m });
                                                    }}>
                                                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 dark:text-white mb-2">বছর</label>
                                                    <select className="w-full border p-3 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white font-semibold" value={manager.year} onChange={e => {
                                                        const y = parseInt(e.target.value);
                                                        setManager({...manager, year: y});
                                                        dbService.updateManager(manager.username, { year: y });
                                                    }}>
                                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-700">
                                                <button onClick={async () => {
                                                    if(window.confirm("সতর্কতা: আপনি কি নিশ্চিত যে আপনি সম্পূর্ণ সিস্টেম মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।")) {
                                                        await dbService.deleteSystem(manager.username);
                                                        handleLogout();
                                                    }
                                                }} className="w-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300 p-4 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-100 dark:border-red-900">
                                                    <Trash2 size={20}/> সম্পূর্ণ ডাটাবেস রিসেট করুন
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Edit Modal */}
                        {editingBorder && (
                            <BorderDetailModal 
                                border={editingBorder} 
                                onClose={() => setEditingBorder(null)}
                                onUpdateDeposits={(deposits: Deposit[]) => handleUpdateBorder(editingBorder.id, { deposits })}
                                onUpdateRice={(riceDeposits: RiceDeposit[]) => handleUpdateBorder(editingBorder.id, { riceDeposits })}
                                onUpdateExtra={(extraCost: number) => handleUpdateBorder(editingBorder.id, { extraCost })}
                                onUpdateGuest={(guestCost: number) => handleUpdateBorder(editingBorder.id, { guestCost })}
                                onDeleteBorder={handleDeleteBorder}
                            />
                        )}
                    </Layout>
                ) : (
                    <LoginRegister setManager={setManager} setBorderView={handleSetBorderView} />
                )}
            </>
        )}
      </>
  );
};

export default App;
