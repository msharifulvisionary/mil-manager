import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, FileText, ShoppingCart, Settings, LogOut, 
  Trash2, PlusCircle, Edit2, Save, X, Activity, DollarSign, Calendar, ChevronRight,
  Copy, UserCircle, Phone, Droplet, LayoutDashboard, Utensils, Eye, EyeOff, List, ArrowRight, ShieldCheck, ClipboardList,
  Download, CheckCircle, MessageCircle, Mail, Globe, Share2, Facebook, CalendarDays, UserPlus
} from 'lucide-react';

import { Manager, Border, Expense, MONTHS, YEARS, Deposit, RiceDeposit, SystemDailyEntry, BazaarShift, BazaarShopper } from './types';
import * as dbService from './services/firebaseService';
import Layout from './components/Layout';
import Reports from './components/Reports';
import { FACEBOOK_LINK, DEVELOPER_NAME } from './constants';

// --- DEVELOPER MODAL ---
const DeveloperModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative transform transition-all scale-100">
                <button onClick={onClose} className="absolute top-3 right-3 bg-white/20 hover:bg-black/10 p-2 rounded-full text-slate-600 transition-colors z-10">
                    <X size={24} />
                </button>
                
                {/* Header / Cover */}
                <div className="h-32 bg-gradient-to-r from-primary to-blue-600 relative">
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                         <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 shadow-lg overflow-hidden flex items-center justify-center">
                             <img src="https://i.imgur.com/mm2jLrd.png" alt="Developer" className="w-full h-full object-cover" />
                         </div>
                    </div>
                </div>
                
                <div className="pt-14 pb-8 px-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 font-baloo">MD SHARIFUL ISLAM</h2>
                    <p className="text-xs font-bold text-primary tracking-widest uppercase mb-4">Professional Web Designer & Developer</p>
                    
                    <div className="space-y-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                        <div className="flex items-center gap-3 text-slate-700">
                            <Phone size={18} className="text-primary" />
                            <a href="tel:+8801735757133" className="hover:text-primary font-medium">+8801735757133</a>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                            <MessageCircle size={18} className="text-green-500" />
                            <a href="https://wa.me/8801735757133" target="_blank" rel="noreferrer" className="hover:text-green-600 font-medium">WhatsApp Me</a>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                            <Mail size={18} className="text-red-500" />
                            <a href="mailto:msharifulvisionary@gmail.com" className="hover:text-red-600 font-medium text-sm">msharifulvisionary@gmail.com</a>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                            <Facebook size={18} className="text-blue-600" />
                            <a href="https://www.facebook.com/share/16omXd7dE2/" target="_blank" rel="noreferrer" className="hover:text-blue-700 font-medium">Facebook Profile</a>
                        </div>
                    </div>

                    <button onClick={onClose} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
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
            // Show prompt after 5 seconds
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
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-primary font-bold text-xl font-baloo">
                        <Utensils size={28} /> মেস ম্যানেজার
                    </div>
                    <button onClick={onStart} className="bg-slate-900 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-slate-800 transition-colors">
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
            <div className="py-20 px-4 bg-white">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4 font-baloo">কেন ব্যবহার করবেন?</h2>
                        <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Calendar, title: "সহজ মিল ম্যানেজমেন্ট", desc: "প্রতিদিনের মিল এবং চালের হিসাব খুব সহজেই এন্ট্রি এবং আপডেট করার সুবিধা।" },
                            { icon: FileText, title: "অটোমেটেড রিপোর্ট", desc: "মাস শেষে এক ক্লিকেই সম্পূর্ণ মাসের আয়-ব্যয়ের পিডিএফ এবং ইমেজ রিপোর্ট।" },
                            { icon: ShieldCheck, title: "স্বচ্ছ ও নিরাপদ", desc: "ম্যানেজার এবং বর্ডার উভয়ের জন্যই আলাদা ড্যাশবোর্ড এবং স্বচ্ছ হিসাব ব্যবস্থা।" }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl transition-shadow border border-slate-100 text-center group">
                                <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon size={32} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats/CTA Section */}
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

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-8 text-center border-t border-slate-900">
                <div className="container mx-auto px-4">
                    <p className="text-sm font-baloo mb-2">
                        Design and Developed By
                    </p>
                    <button 
                        onClick={onDevClick} 
                        className="text-primary font-bold text-lg hover:text-sky-300 transition-colors underline decoration-dotted underline-offset-4"
                    >
                        {DEVELOPER_NAME}
                    </button>
                    <p className="text-xs text-slate-600 mt-4">© {new Date().getFullYear()} Mess Manager Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

// --- SUB-COMPONENTS ---

// New: Bazaar Schedule Component (Updated)
const BazaarSchedulePage = ({ manager, borders, isManager, currentUser, onUpdate }: { manager: Manager, borders: Border[], isManager: boolean, currentUser?: Border, onUpdate: (m: Manager) => void }) => {
    const [interval, setInterval] = useState(2);
    const [startDay, setStartDay] = useState(1);
    const [manualDate, setManualDate] = useState(1);
    const [selectedBorderToAdd, setSelectedBorderToAdd] = useState('');
    
    // Sort schedule by date
    const sortedDays = Object.values(manager.bazaarSchedule || {}).sort((a, b) => a.date - b.date);

    // Helpers
    const getMonthIndex = (monthName: string) => {
        const idx = MONTHS.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
        return idx !== -1 ? idx : 0;
    };
    
    const getDayName = (day: number) => {
        const date = new Date(manager.year, getMonthIndex(manager.month), day);
        return date.toLocaleDateString('bn-BD', { weekday: 'long' });
    };

    // Manager: Generate Schedule (Resets existing)
    const generateSchedule = async () => {
        if(!window.confirm("সতর্কতা: এটি আগের বাজার লিস্ট মুছে নতুন লিস্ট তৈরি করবে। আপনি কি নিশ্চিত?")) return;

        const monthIdx = getMonthIndex(manager.month);
        const daysInMonth = new Date(manager.year, monthIdx + 1, 0).getDate();
        const newSchedule: { [day: number]: BazaarShift } = {};

        const start = Number(startDay);
        const intv = Number(interval);

        for (let d = start; d <= daysInMonth; d += intv) {
            newSchedule[d] = { date: d, shoppers: [] };
        }

        updateSchedule(newSchedule);
    };

    // Manager: Add Single Date
    const addSingleDate = () => {
        const day = Number(manualDate);
        if(!day || day < 1 || day > 31) return alert("সঠিক তারিখ দিন");
        
        const currentSchedule = { ...manager.bazaarSchedule };
        if(currentSchedule[day]) return alert("এই তারিখটি ইতিমধ্যে আছে!");

        currentSchedule[day] = { date: day, shoppers: [] };
        updateSchedule(currentSchedule);
        alert("তারিখ যুক্ত হয়েছে!");
    };

    // Manager: Delete Date
    const deleteDate = (date: number) => {
        if(!window.confirm(`${date} তারিখের বাজার বাতিল করতে চান?`)) return;
        const currentSchedule = { ...manager.bazaarSchedule };
        delete currentSchedule[date];
        updateSchedule(currentSchedule);
    };

    // Manager: Add Shopper to Date
    const addShopperToDate = (date: number, borderId: string) => {
        if(!borderId) return;
        const border = borders.find(b => b.id === borderId);
        if(!border) return;

        const currentSchedule = { ...manager.bazaarSchedule };
        if(!currentSchedule[date]) return;

        // Check duplicates
        if(currentSchedule[date].shoppers.find(s => s.id === borderId)) return alert("এই মেম্বার ইতিমধ্যে যুক্ত আছে");

        currentSchedule[date].shoppers.push({ id: border.id, name: border.name });
        updateSchedule(currentSchedule);
        setSelectedBorderToAdd(''); // reset selection
    };

    // Manager: Remove Shopper from Date
    const removeShopperFromDate = (date: number, shopperId: string) => {
        if(!window.confirm("মুছে ফেলতে চান?")) return;
        const currentSchedule = { ...manager.bazaarSchedule };
        if(!currentSchedule[date]) return;

        currentSchedule[date].shoppers = currentSchedule[date].shoppers.filter(s => s.id !== shopperId);
        updateSchedule(currentSchedule);
    };

    // Border: Join/Book Date
    const bookSlot = (date: number) => {
        if(!currentUser) return;
        if(!window.confirm(`${date} তারিখে বাজার টিমে যুক্ত হতে চান?`)) return;

        const currentSchedule = { ...manager.bazaarSchedule };
        if(!currentSchedule[date]) return;

        // Check if already joined
        if(currentSchedule[date].shoppers.find(s => s.id === currentUser.id)) return alert("আপনি ইতিমধ্যে যুক্ত আছেন");

        currentSchedule[date].shoppers.push({ id: currentUser.id, name: currentUser.name });
        updateSchedule(currentSchedule);
        alert("আপনি যুক্ত হয়েছেন!");
    };

    // Common Update Function
    const updateSchedule = async (newSchedule: { [day: number]: BazaarShift }) => {
        const updatedManager = { ...manager, bazaarSchedule: newSchedule };
        try {
            await dbService.updateManager(manager.username, { bazaarSchedule: newSchedule });
            onUpdate(updatedManager);
        } catch(e) { 
            console.error(e);
            alert("আপডেট ব্যর্থ হয়েছে!"); 
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 md:p-6 animate-fade-in">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 mb-6 border-b pb-4">
                <CalendarDays className="text-primary"/> বাজার লিস্ট (শিডিউল)
            </h2>

            {/* Manager Controls */}
            {isManager && (
                <div className="space-y-4 mb-8">
                    {/* Auto Generator */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-auto">
                            <label className="text-xs font-bold text-slate-600 block mb-1">কত দিন পর পর?</label>
                            <select value={interval} onChange={e => setInterval(parseInt(e.target.value))} className="w-full md:w-32 p-2 border rounded font-bold">
                                <option value={1}>প্রতিদিন</option>
                                <option value={2}>২ দিন পর পর</option>
                                <option value={3}>৩ দিন পর পর</option>
                                <option value={4}>৪ দিন পর পর</option>
                                <option value={5}>৫ দিন পর পর</option>
                            </select>
                        </div>
                        <div className="w-full md:w-auto">
                            <label className="text-xs font-bold text-slate-600 block mb-1">শুরু হবে কত তারিখে?</label>
                            <input type="number" min="1" max="31" value={startDay} onChange={e => setStartDay(parseInt(e.target.value))} className="w-full md:w-32 p-2 border rounded font-bold" />
                        </div>
                        <button onClick={generateSchedule} className="bg-blue-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-blue-700 w-full md:w-auto">
                            অটোমেটিক জেনারেট
                        </button>
                    </div>

                    {/* Manual Add */}
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex items-center gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-emerald-700 block mb-1">নতুন তারিখ যোগ করুন</label>
                            <div className="flex gap-2">
                                <input type="number" min="1" max="31" placeholder="তারিখ (1-31)" value={manualDate} onChange={e => setManualDate(parseInt(e.target.value))} className="w-full md:w-40 p-2 border rounded font-bold" />
                                <button onClick={addSingleDate} className="bg-emerald-600 text-white px-3 py-2 rounded font-bold hover:bg-emerald-700 flex items-center gap-1">
                                    <PlusCircle size={18}/> যোগ করুন
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule List */}
            <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <th className="p-3 w-1/4">তারিখ & বার</th>
                            <th className="p-3 w-1/2">বাজারকারী টিম</th>
                            {isManager && <th className="p-3 w-1/4 text-center">অ্যাকশন</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sortedDays.length === 0 ? (
                            <tr><td colSpan={3} className="p-8 text-center text-slate-400">কোন শিডিউল নেই।</td></tr>
                        ) : (
                            sortedDays.map((shift) => (
                                <tr key={shift.date} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-3 align-top">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-lg font-baloo text-slate-800">{shift.date} তারিখ</span>
                                            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded w-fit">{getDayName(shift.date)}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 align-top">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {shift.shoppers && shift.shoppers.length > 0 ? (
                                                shift.shoppers.map((shopper: BazaarShopper) => (
                                                    <span key={shopper.id} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-bold border border-primary/20">
                                                        {shopper.name}
                                                        {isManager && (
                                                            <button onClick={() => removeShopperFromDate(shift.date, shopper.id)} className="text-red-500 hover:text-red-700 ml-1">
                                                                <X size={14}/>
                                                            </button>
                                                        )}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-400 italic text-xs">কাউকে দেওয়া হয়নি</span>
                                            )}
                                        </div>
                                        
                                        {/* Action Buttons inside cell */}
                                        <div className="mt-2">
                                            {!isManager && currentUser && !shift.shoppers?.find(s => s.id === currentUser.id) && (
                                                <button onClick={() => bookSlot(shift.date)} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-bold hover:bg-green-200 border border-green-200 transition-colors flex items-center gap-1 w-fit">
                                                    <UserPlus size={14}/> আমি বাজার করবো
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    {isManager && (
                                        <td className="p-3 text-center align-top">
                                            <div className="flex flex-col gap-2 items-center">
                                                <div className="flex gap-1 w-full max-w-[200px]">
                                                    <select 
                                                        className="p-1.5 border rounded text-xs bg-white w-full outline-none"
                                                        onChange={(e) => {
                                                            if(e.target.value) addShopperToDate(shift.date, e.target.value);
                                                            e.target.value = ''; // reset ui
                                                        }}
                                                    >
                                                        <option value="">+ মেম্বার যুক্ত করুন</option>
                                                        {borders.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                                    </select>
                                                </div>
                                                <button onClick={() => deleteDate(shift.date)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors flex items-center gap-1 text-xs font-bold border border-transparent hover:border-red-100">
                                                    <Trash2 size={16}/> তারিখ ডিলিট
                                                </button>
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

// New: System Daily Entry Component
const SystemDailyEntryPage = ({ manager, onUpdate }: { manager: Manager, onUpdate: (m: Manager) => void }) => {
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const [localData, setLocalData] = useState(manager.systemDaily || {});
    
    // Auto-save or Manual save? Let's do onBlur save
    const handleChange = (day: number, shift: 'morning'|'lunch'|'dinner', field: 'meal'|'rice', value: number) => {
        const newData = { ...localData };
        if(!newData[day]) newData[day] = { morning: {meal:0, rice:0}, lunch: {meal:0, rice:0}, dinner: {meal:0, rice:0} };
        
        newData[day][shift][field] = value;

        // Auto Calc Logic
        if(field === 'meal') {
            if(shift === 'morning') newData[day][shift].rice = value > 0 ? Math.max(0, value - 2) : 0;
            if(shift === 'lunch') newData[day][shift].rice = value > 0 ? value + 2 : 0;
            if(shift === 'dinner') newData[day][shift].rice = value;
        }

        setLocalData(newData);
    };

    const handleSave = async () => {
        try {
            await dbService.updateManager(manager.username, { systemDaily: localData });
            onUpdate({ ...manager, systemDaily: localData });
            alert("সংরক্ষিত হয়েছে!");
        } catch(e) { alert("এরর!"); }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-4 sticky left-0">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800"><ClipboardList/> সিস্টেম ডেইলি এন্ট্রি</h2>
                <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded shadow font-bold flex gap-2"><Save size={18}/> সেভ করুন</button>
            </div>
            <div className="overflow-x-auto max-h-[70vh]">
                <table className="w-full text-sm text-center border-collapse">
                    <thead className="bg-slate-800 text-white sticky top-0 z-10">
                        <tr>
                            <th rowSpan={2} className="p-2 border border-slate-600 min-w-[50px]">তাং</th>
                            <th colSpan={2} className="p-1 border border-slate-600 bg-orange-600">সকাল</th>
                            <th colSpan={2} className="p-1 border border-slate-600 bg-blue-600">দুপুর</th>
                            <th colSpan={2} className="p-1 border border-slate-600 bg-purple-600">রাত</th>
                            <th colSpan={2} className="p-1 border border-slate-600 bg-emerald-600">মোট</th>
                        </tr>
                        <tr>
                            <th className="p-1 border border-slate-600 text-[10px] w-12">মিল</th><th className="p-1 border border-slate-600 text-[10px] w-12">চাল</th>
                            <th className="p-1 border border-slate-600 text-[10px] w-12">মিল</th><th className="p-1 border border-slate-600 text-[10px] w-12">চাল</th>
                            <th className="p-1 border border-slate-600 text-[10px] w-12">মিল</th><th className="p-1 border border-slate-600 text-[10px] w-12">চাল</th>
                            <th className="p-1 border border-slate-600 text-[10px] w-12">মিল</th><th className="p-1 border border-slate-600 text-[10px] w-12">চাল</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {days.map(d => {
                            const entry = localData[d] || { morning: {meal:0, rice:0}, lunch: {meal:0, rice:0}, dinner: {meal:0, rice:0} };
                            const tMeal = (entry.morning?.meal||0) + (entry.lunch?.meal||0) + (entry.dinner?.meal||0);
                            const tRice = (entry.morning?.rice||0) + (entry.lunch?.rice||0) + (entry.dinner?.rice||0);
                            
                            return (
                                <tr key={d} className="hover:bg-slate-50">
                                    <td className="p-2 font-bold bg-slate-100 border border-slate-200">{d}</td>
                                    
                                    <td className="p-1 border"><input type="number" className="w-full text-center outline-none bg-transparent" value={entry.morning?.meal||''} placeholder="-" onChange={e => handleChange(d, 'morning', 'meal', parseFloat(e.target.value)||0)} /></td>
                                    <td className="p-1 border bg-orange-50"><input type="number" step="0.1" className="w-full text-center outline-none bg-transparent font-bold text-orange-700" value={entry.morning?.rice||''} placeholder="-" onChange={e => handleChange(d, 'morning', 'rice', parseFloat(e.target.value)||0)} /></td>
                                    
                                    <td className="p-1 border"><input type="number" className="w-full text-center outline-none bg-transparent" value={entry.lunch?.meal||''} placeholder="-" onChange={e => handleChange(d, 'lunch', 'meal', parseFloat(e.target.value)||0)} /></td>
                                    <td className="p-1 border bg-blue-50"><input type="number" step="0.1" className="w-full text-center outline-none bg-transparent font-bold text-blue-700" value={entry.lunch?.rice||''} placeholder="-" onChange={e => handleChange(d, 'lunch', 'rice', parseFloat(e.target.value)||0)} /></td>
                                    
                                    <td className="p-1 border"><input type="number" className="w-full text-center outline-none bg-transparent" value={entry.dinner?.meal||''} placeholder="-" onChange={e => handleChange(d, 'dinner', 'meal', parseFloat(e.target.value)||0)} /></td>
                                    <td className="p-1 border bg-purple-50"><input type="number" step="0.1" className="w-full text-center outline-none bg-transparent font-bold text-purple-700" value={entry.dinner?.rice||''} placeholder="-" onChange={e => handleChange(d, 'dinner', 'rice', parseFloat(e.target.value)||0)} /></td>
                                    
                                    <td className="p-1 border bg-emerald-50 font-bold">{tMeal}</td>
                                    <td className="p-1 border bg-emerald-100 font-bold text-emerald-800">{tRice.toFixed(1)}</td>
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
    const totalMoney = borders.reduce((acc, b) => acc + b.deposits.reduce((s, d) => s + d.amount, 0), 0);
    const totalMeals = borders.reduce((acc, b) => acc + Object.values(b.dailyUsage).reduce((s, u) => s + (u.meals || 0), 0), 0);
    const totalRiceDeposited = borders.reduce((acc, b) => acc + b.riceDeposits.reduce((s, d) => s + (d.amount || 0), 0), 0);
    const totalRiceConsumed = borders.reduce((acc, b) => acc + Object.values(b.dailyUsage).reduce((s, u) => s + (u.rice || 0), 0), 0);
    
    // System Totals
    let systemMeals = 0;
    let systemRice = 0;
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
    const currentRiceBalance = totalRiceDeposited - totalRiceConsumed;

    const [showBorderList, setShowBorderList] = useState(false);

    const copyCreds = () => {
        const text = `মেস লগইন তথ্য:\nইউজারনেম: ${manager.username}\nপাসওয়ার্ড: ${manager.borderPassword}`;
        navigator.clipboard.writeText(text);
        alert("লগইন তথ্য কপি হয়েছে!");
    };

    if (showBorderList) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 animate-fade-in">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-slate-800">বর্ডারদের তথ্য</h2>
                    <button onClick={() => setShowBorderList(false)} className="bg-slate-100 text-slate-600 px-3 py-1 rounded hover:bg-slate-200">বন্ধ করুন</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-2">নাম</th>
                                <th className="p-2">মোবাইল</th>
                                <th className="p-2">রক্তের গ্রুপ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borders.map(b => (
                                <tr key={b.id} className="border-b hover:bg-slate-50">
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

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Credentials Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">বর্ডার লগইন ক্রেডেনশিয়াল</h3>
                    <div className="flex gap-4 mt-1 text-slate-800">
                        <span className="bg-slate-100 px-2 py-1 rounded text-sm">ইউজারনেম: <b>{manager.username}</b></span>
                        <span className="bg-slate-100 px-2 py-1 rounded text-sm">পাসওয়ার্ড: <b>{manager.borderPassword}</b></span>
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
                 <div className="bg-white p-5 rounded-xl shadow border border-slate-200">
                     <h3 className="text-slate-500 text-sm font-bold uppercase">মোট মিল (বর্ডার)</h3>
                     <p className="text-3xl font-bold mt-1 text-slate-800 font-baloo">{totalMeals}</p>
                 </div>
                 
                 {/* Secondary Stats */}
                 <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
                     <h4 className="text-slate-500 text-xs font-bold uppercase">বাজার খরচ</h4>
                     <p className="text-xl font-bold text-slate-800 font-baloo">{marketCost} ৳</p>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
                     <h4 className="text-slate-500 text-xs font-bold uppercase text-red-500">অতিরিক্ত বাজার</h4>
                     <p className="text-xl font-bold text-red-600 font-baloo">{extraCost} ৳</p>
                 </div>
                 
                 {/* System Daily Stats */}
                 <div className="col-span-2 bg-slate-800 text-white p-4 rounded-xl shadow border border-slate-600 flex justify-between items-center">
                    <div>
                        <h4 className="text-slate-300 text-xs font-bold uppercase mb-1">সিস্টেম ডেইলি হিসাব</h4>
                        <div className="flex gap-4">
                            <div>
                                <span className="text-xs text-slate-400">মোট মিল:</span>
                                <span className="text-xl font-bold ml-1 font-baloo">{systemMeals}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-400">মোট চাল:</span>
                                <span className="text-xl font-bold ml-1 font-baloo text-orange-400">{systemRice.toFixed(1)} পট</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                         <span className="text-[10px] block text-slate-400">বর্ডার vs সিস্টেম পার্থক্য</span>
                         <span className={`font-bold ${totalMeals === systemMeals ? 'text-green-400' : 'text-red-400'}`}>
                             মিল: {systemMeals - totalMeals} 
                         </span>
                    </div>
                 </div>
            </div>
        </div>
    );
};

// 2. Border Management List
const BorderList = ({ borders, onAdd, onEdit, onDelete }: any) => {
    const [name, setName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-700">বর্ডার তালিকা ({borders.length})</h2>
                <button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow hover:bg-sky-600 text-sm">
                    <PlusCircle size={16} /> নতুন বর্ডার
                </button>
            </div>

            {isAdding && (
                <div className="p-4 bg-blue-50 border-b flex gap-2 animate-fade-in">
                    <input className="border border-blue-300 p-2 rounded flex-1 focus:outline-none" placeholder="নাম লিখুন..." value={name} onChange={e => setName(e.target.value)} autoFocus />
                    <button onClick={() => { onAdd(name); setName(''); setIsAdding(false); }} className="bg-green-600 text-white px-4 rounded font-medium shadow">সেভ</button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-xs font-bold">
                        <tr>
                            <th className="p-3">নাম & তথ্য</th>
                            <th className="p-3 text-right">টাকা জমা</th>
                            <th className="p-3 text-right">চাল জমা</th>
                            <th className="p-3 text-right">নিজস্ব+গেস্ট</th>
                            <th className="p-3 text-center">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {borders.map((b: Border) => (
                            <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-3">
                                    <div className="font-semibold text-slate-800">{b.name}</div>
                                    <div className="text-xs text-slate-500 flex gap-2 mt-0.5">
                                        {b.mobile && <span>📞 {b.mobile}</span>}
                                        {b.bloodGroup && <span className="text-red-500">🩸 {b.bloodGroup}</span>}
                                    </div>
                                </td>
                                <td className="p-3 text-right font-mono text-emerald-600 font-bold">{b.deposits.reduce((acc, curr) => acc + curr.amount, 0)} ৳</td>
                                <td className="p-3 text-right font-mono text-orange-600 font-bold">{b.riceDeposits.reduce((acc, curr) => acc + curr.amount, 0)} পট</td>
                                <td className="p-3 text-right font-mono text-red-500 font-bold">{(b.extraCost + b.guestCost)} ৳</td>
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

// 3. Daily Entry
const DailyEntry = ({ borders, onSave }: any) => {
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());

    return (
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800"><Calendar className="text-primary"/> দৈনিক এন্ট্রি (বর্ডার ভিত্তিক)</h2>
                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg">
                    <label className="text-slate-600 font-medium">তারিখ:</label>
                    <select value={selectedDay} onChange={e => setSelectedDay(parseInt(e.target.value))} className="bg-white border p-1.5 rounded font-bold outline-none font-baloo">
                        {days.map(d => <option key={d} value={d}>{d} তারিখ</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {borders.map((b: Border) => (
                    <div key={b.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md flex flex-col gap-3">
                        <div className="font-bold text-lg text-slate-800 border-b pb-2">{b.name}</div>
                        <div className="flex justify-between items-center">
                             <div className="flex flex-col gap-1 w-[48%]">
                                <span className="text-xs text-slate-500 font-bold uppercase">মিল</span>
                                <input type="number" step="0.5" className="w-full p-2 border rounded text-center font-bold text-blue-600 outline-none focus:ring-1 font-baloo"
                                  defaultValue={b.dailyUsage[selectedDay]?.meals || 0}
                                  onBlur={(e) => onSave(b, selectedDay, parseFloat(e.target.value) || 0, b.dailyUsage[selectedDay]?.rice || 0)} />
                             </div>
                             <div className="flex flex-col gap-1 w-[48%]">
                                <span className="text-xs text-slate-500 font-bold uppercase">চাল (পট)</span>
                                <input type="number" step="0.1" className="w-full p-2 border rounded text-center font-bold text-orange-600 outline-none focus:ring-1 font-baloo"
                                  defaultValue={b.dailyUsage[selectedDay]?.rice || 0} 
                                  onBlur={(e) => onSave(b, selectedDay, b.dailyUsage[selectedDay]?.meals || 0, parseFloat(e.target.value) || 0)} />
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 4. Market View (With Edit & Delete)
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
            onAdd(form);
        }
        setForm({ date: new Date().toISOString().split('T')[0], type: 'market', amount: 0, shopper: '', id: undefined });
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
                setForm({ date: new Date().toISOString().split('T')[0], type: 'market', amount: 0, shopper: '', id: undefined });
            }
        }
    }

    const filteredExpenses = expenses.filter((e: Expense) => filterType === 'all' ? true : e.type === filterType);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-slate-200 h-fit">
                <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">
                    <ShoppingCart size={20} className="text-primary"/> {isEditing ? 'খরচ এডিট করুন' : 'খরচ যুক্ত করুন'}
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">খরচের ধরণ</label>
                        <select className="w-full p-2.5 border rounded-lg bg-slate-50" value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}>
                            <option value="market">বাজার</option>
                            <option value="extra">অতিরিক্ত বাজার</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">তারিখ</label>
                        <input type="date" className="w-full p-2.5 border rounded-lg bg-slate-50 font-baloo" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">বিবরণ / নাম</label>
                        <input placeholder="..." className="w-full p-2.5 border rounded-lg bg-slate-50" value={form.shopper} onChange={e => setForm({...form, shopper: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">টাকার পরিমাণ</label>
                        <input type="number" placeholder="0" className="w-full p-2.5 border rounded-lg bg-slate-50 font-bold font-baloo" value={form.amount || ''} onChange={e => setForm({...form, amount: parseFloat(e.target.value)})} />
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

            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-slate-200 flex flex-col h-[600px]">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="font-bold text-lg text-slate-800">খরচের তালিকা</h3>
                    <div className="flex gap-2">
                        <button onClick={() => setFilterType('all')} className={`px-3 py-1 text-xs rounded-full ${filterType === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}>সব</button>
                        <button onClick={() => setFilterType('market')} className={`px-3 py-1 text-xs rounded-full ${filterType === 'market' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>বাজার</button>
                        <button onClick={() => setFilterType('extra')} className={`px-3 py-1 text-xs rounded-full ${filterType === 'extra' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'}`}>অতিরিক্ত</button>
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 pr-2">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-white shadow-sm z-10">
                            <tr className="text-left text-slate-500 border-b">
                                <th className="py-2">তারিখ</th>
                                <th className="py-2">ধরণ</th>
                                <th className="py-2">বিবরণ</th>
                                <th className="py-2 text-right">টাকা</th>
                                <th className="py-2 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredExpenses.map((e: Expense) => (
                                <tr key={e.id} className="hover:bg-slate-50 group">
                                    <td className="py-3 text-slate-600 font-baloo">{e.date}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${e.type === 'extra' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                                            {e.type === 'extra' ? 'অতিরিক্ত' : 'বাজার'}
                                        </span>
                                    </td>
                                    <td className="py-3 font-medium">{e.shopper}</td>
                                    <td className="py-3 font-bold text-right font-baloo">{e.amount}</td>
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

// 5. Border Detail Modal (Updated Labels & Delete)
const BorderDetailModal = ({ 
    border, onClose, onUpdateDeposits, onUpdateRice, onUpdateExtra, onUpdateGuest, onDeleteBorder 
}: any) => {
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
            <div className="bg-white rounded-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors"><X size={20} /></button>
                <div className="p-6 border-b">
                    {/* Fixed Text Label */}
                    <h2 className="text-2xl font-bold text-slate-800">ম্যানেজ : <span className="text-primary">{border.name}</span></h2>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Col */}
                    <div className="space-y-6">
                         {/* Money Section */}
                        <div className="bg-emerald-50 rounded-xl border border-emerald-100 overflow-hidden">
                            <div className="bg-emerald-100 p-3 px-5 border-b border-emerald-200 flex justify-between items-center">
                                <h3 className="font-bold flex items-center gap-2 text-emerald-800"><DollarSign size={18}/> টাকা জমা</h3>
                                <span className="text-sm font-bold bg-white px-2 py-0.5 rounded text-emerald-700">মোট: {border.deposits.reduce((a:number,b:any)=>a+b.amount,0)} ৳</span>
                            </div>
                            <div className="p-4 bg-white/50">
                                <div className="flex gap-2 mb-2">
                                    <input type="date" value={moneyForm.date} onChange={e => setMoneyForm({...moneyForm, date: e.target.value})} className="border p-1.5 rounded text-sm w-1/3 font-baloo" />
                                    <input type="number" placeholder="পরিমাণ" value={moneyForm.amount || ''} onChange={e => setMoneyForm({...moneyForm, amount: parseFloat(e.target.value)})} className="border p-1.5 rounded w-1/3 font-bold font-baloo" />
                                    <button onClick={saveMoney} className="bg-emerald-600 text-white px-3 rounded flex-1 font-bold">{isEditingMoney ? 'আপডেট' : 'জমা'}</button>
                                </div>
                                <div className="max-h-40 overflow-y-auto">
                                    <table className="w-full text-sm"><tbody>
                                        {border.deposits.map((d:any) => (
                                            <tr key={d.id} className="border-b last:border-0 hover:bg-emerald-100/50">
                                                <td className="py-2 font-baloo">{d.date}</td>
                                                <td className="py-2 font-bold text-emerald-700 font-baloo">{d.amount}</td>
                                                <td className="py-2 text-right flex justify-end gap-2">
                                                    <button onClick={() => editMoney(d)}><Edit2 size={14}/></button>
                                                    <button onClick={() => deleteMoney(d.id)}><Trash2 size={14}/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody></table>
                                </div>
                            </div>
                        </div>

                        {/* Extra Costs */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                             <h3 className="font-bold text-slate-700 mb-3">অতিরিক্ত খরচ সমূহ</h3>
                             <div className="space-y-3">
                                 <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-1">গেস্ট মিল খরচ (শুধুমাত্র মিলের জন্য)</label>
                                    <div className="flex gap-2">
                                        <input type="number" value={border.guestCost} onChange={e => onUpdateGuest(parseFloat(e.target.value))} className="w-full p-2 border rounded font-bold text-blue-600 bg-blue-50 font-baloo" />
                                    </div>
                                 </div>
                                 <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-1">অতিরিক্ত বাজার</label>
                                    <div className="flex gap-2">
                                        <input type="number" value={border.extraCost} onChange={e => onUpdateExtra(parseFloat(e.target.value))} className="w-full p-2 border rounded font-bold text-red-600 bg-red-50 font-baloo" />
                                    </div>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Right Col: Rice */}
                    <div className="bg-orange-50 rounded-xl border border-orange-100 overflow-hidden h-fit">
                        <div className="bg-orange-100 p-3 px-5 border-b border-orange-200 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2 text-orange-800"><Activity size={18}/> চালের হিসাব</h3>
                            <span className="text-sm font-bold bg-white px-2 py-0.5 rounded text-orange-700">মোট: {border.riceDeposits.reduce((a:number,b:any)=>a+b.amount,0)} পট</span>
                        </div>
                        <div className="p-4 bg-white/50">
                             <div className="flex flex-col gap-2 mb-2">
                                    <div className="flex gap-2"><select value={riceForm.type} onChange={e => setRiceForm({...riceForm, type: e.target.value as any})} className="border p-1.5 rounded text-xs"><option value="deposit">নতুন জমা</option><option value="previous_balance">পূর্বের জের</option></select><input type="date" value={riceForm.date} onChange={e => setRiceForm({...riceForm, date: e.target.value})} className="border p-1.5 rounded text-sm flex-1 font-baloo" /></div>
                                    <div className="flex gap-2"><input type="number" placeholder="পরিমাণ" value={riceForm.amount || ''} onChange={e => setRiceForm({...riceForm, amount: parseFloat(e.target.value)})} className="border p-1.5 rounded w-1/2 font-bold font-baloo" /><button onClick={saveRice} className="bg-orange-600 text-white px-3 rounded flex-1 font-bold">{isEditingRice ? 'আপডেট' : 'জমা'}</button></div>
                             </div>
                             <div className="max-h-60 overflow-y-auto">
                                <table className="w-full text-sm"><tbody>
                                    {border.riceDeposits.map((d:any) => (
                                        <tr key={d.id} className="border-b last:border-0 hover:bg-orange-100/50">
                                            <td className="py-2 text-xs font-baloo">{d.type === 'previous_balance' ? 'পূর্বের জের' : d.date}</td>
                                            <td className="py-2 font-bold text-orange-700 font-baloo">{d.amount}</td>
                                            <td className="py-2 text-right flex justify-end gap-2">
                                                <button onClick={() => editRice(d)}><Edit2 size={14}/></button>
                                                <button onClick={() => deleteRice(d.id)}><Trash2 size={14}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody></table>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-6 mt-6 border-t border-slate-200">
                        <button onClick={deleteThisBorder} className="flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold w-full justify-center">
                            <Trash2 size={16}/> এই বর্ডার ডিলিট করুন (সতর্কতা)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- AUTH COMPONENT (With Eye Icon) ---
const LoginRegister = ({ setManager, setBorderView }: any) => {
  const [isRegister, setIsRegister] = useState(false);
  const [activeTab, setActiveTab] = useState<'manager' | 'border'>('manager');
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
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 animate-fade-in">
              <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
                  <h2 className="text-xl font-bold mb-4">আপনার নাম সিলেক্ট করুন</h2>
                  <select className="w-full p-3 border rounded mb-4" value={selectedBorderId} onChange={e => setSelectedBorderId(e.target.value)}>
                      <option value="">-- নাম বাছাই করুন --</option>
                      {borderList.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <button onClick={() => { const b = borderList.find(x => x.id === selectedBorderId); if(b) setBorderView(b); }} disabled={!selectedBorderId} className="w-full bg-primary text-white py-3 rounded font-bold">ড্যাশবোর্ড দেখুন</button>
              </div>
          </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-md w-full animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-primary mb-6 font-baloo">মেস ম্যানেজার প্রো</h1>
        <div className="flex mb-6 bg-slate-100 p-1 rounded-lg">
          <button className={`flex-1 py-2 rounded font-bold ${activeTab === 'manager' ? 'bg-white shadow' : 'text-slate-500'}`} onClick={() => setActiveTab('manager')}>ম্যানেজার</button>
          <button className={`flex-1 py-2 rounded font-bold ${activeTab === 'border' ? 'bg-white shadow' : 'text-slate-500'}`} onClick={() => setActiveTab('border')}>বর্ডার</button>
        </div>

        {activeTab === 'manager' ? (
          isRegister ? (
            <form onSubmit={handleRegister} className="space-y-3 h-96 overflow-y-auto custom-scrollbar">
               <input required placeholder="নাম" className="w-full p-3 border rounded" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} />
               <input required placeholder="মেসের নাম" className="w-full p-3 border rounded" value={regForm.messName} onChange={e => setRegForm({...regForm, messName: e.target.value})} />
               <input required placeholder="মোবাইল" className="w-full p-3 border rounded" value={regForm.mobile} onChange={e => setRegForm({...regForm, mobile: e.target.value})} />
               <input required placeholder="রক্তের গ্রুপ" className="w-full p-3 border rounded" value={regForm.bloodGroup || ''} onChange={e => setRegForm({...regForm, bloodGroup: e.target.value})} />
               <input required placeholder="ইউজারনেম" className="w-full p-3 border rounded" value={regForm.username} onChange={e => setRegForm({...regForm, username: e.target.value})} />
               <input required type="password" placeholder="পাসওয়ার্ড" className="w-full p-3 border rounded" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} />
               <hr/>
               <p className="text-xs">বর্ডার লগইন:</p>
               <input required placeholder="গ্রুপ ইউজারনেম" className="w-full p-3 border rounded" value={regForm.borderUsername} onChange={e => setRegForm({...regForm, borderUsername: e.target.value})} />
               <input required placeholder="গ্রুপ পাসওয়ার্ড" className="w-full p-3 border rounded" value={regForm.borderPassword} onChange={e => setRegForm({...regForm, borderPassword: e.target.value})} />
               <button type="submit" className="w-full bg-primary text-white py-3 rounded font-bold mt-2">রেজিস্ট্রেশন</button>
               <p className="text-center text-sm text-blue-500 mt-2 cursor-pointer hover:underline" onClick={() => setIsRegister(false)}>লগইন করুন</p>
            </form>
          ) : (
            <form onSubmit={handleManagerLogin} className="space-y-4">
              <input required placeholder="ইউজারনেম" className="w-full p-3 border rounded" value={loginCreds.username} onChange={e => setLoginCreds({...loginCreds, username: e.target.value})} />
              <div className="relative">
                  <input required type={showPass ? "text" : "password"} placeholder="পাসওয়ার্ড" className="w-full p-3 border rounded" value={loginCreds.password} onChange={e => setLoginCreds({...loginCreds, password: e.target.value})} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-500">{showPass ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-sky-600 transition-colors">{loading ? '...' : 'লগইন'}</button>
              <p className="text-center text-sm text-blue-500 mt-2 cursor-pointer hover:underline" onClick={() => setIsRegister(true)}>নতুন রেজিস্ট্রেশন</p>
            </form>
          )
        ) : (
          <form onSubmit={verifyBorderLogin} className="space-y-4">
             <input required placeholder="ম্যানেজার ইউজারনেম" className="w-full p-3 border rounded" value={borderCreds.username} onChange={e => setBorderCreds({...borderCreds, username: e.target.value})} />
             <div className="relative">
                <input required type={showPass ? "text" : "password"} placeholder="গ্রুপ পাসওয়ার্ড" className="w-full p-3 border rounded" value={borderCreds.password} onChange={e => setBorderCreds({...borderCreds, password: e.target.value})} />
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
  const [activeTab, setActiveTab] = useState<'dashboard'|'daily'|'market'|'system'|'reports'|'settings'|'borders'|'schedule'>('dashboard');
  const [activeBorderTab, setActiveBorderTab] = useState<'overview'|'meals'|'market'|'profile'|'schedule'>('overview');
  
  const [editingBorder, setEditingBorder] = useState<Border | null>(null);
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState<Manager>({} as Manager);
  const [borderProfileForm, setBorderProfileForm] = useState({ mobile: '', bloodGroup: '' });

  // Developer Modal State
  const [showDevModal, setShowDevModal] = useState(false);

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

  // Fetch Manager Data
  useEffect(() => {
      if(manager) {
          loadData();
      }
  }, [manager]);

  const loadData = async () => {
      if(!manager) return;
      try {
        const [b, e] = await Promise.all([
            dbService.getBorders(manager.username),
            dbService.getExpenses(manager.username)
        ]);
        setBorders(b);
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
        setBorders([...borders, newB as Border]);
      } catch(e) { alert("Error adding border"); }
  };

  const handleUpdateBorder = async (borderId: string, data: Partial<Border>) => {
      try {
          await dbService.updateBorder(borderId, data);
          setBorders(prev => prev.map(b => b.id === borderId ? { ...b, ...data } : b));
          if(editingBorder && editingBorder.id === borderId) {
              setEditingBorder(prev => prev ? { ...prev, ...data } : null);
          }
          // Also update borderView if active
          if(borderView && borderView.id === borderId) {
              setBorderView(prev => prev ? { ...prev, ...data } : null);
          }
      } catch(e) { console.error(e); }
  };

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
                        action={<button onClick={handleBorderLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-full font-bold flex gap-2 items-center hover:bg-red-100 transition-colors"><LogOut size={18}/> বের হন</button>}
                        onDeveloperClick={() => setShowDevModal(true)}
                    >
                         <div className="flex bg-white p-1 rounded mb-6 border overflow-x-auto sticky top-20 z-20 shadow-sm">
                             {['overview','meals','market','schedule','profile'].map(v => (
                                 <button key={v} onClick={() => setActiveBorderTab(v as any)} className={`flex-1 py-2 px-4 rounded font-bold capitalize whitespace-nowrap ${activeBorderTab === v ? 'bg-primary text-white' : 'text-slate-500'}`}>
                                     {v === 'overview' ? 'সামারি' : v === 'meals' ? 'মিল চার্ট' : v === 'market' ? 'বাজার' : v === 'schedule' ? 'বাজার লিস্ট' : 'প্রোফাইল'}
                                 </button>
                             ))}
                         </div>

                         {activeBorderTab === 'overview' && (
                             <div className="space-y-6">
                                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                      <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                                          <h3 className="text-emerald-100 text-xs">মোট জমা টাকা</h3>
                                          <p className="text-2xl font-bold font-baloo">{borderView.deposits.reduce((a,b) => a + Number(b.amount), 0)} ৳</p>
                                          <DollarSign className="absolute bottom-2 right-2 opacity-20"/>
                                      </div>
                                      <div className="bg-orange-600 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                                          <h3 className="text-orange-100 text-xs">মোট জমা চাল</h3>
                                          <p className="text-2xl font-bold font-baloo">{borderView.riceDeposits.reduce((a,b) => a + (Number(b.amount)||0), 0)} পট</p>
                                          <Utensils className="absolute bottom-2 right-2 opacity-20"/>
                                      </div>
                                       <div className={`p-4 rounded-xl shadow-lg text-white relative overflow-hidden bg-blue-600`}>
                                          <h3 className="text-white/80 text-xs">ব্যালেন্স দেখুন</h3>
                                          <p className="text-xl font-bold font-baloo mt-1">রিপোর্ট দেখুন</p>
                                          <p className="text-[10px] bg-white/20 inline-block px-1 rounded mt-1">বিস্তারিত</p>
                                      </div>
                                      <div className="bg-yellow-600 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                                          <h3 className="text-yellow-100 text-xs">চাল খাওয়া</h3>
                                          <p className="text-2xl font-bold font-baloo">{(Object.values(borderView.dailyUsage).reduce((a:number,b:any)=>a+(Number(b.rice)||0),0) as number).toFixed(1)} পট</p>
                                      </div>
                                  </div>

                                  <div className="bg-white p-6 rounded-xl shadow border">
                                      <h3 className="font-bold border-b pb-3 mb-4 text-slate-800">খরচের বিস্তারিত</h3>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                          <div className="p-3 bg-slate-50 rounded">
                                              <p className="text-xs text-slate-500">মিল সংখ্যা</p>
                                              <p className="font-bold font-baloo">{Object.values(borderView.dailyUsage).reduce((a:number,b:any)=>a+(Number(b.meals)||0),0)}</p>
                                          </div>
                                          <div className="p-3 bg-blue-50 rounded">
                                              <p className="text-xs text-slate-500">গেস্ট খরচ</p>
                                              <p className="font-bold font-baloo text-blue-600">{borderView.guestCost} ৳</p>
                                          </div>
                                          <div className="p-3 bg-red-50 rounded">
                                              <p className="text-xs text-slate-500">অতিরিক্ত খরচ</p>
                                              <p className="font-bold font-baloo text-red-600">{borderView.extraCost} ৳</p>
                                          </div>
                                          <div className="p-3 bg-orange-50 rounded">
                                              <p className="text-xs text-slate-500">মিল রেট</p>
                                              <p className="font-bold font-baloo text-orange-600">{managerInfoForBorder.mealRate} ৳</p>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="bg-white p-6 rounded-xl shadow border">
                                           <h3 className="font-bold border-b pb-3 mb-4 text-slate-800 text-emerald-600">টাকা জমা ইতিহাস</h3>
                                           <div className="max-h-60 overflow-y-auto">
                                              <table className="w-full text-sm">
                                                  <thead className="bg-slate-50 text-xs"><tr><th className="p-2 text-left">তারিখ</th><th className="p-2 text-right">পরিমাণ</th></tr></thead>
                                                  <tbody>
                                                      {borderView.deposits.map(d => (<tr key={d.id} className="border-b"><td className="p-2 font-baloo">{d.date}</td><td className="p-2 text-right font-bold text-emerald-600 font-baloo">{d.amount} ৳</td></tr>))}
                                                  </tbody>
                                              </table>
                                           </div>
                                      </div>
                                      <div className="bg-white p-6 rounded-xl shadow border">
                                           <h3 className="font-bold border-b pb-3 mb-4 text-slate-800 text-orange-600">চাল জমা ইতিহাস</h3>
                                           <div className="max-h-60 overflow-y-auto">
                                              <table className="w-full text-sm">
                                                  <thead className="bg-slate-50 text-xs"><tr><th className="p-2 text-left">তারিখ/ধরণ</th><th className="p-2 text-right">পরিমাণ</th></tr></thead>
                                                  <tbody>
                                                      {borderView.riceDeposits.map(d => (<tr key={d.id} className="border-b"><td className="p-2 font-baloo text-xs">{d.type === 'previous_balance' ? 'পূর্বের জের' : d.date}</td><td className="p-2 text-right font-bold text-orange-600 font-baloo">{d.amount} পট</td></tr>))}
                                                  </tbody>
                                              </table>
                                           </div>
                                      </div>
                                  </div>
                             </div>
                         )}

                         {activeBorderTab === 'meals' && (
                             <div className="bg-white rounded-xl shadow border overflow-hidden">
                                  <div className="p-4 bg-slate-50 font-bold text-slate-700">মিল চার্ট</div>
                                  <div className="max-h-[600px] overflow-y-auto">
                                      <table className="w-full text-sm text-center">
                                          <thead className="bg-slate-100 sticky top-0"><tr><th className="p-2">তারিখ</th><th className="p-2">মিল</th><th className="p-2">চাল</th></tr></thead>
                                          <tbody className="divide-y">{Array.from({length: 31}, (_, i) => i + 1).map(d => borderView.dailyUsage[d]?.meals || borderView.dailyUsage[d]?.rice ? (<tr key={d}><td className="p-2 font-baloo">{d}</td><td className="p-2 font-bold text-blue-600 font-baloo">{borderView.dailyUsage[d]?.meals}</td><td className="p-2 font-bold text-orange-600 font-baloo">{borderView.dailyUsage[d]?.rice}</td></tr>) : null)}</tbody>
                                      </table>
                                  </div>
                             </div>
                         )}

                         {activeBorderTab === 'market' && (
                              <div className="bg-white rounded-xl shadow border overflow-hidden">
                                  <div className="max-h-[600px] overflow-y-auto">
                                      <table className="w-full text-sm text-left">
                                          <thead className="bg-slate-100 sticky top-0"><tr><th className="p-3">তারিখ</th><th className="p-3">বিবরণ</th><th className="p-3 text-right">টাকা</th></tr></thead>
                                          <tbody className="divide-y">
                                              {expenses.map(e => (
                                                  <tr key={e.id} className={`hover:bg-slate-50 ${e.type === 'extra' ? 'bg-red-50' : ''}`}>
                                                      <td className="p-3 font-baloo">{e.date}</td>
                                                      <td className="p-3">{e.shopper} {e.type === 'extra' && <span className="text-[10px] bg-red-200 px-1 rounded">অতিরিক্ত বাজার :</span>}</td>
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

                         {activeBorderTab === 'profile' && (
                              <div className="bg-white rounded-xl shadow border p-6 max-w-lg mx-auto">
                                  <h3 className="font-bold mb-4">প্রোফাইল আপডেট</h3>
                                  <div className="space-y-3">
                                      <input className="w-full p-3 border rounded" value={borderProfileForm.mobile} onChange={e => setBorderProfileForm({...borderProfileForm, mobile: e.target.value})} placeholder="মোবাইল" />
                                      <select className="w-full p-3 border rounded" value={borderProfileForm.bloodGroup} onChange={e => setBorderProfileForm({...borderProfileForm, bloodGroup: e.target.value})}>
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
                            <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold border border-white/20">
                                <LogOut size={16} /> <span className="hidden md:inline">লগ আউট</span>
                            </button>
                        }
                        onDeveloperClick={() => setShowDevModal(true)}
                    >
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Sidebar / Tabs (Desktop) & Mobile Nav */}
                            <div className="lg:w-64 flex-shrink-0">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 sticky top-24 flex lg:flex-col flex-row gap-1 overflow-x-auto lg:overflow-visible">
                                    {[
                                        {id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard},
                                        {id: 'borders', label: 'বর্ডার তালিকা', icon: Users},
                                        {id: 'schedule', label: 'বাজার লিস্ট', icon: CalendarDays},
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
                                                    : 'text-slate-600 hover:bg-slate-50'}`}
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
                                        <ManagerOverview manager={manager} borders={borders} expenses={expenses} />
                                    </div>
                                )}
                                {activeTab === 'borders' && <div className="animate-fade-in"><BorderList borders={borders} onAdd={handleAddBorder} onEdit={setEditingBorder} onDelete={handleDeleteBorder} /></div>}
                                {activeTab === 'schedule' && <div className="animate-fade-in"><BazaarSchedulePage manager={manager} borders={borders} isManager={true} currentUser={undefined} onUpdate={(m) => setManager(m)} /></div>}
                                {activeTab === 'daily' && <div className="animate-fade-in"><DailyEntry borders={borders} onSave={handleDailySave} /></div>}
                                {activeTab === 'system' && <div className="animate-fade-in"><SystemDailyEntryPage manager={manager} onUpdate={(m) => setManager(m)} /></div>}
                                {activeTab === 'market' && <div className="animate-fade-in"><MarketView expenses={expenses} onAdd={handleAddExpense} onDelete={handleDeleteExpense} onUpdate={handleUpdateExpense} /></div>}
                                {activeTab === 'reports' && <div className="animate-fade-in"><Reports manager={manager} borders={borders} expenses={expenses} /></div>}
                                {activeTab === 'settings' && (
                                    <div className="animate-fade-in bg-white p-8 rounded-xl shadow border border-slate-200 max-w-xl mx-auto">
                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 pb-4 border-b"><Settings className="text-slate-700"/> সিস্টেম সেটিংস</h2>
                                        
                                        {/* Manager Profile Edit */}
                                        <div className="mb-8 border-b pb-6">
                                           <div className="flex justify-between items-center mb-4">
                                               <h3 className="font-bold text-slate-700">ম্যানেজার প্রোফাইল & ক্রেডেনশিয়াল</h3>
                                               <button onClick={() => setProfileEdit(!profileEdit)} className="text-blue-600 text-sm hover:underline">{profileEdit ? 'বন্ধ করুন' : 'এডিট করুন'}</button>
                                           </div>
                                           {profileEdit ? (
                                               <div className="space-y-3 bg-slate-50 p-4 rounded">
                                                   <label className="text-xs font-bold block mt-2">ব্যক্তিগত তথ্য</label>
                                                   <input placeholder="নাম" className="w-full p-2 border rounded" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                                                   <input placeholder="মেসের নাম" className="w-full p-2 border rounded" value={profileForm.messName} onChange={e => setProfileForm({...profileForm, messName: e.target.value})} />
                                                   <input placeholder="মোবাইল" className="w-full p-2 border rounded" value={profileForm.mobile} onChange={e => setProfileForm({...profileForm, mobile: e.target.value})} />
                                                   <input placeholder="রক্তের গ্রুপ" className="w-full p-2 border rounded" value={profileForm.bloodGroup || ''} onChange={e => setProfileForm({...profileForm, bloodGroup: e.target.value})} />
                                                   
                                                   <label className="text-xs font-bold block mt-4 text-red-600">ক্রেডেনশিয়াল আপডেট (সাবধানে পরিবর্তন করুন)</label>
                                                   <input placeholder="আপনার নতুন পাসওয়ার্ড" className="w-full p-2 border rounded border-red-200" value={profileForm.password} onChange={e => setProfileForm({...profileForm, password: e.target.value})} />
                                                   <input placeholder="বর্ডার গ্রুপ ইউজারনেম" className="w-full p-2 border rounded border-red-200" value={profileForm.borderUsername} onChange={e => setProfileForm({...profileForm, borderUsername: e.target.value})} />
                                                   <input placeholder="বর্ডার গ্রুপ পাসওয়ার্ড" className="w-full p-2 border rounded border-red-200" value={profileForm.borderPassword} onChange={e => setProfileForm({...profileForm, borderPassword: e.target.value})} />
                                                   
                                                   <button onClick={handleUpdateManagerProfile} className="bg-green-600 text-white px-4 py-2 rounded w-full font-bold mt-2 shadow">সেভ করুন</button>
                                               </div>
                                           ) : (
                                               <div className="text-sm text-slate-600 space-y-1">
                                                   <p>নাম: <b>{manager.name}</b></p>
                                                   <p>মেস: <b>{manager.messName}</b></p>
                                                   <p>মোবাইল: <b>{manager.mobile}</b></p>
                                                   <p>রক্তের গ্রুপ: <b>{manager.bloodGroup || '-'}</b></p>
                                               </div>
                                           )}
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">বর্তমান মিল রেট</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-bold text-blue-600">৳</span>
                                                    <input type="number" step="0.01" className="flex-1 border-2 border-blue-100 p-3 rounded-lg text-lg font-bold text-slate-700 focus:border-blue-500 outline-none transition-colors" 
                                                        value={manager.mealRate} 
                                                        onChange={e => setManager({...manager, mealRate: parseFloat(e.target.value) || 0})}
                                                        onBlur={() => dbService.updateManager(manager.username, { mealRate: manager.mealRate })}
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-500 mt-2">⚠️ মিল রেট পরিবর্তন করলে সকল বর্ডারের খরচের হিসাব সাথে সাথে আপডেট হয়ে যাবে।</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">মাস</label>
                                                    <select className="w-full border p-3 rounded-lg bg-slate-50 font-semibold" value={manager.month} onChange={e => {
                                                        const m = e.target.value;
                                                        setManager({...manager, month: m});
                                                        dbService.updateManager(manager.username, { month: m });
                                                    }}>
                                                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">বছর</label>
                                                    <select className="w-full border p-3 rounded-lg bg-slate-50 font-semibold" value={manager.year} onChange={e => {
                                                        const y = parseInt(e.target.value);
                                                        setManager({...manager, year: y});
                                                        dbService.updateManager(manager.username, { year: y });
                                                    }}>
                                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="pt-8 mt-8 border-t border-slate-100">
                                                <button onClick={async () => {
                                                    if(window.confirm("সতর্কতা: আপনি কি নিশ্চিত যে আপনি সম্পূর্ণ সিস্টেম মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।")) {
                                                        await dbService.deleteSystem(manager.username);
                                                        handleLogout();
                                                    }
                                                }} className="w-full bg-red-50 text-red-600 p-4 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-100">
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