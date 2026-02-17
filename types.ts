export interface Deposit {
  id: string;
  amount: number;
  date: string; // ISO date string YYYY-MM-DD
}

export interface RiceDeposit {
  id: string;
  amount: number; // in pots
  date: string;
  type: 'deposit' | 'previous_balance'; // Is it new deposit or leftover from last month?
}

// Daily entry for a border (Day 1-31)
export interface DailyUsage {
  [day: number]: {
    meals: number;
    rice: number;
  };
}

// New: System/Cook Daily Entry
export interface DayShift {
  meal: number;
  rice: number;
}

export interface SystemDailyEntry {
  morning: DayShift;
  lunch: DayShift;
  dinner: DayShift;
}

export interface SystemDaily {
  [day: number]: SystemDailyEntry;
}

// New: Bazaar Schedule Entry
export interface BazaarShopper {
  id: string;
  name: string;
}

export interface BazaarShift {
  date: number; // Day of the month
  shoppers: BazaarShopper[]; // Array of shoppers
}

export interface Border {
  id: string; // Firestore Doc ID
  name: string;
  mobile?: string;
  bloodGroup?: string; 
  managerId: string;
  deposits: Deposit[];
  riceDeposits: RiceDeposit[];
  dailyUsage: DailyUsage;
  extraCost: number; // Personal Extra / Fine
  guestCost: number; // New: Guest Meal Cost
  order?: number; // New: For shuffling/sorting
}

export interface RiceConfig {
  morningDiff: number; // e.g., -2 (Meals - 2)
  lunchDiff: number;
  dinnerDiff: number;
}

export interface AutoRiceRule {
  meal: number;
  rice: number;
}

export interface Manager {
  username: string; // ID
  password: string; 
  name: string;
  messName: string;
  year: number;
  month: string; 
  mobile: string;
  bloodGroup?: string; // New
  mealRate: number; 
  
  // Credentials created by manager for borders to login
  borderUsername?: string;
  borderPassword?: string;

  // New: System wide daily meal/rice tracking (Cook's View)
  systemDaily?: SystemDaily; 
  riceConfig?: RiceConfig; // New: Config for auto rice calc
  prevRiceBalance?: number; // New: Previous month rice balance
  
  // New: Bazaar Schedule
  bazaarSchedule?: { [day: number]: BazaarShift };

  // New: Auto Rice Calculation Feature
  autoRiceEnabled?: boolean;
  autoRiceRules?: AutoRiceRule[];
}

export interface Expense {
  id: string;
  date: string;
  shopper: string;
  amount: number;
  description?: string; 
  managerId: string;
  type: 'market' | 'extra'; 
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
