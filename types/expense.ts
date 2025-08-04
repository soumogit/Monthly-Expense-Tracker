export interface DailyExpense {
  id: string
  date: string
  rent: number
  food: number
  groceries: number
  electricity: number
  recharge: number
  transport: number
  medical: number
  shopping: number
  others: number
  creditCardBill: number // New field
  investment: number
  emergencyFund: number
  notes: string
  total: number
  createdAt?: string
  updatedAt?: string
}

export interface UserIncome {
  username: string
  baseSalary: number
  foodDeduction: number
  pf: number
  totalIncome: number // baseSalary - foodDeduction
  lastUpdated: string
}

export interface ExpenseCategory {
  key: keyof Omit<DailyExpense, "id" | "date" | "notes" | "total" | "createdAt" | "updatedAt">
  label: string
  icon: string
  color: string
}

export interface MonthlyStats {
  totalIncome: number
  foodDeduction: number
  pf: number
  netIncome: number
  totalSpent: number
  totalInvestment: number
  totalEmergencyFund: number
  finalBalance: number
  savingsRate: number
}

export interface WeeklyData {
  week: string
  expenses: number
  investment: number
  emergencyFund: number
}
