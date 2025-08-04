import type { DailyExpense, UserIncome } from "../types/expense"

// Enhanced local storage with better error handling
export class OfflineStorage {
  private static getStorageKey(username: string, type: "expenses" | "income"): string {
    return `expense_tracker_${type}_${username}`
  }

  // Expenses
  static getExpenses(username: string): DailyExpense[] {
    try {
      const data = localStorage.getItem(this.getStorageKey(username, "expenses"))
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error loading expenses from local storage:", error)
      return []
    }
  }

  static saveExpenses(username: string, expenses: DailyExpense[]): void {
    try {
      localStorage.setItem(this.getStorageKey(username, "expenses"), JSON.stringify(expenses))
    } catch (error) {
      console.error("Error saving expenses to local storage:", error)
    }
  }

  static addExpense(username: string, expense: DailyExpense): void {
    const expenses = this.getExpenses(username)
    const updatedExpenses = [expense, ...expenses.filter((e) => e.id !== expense.id)].sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime()
      if (dateCompare === 0) {
        return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
      }
      return dateCompare
    })
    this.saveExpenses(username, updatedExpenses)
  }

  static deleteExpense(username: string, expenseId: string): void {
    const expenses = this.getExpenses(username)
    const filteredExpenses = expenses.filter((e) => e.id !== expenseId)
    this.saveExpenses(username, filteredExpenses)
  }

  // Income
  static getIncome(username: string): UserIncome | null {
    try {
      const data = localStorage.getItem(this.getStorageKey(username, "income"))
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Error loading income from local storage:", error)
      return null
    }
  }

  static saveIncome(username: string, income: UserIncome): void {
    try {
      localStorage.setItem(this.getStorageKey(username, "income"), JSON.stringify(income))
    } catch (error) {
      console.error("Error saving income to local storage:", error)
    }
  }

  // Storage info
  static getStorageInfo(): { used: number; available: boolean } {
    try {
      const testKey = "storage_test"
      localStorage.setItem(testKey, "test")
      localStorage.removeItem(testKey)

      // Estimate used storage
      let used = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }

      return { used, available: true }
    } catch (error) {
      return { used: 0, available: false }
    }
  }
}
