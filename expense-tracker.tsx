"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Calendar, BarChart3, Loader2, LogOut, User } from "lucide-react"
import { ExpenseForm } from "./components/expense-form"
import { ExpenseDashboard } from "./components/expense-dashboard"
import { MonthlyOverview } from "./components/monthly-overview"
import { SidebarNavigation } from "./components/sidebar-navigation"
import { IncomeSummaryCard } from "./components/income-summary-card"
import { IncomeModal } from "./components/income-modal"
import type { DailyExpense, UserIncome } from "./types/expense"
import { calculateMonthlyStats } from "./utils/calculations"
import { expenseOperations, isSupabaseAvailable } from "./lib/supabase"
import { getStoredIncome, storeIncome } from "./lib/income"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./contexts/auth-context"

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<DailyExpense[]>([])
  const [income, setIncome] = useState<UserIncome | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [activeView, setActiveView] = useState<"daily" | "monthly">("daily")
  const [activeSection, setActiveSection] = useState("expenses")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)
  const { toast } = useToast()
  const { user, logout } = useAuth()

  const supabaseAvailable = isSupabaseAvailable()

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      try {
        setIsLoading(true)

        // Load income
        const userIncome = getStoredIncome(user.username)
        setIncome(userIncome)

        // Load expenses
        const data = await expenseOperations.getAllExpenses(user.username)
        setExpenses(data)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Using local storage as fallback.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [toast, user])

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const handleAddExpense = async (expenseData: Omit<DailyExpense, "id" | "createdAt" | "updatedAt">) => {
    if (!user) return

    try {
      setIsSubmitting(true)
      const newExpense = await expenseOperations.addExpense(expenseData, user.username)

      if (newExpense) {
        setExpenses((prev) =>
          [newExpense, ...prev].sort((a, b) => {
            const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime()
            if (dateCompare === 0) {
              return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
            }
            return dateCompare
          }),
        )

        toast({
          title: "Success",
          description: "Expense entry added successfully!",
        })
      } else {
        throw new Error("Failed to add expense")
      }
    } catch (error) {
      console.error("Error adding expense:", error)
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    if (!user) return

    try {
      setIsDeleting(true)
      const success = await expenseOperations.deleteExpense(id, user.username)

      if (success) {
        setExpenses((prev) => prev.filter((expense) => expense.id !== id))
        toast({
          title: "Success",
          description: "Expense entry deleted successfully!",
        })
      } else {
        throw new Error("Failed to delete expense")
      }
    } catch (error) {
      console.error("Error deleting expense:", error)
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleIncomeUpdate = (updatedIncome: UserIncome) => {
    setIncome(updatedIncome)
    storeIncome(updatedIncome)
    toast({
      title: "Success",
      description: "Income updated successfully!",
    })
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const monthlyStats = income ? calculateMonthlyStats(expenses, income) : null

  if (!user || !income) {
    return null // This will be handled by the main app component
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your financial data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Sidebar Navigation */}
        <SidebarNavigation activeSection={activeSection} onSectionChange={setActiveSection} />

        {/* Main Content */}
        <div className="md:ml-70 transition-all duration-300">
          {/* Database Status Alert */}
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      💰 {user.displayName}'s Expense Tracker
                    </h1>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        Welcome, {user.displayName}!
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Net Income: ₹{income.totalIncome.toLocaleString()} |
                    {income.foodDeduction > 0 && ` Food Deduction: ₹${income.foodDeduction.toLocaleString()} |`}
                    {income.pf > 0 && ` PF: ₹${income.pf.toLocaleString()}`}
                    {!supabaseAvailable && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                        📱 Offline Mode
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <Button
                      variant={activeView === "daily" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveView("daily")}
                      className="flex items-center gap-2 transition-all duration-200"
                    >
                      <Calendar className="h-4 w-4" />
                      Daily View
                    </Button>
                    <Button
                      variant={activeView === "monthly" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveView("monthly")}
                      className="flex items-center gap-2 transition-all duration-200"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Monthly Overview
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDarkMode(!darkMode)}
                    className="flex items-center gap-2 transition-all duration-200"
                  >
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {darkMode ? "Light" : "Dark"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 bg-transparent"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6">
            {/* Income Summary Card */}
            <IncomeSummaryCard income={income} onEditClick={() => setIsIncomeModalOpen(true)} />

            <AnimatePresence mode="wait">
              {activeView === "daily" ? (
                <motion.div
                  key="daily"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  {/* Expense Form */}
                  <div className="lg:col-span-1">
                    <ExpenseForm onSubmit={handleAddExpense} isLoading={isSubmitting} />
                  </div>

                  {/* Dashboard */}
                  <div className="lg:col-span-2">
                    {monthlyStats && (
                      <ExpenseDashboard
                        expenses={expenses}
                        monthlyStats={monthlyStats}
                        onDeleteExpense={handleDeleteExpense}
                        isDeleting={isDeleting}
                      />
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="monthly"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {monthlyStats && <MonthlyOverview expenses={expenses} monthlyStats={monthlyStats} />}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-12">
            <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Personal Expense Tracker • Built with ❤️ for better financial management</p>
              {!supabaseAvailable && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  📱 Running in offline mode - your data is safely stored locally
                </p>
              )}
            </div>
          </footer>
        </div>

        {/* Income Modal */}
        <IncomeModal
          isOpen={isIncomeModalOpen}
          onClose={() => setIsIncomeModalOpen(false)}
          income={income}
          onSave={handleIncomeUpdate}
        />
      </div>
    </div>
  )
}
