import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  writeBatch
} from "firebase/firestore";
import { FIREBASE_CONFIG } from "../constants";
import { Manager, Border, Expense } from "../types";

const app = initializeApp(FIREBASE_CONFIG);
export const db = getFirestore(app);

// Export Firestore functions for direct use where needed
export { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  writeBatch 
};

// --- Auth / Manager ---

export const registerManager = async (managerData: Manager) => {
  // Check if username exists
  const docRef = doc(db, "managers", managerData.username);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    throw new Error("Username already exists");
  }

  await setDoc(docRef, managerData);
  return managerData;
};

export const loginManager = async (username: string, password: string): Promise<Manager | null> => {
  const docRef = doc(db, "managers", username);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data() as Manager;
    if (data.password === password) {
      return data;
    }
  }
  return null;
};

export const updateManager = async (username: string, data: Partial<Manager>) => {
  const docRef = doc(db, "managers", username);
  await updateDoc(docRef, data);
};

export const deleteSystem = async (username: string) => {
  // 1. Delete all expenses
  const expenseQ = query(collection(db, "expenses"), where("managerId", "==", username));
  const expenseSnaps = await getDocs(expenseQ);
  const batch1 = writeBatch(db);
  expenseSnaps.forEach((doc) => batch1.delete(doc.ref));
  await batch1.commit();

  // 2. Delete all borders
  const borderQ = query(collection(db, "borders"), where("managerId", "==", username));
  const borderSnaps = await getDocs(borderQ);
  const batch2 = writeBatch(db);
  borderSnaps.forEach((doc) => batch2.delete(doc.ref));
  await batch2.commit();

  // 3. Delete manager
  await deleteDoc(doc(db, "managers", username));
};

// --- Borders ---

export const addBorder = async (managerId: string, name: string) => {
  const newBorder: Omit<Border, 'id'> = {
    name,
    managerId,
    deposits: [],
    riceDeposits: [],
    dailyUsage: {},
    extraCost: 0,
    guestCost: 0
  };
  const docRef = await addDoc(collection(db, "borders"), newBorder);
  return { id: docRef.id, ...newBorder };
};

export const getBorders = async (managerId: string): Promise<Border[]> => {
  const q = query(collection(db, "borders"), where("managerId", "==", managerId));
  const querySnapshot = await getDocs(q);
  const borders: Border[] = [];
  querySnapshot.forEach((doc) => {
    // Fill default guestCost if missing in old data
    const data = doc.data();
    borders.push({ id: doc.id, guestCost: 0, ...data } as Border);
  });
  // Sort by 'order' field if available, otherwise fallback to name or insertion
  return borders.sort((a,b) => (a.order || 0) - (b.order || 0));
};

export const updateBorder = async (borderId: string, data: Partial<Border>) => {
  const docRef = doc(db, "borders", borderId);
  await updateDoc(docRef, data);
};

export const deleteBorder = async (borderId: string) => {
  await deleteDoc(doc(db, "borders", borderId));
};

// --- Expenses ---

export const addExpense = async (expense: Omit<Expense, 'id'>) => {
  const docRef = await addDoc(collection(db, "expenses"), expense);
  return { id: docRef.id, ...expense };
};

export const getExpenses = async (managerId: string): Promise<Expense[]> => {
  const q = query(collection(db, "expenses"), where("managerId", "==", managerId));
  const querySnapshot = await getDocs(q);
  const expenses: Expense[] = [];
  querySnapshot.forEach((doc) => {
    expenses.push({ id: doc.id, ...doc.data() } as Expense);
  });
  return expenses.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const deleteExpense = async (expenseId: string) => {
  await deleteDoc(doc(db, "expenses", expenseId));
};

export const updateExpense = async (expenseId: string, data: Partial<Expense>) => {
  await updateDoc(doc(db, "expenses", expenseId), data);
};