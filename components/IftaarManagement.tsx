import React, { useState, useEffect, useRef } from 'react';
import { 
  DollarSign, ShoppingCart, Calendar, User, Plus, Trash2, Edit2, Download, 
  Save, X, ArrowLeft, LayoutDashboard, List, Info, Phone, Home
} from 'lucide-react';
import { IftaarConfig, IftaarDeposit, IftaarExpense, IftaarBazaarSchedule, Manager } from '../types';
import * as dbService from '../services/firebaseService';
import html2canvas from 'html2canvas';

const formatBanglaDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  const banglaNums: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  
  const toBangla = (num: number | string) => num.toString().split('').map(d => banglaNums[d] || d).join('');
  
  return `${toBangla(day)} ${month} ${toBangla(year)}`;
};

interface IftaarManagementProps {
  manager: Manager;
  isManager: boolean;
  onBack: () => void;
}

const IftaarManagement: React.FC<IftaarManagementProps> = ({ manager, isManager, onBack }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'deposits' | 'expenses' | 'schedule' | 'settings'>('dashboard');
  const [config, setConfig] = useState<IftaarConfig>(manager.iftaarConfig || {
    messName: manager.messName,
    managerName: manager.name,
    managerMobile: manager.mobile,
    month: manager.month,
    year: manager.year
  });

  const [deposits, setDeposits] = useState<IftaarDeposit[]>([]);
  const [expenses, setExpenses] = useState<IftaarExpense[]>([]);
  const [schedules, setSchedules] = useState<IftaarBazaarSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [editingDeposit, setEditingDeposit] = useState<IftaarDeposit | null>(null);
  const [depositForm, setDepositForm] = useState({ name: '', amount: 0, date: new Date().toISOString().split('T')[0] });

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<IftaarExpense | null>(null);
  const [expenseForm, setExpenseForm] = useState({ shopper: '', amount: 0, date: new Date().toISOString().split('T')[0] });

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<IftaarBazaarSchedule | null>(null);
  const [scheduleForm, setScheduleForm] = useState({ shopper: '', date: new Date().toISOString().split('T')[0] });

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [manager.username]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [d, e, s] = await Promise.all([
        dbService.getIftaarDeposits(manager.username),
        dbService.getIftaarExpenses(manager.username),
        dbService.getIftaarBazaarSchedules(manager.username)
      ]);
      setDeposits(d);
      setExpenses(e);
      setSchedules(s);
    } catch (error) {
      console.error("Error fetching iftaar data:", error);
    }
    setLoading(false);
  };

  const handleSaveConfig = async () => {
    try {
      await dbService.updateManager(manager.username, { iftaarConfig: config });
      alert("সেটিংস সেভ হয়েছে!");
    } catch (error) {
      alert("সেভ করতে সমস্যা হয়েছে।");
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDeposit) {
        await dbService.updateIftaarDeposit(editingDeposit.id, depositForm);
      } else {
        await dbService.addIftaarDeposit({ ...depositForm, managerId: manager.username });
      }
      setShowDepositForm(false);
      setEditingDeposit(null);
      setDepositForm({ name: '', amount: 0, date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (error) {
      alert("Error saving deposit");
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await dbService.updateIftaarExpense(editingExpense.id, expenseForm);
      } else {
        await dbService.addIftaarExpense({ ...expenseForm, managerId: manager.username });
      }
      setShowExpenseForm(false);
      setEditingExpense(null);
      setExpenseForm({ shopper: '', amount: 0, date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (error) {
      alert("Error saving expense");
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await dbService.updateIftaarBazaarSchedule(editingSchedule.id, scheduleForm);
      } else {
        await dbService.addIftaarBazaarSchedule({ ...scheduleForm, managerId: manager.username });
      }
      setShowScheduleForm(false);
      setEditingSchedule(null);
      setScheduleForm({ shopper: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (error) {
      alert("Error saving schedule");
    }
  };

  const downloadImage = async (title: string) => {
    if (!reportRef.current) return;
    try {
      // Temporarily show the hidden element for capturing
      const element = reportRef.current;
      const parent = element.parentElement;
      if (parent) parent.classList.remove('hidden');
      
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      if (parent) parent.classList.add('hidden');
      
      const link = document.createElement('a');
      link.download = `Iftaar_${title}_${config.month}_${config.year}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Image download error:", error);
      alert("ইমেজ ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    }
  };

  const totalDeposits = deposits.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const balance = totalDeposits - totalExpenses;

  const nextBazaar = schedules
    .filter(s => new Date(s.date) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  if (loading) return <div className="p-10 text-center font-baloo">লোড হচ্ছে...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
          <ArrowLeft size={20} /> <span className="font-bold">পিছনে</span>
        </button>
        <h1 className="text-2xl font-bold font-baloo text-primary">ইফতার ম্যানেজমেন্ট</h1>
        <div className="w-10"></div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 no-scrollbar">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
          { id: 'deposits', icon: DollarSign, label: 'টাকা জমা' },
          { id: 'expenses', icon: ShoppingCart, label: 'বাজার খরচ' },
          { id: 'schedule', icon: Calendar, label: 'বাজার তালিকা' },
          { id: 'settings', icon: Info, label: 'ম্যানেজার তথ্য', hide: !isManager }
        ].filter(t => !t.hide).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                <h2 className="text-xl font-bold font-baloo mb-2">{config.messName}</h2>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><User size={14}/> {config.managerName}</span>
                    <span className="flex items-center gap-1"><Phone size={14}/> {config.managerMobile}</span>
                    <span className="flex items-center gap-1"><Calendar size={14}/> {config.month}, {config.year}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <h3 className="text-emerald-100 text-sm">মোট জমা</h3>
                <p className="text-3xl font-bold font-baloo">{totalDeposits} ৳</p>
                <DollarSign className="absolute bottom-2 right-2 opacity-20" size={48}/>
              </div>
              <div className="bg-rose-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <h3 className="text-rose-100 text-sm">মোট খরচ</h3>
                <p className="text-3xl font-bold font-baloo">{totalExpenses} ৳</p>
                <ShoppingCart className="absolute bottom-2 right-2 opacity-20" size={48}/>
              </div>
              <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <h3 className="text-blue-100 text-sm">বর্তমান ব্যালেন্স</h3>
                <p className="text-3xl font-bold font-baloo">{balance} ৳</p>
                <Info className="absolute bottom-2 right-2 opacity-20" size={48}/>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-amber-800 dark:text-amber-400">পরবর্তী বাজার</h3>
                    {nextBazaar ? (
                        <p className="text-lg font-baloo dark:text-white">{nextBazaar.shopper} - {formatBanglaDate(nextBazaar.date)}</p>
                    ) : (
                        <p className="text-slate-500 italic">কোন শিডিউল নেই</p>
                    )}
                </div>
                <Calendar className="text-amber-500" size={40} />
            </div>
            
            {!isManager && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold border-b dark:border-slate-700 pb-3 mb-4 flex items-center gap-2">
                  <List size={18} className="text-primary"/> আপনার বাজারের নাম দিন
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                   <input 
                      type="text" 
                      placeholder="আপনার নাম লিখুন..."
                      id="borderShopperName"
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                   />
                   <input 
                      type="date" 
                      id="borderShopperDate"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                   />
                   <button 
                    onClick={async () => {
                      const nameInput = document.getElementById('borderShopperName') as HTMLInputElement;
                      const dateInput = document.getElementById('borderShopperDate') as HTMLInputElement;
                      if(!nameInput.value) return alert('আপনার নাম লিখুন');
                      if(!dateInput.value) return alert('তারিখ সিলেক্ট করুন');
                      try {
                        await dbService.addIftaarBazaarSchedule({ 
                          shopper: nameInput.value, 
                          date: dateInput.value, 
                          managerId: manager.username 
                        });
                        nameInput.value = '';
                        alert('আপনার বাজারের নাম এবং তারিখ যোগ হয়েছে!');
                        fetchData();
                      } catch(e) { alert('Error'); }
                    }}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-sky-600 transition-colors">যোগ করুন</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-baloo">টাকা জমার তালিকা</h3>
              <div className="flex gap-2">
                <button onClick={() => downloadImage('Deposits')} className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                  <Download size={18} />
                </button>
                {isManager && (
                  <button onClick={() => { setShowDepositForm(true); setEditingDeposit(null); }} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md">
                    <Plus size={18} /> যোগ করুন
                  </button>
                )}
              </div>
            </div>

            {/* Hidden component for Image Download */}
            <div className="hidden">
              <div ref={reportRef} className="p-10 bg-white text-slate-900 w-[800px]">
                  <div className="text-center border-b-2 border-primary pb-6 mb-6">
                      <h1 className="text-3xl font-bold font-baloo text-primary mb-2">{config.messName}</h1>
                      <p className="text-xl font-bold">
                        {activeTab === 'deposits' ? 'ইফতার টাকা জমার তালিকা' : 
                         activeTab === 'expenses' ? 'ইফতার বাজার খরচের তালিকা' : 
                         'ইফতার বাজার শিডিউল তালিকা'}
                      </p>
                      <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
                          <span>ম্যানেজার: {config.managerName}</span>
                          <span>মোবাইল: {config.managerMobile}</span>
                          <span>মাস: {config.month}, {config.year}</span>
                      </div>
                  </div>

                  {activeTab === 'deposits' && (
                    <table className="w-full border-collapse border border-slate-300">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="border border-slate-300 p-3">ক্রমিক নং</th>
                                <th className="border border-slate-300 p-3">তারিখ</th>
                                <th className="border border-slate-300 p-3">নাম</th>
                                <th className="border border-slate-300 p-3">পরিমাণ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deposits.map((d, i) => (
                                <tr key={d.id} className="text-center">
                                    <td className="border border-slate-300 p-3 font-baloo">{i+1}</td>
                                  <td className="border border-slate-300 p-3 font-baloo">{formatBanglaDate(d.date)}</td>
                                  <td className="border border-slate-300 p-3">{d.name}</td>
                                    <td className="border border-slate-300 p-3 font-bold font-baloo">{d.amount} ৳</td>
                                </tr>
                            ))}
                            <tr className="bg-slate-50 font-bold">
                                <td colSpan={3} className="border border-slate-300 p-3 text-right">মোট জমা:</td>
                                <td className="border border-slate-300 p-3 text-center font-baloo">{totalDeposits} ৳</td>
                            </tr>
                        </tbody>
                    </table>
                  )}

                  {activeTab === 'expenses' && (
                    <table className="w-full border-collapse border border-slate-300">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="border border-slate-300 p-3">ক্রমিক নং</th>
                                <th className="border border-slate-300 p-3">তারিখ</th>
                                <th className="border border-slate-300 p-3">বাজারকারী</th>
                                <th className="border border-slate-300 p-3">পরিমাণ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((e, i) => (
                                <tr key={e.id} className="text-center">
                                    <td className="border border-slate-300 p-3 font-baloo">{i+1}</td>
                                    <td className="border border-slate-300 p-3 font-baloo">{formatBanglaDate(e.date)}</td>
                                    <td className="border border-slate-300 p-3">{e.shopper}</td>
                                    <td className="border border-slate-300 p-3 font-bold font-baloo">{e.amount} ৳</td>
                                </tr>
                            ))}
                            <tr className="bg-slate-50 font-bold">
                                <td colSpan={3} className="border border-slate-300 p-3 text-right">মোট খরচ:</td>
                                <td className="border border-slate-300 p-3 text-center font-baloo">{totalExpenses} ৳</td>
                            </tr>
                        </tbody>
                    </table>
                  )}

                  {activeTab === 'schedule' && (
                    <table className="w-full border-collapse border border-slate-300">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="border border-slate-300 p-3">ক্রমিক নং</th>
                                <th className="border border-slate-300 p-3">তারিখ</th>
                                <th className="border border-slate-300 p-3">বাজারকারী</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((s, i) => (
                                <tr key={s.id} className="text-center">
                                    <td className="border border-slate-300 p-3 font-baloo">{i+1}</td>
                                    <td className="border border-slate-300 p-3 font-baloo">{formatBanglaDate(s.date)}</td>
                                    <td className="border border-slate-300 p-3">{s.shopper}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  )}

                  <div className="mt-10 text-right italic text-sm text-slate-400">Generated by Mess Manager App</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="p-4 text-left">তারিখ</th>
                    <th className="p-4 text-left">নাম</th>
                    <th className="p-4 text-right">টাকা</th>
                    {isManager && <th className="p-4 text-center">অ্যাকশন</th>}
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-700">
                  {deposits.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-4 font-baloo">{formatBanglaDate(d.date)}</td>
                      <td className="p-4 font-bold">{d.name}</td>
                      <td className="p-4 text-right font-bold font-baloo text-emerald-600 dark:text-emerald-400">{d.amount} ৳</td>
                      {isManager && (
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => { setEditingDeposit(d); setDepositForm({ name: d.name, amount: d.amount, date: d.date }); setShowDepositForm(true); }} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Edit2 size={16}/></button>
                            <button onClick={() => { if(confirm('ডিলিট করতে চান?')) dbService.deleteIftaarDeposit(d.id).then(fetchData) }} className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded"><Trash2 size={16}/></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {deposits.length === 0 && <tr><td colSpan={isManager ? 4 : 3} className="p-10 text-center text-slate-400 italic">কোন তথ্য নেই</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-baloo">বাজার খরচের তালিকা</h3>
              <div className="flex gap-2">
                <button onClick={() => downloadImage('Expenses')} className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                  <Download size={18} />
                </button>
                {isManager && (
                  <button onClick={() => { setShowExpenseForm(true); setEditingExpense(null); }} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md">
                    <Plus size={18} /> যোগ করুন
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="p-4 text-left">তারিখ</th>
                    <th className="p-4 text-left">বাজারকারী</th>
                    <th className="p-4 text-right">খরচ</th>
                    {isManager && <th className="p-4 text-center">অ্যাকশন</th>}
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-700">
                  {expenses.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-4 font-baloo">{formatBanglaDate(e.date)}</td>
                      <td className="p-4 font-bold">{e.shopper}</td>
                      <td className="p-4 text-right font-bold font-baloo text-rose-600 dark:text-rose-400">{e.amount} ৳</td>
                      {isManager && (
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => { setEditingExpense(e); setExpenseForm({ shopper: e.shopper, amount: e.amount, date: e.date }); setShowExpenseForm(true); }} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Edit2 size={16}/></button>
                            <button onClick={() => { if(confirm('ডিলিট করতে চান?')) dbService.deleteIftaarExpense(e.id).then(fetchData) }} className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded"><Trash2 size={16}/></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {expenses.length === 0 && <tr><td colSpan={isManager ? 4 : 3} className="p-10 text-center text-slate-400 italic">কোন তথ্য নেই</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-baloo">বাজার করার তালিকা</h3>
              <div className="flex gap-2">
                <button onClick={() => downloadImage('Schedule')} className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                  <Download size={18} />
                </button>
                {isManager && (
                  <button onClick={() => { setShowScheduleForm(true); setEditingSchedule(null); }} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md">
                    <Plus size={18} /> যোগ করুন
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="p-4 text-left">তারিখ</th>
                    <th className="p-4 text-left">বাজারকারী</th>
                    {isManager && <th className="p-4 text-center">অ্যাকশন</th>}
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-700">
                  {schedules.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-4 font-baloo">{formatBanglaDate(s.date)}</td>
                      <td className="p-4 font-bold">{s.shopper}</td>
                      {isManager && (
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => { setEditingSchedule(s); setScheduleForm({ shopper: s.shopper, date: s.date }); setShowScheduleForm(true); }} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Edit2 size={16}/></button>
                            <button onClick={() => { if(confirm('ডিলিট করতে চান?')) dbService.deleteIftaarBazaarSchedule(s.id).then(fetchData) }} className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded"><Trash2 size={16}/></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {schedules.length === 0 && <tr><td colSpan={isManager ? 3 : 2} className="p-10 text-center text-slate-400 italic">কোন তথ্য নেই</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && isManager && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold font-baloo border-b dark:border-slate-700 pb-2">ম্যানেজমেন্ট সেটিংস</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">মেসের নাম</label>
                <input value={config.messName} onChange={e => setConfig({...config, messName: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">ম্যানেজারের নাম</label>
                <input value={config.managerName} onChange={e => setConfig({...config, managerName: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">মোবাইল নম্বর</label>
                <input value={config.managerMobile} onChange={e => setConfig({...config, managerMobile: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">মাস</label>
                <input value={config.month} onChange={e => setConfig({...config, month: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">বছর</label>
                <input type="number" value={config.year} onChange={e => setConfig({...config, year: parseInt(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            <button onClick={handleSaveConfig} className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2">
              <Save size={20}/> তথ্য সেভ করুন
            </button>
          </div>
        )}
      </div>

      {/* Forms Modals */}
      {showDepositForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-lg font-baloo">{editingDeposit ? 'জমা এডিট করুন' : 'নতুন জমা যোগ করুন'}</h3>
              <button onClick={() => setShowDepositForm(false)}><X/></button>
            </div>
            <form onSubmit={handleDepositSubmit} className="p-6 space-y-4">
              <div><label className="text-xs font-bold">নাম</label><input required value={depositForm.name} onChange={e => setDepositForm({...depositForm, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2" /></div>
              <div><label className="text-xs font-bold">পরিমাণ</label><input required type="number" value={depositForm.amount} onChange={e => setDepositForm({...depositForm, amount: parseInt(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2" /></div>
              <div><label className="text-xs font-bold">তারিখ</label><input required type="date" value={depositForm.date} onChange={e => setDepositForm({...depositForm, date: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2" /></div>
              <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-bold">সেভ করুন</button>
            </form>
          </div>
        </div>
      )}

      {showExpenseForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-lg font-baloo">{editingExpense ? 'খরচ এডিট করুন' : 'নতুন খরচ যোগ করুন'}</h3>
              <button onClick={() => setShowExpenseForm(false)}><X/></button>
            </div>
            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4">
              <div><label className="text-xs font-bold">বাজারকারী</label><input required value={expenseForm.shopper} onChange={e => setExpenseForm({...expenseForm, shopper: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2" /></div>
              <div><label className="text-xs font-bold">পরিমাণ</label><input required type="number" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: parseInt(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2" /></div>
              <div><label className="text-xs font-bold">তারিখ</label><input required type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2" /></div>
              <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-bold">সেভ করুন</button>
            </form>
          </div>
        </div>
      )}

      {showScheduleForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-lg font-baloo">{editingSchedule ? 'শিডিউল এডিট করুন' : 'নতুন শিডিউল যোগ করুন'}</h3>
              <button onClick={() => setShowScheduleForm(false)}><X/></button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              <div><label className="text-xs font-bold">বাজারকারী</label><input required value={scheduleForm.shopper} onChange={e => setScheduleForm({...scheduleForm, shopper: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2" /></div>
              <div><label className="text-xs font-bold">তারিখ</label><input required type="date" value={scheduleForm.date} onChange={e => setScheduleForm({...scheduleForm, date: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2" /></div>
              <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-bold">সেভ করুন</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IftaarManagement;
