import type { ExpenseCategory } from "../types/expense"

export const expenseCategories: ExpenseCategory[] = [
  { key: "rent", label: "Rent", icon: "🏠", color: "#8B5CF6" },
  { key: "food", label: "Food", icon: "🍽️", color: "#EF4444" },
  { key: "groceries", label: "Groceries", icon: "🛒", color: "#10B981" },
  { key: "electricity", label: "Electricity", icon: "⚡", color: "#F59E0B" },
  { key: "recharge", label: "Recharge", icon: "📱", color: "#3B82F6" },
  { key: "transport", label: "Transport", icon: "🚗", color: "#6366F1" },
  { key: "medical", label: "Medical", icon: "💊", color: "#EC4899" },
  { key: "shopping", label: "Shopping", icon: "🛍️", color: "#14B8A6" },
  { key: "creditCardBill", label: "Credit Card Bill", icon: "💳", color: "#F97316" }, // New category
  { key: "others", label: "Others", icon: "📝", color: "#64748B" },
  { key: "investment", label: "Investment (SIP)", icon: "💰", color: "#059669" },
  { key: "emergencyFund", label: "Emergency Fund", icon: "🚨", color: "#DC2626" },
]
