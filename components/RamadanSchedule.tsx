import React, { useState, useEffect } from 'react';
import { Moon, Sun, ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RamadanDay {
  ramadan: number;
  date: string;
  sehri: string;
  fajr: string;
  iftaar: string;
  fullDate: Date;
}

const RAMADAN_DATA: RamadanDay[] = [
  { ramadan: 1, date: "১৯ ফেব্রুয়ারি", sehri: "৫:১৫", fajr: "৫:১৯", iftaar: "৬:০১", fullDate: new Date(2026, 1, 19) },
  { ramadan: 2, date: "২০ ফেব্রুয়ারি", sehri: "৫:১৫", fajr: "৫:১৯", iftaar: "৬:০২", fullDate: new Date(2026, 1, 20) },
  { ramadan: 3, date: "২১ ফেব্রুয়ারি", sehri: "৫:১৪", fajr: "৫:১৮", iftaar: "৬:০২", fullDate: new Date(2026, 1, 21) },
  { ramadan: 4, date: "২২ ফেব্রুয়ারি", sehri: "৫:১৩", fajr: "৫:১৭", iftaar: "৬:০৩", fullDate: new Date(2026, 1, 22) },
  { ramadan: 5, date: "২৩ ফেব্রুয়ারি", sehri: "৫:১২", fajr: "৫:১৭", iftaar: "৬:০৩", fullDate: new Date(2026, 1, 23) },
  { ramadan: 6, date: "২৪ ফেব্রুয়ারি", sehri: "৫:১২", fajr: "৫:১৬", iftaar: "৬:০৪", fullDate: new Date(2026, 1, 24) },
  { ramadan: 7, date: "২৫ ফেব্রুয়ারি", sehri: "৫:১১", fajr: "৫:১৫", iftaar: "৬:০৪", fullDate: new Date(2026, 1, 25) },
  { ramadan: 8, date: "২৬ ফেব্রুয়ারি", sehri: "৫:১০", fajr: "৫:১৪", iftaar: "৬:০৫", fullDate: new Date(2026, 1, 26) },
  { ramadan: 9, date: "২৭ ফেব্রুয়ারি", sehri: "৫:০৯", fajr: "৫:১৩", iftaar: "৬:০৬", fullDate: new Date(2026, 1, 27) },
  { ramadan: 10, date: "২৮ ফেব্রুয়ারি", sehri: "৫:০৮", fajr: "৫:১৩", iftaar: "৬:০৬", fullDate: new Date(2026, 1, 28) },
  { ramadan: 11, date: "০১ মার্চ", sehri: "৫:০৮", fajr: "৫:১২", iftaar: "৬:০৭", fullDate: new Date(2026, 2, 1) },
  { ramadan: 12, date: "০২ মার্চ", sehri: "৫:০৭", fajr: "৫:১১", iftaar: "৬:০৭", fullDate: new Date(2026, 2, 2) },
  { ramadan: 13, date: "০৩ মার্চ", sehri: "৫:০৬", fajr: "৫:১০", iftaar: "৬:০৮", fullDate: new Date(2026, 2, 3) },
  { ramadan: 14, date: "০৪ মার্চ", sehri: "৫:০৫", fajr: "৫:০৯", iftaar: "৬:০৮", fullDate: new Date(2026, 2, 4) },
  { ramadan: 15, date: "০৫ মার্চ", sehri: "৫:০৪", fajr: "৫:০৮", iftaar: "৬:০৯", fullDate: new Date(2026, 2, 5) },
  { ramadan: 16, date: "০৬ মার্চ", sehri: "৫:০৩", fajr: "৫:০৭", iftaar: "৬:০৯", fullDate: new Date(2026, 2, 6) },
  { ramadan: 17, date: "০৭ মার্চ", sehri: "৫:০২", fajr: "৫:০৬", iftaar: "৬:১০", fullDate: new Date(2026, 2, 7) },
  { ramadan: 18, date: "০৮ মার্চ", sehri: "৫:০১", fajr: "৫:০৫", iftaar: "৬:১০", fullDate: new Date(2026, 2, 8) },
  { ramadan: 19, date: "০৯ মার্চ", sehri: "৫:০০", fajr: "৫:০৪", iftaar: "৬:১১", fullDate: new Date(2026, 2, 9) },
  { ramadan: 20, date: "১০ মার্চ", sehri: "৪:৫৯", fajr: "৫:০৩", iftaar: "৬:১১", fullDate: new Date(2026, 2, 10) },
  { ramadan: 21, date: "১১ মার্চ", sehri: "৪:৫৮", fajr: "৫:০২", iftaar: "৬:১১", fullDate: new Date(2026, 2, 11) },
  { ramadan: 22, date: "১২ মার্চ", sehri: "৪:৫৭", fajr: "৫:০১", iftaar: "৬:১২", fullDate: new Date(2026, 2, 12) },
  { ramadan: 23, date: "১৩ মার্চ", sehri: "৪:৫৬", fajr: "৫:০০", iftaar: "৬:১২", fullDate: new Date(2026, 2, 13) },
  { ramadan: 24, date: "১৪ মার্চ", sehri: "৪:৫৫", fajr: "৪:৫৯", iftaar: "৬:১৩", fullDate: new Date(2026, 2, 14) },
  { ramadan: 25, date: "১৫ মার্চ", sehri: "৪:৫৪", fajr: "৪:৫৮", iftaar: "৬:১৩", fullDate: new Date(2026, 2, 15) },
  { ramadan: 26, date: "১৬ মার্চ", sehri: "৪:৫৩", fajr: "৪:৫৭", iftaar: "৬:১৪", fullDate: new Date(2026, 2, 16) },
  { ramadan: 27, date: "১৭ মার্চ", sehri: "৪:৫২", fajr: "৪:৫৬", iftaar: "৬:১৪", fullDate: new Date(2026, 2, 17) },
  { ramadan: 28, date: "১৮ মার্চ", sehri: "৪:৫১", fajr: "৪:৫৫", iftaar: "৬:১৫", fullDate: new Date(2026, 2, 18) },
  { ramadan: 29, date: "১৯ মার্চ", sehri: "৪:৫০", fajr: "৪:৫৪", iftaar: "৬:১৫", fullDate: new Date(2026, 2, 19) },
  { ramadan: 30, date: "২০ মার্চ", sehri: "৪:৪৯", fajr: "৪:৫৩", iftaar: "৬:১৫", fullDate: new Date(2026, 2, 20) },
];

const EID_DATE = new Date(2026, 2, 21); // March 21, 2026

const toBengaliDigits = (num: number | string) => {
  const bengaliDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return num.toString().split('').map(d => bengaliDigits[d] || d).join('');
};

const RamadanSchedule: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRamadan, setIsRamadan] = useState<boolean>(false);
  const [isEid, setIsEid] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check for Eid
    const eidDay = new Date(EID_DATE);
    eidDay.setHours(0, 0, 0, 0);
    if (today.getTime() === eidDay.getTime()) {
      setIsEid(true);
      triggerConfetti();
      return;
    }

    // Check for Ramadan
    const firstDay = new Date(RAMADAN_DATA[0].fullDate);
    firstDay.setHours(0, 0, 0, 0);
    const lastDay = new Date(RAMADAN_DATA[RAMADAN_DATA.length - 1].fullDate);
    lastDay.setHours(0, 0, 0, 0);

    if (today >= firstDay && today <= lastDay) {
      setIsRamadan(true);
      const index = RAMADAN_DATA.findIndex(day => {
        const d = new Date(day.fullDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });
      if (index !== -1) setCurrentIndex(index);
    }
  }, []);

  const triggerConfetti = () => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : RAMADAN_DATA.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < RAMADAN_DATA.length - 1 ? prev + 1 : 0));
  };

  if (isEid) {
    return (
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 shadow-2xl text-white text-center relative overflow-hidden mb-6 animate-fade-in">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 animate-bounce"><PartyPopper size={40} /></div>
          <div className="absolute bottom-10 right-10 animate-bounce delay-700"><PartyPopper size={40} /></div>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 font-baloo animate-pulse">ঈদ মোবারক!</h1>
        <div className="bg-white/20 backdrop-blur-md py-4 px-6 rounded-2xl border border-white/30 inline-block mb-4">
          <p className="text-xl md:text-2xl font-bold">পবিত্র ঈদ-উল-ফিতরের শুভেচ্ছা - শরিফুল</p>
        </div>
        <p className="text-sm opacity-80">আল্লাহ আপনার সকল নেক আমল কবুল করুন।</p>
      </div>
    );
  }

  if (!isRamadan) return null;

  const currentDay = RAMADAN_DATA[currentIndex];

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden mb-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20px] right-[-20px] opacity-10">
        <Moon size={150} />
      </div>
      
      <div className="relative z-10">
        {/* Marquee Section */}
        <div className="bg-black/20 backdrop-blur-sm py-2 px-4 rounded-lg mb-6 overflow-hidden border border-white/10">
          <div className="whitespace-nowrap animate-marquee flex items-center gap-4">
            <span className="font-bold text-yellow-300">পবিত্র মাহে রমজান এর শুভেচ্ছা - শরিফুল</span>
            <span className="opacity-50">•</span>
            <span className="font-bold text-yellow-300">পবিত্র মাহে রমজান এর শুভেচ্ছা - শরিফুল</span>
            <span className="opacity-50">•</span>
            <span className="font-bold text-yellow-300">পবিত্র মাহে রমজান এর শুভেচ্ছা - শরিফুল</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md">
            <CalendarIcon size={18} />
            <span className="text-sm font-bold">{currentDay.date}</span>
          </div>
          <div className="bg-yellow-400 text-emerald-900 px-4 py-1.5 rounded-full font-bold shadow-lg">
            {toBengaliDigits(currentDay.ramadan)} তম রোজা
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="flex flex-col items-center gap-2">
              <Moon className="text-yellow-200" size={24} />
              <span className="text-xs font-medium opacity-80">সেহরির শেষ</span>
              <span className="text-xl font-bold font-baloo">{toBengaliDigits(currentDay.sehri)}</span>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="flex flex-col items-center gap-2">
              <Sun className="text-orange-300" size={24} />
              <span className="text-xs font-medium opacity-80">ফজরের আযান</span>
              <span className="text-xl font-bold font-baloo">{toBengaliDigits(currentDay.fajr)}</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="flex flex-col items-center gap-2">
              <Clock className="text-sky-300" size={24} />
              <span className="text-xs font-medium opacity-80">ইফতারের সময়</span>
              <span className="text-xl font-bold font-baloo">{toBengaliDigits(currentDay.iftaar)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-8 mt-6">
          <button 
            onClick={handlePrev}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all border border-white/30"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-xs font-bold tracking-widest uppercase opacity-70">
            রমজান সময়সূচী ২০২৬
          </div>
          <button 
            onClick={handleNext}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all border border-white/30"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RamadanSchedule;
