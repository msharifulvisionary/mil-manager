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
    
    const element = ref.current;
    element.style.display = 'block';
    
    try {
      const canvas = await html2canvas(element, { 
          scale: 3, // Higher scale for HD
          useCORS: true, 
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      if (type === 'image') {
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `${filename}.png`;
          link.click();
      } else {
          const pdf = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: 'a4',
            compress: true
          });
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          // Add a small margin
          const margin = 5;
          const contentWidth = pdfWidth - (margin * 2);
          const contentHeight = (canvas.height * contentWidth) / canvas.width;
          
          // If content is longer than one page, we might need to handle it, 
          // but for these reports, we usually fit them or scale them.
          pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
          pdf.save(`${filename}.pdf`);
      }
    } catch (err) {
      console.error(err);
      alert("রিপোর্ট জেনারেট করতে সমস্যা হয়েছে।");
    } finally {
       element.style.display = 'none';
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const getTotalMeals = (b: Border) => Object.values(b.dailyUsage).reduce((acc, curr) => acc + (curr.meals || 0), 0);
  const getTotalRice = (b: Border) => Object.values(b.dailyUsage).reduce((acc, curr) => acc + (curr.rice || 0), 0);
  const totalExtraBazaar = expenses.filter(e => e.type === 'extra').reduce((sum, e) => sum + e.amount, 0);
  
  const calculateBorderStats = (b: Border) => {
    const totalMoneyDeposit = b.deposits.reduce((sum, d) => sum + d.amount, 0);
    const totalRiceDeposit = b.riceDeposits.reduce((sum, d) => sum + (d.amount || 0), 0);
    const mealsEaten = getTotalMeals(b);
    const riceEaten = getTotalRice(b);
    
    const mealCost = Math.round(mealsEaten * manager.mealRate);
    const totalCost = mealCost + b.extraCost + b.guestCost;
    
    const moneyBalance = totalMoneyDeposit - totalCost; 
    const riceBalance = totalRiceDeposit - riceEaten;

    return { totalMoneyDeposit, totalRiceDeposit, mealsEaten, riceEaten, mealCost, totalCost, moneyBalance, riceBalance };
  };

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
    <div className="text-center mb-6 border-b-4 border-double border-slate-400 pb-4">
        <h1 className="text-4xl font-extrabold uppercase text-blue-900 mb-2">{manager.messName}</h1>
        <div className="flex justify-center items-center gap-6 text-lg font-bold text-slate-700 mb-3">
            <span className="bg-slate-100 px-3 py-1 rounded shadow-sm">ম্যানেজার: {manager.name}</span>
            <span className="bg-slate-100 px-3 py-1 rounded shadow-sm">মোবাইল: {manager.mobile}</span>
            <span className="bg-slate-100 px-3 py-1 rounded shadow-sm">মাস: {manager.month}, {manager.year}</span>
        </div>
        <div className="inline-block bg-blue-900 text-white px-8 py-2 rounded-full shadow-lg">
            <h2 className="text-2xl font-bold tracking-wide">{title}</h2>
        </div>
    </div>
  );

  const tableHeaderStyle = "bg-slate-800 text-white border border-slate-600 p-3 text-center align-middle font-bold";
  const tableCellStyle = "border border-slate-300 p-2 text-center align-middle text-slate-800";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">রিপোর্ট সেন্টার</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportCard title="সিস্টেম ডেইলি এন্ট্রি" desc="সকাল-দুপুর-রাত মিল ও চালের হিসাব।" onPdf={() => downloadReport(systemDailyRef, `System_Daily_${manager.month}`, 'pdf', 'l')} onImg={() => downloadReport(systemDailyRef, `System_Daily_${manager.month}`, 'image', 'l')} />
        <ReportCard title="বর্ডার লিস্ট" desc="নাম, মোবাইল ও রক্তের গ্রুপ।" onPdf={() => downloadReport(borderListRef, `Border_List`, 'pdf', 'p')} onImg={() => downloadReport(borderListRef, `Border_List`, 'image', 'p')} />
        <ReportCard title="সাধারণ বাজার" desc="শুধুমাত্র সাধারণ বাজারের তালিকা।" onPdf={() => downloadReport(generalMarketRef, `General_Market_${manager.month}`, 'pdf', 'p')} onImg={() => downloadReport(generalMarketRef, `General_Market_${manager.month}`, 'image', 'p')} />
        <ReportCard title="অতিরিক্ত বাজার" desc="শুধুমাত্র অতিরিক্ত বাজারের তালিকা।" onPdf={() => downloadReport(extraMarketRef, `Extra_Market_${manager.month}`, 'pdf', 'p')} onImg={() => downloadReport(extraMarketRef, `Extra_Market_${manager.month}`, 'image', 'p')} />
        <ReportCard title="দৈনিক চালের হিসাব" desc="বর্ডার ভিত্তিক দৈনিক চালের তালিকা।" onPdf={() => downloadReport(dailyRiceRef, `Daily_Rice_${manager.month}`, 'pdf', 'l')} onImg={() => downloadReport(dailyRiceRef, `Daily_Rice_${manager.month}`, 'image', 'l')} />
        <ReportCard title="দৈনিক মিলের হিসাব" desc="বর্ডার ভিত্তিক দৈনিক মিলের তালিকা।" onPdf={() => downloadReport(dailyMealRef, `Daily_Meal_${manager.month}`, 'pdf', 'l')} onImg={() => downloadReport(dailyMealRef, `Daily_Meal_${manager.month}`, 'image', 'l')} />
        <ReportCard title="মাসিক চালের হিসাব" desc="চাল জমা, খাওয়া ও ব্যালেন্স।" onPdf={() => downloadReport(monthlyRiceRef, `Monthly_Rice_${manager.month}`, 'pdf', 'p')} onImg={() => downloadReport(monthlyRiceRef, `Monthly_Rice_${manager.month}`, 'image', 'p')} />
        <ReportCard title="মাসিক মিল ও টাকা" desc="সম্পূর্ণ আর্থিক বিবরণী ও ব্যালেন্স।" onPdf={() => downloadReport(monthlyCostRef, `Monthly_Final_${manager.month}`, 'pdf', 'l')} onImg={() => downloadReport(monthlyCostRef, `Monthly_Final_${manager.month}`, 'image', 'l')} />
        <ReportCard title="বাজার লিস্ট (শিডিউল)" desc="মাসের বাজার করার শিডিউল।" onPdf={() => downloadReport(bazaarScheduleRef, `Bazaar_Schedule_${manager.month}`, 'pdf', 'p')} onImg={() => downloadReport(bazaarScheduleRef, `Bazaar_Schedule_${manager.month}`, 'image', 'p')} />
      </div>

      {/* 1. System Daily Report */}
      <div style={{ display: 'none' }} ref={systemDailyRef} className="bg-white p-10 w-[1400px] mx-auto">
        <Header title="সিস্টেম ডেইলি এন্ট্রি (মিল ও চালের হিসাব)" />
        <table className="w-full border-collapse border-2 border-slate-400">
            <thead>
                <tr>
                    <th rowSpan={2} className={tableHeaderStyle}>তারিখ</th>
                    <th colSpan={2} className={`${tableHeaderStyle} bg-orange-700`}>সকাল</th>
                    <th colSpan={2} className={`${tableHeaderStyle} bg-blue-700`}>দুপুর</th>
                    <th colSpan={2} className={`${tableHeaderStyle} bg-purple-700`}>রাত</th>
                    <th colSpan={2} className={`${tableHeaderStyle} bg-emerald-700`}>মোট</th>
                </tr>
                <tr>
                    <th className={`${tableHeaderStyle} bg-orange-600`}>মিল</th><th className={`${tableHeaderStyle} bg-orange-600`}>চাল</th>
                    <th className={`${tableHeaderStyle} bg-blue-600`}>মিল</th><th className={`${tableHeaderStyle} bg-blue-600`}>চাল</th>
                    <th className={`${tableHeaderStyle} bg-purple-600`}>মিল</th><th className={`${tableHeaderStyle} bg-purple-600`}>চাল</th>
                    <th className={`${tableHeaderStyle} bg-emerald-600`}>মিল</th><th className={`${tableHeaderStyle} bg-emerald-600`}>চাল</th>
                </tr>
            </thead>
            <tbody>
                {days.map(d => {
                    const dayData = manager.systemDaily?.[d];
                    const dM = (dayData?.morning?.meal||0) + (dayData?.lunch?.meal||0) + (dayData?.dinner?.meal||0);
                    const dR = (dayData?.morning?.rice||0) + (dayData?.lunch?.rice||0) + (dayData?.dinner?.rice||0);
                    if(!dM && !dR) return null;
                    return (
                        <tr key={d} className="hover:bg-slate-50">
                            <td className={`${tableCellStyle} font-bold bg-slate-100`}>{d}</td>
                            <td className={tableCellStyle}>{dayData?.morning?.meal || '-'}</td><td className={`${tableCellStyle} text-orange-700 font-bold`}>{dayData?.morning?.rice || '-'}</td>
                            <td className={tableCellStyle}>{dayData?.lunch?.meal || '-'}</td><td className={`${tableCellStyle} text-blue-700 font-bold`}>{dayData?.lunch?.rice || '-'}</td>
                            <td className={tableCellStyle}>{dayData?.dinner?.meal || '-'}</td><td className={`${tableCellStyle} text-purple-700 font-bold`}>{dayData?.dinner?.rice || '-'}</td>
                            <td className={`${tableCellStyle} bg-emerald-50 font-bold`}>{dM}</td><td className={`${tableCellStyle} bg-emerald-100 font-bold text-emerald-800`}>{dR.toFixed(1)}</td>
                        </tr>
                    )
                })}
                <tr className="bg-slate-200 font-bold">
                    <td className={tableCellStyle}>সর্বমোট</td>
                    <td colSpan={6} className={`${tableCellStyle} text-right text-lg`}>মাসের মোট:</td>
                    <td className={`${tableCellStyle} text-lg`}>{sysTotals.tMeals}</td>
                    <td className={`${tableCellStyle} text-lg`}>{sysTotals.tRice.toFixed(1)}</td>
                </tr>
            </tbody>
        </table>
        <div className="mt-8 p-4 bg-slate-50 border-2 border-slate-200 rounded-lg grid grid-cols-4 gap-4 text-center">
            <div className="p-2 border-r border-slate-300">
                <p className="text-sm text-slate-500">গত মাসের জমা চাল</p>
                <p className="text-xl font-bold text-blue-800">{(manager.prevRiceBalance || 0).toFixed(1)} পট</p>
            </div>
            <div className="p-2 border-r border-slate-300">
                <p className="text-sm text-slate-500">মোট জমা চাল</p>
                <p className="text-xl font-bold text-green-700">
                    {( (manager.prevRiceBalance || 0) + borders.reduce((sum, b) => sum + b.riceDeposits.reduce((s, d) => s + (d.amount || 0), 0), 0) ).toFixed(1)} পট
                </p>
            </div>
            <div className="p-2 border-r border-slate-300">
                <p className="text-sm text-slate-500">মোট খাওয়া চাল</p>
                <p className="text-xl font-bold text-red-700">{sysTotals.tRice.toFixed(1)} পট</p>
            </div>
            <div className="p-2">
                <p className="text-sm text-slate-500">মোট অবশিষ্ট চাল</p>
                <p className="text-xl font-bold text-emerald-700">
                    {( (manager.prevRiceBalance || 0) + borders.reduce((sum, b) => sum + b.riceDeposits.reduce((s, d) => s + (d.amount || 0), 0), 0) - sysTotals.tRice ).toFixed(1)} পট
                </p>
            </div>
        </div>
      </div>

      {/* 2. Border List Report */}
      <div style={{ display: 'none' }} ref={borderListRef} className="bg-white p-10 w-[1000px] mx-auto">
        <Header title="বর্ডার তালিকা ও তথ্য" />
        <table className="w-full border-collapse border-2 border-slate-400">
            <thead>
                <tr className="bg-slate-800 text-white">
                    <th className={`${tableHeaderStyle} w-20`}>ক্রমিক নং</th>
                    <th className={`${tableHeaderStyle} text-left`}>বর্ডার নাম</th>
                    <th className={tableHeaderStyle}>মোবাইল নম্বর</th>
                    <th className={tableHeaderStyle}>রক্তের গ্রুপ</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                        <td className={tableCellStyle}>{idx + 1}</td>
                        <td className={`${tableCellStyle} text-left font-bold`}>{b.name}</td>
                        <td className={`${tableCellStyle} font-mono`}>{b.mobile || '-'}</td>
                        <td className={`${tableCellStyle} text-red-600 font-bold`}>{b.bloodGroup || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* 3. General Market List Report */}
      <div style={{ display: 'none' }} ref={generalMarketRef} className="bg-white p-10 w-[1000px] mx-auto">
        <Header title="সাধারণ বাজার তালিকা" />
        <table className="w-full border-collapse border-2 border-slate-400">
            <thead>
                <tr className="bg-blue-700 text-white">
                    <th className={`${tableHeaderStyle} w-20`}>ক্রমিক নং</th>
                    <th className={tableHeaderStyle}>বাজার করার তারিখ</th>
                    <th className={`${tableHeaderStyle} text-left`}>বাজারকারীর নাম</th>
                    <th className={`${tableHeaderStyle} text-right`}>টাকা</th>
                </tr>
            </thead>
            <tbody>
                {expenses.filter(e => e.type === 'market').map((e, idx) => (
                    <tr key={e.id} className="hover:bg-slate-50">
                        <td className={tableCellStyle}>{idx + 1}</td>
                        <td className={tableCellStyle}>{e.date}</td>
                        <td className={`${tableCellStyle} text-left font-semibold`}>{e.shopper}</td>
                        <td className={`${tableCellStyle} text-right font-bold`}>{e.amount}</td>
                    </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                    <td colSpan={3} className={`${tableCellStyle} text-right text-xl`}>মোট সাধারণ বাজার:</td>
                    <td className={`${tableCellStyle} text-right text-xl text-blue-800`}>{expenses.filter(e => e.type === 'market').reduce((a,b)=>a+b.amount,0)}</td>
                </tr>
            </tbody>
        </table>
      </div>

      {/* 4. Extra Market List Report */}
      <div style={{ display: 'none' }} ref={extraMarketRef} className="bg-white p-10 w-[1000px] mx-auto">
        <Header title="অতিরিক্ত বাজার তালিকা" />
        <table className="w-full border-collapse border-2 border-slate-400">
            <thead>
                <tr className="bg-red-700 text-white">
                    <th className={`${tableHeaderStyle} w-20`}>ক্রমিক নং</th>
                    <th className={tableHeaderStyle}>বাজার করার তারিখ</th>
                    <th className={`${tableHeaderStyle} text-left`}>অতিরিক্ত বাজার এর নাম</th>
                    <th className={`${tableHeaderStyle} text-right`}>টাকা</th>
                </tr>
            </thead>
            <tbody>
                {expenses.filter(e => e.type === 'extra').map((e, idx) => (
                    <tr key={e.id} className="hover:bg-slate-50">
                        <td className={tableCellStyle}>{idx + 1}</td>
                        <td className={tableCellStyle}>{e.date}</td>
                        <td className={`${tableCellStyle} text-left font-semibold`}>{e.shopper}</td>
                        <td className={`${tableCellStyle} text-right font-bold`}>{e.amount}</td>
                    </tr>
                ))}
                <tr className="bg-red-50 font-bold">
                    <td colSpan={3} className={`${tableCellStyle} text-right text-xl`}>মোট অতিরিক্ত বাজার:</td>
                    <td className={`${tableCellStyle} text-right text-xl text-red-800`}>{expenses.filter(e => e.type === 'extra').reduce((a,b)=>a+b.amount,0)}</td>
                </tr>
            </tbody>
        </table>
      </div>

      {/* 5. Daily Rice Sheet */}
      <div style={{ display: 'none' }} ref={dailyRiceRef} className="bg-white p-8 w-[1600px] mx-auto">
        <Header title="দৈনিক চালের হিসাব (বর্ডার ভিত্তিক)" />
        <table className="w-full border-collapse border-2 border-slate-400 text-[12px]">
            <thead>
                <tr className="bg-slate-800 text-white">
                    <th className={`${tableHeaderStyle} w-12`}>ক্রম</th>
                    <th className={`${tableHeaderStyle} text-left px-4 w-48`}>বর্ডার নাম</th>
                    {days.map(d => <th key={d} className="border border-slate-600 p-1 w-8 text-center">{d}</th>)}
                    <th className={`${tableHeaderStyle} w-20 bg-yellow-600`}>মোট</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                        <td className={tableCellStyle}>{idx + 1}</td>
                        <td className={`${tableCellStyle} font-bold text-left px-4`}>{b.name}</td>
                        {days.map(d => (
                            <td key={d} className={tableCellStyle}>
                                {b.dailyUsage[d]?.rice > 0 ? b.dailyUsage[d]?.rice : ''}
                            </td>
                        ))}
                        <td className={`${tableCellStyle} font-bold bg-yellow-50 text-base`}>{getTotalRice(b).toFixed(1)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* 6. Daily Meal Sheet */}
      <div style={{ display: 'none' }} ref={dailyMealRef} className="bg-white p-8 w-[1600px] mx-auto">
        <Header title="দৈনিক মিলের হিসাব (বর্ডার ভিত্তিক)" />
        <table className="w-full border-collapse border-2 border-slate-400 text-[12px]">
            <thead>
                <tr className="bg-slate-800 text-white">
                    <th className={`${tableHeaderStyle} w-12`}>ক্রম</th>
                    <th className={`${tableHeaderStyle} text-left px-4 w-48`}>বর্ডার নাম</th>
                    {days.map(d => <th key={d} className="border border-slate-600 p-1 w-8 text-center">{d}</th>)}
                    <th className={`${tableHeaderStyle} w-20 bg-blue-600`}>মোট</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                        <td className={tableCellStyle}>{idx + 1}</td>
                        <td className={`${tableCellStyle} font-bold text-left px-4`}>{b.name}</td>
                        {days.map(d => (
                            <td key={d} className={`${tableCellStyle} text-blue-900 font-bold`}>
                                {b.dailyUsage[d]?.meals > 0 ? b.dailyUsage[d]?.meals : ''}
                            </td>
                        ))}
                        <td className={`${tableCellStyle} font-bold bg-blue-50 text-base`}>{getTotalMeals(b)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

       {/* 7. Monthly Rice Sheet */}
       <div style={{ display: 'none' }} ref={monthlyRiceRef} className="bg-white p-10 w-[1100px] mx-auto">
        <Header title="মাসিক চালের হিসাব" />
        <table className="w-full border-collapse border-2 border-slate-400">
            <thead>
                <tr className="bg-slate-800 text-white">
                    <th className={tableHeaderStyle}>ক্রমিক নম্বর</th>
                    <th className={`${tableHeaderStyle} text-left`}>বর্ডার এর নাম</th>
                    <th className={`${tableHeaderStyle} bg-green-700`}>কত পট চাল জমা দিয়েছে</th>
                    <th className={`${tableHeaderStyle} bg-red-700`}>কত পট চাল খেয়েছে</th>
                    <th className={`${tableHeaderStyle} bg-blue-700`}>ম্যানেজার পাবে (পট)</th>
                    <th className={`${tableHeaderStyle} bg-emerald-700`}>ম্যানেজার দিবে (পট)</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => {
                    const stats = calculateBorderStats(b);
                    return (
                        <tr key={b.id} className="hover:bg-slate-50">
                            <td className={tableCellStyle}>{idx + 1}</td>
                            <td className={`${tableCellStyle} text-left font-bold`}>{b.name}</td>
                            <td className={`${tableCellStyle} font-mono bg-green-50 text-lg`}>{stats.totalRiceDeposit.toFixed(2)}</td>
                            <td className={`${tableCellStyle} font-mono bg-red-50 text-lg`}>{stats.riceEaten.toFixed(2)}</td>
                            <td className={`${tableCellStyle} font-bold font-mono text-red-600 text-lg`}>
                                {stats.riceBalance < 0 ? Math.abs(stats.riceBalance).toFixed(2) : '-'}
                            </td>
                            <td className={`${tableCellStyle} font-bold font-mono text-green-600 text-lg`}>
                                {stats.riceBalance >= 0 ? stats.riceBalance.toFixed(2) : '-'}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>

       {/* 8. Monthly Financial Sheet */}
       <div style={{ display: 'none' }} ref={monthlyCostRef} className="bg-white p-10 w-[1500px] mx-auto">
        <Header title="মাসিক মিল ও টাকার হিসাব" />
        <div className="text-center mb-6">
            <span className="bg-blue-50 text-blue-900 px-6 py-2 rounded-full border-2 border-blue-200 font-bold text-xl">
                মিল রেট: {manager.mealRate.toFixed(2)} টাকা
            </span>
        </div>
        <table className="w-full border-collapse border-2 border-slate-400">
            <thead>
                <tr className="bg-slate-900 text-white text-sm">
                    <th className={`${tableHeaderStyle} w-16`}>ক্রম নাম্বার</th>
                    <th className={`${tableHeaderStyle} text-left`}>বর্ডার এর নাম</th>
                    <th className={`${tableHeaderStyle} bg-emerald-700`}>কত টাকা জমা দিয়েছে</th>
                    <th className={tableHeaderStyle}>মোট মিল</th>
                    <th className={tableHeaderStyle}>মিল খরচ</th>
                    <th className={tableHeaderStyle}>অতিরিক্ত খরচ</th>
                    <th className={`${tableHeaderStyle} bg-rose-700`}>মোট খরচ</th>
                    <th className={`${tableHeaderStyle} bg-blue-800`}>ম্যানেজার পাবে</th>
                    <th className={`${tableHeaderStyle} bg-green-800`}>ম্যানেজার দিবে</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => {
                    const stats = calculateBorderStats(b);
                    const extraCost = b.extraCost + b.guestCost;
                    return (
                        <tr key={b.id} className="hover:bg-slate-50">
                            <td className={tableCellStyle}>{idx + 1}</td>
                            <td className={`${tableCellStyle} text-left font-bold text-lg`}>{b.name}</td>
                            <td className={`${tableCellStyle} font-mono bg-emerald-50 text-lg font-bold`}>{stats.totalMoneyDeposit.toFixed(0)}</td>
                            <td className={`${tableCellStyle} font-mono`}>{stats.mealsEaten}</td>
                            <td className={`${tableCellStyle} font-mono`}>{stats.mealCost.toFixed(0)}</td>
                            <td className={`${tableCellStyle} text-red-600 font-mono font-semibold`}>{extraCost.toFixed(0)}</td>
                            <td className={`${tableCellStyle} font-bold bg-rose-50 font-mono text-lg`}>{stats.totalCost.toFixed(0)}</td>
                            <td className={`${tableCellStyle} font-bold bg-blue-50 font-mono text-lg text-red-600`}>
                                {stats.moneyBalance < 0 ? Math.abs(stats.moneyBalance).toFixed(0) : '-'}
                            </td>
                            <td className={`${tableCellStyle} font-bold bg-green-50 font-mono text-lg text-green-600`}>
                                {stats.moneyBalance >= 0 ? stats.moneyBalance.toFixed(0) : '-'}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        <div className="mt-20 flex justify-between px-32">
            <div className="text-center">
                <div className="w-48 border-t-2 border-slate-800 mb-2"></div>
                <p className="font-bold text-slate-800">হিসাব রক্ষক</p>
            </div>
            <div className="text-center">
                <div className="w-48 border-t-2 border-slate-800 mb-2"></div>
                <p className="font-bold text-slate-800">ম্যানেজার স্বাক্ষর</p>
            </div>
        </div>
      </div>
      
      {/* 9. Bazaar Schedule Report */}
      <div style={{ display: 'none' }} ref={bazaarScheduleRef} className="bg-white p-10 w-[1000px] mx-auto">
        <Header title="বাজার লিস্ট (শিডিউল)" />
        <table className="w-full border-collapse border-2 border-slate-400">
            <thead>
                <tr className="bg-slate-800 text-white">
                    <th className={tableHeaderStyle}>বাজার এর তারিখ</th>
                    <th className={tableHeaderStyle}>বার</th>
                    <th className={`${tableHeaderStyle} text-left`}>বাজারকারী এর নাম</th>
                    <th className={tableHeaderStyle}>মন্তব্য বা সিগনেচার</th>
                </tr>
            </thead>
            <tbody>
                {sortedBazaarSchedule.length === 0 ? (
                    <tr><td colSpan={4} className="p-10 text-center text-slate-400 italic">কোন শিডিউল নেই</td></tr>
                ) : (
                    sortedBazaarSchedule.map((shift: BazaarShift) => (
                        <tr key={shift.date} className="hover:bg-slate-50">
                            <td className={`${tableCellStyle} font-bold text-xl`}>{shift.date}</td>
                            <td className={tableCellStyle}>{getDayName(shift.date)}</td>
                            <td className={`${tableCellStyle} text-left font-bold text-lg`}>
                                {shift.shoppers && shift.shoppers.length > 0 ? (
                                    shift.shoppers.map((s, i) => (
                                        <span key={s.id}>
                                            {s.name}
                                            {i < shift.shoppers.length - 1 ? ', ' : ''}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-300">-- ফাঁকা --</span>
                                )}
                            </td>
                            <td className={`${tableCellStyle} w-48`}></td>
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
