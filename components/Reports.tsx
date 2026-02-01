import React, { useRef } from 'react';
import { Border, Manager, Expense, SystemDailyEntry, MONTHS, BazaarShift } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Image as ImageIcon } from 'lucide-react';

interface ReportsProps {
  manager: Manager;
  borders: Border[];
  expenses: Expense[];
}

const Reports: React.FC<ReportsProps> = ({ manager, borders, expenses }) => {
  const dailyRiceRef = useRef<HTMLDivElement>(null);
  const dailyMealRef = useRef<HTMLDivElement>(null);
  const monthlyRiceRef = useRef<HTMLDivElement>(null);
  const monthlyCostRef = useRef<HTMLDivElement>(null);
  const generalMarketRef = useRef<HTMLDivElement>(null);
  const extraMarketRef = useRef<HTMLDivElement>(null);
  const borderListRef = useRef<HTMLDivElement>(null);
  const systemDailyRef = useRef<HTMLDivElement>(null);
  const bazaarScheduleRef = useRef<HTMLDivElement>(null);

  const downloadReport = async (ref: React.RefObject<HTMLDivElement>, filename: string, type: 'pdf' | 'image', orientation: 'p'|'l' = 'l') => {
    if (!ref.current) return;
    
    // Temporarily show the hidden container for capture
    const element = ref.current;
    element.style.display = 'block';
    
    try {
      const canvas = await html2canvas(element, { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#ffffff',
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
      });
      const imgData = canvas.toDataURL('image/png');
      
      if (type === 'image') {
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `${filename}.png`;
          link.click();
      } else {
          const pdf = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: 'a4'
          });
          
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${filename}.pdf`);
      }
    } catch (err) {
      console.error(err);
      alert("রিপোর্ট জেনারেট করতে সমস্যা হয়েছে।");
    } finally {
        // Hide again
       element.style.display = 'none';
    }
  };

  // --- Calculation Helpers ---
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const getTotalMeals = (b: Border) => Object.values(b.dailyUsage).reduce((acc, curr) => acc + (curr.meals || 0), 0);
  const getTotalRice = (b: Border) => Object.values(b.dailyUsage).reduce((acc, curr) => acc + (curr.rice || 0), 0);
  const totalExtraBazaar = expenses.filter(e => e.type === 'extra').reduce((sum, e) => sum + e.amount, 0);
  
  const calculateBorderStats = (b: Border) => {
    const totalMoneyDeposit = b.deposits.reduce((sum, d) => sum + d.amount, 0);
    const totalRiceDeposit = b.riceDeposits.reduce((sum, d) => sum + (d.amount || 0), 0);
    const mealsEaten = getTotalMeals(b);
    const riceEaten = getTotalRice(b);
    
    const mealCost = mealsEaten * manager.mealRate;
    const sharedExtraCost = borders.length > 0 ? (totalExtraBazaar / borders.length) : 0;
    const totalCost = mealCost + b.extraCost + b.guestCost + sharedExtraCost;
    
    const moneyBalance = totalMoneyDeposit - totalCost; 
    const riceBalance = totalRiceDeposit - riceEaten;

    return { totalMoneyDeposit, totalRiceDeposit, mealsEaten, riceEaten, mealCost, sharedExtraCost, totalCost, moneyBalance, riceBalance };
  };

  // Calculate System Daily Totals
  const getSystemDailyTotals = () => {
    let tMeals = 0, tRice = 0;
    if(manager.systemDaily) {
        Object.values(manager.systemDaily).forEach((day: SystemDailyEntry) => {
            tMeals += (day.morning?.meal||0) + (day.lunch?.meal||0) + (day.dinner?.meal||0);
            tRice += (day.morning?.rice||0) + (day.lunch?.rice||0) + (day.dinner?.rice||0);
        });
    }
    return { tMeals, tRice };
  }
  const sysTotals = getSystemDailyTotals();

  // Helper for Bazaar Schedule
  const getMonthIndex = (monthName: string) => {
      const idx = MONTHS.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
      return idx !== -1 ? idx : 0;
  };
  const getDayName = (day: number) => {
      const date = new Date(manager.year, getMonthIndex(manager.month), day);
      return date.toLocaleDateString('bn-BD', { weekday: 'long' });
  };
  const sortedBazaarSchedule = manager.bazaarSchedule ? (Object.values(manager.bazaarSchedule) as BazaarShift[]).sort((a,b) => a.date - b.date) : [];

  const ReportCard = ({ title, desc, onPdf, onImg }: any) => (
      <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-primary hover:shadow-lg transition-all group">
          <h3 className="text-lg font-bold mb-1 text-slate-800 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-slate-500 mb-4">{desc}</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onPdf} className="flex items-center justify-center gap-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded text-sm hover:bg-red-600 hover:text-white font-medium transition-all">
                <Download size={16} /> PDF
            </button>
            <button onClick={onImg} className="flex items-center justify-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 py-2 rounded text-sm hover:bg-emerald-600 hover:text-white font-medium transition-all">
                <ImageIcon size={16} /> ছবি (HD)
            </button>
          </div>
      </div>
  );

  const Header = ({ title }: { title: string }) => (
    <div className="text-center mb-4 border-b-2 border-slate-300 pb-2">
        <h1 className="text-3xl font-bold uppercase text-blue-800">{manager.messName}</h1>
        <div className="flex justify-center gap-4 text-sm font-semibold mt-1 text-slate-600">
            <span>ম্যানেজার: {manager.name} ({manager.mobile})</span> | <span>মাস: {manager.month} {manager.year}</span>
        </div>
        <h2 className="text-xl font-bold mt-2 bg-slate-100 inline-block px-4 py-1 rounded border border-slate-300">{title}</h2>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">রিপোর্ট সেন্টার</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportCard title="সিস্টেম ডেইলি এন্ট্রি" desc="সকাল-দুপুর-রাত মিল ও চালের হিসাব।" onPdf={() => downloadReport(systemDailyRef, `System_Daily_${manager.month}`, 'pdf', 'l')} onImg={() => downloadReport(systemDailyRef, `System_Daily_${manager.month}`, 'image', 'l')} />
        <ReportCard title="বর্ডার লিস্ট" desc="নাম, মোবাইল ও রক্তের গ্রুপ।" onPdf={() => downloadReport(borderListRef, `Border_List`, 'pdf', 'p')} onImg={() => downloadReport(borderListRef, `Border_List`, 'image', 'p')} />
        
        {/* Market Split */}
        <ReportCard title="সাধারণ বাজার" desc="শুধুমাত্র সাধারণ বাজারের তালিকা।" onPdf={() => downloadReport(generalMarketRef, `General_Market_${manager.month}`, 'pdf', 'p')} onImg={() => downloadReport(generalMarketRef, `General_Market_${manager.month}`, 'image', 'p')} />
        <ReportCard title="অতিরিক্ত বাজার" desc="শুধুমাত্র অতিরিক্ত বাজারের তালিকা।" onPdf={() => downloadReport(extraMarketRef, `Extra_Market_${manager.month}`, 'pdf', 'p')} onImg={() => downloadReport(extraMarketRef, `Extra_Market_${manager.month}`, 'image', 'p')} />
        
        <ReportCard title="দৈনিক চালের হিসাব" desc="বর্ডার ভিত্তিক দৈনিক চালের তালিকা।" onPdf={() => downloadReport(dailyRiceRef, `Daily_Rice_${manager.month}`, 'pdf', 'l')} onImg={() => downloadReport(dailyRiceRef, `Daily_Rice_${manager.month}`, 'image', 'l')} />
        <ReportCard title="দৈনিক মিলের হিসাব" desc="বর্ডার ভিত্তিক দৈনিক মিলের তালিকা।" onPdf={() => downloadReport(dailyMealRef, `Daily_Meal_${manager.month}`, 'pdf', 'l')} onImg={() => downloadReport(dailyMealRef, `Daily_Meal_${manager.month}`, 'image', 'l')} />
        <ReportCard title="মাসিক চালের হিসাব" desc="চাল জমা, খাওয়া ও ব্যালেন্স।" onPdf={() => downloadReport(monthlyRiceRef, `Monthly_Rice_${manager.month}`, 'pdf', 'p')} onImg={() => downloadReport(monthlyRiceRef, `Monthly_Rice_${manager.month}`, 'image', 'p')} />
        <ReportCard title="মাসিক মিল ও টাকা" desc="সম্পূর্ণ আর্থিক বিবরণী ও ব্যালেন্স।" onPdf={() => downloadReport(monthlyCostRef, `Monthly_Final_${manager.month}`, 'pdf', 'l')} onImg={() => downloadReport(monthlyCostRef, `Monthly_Final_${manager.month}`, 'image', 'l')} />
        
        {/* New Report */}
        <ReportCard title="বাজার লিস্ট (শিডিউল)" desc="মাসের বাজার করার শিডিউল।" onPdf={() => downloadReport(bazaarScheduleRef, `Bazaar_Schedule_${manager.month}`, 'pdf', 'p')} onImg={() => downloadReport(bazaarScheduleRef, `Bazaar_Schedule_${manager.month}`, 'image', 'p')} />

      </div>

      {/* --- HIDDEN PRINT AREAS --- */}
      
      {/* 1. System Daily Report */}
      <div style={{ display: 'none' }} ref={systemDailyRef} className="bg-white p-6 w-[1600px] mx-auto">
        <Header title="সিস্টেম ডেইলি এন্ট্রি (বাবুর্চি হিসাব)" />
        <table className="w-full border-collapse text-xs border border-gray-400 text-center">
            <thead>
                <tr className="bg-slate-800 text-white">
                    <th rowSpan={2} className="border p-2">তারিখ</th>
                    <th colSpan={2} className="border p-1 bg-orange-700">সকাল</th>
                    <th colSpan={2} className="border p-1 bg-blue-700">দুপুর</th>
                    <th colSpan={2} className="border p-1 bg-purple-700">রাত</th>
                    <th colSpan={2} className="border p-1 bg-emerald-700">মোট</th>
                </tr>
                <tr className="bg-slate-700 text-white">
                    <th className="border p-1">মিল</th><th className="border p-1">চাল</th>
                    <th className="border p-1">মিল</th><th className="border p-1">চাল</th>
                    <th className="border p-1">মিল</th><th className="border p-1">চাল</th>
                    <th className="border p-1">মিল</th><th className="border p-1">চাল</th>
                </tr>
            </thead>
            <tbody>
                {days.map(d => {
                    const dayData = manager.systemDaily?.[d];
                    const dM = (dayData?.morning?.meal||0) + (dayData?.lunch?.meal||0) + (dayData?.dinner?.meal||0);
                    const dR = (dayData?.morning?.rice||0) + (dayData?.lunch?.rice||0) + (dayData?.dinner?.rice||0);
                    if(!dM && !dR) return null; // Skip empty days in print? Or keep for structure. Let's keep distinct days.
                    return (
                        <tr key={d} className="border-b border-gray-300">
                            <td className="border p-2 font-bold bg-slate-100">{d}</td>
                            <td className="border p-1">{dayData?.morning?.meal || '-'}</td><td className="border p-1 text-orange-700 font-bold">{dayData?.morning?.rice || '-'}</td>
                            <td className="border p-1">{dayData?.lunch?.meal || '-'}</td><td className="border p-1 text-blue-700 font-bold">{dayData?.lunch?.rice || '-'}</td>
                            <td className="border p-1">{dayData?.dinner?.meal || '-'}</td><td className="border p-1 text-purple-700 font-bold">{dayData?.dinner?.rice || '-'}</td>
                            <td className="border p-1 bg-emerald-50 font-bold">{dM}</td><td className="border p-1 bg-emerald-100 font-bold text-emerald-800">{dR.toFixed(1)}</td>
                        </tr>
                    )
                })}
                <tr className="bg-slate-200 font-bold">
                    <td className="border p-2">সর্বমোট</td>
                    <td colSpan={6} className="border p-2 text-right">মাসের মোট:</td>
                    <td className="border p-2">{sysTotals.tMeals}</td>
                    <td className="border p-2">{sysTotals.tRice.toFixed(1)}</td>
                </tr>
            </tbody>
        </table>
      </div>

      {/* 2. Border List Report */}
      <div style={{ display: 'none' }} ref={borderListRef} className="bg-white p-8 w-[1000px] mx-auto">
        <Header title="বর্ডার তালিকা ও তথ্য" />
        <table className="w-full border-collapse text-sm border border-gray-400">
            <thead>
                <tr className="bg-slate-800 text-white">
                    <th className="border p-3 w-16">ক্রম</th>
                    <th className="border p-3 text-left">বর্ডার নাম</th>
                    <th className="border p-3">মোবাইল নাম্বার</th>
                    <th className="border p-3">রক্তের গ্রুপ</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => (
                    <tr key={b.id} className="text-center border-b hover:bg-slate-50">
                        <td className="border p-3">{idx + 1}</td>
                        <td className="border p-3 text-left font-bold">{b.name}</td>
                        <td className="border p-3 font-mono">{b.mobile || '-'}</td>
                        <td className="border p-3 text-red-600 font-bold">{b.bloodGroup || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* 3. General Market List Report */}
      <div style={{ display: 'none' }} ref={generalMarketRef} className="bg-white p-8 w-[1000px] mx-auto">
        <Header title="সাধারণ বাজার তালিকা" />
        <table className="w-full border-collapse text-sm border border-gray-400">
            <thead>
                <tr className="bg-blue-600 text-white">
                    <th className="border p-2">তারিখ</th>
                    <th className="border p-2 text-left">বাজারকারী</th>
                    <th className="border p-2 text-right">টাকা</th>
                </tr>
            </thead>
            <tbody>
                {expenses.filter(e => e.type === 'market').map(e => (
                    <tr key={e.id} className="border-b">
                        <td className="border p-2 text-center">{e.date}</td>
                        <td className="border p-2 font-semibold">{e.shopper}</td>
                        <td className="border p-2 text-right font-bold">{e.amount}</td>
                    </tr>
                ))}
                    <tr className="bg-blue-50 font-bold">
                        <td colSpan={2} className="border p-2 text-right text-lg">সর্বমোট:</td>
                        <td className="border p-2 text-right text-lg">{expenses.filter(e => e.type === 'market').reduce((a,b)=>a+b.amount,0)}</td>
                    </tr>
            </tbody>
        </table>
      </div>

      {/* 4. Extra Market List Report */}
      <div style={{ display: 'none' }} ref={extraMarketRef} className="bg-white p-8 w-[1000px] mx-auto">
        <Header title="অতিরিক্ত বাজার তালিকা" />
        <table className="w-full border-collapse text-sm border border-gray-400">
            <thead>
                <tr className="bg-red-600 text-white">
                    <th className="border p-2">তারিখ</th>
                    <th className="border p-2 text-left">বিবরণ</th>
                    <th className="border p-2 text-right">টাকা</th>
                </tr>
            </thead>
            <tbody>
                {expenses.filter(e => e.type === 'extra').map(e => (
                    <tr key={e.id} className="border-b">
                        <td className="border p-2 text-center">{e.date}</td>
                        <td className="border p-2 font-semibold">{e.shopper}</td>
                        <td className="border p-2 text-right font-bold">{e.amount}</td>
                    </tr>
                ))}
                    <tr className="bg-red-50 font-bold">
                        <td colSpan={2} className="border p-2 text-right text-lg">সর্বমোট:</td>
                        <td className="border p-2 text-right text-lg">{expenses.filter(e => e.type === 'extra').reduce((a,b)=>a+b.amount,0)}</td>
                    </tr>
            </tbody>
        </table>
      </div>

      {/* 5. Daily Rice Sheet */}
      <div style={{ display: 'none' }} ref={dailyRiceRef} className="bg-white p-6 w-[1600px] mx-auto">
        <Header title="দৈনিক চালের হিসাব (বর্ডার ভিত্তিক)" />
        <table className="w-full border-collapse text-[11px] border border-gray-400">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border border-gray-400 p-2 w-8">ক্রম</th>
                    <th className="border border-gray-400 p-2 text-left px-2 w-32">বর্ডার নাম</th>
                    {days.map(d => <th key={d} className="border border-gray-400 p-1 w-6 text-center">{d}</th>)}
                    <th className="border border-gray-400 p-2 w-12 bg-yellow-100">মোট</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => (
                    <tr key={b.id} className="text-center hover:bg-slate-50">
                        <td className="border border-gray-400 p-1" style={{height: '24px', verticalAlign: 'middle'}}>{idx + 1}</td>
                        <td className="border border-gray-400 font-bold text-left px-2 truncate" style={{height: '24px', verticalAlign: 'middle'}}>{b.name}</td>
                        {days.map(d => (
                            <td key={d} className="border border-gray-400 p-0 text-slate-800" style={{height: '24px', verticalAlign: 'middle'}}>
                                {b.dailyUsage[d]?.rice > 0 ? b.dailyUsage[d]?.rice : ''}
                            </td>
                        ))}
                        <td className="border border-gray-400 font-bold bg-yellow-50" style={{height: '24px', verticalAlign: 'middle'}}>{getTotalRice(b).toFixed(1)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* 6. Daily Meal Sheet */}
      <div style={{ display: 'none' }} ref={dailyMealRef} className="bg-white p-6 w-[1600px] mx-auto">
        <Header title="দৈনিক মিলের হিসাব (বর্ডার ভিত্তিক)" />
        <table className="w-full border-collapse text-[11px] border border-gray-400">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border border-gray-400 p-2 w-8">ক্রম</th>
                    <th className="border border-gray-400 p-2 text-left px-2 w-32">বর্ডার নাম</th>
                    {days.map(d => <th key={d} className="border border-gray-400 p-1 w-6 text-center">{d}</th>)}
                    <th className="border border-gray-400 p-2 w-12 bg-blue-100">মোট</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => (
                    <tr key={b.id} className="text-center hover:bg-slate-50">
                        <td className="border border-gray-400 p-1" style={{height: '24px', verticalAlign: 'middle'}}>{idx + 1}</td>
                        <td className="border border-gray-400 font-bold text-left px-2 truncate" style={{height: '24px', verticalAlign: 'middle'}}>{b.name}</td>
                        {days.map(d => (
                            <td key={d} className="border border-gray-400 p-0 text-blue-900 font-bold" style={{height: '24px', verticalAlign: 'middle'}}>
                                {b.dailyUsage[d]?.meals > 0 ? b.dailyUsage[d]?.meals : ''}
                            </td>
                        ))}
                        <td className="border border-gray-400 font-bold bg-blue-50" style={{height: '24px', verticalAlign: 'middle'}}>{getTotalMeals(b)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

       {/* 7. Monthly Rice Sheet (Portrait) */}
       <div style={{ display: 'none' }} ref={monthlyRiceRef} className="bg-white p-8 w-[1000px] mx-auto">
        <Header title="মাসিক চালের হিসাব" />
        <table className="w-full border-collapse text-sm border border-gray-800">
            <thead>
                <tr className="bg-slate-800 text-white">
                    <th className="border border-gray-600 p-2">ক্রম</th>
                    <th className="border border-gray-600 p-2 text-left">বর্ডার নাম</th>
                    <th className="border border-gray-600 p-2 bg-green-700">চাল জমা (পট)</th>
                    <th className="border border-gray-600 p-2 bg-red-700">চাল খাওয়া (পট)</th>
                    <th className="border border-gray-600 p-2 bg-blue-700">ম্যানেজার পাবে (শর্ট)</th>
                    <th className="border border-gray-600 p-2 bg-emerald-700">ম্যানেজার দিবে (উদ্বৃত্ত)</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => {
                    const stats = calculateBorderStats(b);
                    return (
                        <tr key={b.id} className="text-center hover:bg-gray-50">
                            <td className="border border-gray-600 p-2">{idx + 1}</td>
                            <td className="border border-gray-600 p-2 text-left font-bold">{b.name}</td>
                            <td className="border border-gray-600 p-2 font-mono bg-green-50 text-base">{stats.totalRiceDeposit.toFixed(2)}</td>
                            <td className="border border-gray-600 p-2 font-mono bg-red-50 text-base">{stats.riceEaten.toFixed(2)}</td>
                            <td className="border border-gray-600 p-2 font-bold font-mono text-red-600">
                                {stats.riceBalance < 0 ? Math.abs(stats.riceBalance).toFixed(2) : '-'}
                            </td>
                            <td className="border border-gray-600 p-2 font-bold font-mono text-green-600">
                                {stats.riceBalance >= 0 ? stats.riceBalance.toFixed(2) : '-'}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>

       {/* 8. Monthly Financial Sheet (Landscape) */}
       <div style={{ display: 'none' }} ref={monthlyCostRef} className="bg-white p-8 w-[1400px] mx-auto">
        <Header title="মাসিক মিল ও টাকার হিসাব" />
        <div className="text-center mb-4"><span className="bg-gray-100 px-4 py-1 rounded">মিল রেট: {manager.mealRate.toFixed(2)} টাকা</span></div>
        <table className="w-full border-collapse text-sm border border-gray-800">
            <thead>
                <tr className="bg-slate-900 text-white text-xs">
                    <th className="border border-gray-600 p-2 w-10">ক্রম</th>
                    <th className="border border-gray-600 p-2 text-left">বর্ডার নাম</th>
                    <th className="border border-gray-600 p-2 bg-emerald-700">টাকা জমা</th>
                    <th className="border border-gray-600 p-2">মোট মিল</th>
                    <th className="border border-gray-600 p-2">মিল খরচ</th>
                    <th className="border border-gray-600 p-2">অতিরিক্ত খরচ (নিজ+গেস্ট+বাজার)</th>
                    <th className="border border-gray-600 p-2 bg-rose-700">মোট খরচ</th>
                    <th className="border border-gray-600 p-2 bg-blue-900">ম্যানেজার পাবে (ডিউ)</th>
                    <th className="border border-gray-600 p-2 bg-green-900">ম্যানেজার দিবে (ফেরত)</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => {
                    const stats = calculateBorderStats(b);
                    // Total Extra = Personal + Guest + Shared
                    const totalExtraDisplay = b.extraCost + b.guestCost + stats.sharedExtraCost;
                    
                    return (
                        <tr key={b.id} className="text-center hover:bg-gray-50 text-gray-900">
                            <td className="border border-gray-600 p-2">{idx + 1}</td>
                            <td className="border border-gray-600 p-2 text-left font-bold text-base">{b.name}</td>
                            <td className="border border-gray-600 p-2 font-mono bg-emerald-50 text-base font-bold">{stats.totalMoneyDeposit.toFixed(0)}</td>
                            <td className="border border-gray-600 p-2 font-mono">{stats.mealsEaten}</td>
                            <td className="border border-gray-600 p-2 font-mono">{stats.mealCost.toFixed(0)}</td>
                            <td className="border border-gray-600 p-2 text-red-600 font-mono font-semibold">{totalExtraDisplay.toFixed(0)}</td>
                            <td className="border border-gray-600 p-2 font-bold bg-rose-50 font-mono text-base">{stats.totalCost.toFixed(0)}</td>
                            <td className="border border-gray-600 p-2 font-bold bg-blue-50 font-mono text-base text-red-600">
                                {stats.moneyBalance < 0 ? Math.abs(stats.moneyBalance).toFixed(0) : '-'}
                            </td>
                            <td className="border border-gray-600 p-2 font-bold bg-green-50 font-mono text-base text-green-600">
                                {stats.moneyBalance >= 0 ? stats.moneyBalance.toFixed(0) : '-'}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        <div className="mt-12 flex justify-between px-20">
            <div className="text-center">
                <p className="border-t border-black pt-1 w-40 font-semibold">হিসাব রক্ষক</p>
            </div>
            <div className="text-center">
                <p className="border-t border-black pt-1 w-40 font-semibold">ম্যানেজার স্বাক্ষর</p>
            </div>
        </div>
      </div>
      
      {/* 9. Bazaar Schedule Report */}
      <div style={{ display: 'none' }} ref={bazaarScheduleRef} className="bg-white p-8 w-[1000px] mx-auto">
        <Header title="বাজার শিডিউল (লিস্ট)" />
        <table className="w-full border-collapse text-sm border border-gray-800 text-center">
            <thead>
                <tr className="bg-slate-800 text-white">
                    <th className="border border-gray-600 p-3">তারিখ</th>
                    <th className="border border-gray-600 p-3">বার</th>
                    <th className="border border-gray-600 p-3">বাজারকারী টিম</th>
                    <th className="border border-gray-600 p-3">মন্তব্য / সিগনেচার</th>
                </tr>
            </thead>
            <tbody>
                {sortedBazaarSchedule.length === 0 ? (
                    <tr><td colSpan={4} className="p-4">কোন শিডিউল নেই</td></tr>
                ) : (
                    sortedBazaarSchedule.map((shift: BazaarShift) => (
                        <tr key={shift.date} className="hover:bg-gray-50">
                            <td className="border border-gray-600 p-3 font-bold text-lg">{shift.date}</td>
                            <td className="border border-gray-600 p-3">{getDayName(shift.date)}</td>
                            <td className="border border-gray-600 p-3 font-bold text-lg">
                                {shift.shoppers && shift.shoppers.length > 0 ? (
                                    shift.shoppers.map((s, i) => (
                                        <span key={s.id}>
                                            {s.name}
                                            {i < shift.shoppers.length - 1 ? ', ' : ''}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-300">-- ফাঁকা --</span>
                                )}
                            </td>
                            <td className="border border-gray-600 p-3"></td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>

    </div>
  );
};

export default Reports;