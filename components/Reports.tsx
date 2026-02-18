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
    const originalStyle = element.style.cssText;
    
    // Ensure it's visible and has proper layout for capture
    element.style.display = 'block';
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';
    element.style.zIndex = '-9999';
    element.style.backgroundColor = '#ffffff';
    
    try {
      const canvas = await html2canvas(element, { 
          scale: 3, 
          useCORS: true, 
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
          y: 0, // Ensure capture starts from the very top
          scrollY: 0
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
          
          const imgProps = pdf.getImageProperties(imgData);
          const ratio = imgProps.width / imgProps.height;
          
          let renderWidth = pdfWidth - 10; // 5mm margin each side
          let renderHeight = renderWidth / ratio;
          
          if (renderHeight > pdfHeight - 10) {
            renderHeight = pdfHeight - 10;
            renderWidth = renderHeight * ratio;
          }
          
          const x = (pdfWidth - renderWidth) / 2;
          const y = 5; // Small top margin
          
          pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight, undefined, 'FAST');
          pdf.save(`${filename}.pdf`);
      }
    } catch (err) {
      console.error(err);
      alert("রিপোর্ট জেনারেট করতে সমস্যা হয়েছে।");
    } finally {
       element.style.cssText = originalStyle;
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
    <div className="text-center mb-8 pt-4 border-b-4 border-double border-slate-400 pb-6">
        <h1 className="text-5xl font-black uppercase text-blue-900 mb-4 leading-tight">{manager.messName}</h1>
        <div className="flex justify-center items-center gap-8 text-lg font-bold text-slate-700 mb-6">
            <span className="bg-slate-100 px-4 py-2 rounded shadow-sm border border-slate-200">ম্যানেজার: {manager.name}</span>
            <span className="bg-slate-100 px-4 py-2 rounded shadow-sm border border-slate-200">মোবাইল: {manager.mobile}</span>
            <span className="bg-slate-100 px-4 py-2 rounded shadow-sm border border-slate-200">মাস: {manager.month} {manager.year}</span>
        </div>
        <div className="inline-block bg-blue-900 text-white px-12 py-3 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold tracking-wide">{title}</h2>
        </div>
    </div>
  );

  const tableHeaderClass = "bg-slate-800 text-white border-2 border-slate-600 p-4 text-center font-bold align-middle text-lg";
  const tableCellClass = "border-2 border-slate-300 p-3 text-center align-middle text-slate-800 font-medium";

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

      {/* --- HIDDEN PRINT AREAS --- */}
      
      {/* 1. System Daily Report */}
      <div style={{ display: 'none' }} ref={systemDailyRef} className="bg-white p-12 w-[1400px] mx-auto">
        <Header title="সিস্টেম ডেইলি এন্ট্রি (বাবুর্চি হিসাব)" />
        <table className="w-full border-collapse border-2 border-slate-800">
            <thead>
                <tr>
                    <th rowSpan={2} className={tableHeaderClass}>তারিখ</th>
                    <th colSpan={2} className={`${tableHeaderClass} bg-orange-700`}>সকাল</th>
                    <th colSpan={2} className={`${tableHeaderClass} bg-blue-700`}>দুপুর</th>
                    <th colSpan={2} className={`${tableHeaderClass} bg-purple-700`}>রাত</th>
                    <th colSpan={2} className={`${tableHeaderClass} bg-emerald-700`}>মোট</th>
                </tr>
                <tr>
                    <th className={tableHeaderClass}>মিল</th><th className={tableHeaderClass}>চাল</th>
                    <th className={tableHeaderClass}>মিল</th><th className={tableHeaderClass}>চাল</th>
                    <th className={tableHeaderClass}>মিল</th><th className={tableHeaderClass}>চাল</th>
                    <th className={tableHeaderClass}>মিল</th><th className={tableHeaderClass}>চাল</th>
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
                            <td className={`${tableCellClass} font-bold bg-slate-100`}>{d}</td>
                            <td className={tableCellClass}>{dayData?.morning?.meal || '-'}</td><td className={`${tableCellClass} text-orange-700 font-bold`}>{dayData?.morning?.rice || '-'}</td>
                            <td className={tableCellClass}>{dayData?.lunch?.meal || '-'}</td><td className={`${tableCellClass} text-blue-700 font-bold`}>{dayData?.lunch?.rice || '-'}</td>
                            <td className={tableCellClass}>{dayData?.dinner?.meal || '-'}</td><td className={`${tableCellClass} text-purple-700 font-bold`}>{dayData?.dinner?.rice || '-'}</td>
                            <td className={`${tableCellClass} bg-emerald-50 font-bold`}>{dM}</td><td className={`${tableCellClass} bg-emerald-100 font-bold text-emerald-800`}>{dR.toFixed(1)}</td>
                        </tr>
                    )
                })}
                <tr className="bg-slate-200 font-bold">
                    <td className={tableCellClass}>সর্বমোট</td>
                    <td colSpan={6} className={`${tableCellClass} text-right pr-4`}>মাসের মোট:</td>
                    <td className={tableCellClass}>{sysTotals.tMeals}</td>
                    <td className={tableCellClass}>{sysTotals.tRice.toFixed(1)}</td>
                </tr>
            </tbody>
        </table>
        <div className="mt-10 p-6 bg-slate-50 border-2 border-slate-300 rounded-xl grid grid-cols-4 gap-6 text-center font-bold text-lg">
            <div className="p-3 border-r-2 border-slate-200">গত মাসের জমা চাল: <span className="text-blue-700">{manager.prevRiceBalance || 0}</span></div>
            <div className="p-3 border-r-2 border-slate-200">মোট জমা চাল: <span className="text-green-700">{(manager.prevRiceBalance || 0) + borders.reduce((sum, b) => sum + b.riceDeposits.reduce((s, d) => s + (d.amount || 0), 0), 0)}</span></div>
            <div className="p-3 border-r-2 border-slate-200">মোট খাওয়া চাল: <span className="text-red-700">{sysTotals.tRice.toFixed(1)}</span></div>
            <div className="p-3">অবশিষ্ট চাল: <span className="text-purple-700">{((manager.prevRiceBalance || 0) + borders.reduce((sum, b) => sum + b.riceDeposits.reduce((s, d) => s + (d.amount || 0), 0), 0) - sysTotals.tRice).toFixed(1)}</span></div>
        </div>
      </div>

      {/* 2. Border List Report */}
      <div style={{ display: 'none' }} ref={borderListRef} className="bg-white p-12 w-[1000px] mx-auto">
        <Header title="বর্ডার তালিকা ও তথ্য" />
        <table className="w-full border-collapse border-2 border-slate-800">
            <thead>
                <tr>
                    <th className={`${tableHeaderClass} w-24`}>ক্রমিক নং</th>
                    <th className={`${tableHeaderClass} text-left pl-8`}>বর্ডার নাম</th>
                    <th className={tableHeaderClass}>মোবাইল নাম্বার</th>
                    <th className={tableHeaderClass}>রক্তের গ্রুপ</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                        <td className={tableCellClass}>{idx + 1}</td>
                        <td className={`${tableCellClass} text-left pl-8 font-bold text-lg`}>{b.name}</td>
                        <td className={`${tableCellClass} font-mono`}>{b.mobile || '-'}</td>
                        <td className={`${tableCellClass} text-red-600 font-bold`}>{b.bloodGroup || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* 3. General Market List Report */}
      <div style={{ display: 'none' }} ref={generalMarketRef} className="bg-white p-12 w-[1000px] mx-auto">
        <Header title="সাধারণ বাজার তালিকা" />
        <table className="w-full border-collapse border-2 border-slate-800">
            <thead>
                <tr>
                    <th className={`${tableHeaderClass} w-24`}>ক্রমিক</th>
                    <th className={tableHeaderClass}>বাজার করার তারিখ</th>
                    <th className={`${tableHeaderClass} text-left pl-8`}>বাজারকারীর নাম</th>
                    <th className={`${tableHeaderClass} text-right pr-8`}>বাজারের টাকা</th>
                </tr>
            </thead>
            <tbody>
                {expenses.filter(e => e.type === 'market').map((e, idx) => (
                    <tr key={e.id} className="hover:bg-slate-50">
                        <td className={tableCellClass}>{idx + 1}</td>
                        <td className={tableCellClass}>{e.date}</td>
                        <td className={`${tableCellClass} text-left pl-8 font-semibold`}>{e.shopper}</td>
                        <td className={`${tableCellClass} text-right pr-8 font-bold`}>{e.amount}</td>
                    </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                    <td colSpan={3} className={`${tableCellClass} text-right pr-8 text-2xl`}>মোট সাধারণ বাজার:</td>
                    <td className={`${tableCellClass} text-right pr-8 text-2xl text-blue-800`}>{expenses.filter(e => e.type === 'market').reduce((a,b)=>a+b.amount,0)}</td>
                </tr>
            </tbody>
        </table>
      </div>

      {/* 4. Extra Market List Report */}
      <div style={{ display: 'none' }} ref={extraMarketRef} className="bg-white p-12 w-[1000px] mx-auto">
        <Header title="অতিরিক্ত বাজার তালিকা" />
        <table className="w-full border-collapse border-2 border-slate-800">
            <thead>
                <tr>
                    <th className={`${tableHeaderClass} w-24`}>ক্রমিক</th>
                    <th className={tableHeaderClass}>বাজার করার তারিখ</th>
                    <th className={`${tableHeaderClass} text-left pl-8`}>অতিরিক্ত বাজার এর নাম</th>
                    <th className={`${tableHeaderClass} text-right pr-8`}>বাজারের টাকা</th>
                </tr>
            </thead>
            <tbody>
                {expenses.filter(e => e.type === 'extra').map((e, idx) => (
                    <tr key={e.id} className="hover:bg-slate-50">
                        <td className={tableCellClass}>{idx + 1}</td>
                        <td className={tableCellClass}>{e.date}</td>
                        <td className={`${tableCellClass} text-left pl-8 font-semibold`}>{e.shopper}</td>
                        <td className={`${tableCellClass} text-right pr-8 font-bold`}>{e.amount}</td>
                    </tr>
                ))}
                <tr className="bg-red-50 font-bold">
                    <td colSpan={3} className={`${tableCellClass} text-right pr-8 text-2xl`}>মোট অতিরিক্ত বাজার:</td>
                    <td className={`${tableCellClass} text-right pr-8 text-2xl text-red-800`}>{expenses.filter(e => e.type === 'extra').reduce((a,b)=>a+b.amount,0)}</td>
                </tr>
            </tbody>
        </table>
      </div>

      {/* 5. Daily Rice Sheet */}
      <div style={{ display: 'none' }} ref={dailyRiceRef} className="bg-white p-10 w-[1600px] mx-auto">
        <Header title="দৈনিক চালের হিসাব (বর্ডার ভিত্তিক)" />
        <table className="w-full border-collapse border-2 border-slate-800">
            <thead>
                <tr className="bg-slate-800 text-white">
                    <th className={`${tableHeaderClass} w-16`}>ক্রম</th>
                    <th className={`${tableHeaderClass} text-left pl-4 w-56`}>বর্ডার নাম</th>
                    {days.map(d => <th key={d} className={`${tableHeaderClass} w-12 p-1`}>{d}</th>)}
                    <th className={`${tableHeaderClass} w-24 bg-yellow-700`}>মোট</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                        <td className={tableCellClass}>{idx + 1}</td>
                        <td className={`${tableCellClass} text-left pl-4 font-bold`}>{b.name}</td>
                        {days.map(d => (
                            <td key={d} className={tableCellClass}>
                                {b.dailyUsage[d]?.rice > 0 ? b.dailyUsage[d]?.rice : ''}
                            </td>
                        ))}
                        <td className={`${tableCellClass} font-bold bg-yellow-50 text-yellow-900`}>{getTotalRice(b).toFixed(1)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* 6. Daily Meal Sheet */}
      <div style={{ display: 'none' }} ref={dailyMealRef} className="bg-white p-10 w-[1600px] mx-auto">
        <Header title="দৈনিক মিলের হিসাব (বর্ডার ভিত্তিক)" />
        <table className="w-full border-collapse border-2 border-slate-800">
            <thead>
                <tr className="bg-slate-800 text-white">
                    <th className={`${tableHeaderClass} w-16`}>ক্রম</th>
                    <th className={`${tableHeaderClass} text-left pl-4 w-56`}>বর্ডার নাম</th>
                    {days.map(d => <th key={d} className={`${tableHeaderClass} w-12 p-1`}>{d}</th>)}
                    <th className={`${tableHeaderClass} w-24 bg-blue-700`}>মোট</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                        <td className={tableCellClass}>{idx + 1}</td>
                        <td className={`${tableCellClass} text-left pl-4 font-bold`}>{b.name}</td>
                        {days.map(d => (
                            <td key={d} className={`${tableCellClass} text-blue-900 font-bold`}>
                                {b.dailyUsage[d]?.meals > 0 ? b.dailyUsage[d]?.meals : ''}
                            </td>
                        ))}
                        <td className={`${tableCellClass} font-bold bg-blue-50 text-blue-900`}>{getTotalMeals(b)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

       {/* 7. Monthly Rice Sheet */}
       <div style={{ display: 'none' }} ref={monthlyRiceRef} className="bg-white p-12 w-[1100px] mx-auto">
        <Header title="মাসিক চালের হিসাব" />
        <table className="w-full border-collapse border-2 border-slate-800">
            <thead>
                <tr>
                    <th className={`${tableHeaderClass} w-20`}>ক্রমিক</th>
                    <th className={`${tableHeaderClass} text-left pl-8`}>বর্ডার নাম</th>
                    <th className={`${tableHeaderClass} bg-green-700`}>চাল জমা (পট)</th>
                    <th className={`${tableHeaderClass} bg-red-700`}>চাল খাওয়া (পট)</th>
                    <th className={`${tableHeaderClass} bg-blue-700`}>ম্যানেজার পাবে</th>
                    <th className={`${tableHeaderClass} bg-emerald-700`}>ম্যানেজার দিবে</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => {
                    const stats = calculateBorderStats(b);
                    return (
                        <tr key={b.id} className="hover:bg-slate-50">
                            <td className={tableCellClass}>{idx + 1}</td>
                            <td className={`${tableCellClass} text-left pl-8 font-bold text-lg`}>{b.name}</td>
                            <td className={`${tableCellClass} font-mono bg-green-50 font-bold text-lg`}>{stats.totalRiceDeposit.toFixed(2)}</td>
                            <td className={`${tableCellClass} font-mono bg-red-50 font-bold text-lg`}>{stats.riceEaten.toFixed(2)}</td>
                            <td className={`${tableCellClass} font-bold text-red-600 text-lg`}>
                                {stats.riceBalance < 0 ? Math.abs(stats.riceBalance).toFixed(2) : '-'}
                            </td>
                            <td className={`${tableCellClass} font-bold text-green-600 text-lg`}>
                                {stats.riceBalance >= 0 ? stats.riceBalance.toFixed(2) : '-'}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>

       {/* 8. Monthly Financial Sheet */}
       <div style={{ display: 'none' }} ref={monthlyCostRef} className="bg-white p-12 w-[1500px] mx-auto">
        <Header title="মাসিক মিল ও টাকার হিসাব" />
        <div className="text-center mb-8"><span className="bg-blue-50 text-blue-900 border-2 border-blue-200 px-8 py-3 rounded-full font-black text-2xl shadow-sm">মিল রেট: {manager.mealRate.toFixed(2)} টাকা</span></div>
        <table className="w-full border-collapse border-2 border-slate-800">
            <thead>
                <tr>
                    <th className={`${tableHeaderClass} w-20`}>ক্রম</th>
                    <th className={`${tableHeaderClass} text-left pl-6`}>বর্ডার নাম</th>
                    <th className={`${tableHeaderClass} bg-emerald-700`}>টাকা জমা</th>
                    <th className={tableHeaderClass}>মোট মিল</th>
                    <th className={tableHeaderClass}>মিল খরচ</th>
                    <th className={tableHeaderClass}>অতিরিক্ত খরচ</th>
                    <th className={`${tableHeaderClass} bg-rose-700`}>মোট খরচ</th>
                    <th className={`${tableHeaderClass} bg-blue-900`}>ম্যানেজার পাবে</th>
                    <th className={`${tableHeaderClass} bg-green-900`}>ম্যানেজার দিবে</th>
                </tr>
            </thead>
            <tbody>
                {borders.map((b, idx) => {
                    const stats = calculateBorderStats(b);
                    const totalExtraDisplay = b.extraCost + b.guestCost;
                    return (
                        <tr key={b.id} className="hover:bg-slate-50">
                            <td className={tableCellClass}>{idx + 1}</td>
                            <td className={`${tableCellClass} text-left pl-6 font-bold text-xl`}>{b.name}</td>
                            <td className={`${tableCellClass} font-mono bg-emerald-50 font-bold text-xl`}>{stats.totalMoneyDeposit.toFixed(0)}</td>
                            <td className={`${tableCellClass} font-mono text-lg`}>{stats.mealsEaten}</td>
                            <td className={`${tableCellClass} font-mono text-lg`}>{stats.mealCost.toFixed(0)}</td>
                            <td className={`${tableCellClass} text-red-600 font-mono font-bold text-lg`}>{totalExtraDisplay.toFixed(0)}</td>
                            <td className={`${tableCellClass} font-bold bg-rose-50 font-mono text-xl`}>{stats.totalCost.toFixed(0)}</td>
                            <td className={`${tableCellClass} font-bold bg-blue-50 font-mono text-xl text-red-600`}>
                                {stats.moneyBalance < 0 ? Math.abs(stats.moneyBalance).toFixed(0) : '-'}
                            </td>
                            <td className={`${tableCellClass} font-bold bg-green-50 font-mono text-xl text-green-600`}>
                                {stats.moneyBalance >= 0 ? stats.moneyBalance.toFixed(0) : '-'}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        <div className="mt-24 flex justify-between px-40">
            <div className="text-center">
                <div className="w-56 border-t-4 border-slate-800 pt-3 font-black text-xl">হিসাব রক্ষক</div>
            </div>
            <div className="text-center">
                <div className="w-56 border-t-4 border-slate-800 pt-3 font-black text-xl">ম্যানেজার স্বাক্ষর</div>
            </div>
        </div>
      </div>
      
      {/* 9. Bazaar Schedule Report */}
      <div style={{ display: 'none' }} ref={bazaarScheduleRef} className="bg-white p-12 w-[1100px] mx-auto">
        <Header title="বাজার লিস্ট (শিডিউল)" />
        <table className="w-full border-collapse border-2 border-slate-800">
            <thead>
                <tr>
                    <th className={tableHeaderClass}>বাজার এর তারিখ</th>
                    <th className={tableHeaderClass}>বার</th>
                    <th className={`${tableHeaderClass} text-left pl-8`}>বাজারকারী এর নাম</th>
                    <th className={tableHeaderClass}>মন্তব্য বা সিগনেচার</th>
                </tr>
            </thead>
            <tbody>
                {sortedBazaarSchedule.length === 0 ? (
                    <tr><td colSpan={4} className={`${tableCellClass} p-16 text-slate-400 italic text-xl`}>কোন শিডিউল নেই</td></tr>
                ) : (
                    sortedBazaarSchedule.map((shift: BazaarShift) => (
                        <tr key={shift.date} className="hover:bg-slate-50">
                            <td className={`${tableCellClass} font-black text-2xl`}>{shift.date}</td>
                            <td className={`${tableCellClass} text-xl`}>{getDayName(shift.date)}</td>
                            <td className={`${tableCellClass} text-left pl-8 font-bold text-xl`}>
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
                            <td className={`${tableCellClass} w-56`}></td>
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
