import type { DailyExpense, MonthlyStats, WeeklyData, UserIncome } from "../types/expense"
import { startOfWeek, format, isValid } from "date-fns"

export const calculateDailyTotal = (
  expense: Omit<DailyExpense, "id" | "date" | "notes" | "total" | "createdAt" | "updatedAt">,
): number => {
  return (
    expense.rent +
    expense.food +
    expense.groceries +
    expense.electricity +
    expense.recharge +
    expense.transport +
    expense.medical +
    expense.shopping +
    expense.creditCardBill + // Include credit card bill
    expense.others +
    expense.investment +
    expense.emergencyFund
  )
}

export const calculateMonthlyStats = (expenses: DailyExpense[], income: UserIncome): MonthlyStats => {
  const totals = expenses.reduce(
    (acc, expense) => ({
      totalSpent: acc.totalSpent + (expense.total - expense.investment - expense.emergencyFund),
      totalInvestment: acc.totalInvestment + expense.investment,
      totalEmergencyFund: acc.totalEmergencyFund + expense.emergencyFund,
    }),
    { totalSpent: 0, totalInvestment: 0, totalEmergencyFund: 0 },
  )

  const finalBalance = income.totalIncome - totals.totalSpent - totals.totalInvestment - totals.totalEmergencyFund
  const savingsRate = income.totalIncome > 0 ? (finalBalance / income.totalIncome) * 100 : 0

  return {
    totalIncome: income.totalIncome,
    foodDeduction: income.foodDeduction,
    pf: income.pf,
    netIncome: income.totalIncome,
    ...totals,
    finalBalance,
    savingsRate,
  }
}

export const getCategoryData = (expenses: DailyExpense[]) => {
  const categories = [
    "rent",
    "food",
    "groceries",
    "electricity",
    "recharge",
    "transport",
    "medical",
    "shopping",
    "creditCardBill", // Include credit card bill
    "others",
  ]

  return categories
    .map((category) => ({
      name: category === "creditCardBill" ? "Credit Card" : category.charAt(0).toUpperCase() + category.slice(1),
      value: expenses.reduce((sum, expense) => (sum + expense[category as keyof DailyExpense]) as number, 0),
    }))
    .filter((item) => item.value > 0)
}

// Safe date formatting function
export const formatSafeDate = (dateString: string, formatStr = "MMM dd"): string => {
  try {
    if (!dateString) return "Invalid Date"

    const date = new Date(dateString)
    if (!isValid(date)) return "Invalid Date"

    return format(date, formatStr)
  } catch (error) {
    console.error("Date formatting error:", error, "for date:", dateString)
    return "Invalid Date"
  }
}

export const getWeeklyData = (expenses: DailyExpense[]): WeeklyData[] => {
  const weeklyMap = new Map<string, WeeklyData>()

  expenses.forEach((expense) => {
    try {
      if (!expense.date) return

      const date = new Date(expense.date)
      if (!isValid(date)) return

      const weekStart = startOfWeek(date)
      const weekKey = format(weekStart, "MMM dd")

      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, {
          week: weekKey,
          expenses: 0,
          investment: 0,
          emergencyFund: 0,
        })
      }

      const weekData = weeklyMap.get(weekKey)!
      weekData.expenses += expense.total - expense.investment - expense.emergencyFund
      weekData.investment += expense.investment
      weekData.emergencyFund += expense.emergencyFund
    } catch (error) {
      console.error("Error processing expense for weekly data:", error, expense)
    }
  })

  return Array.from(weeklyMap.values()).sort((a, b) => {
    try {
      return new Date(a.week).getTime() - new Date(b.week).getTime()
    } catch {
      return 0
    }
  })
}

export const getTopCategories = (expenses: DailyExpense[]) => {
  const categoryTotals = getCategoryData(expenses)
  return categoryTotals.sort((a, b) => b.value - a.value).slice(0, 5)
}

// Group expenses by date and sum totals
export const getAggregatedDailyData = (expenses: DailyExpense[]) => {
  const dailyMap = new Map<
    string,
    {
      date: string
      total: number
      spending: number
      entries: DailyExpense[]
    }
  >()

  expenses.forEach((expense) => {
    try {
      if (!expense.date) return

      const date = new Date(expense.date)
      if (!isValid(date)) return

      if (!dailyMap.has(expense.date)) {
        dailyMap.set(expense.date, {
          date: expense.date,
          total: 0,
          spending: 0,
          entries: [],
        })
      }

      const dayData = dailyMap.get(expense.date)!
      dayData.total += expense.total
      dayData.spending += expense.total - expense.investment - expense.emergencyFund
      dayData.entries.push(expense)
    } catch (error) {
      console.error("Error processing expense for daily data:", error, expense)
    }
  })

  return Array.from(dailyMap.values())
    .sort((a, b) => {
      try {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } catch {
        return 0
      }
    })
    .map((day) => ({
      date: formatSafeDate(day.date),
      total: day.total,
      spending: day.spending,
    }))
}
