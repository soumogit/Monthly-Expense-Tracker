import type { UserIncome } from "../types/expense"

// Default income settings for each user
const DEFAULT_INCOMES: Record<string, Omit<UserIncome, "username" | "lastUpdated">> = {
  soumodip: {
    baseSalary: 50000,
    foodDeduction: 0,
    pf: 1800,
    totalIncome: 50000,
  },
  soumya: {
    baseSalary: 30000,
    foodDeduction: 600,
    pf: 0,
    totalIncome: 29400, // 30000 - 600
  },
}

export const getStoredIncome = (username: string): UserIncome => {
  if (typeof window === "undefined") {
    const defaultIncome = DEFAULT_INCOMES[username] || DEFAULT_INCOMES.soumya
    return {
      username,
      ...defaultIncome,
      lastUpdated: new Date().toISOString(),
    }
  }

  try {
    const storedIncome = localStorage.getItem(`income_${username}`)
    if (storedIncome) {
      return JSON.parse(storedIncome)
    }
  } catch (error) {
    console.error("Error loading stored income:", error)
  }

  // Return default income if not found
  const defaultIncome = DEFAULT_INCOMES[username] || DEFAULT_INCOMES.soumya
  return {
    username,
    ...defaultIncome,
    lastUpdated: new Date().toISOString(),
  }
}

export const storeIncome = (income: UserIncome): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(`income_${income.username}`, JSON.stringify(income))
}

export const calculateTotalIncome = (baseSalary: number, foodDeduction: number): number => {
  return baseSalary - foodDeduction
}
