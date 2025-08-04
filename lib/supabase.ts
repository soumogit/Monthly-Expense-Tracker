import { createClient } from "@supabase/supabase-js"
import type { DailyExpense } from "../types/expense"
import { OfflineStorage } from "./offline-storage"

// Replace the existing environment variable declarations with these:
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client if env vars are not available
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.info("Running in offline mode - using local storage for data persistence.")
    return null
  }
  return createClient(supabaseUrl, supabaseKey)
}

export const supabase = createSupabaseClient()

// Export a function to check if we're in offline mode
export const isOfflineMode = () => {
  return supabase === null
}

// Export a function to check if Supabase is available (keeping for backward compatibility)
export const isSupabaseAvailable = () => {
  return supabase !== null
}

// Mock data for when Supabase is not available
const mockExpenses: DailyExpense[] = []

// Update the expense operations to use the enhanced offline storage
export const expenseOperations = {
  // Fetch all expenses for a specific user
  async getAllExpenses(username: string): Promise<DailyExpense[]> {
    try {
      if (!supabase) {
        // Use enhanced offline storage
        return OfflineStorage.getExpenses(username)
      }

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("username", username)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching expenses:", error)
        // Fallback to offline storage
        return OfflineStorage.getExpenses(username)
      }

      if (!data) return []

      const expenses = data.map((expense) => ({
        id: expense.id || "",
        date: expense.date || "",
        rent: Number(expense.rent) || 0,
        food: Number(expense.food) || 0,
        groceries: Number(expense.groceries) || 0,
        electricity: Number(expense.electricity) || 0,
        recharge: Number(expense.recharge) || 0,
        transport: Number(expense.transport) || 0,
        medical: Number(expense.medical) || 0,
        shopping: Number(expense.shopping) || 0,
        creditCardBill: Number(expense.credit_card_bill) || 0,
        others: Number(expense.others) || 0,
        investment: Number(expense.investment) || 0,
        emergencyFund: Number(expense.emergency_fund) || 0,
        notes: expense.notes || "",
        total: Number(expense.total) || 0,
        createdAt: expense.created_at || "",
        updatedAt: expense.updated_at || "",
      }))

      // Also save to offline storage as backup
      OfflineStorage.saveExpenses(username, expenses)
      return expenses
    } catch (error) {
      console.error("Unexpected error fetching expenses:", error)
      // Fallback to offline storage
      return OfflineStorage.getExpenses(username)
    }
  },

  // Add new expense for a specific user
  async addExpense(
    expense: Omit<DailyExpense, "id" | "createdAt" | "updatedAt">,
    username: string,
  ): Promise<DailyExpense | null> {
    const newExpense: DailyExpense = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...expense,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      if (!supabase) {
        // Use enhanced offline storage
        OfflineStorage.addExpense(username, newExpense)
        return newExpense
      }

      const { data, error } = await supabase
        .from("expenses")
        .insert({
          username,
          date: expense.date,
          rent: expense.rent || 0,
          food: expense.food || 0,
          groceries: expense.groceries || 0,
          electricity: expense.electricity || 0,
          recharge: expense.recharge || 0,
          transport: expense.transport || 0,
          medical: expense.medical || 0,
          shopping: expense.shopping || 0,
          credit_card_bill: expense.creditCardBill || 0,
          others: expense.others || 0,
          investment: expense.investment || 0,
          emergency_fund: expense.emergencyFund || 0,
          notes: expense.notes || "",
          total: expense.total || 0,
        })
        .select()
        .single()

      if (error) {
        console.error("Error adding expense:", error)
        // Fallback to offline storage
        OfflineStorage.addExpense(username, newExpense)
        return newExpense
      }

      if (!data) return newExpense

      const dbExpense = {
        id: data.id,
        date: data.date || "",
        rent: Number(data.rent) || 0,
        food: Number(data.food) || 0,
        groceries: Number(data.groceries) || 0,
        electricity: Number(data.electricity) || 0,
        recharge: Number(data.recharge) || 0,
        transport: Number(data.transport) || 0,
        medical: Number(data.medical) || 0,
        shopping: Number(data.shopping) || 0,
        creditCardBill: Number(data.credit_card_bill) || 0,
        others: Number(data.others) || 0,
        investment: Number(data.investment) || 0,
        emergencyFund: Number(data.emergency_fund) || 0,
        notes: data.notes || "",
        total: Number(data.total) || 0,
        createdAt: data.created_at || "",
        updatedAt: data.updated_at || "",
      }

      // Also update offline storage
      OfflineStorage.addExpense(username, dbExpense)
      return dbExpense
    } catch (error) {
      console.error("Unexpected error adding expense:", error)
      // Fallback to offline storage
      OfflineStorage.addExpense(username, newExpense)
      return newExpense
    }
  },

  // Delete expense (with user verification)
  async deleteExpense(id: string, username: string): Promise<boolean> {
    try {
      if (!id) return false

      if (!supabase) {
        // Use enhanced offline storage
        OfflineStorage.deleteExpense(username, id)
        return true
      }

      const { error } = await supabase.from("expenses").delete().eq("id", id).eq("username", username)

      if (error) {
        console.error("Error deleting expense:", error)
        // Fallback to offline storage
        OfflineStorage.deleteExpense(username, id)
        return true
      }

      // Also update offline storage
      OfflineStorage.deleteExpense(username, id)
      return true
    } catch (error) {
      console.error("Unexpected error deleting expense:", error)
      // Fallback to offline storage
      OfflineStorage.deleteExpense(username, id)
      return true
    }
  },
}
