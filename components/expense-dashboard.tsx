"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Trash2, Loader2 } from "lucide-react"
import type { DailyExpense, MonthlyStats } from "../types/expense"
import { getCategoryData, getAggregatedDailyData, formatSafeDate } from "../utils/calculations"
import { DeleteConfirmation } from "./delete-confirmation"

interface ExpenseDashboardProps {
  expenses: DailyExpense[]
  monthlyStats: MonthlyStats
  onDeleteExpense: (id: string) => Promise<void>
  isDeleting?: boolean
}

const COLORS = ["#8B5CF6", "#EF4444", "#10B981", "#F59E0B", "#3B82F6", "#6366F1", "#EC4899", "#14B8A6", "#64748B"]

export function ExpenseDashboard({
  expenses,
  monthlyStats,
  onDeleteExpense,
  isDeleting = false,
}: ExpenseDashboardProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    expenseId: string
    expenseDate: string
  }>({
    isOpen: false,
    expenseId: "",
    expenseDate: "",
  })

  const categoryData = getCategoryData(expenses)
  const dailyTrend = getAggregatedDailyData(expenses)

  const handleDeleteClick = (expense: DailyExpense) => {
    setDeleteConfirmation({
      isOpen: true,
      expenseId: expense.id,
      expenseDate: expense.date || "",
    })
  }

  const handleDeleteConfirm = async () => {
    await onDeleteExpense(deleteConfirmation.expenseId)
    setDeleteConfirmation({ isOpen: false, expenseId: "", expenseDate: "" })
  }

  const statsCards = [
    { title: "Total Income", value: monthlyStats.totalIncome, icon: "💰", color: "text-green-600" },
    { title: "Food Deduction", value: monthlyStats.foodDeduction, icon: "🍽️", color: "text-red-600" },
    { title: "Net Income", value: monthlyStats.netIncome, icon: "💵", color: "text-blue-600" },
    { title: "Total Spent", value: monthlyStats.totalSpent, icon: "💸", color: "text-orange-600" },
    { title: "Total Investment", value: monthlyStats.totalInvestment, icon: "📈", color: "text-purple-600" },
    { title: "Emergency Fund", value: monthlyStats.totalEmergencyFund, icon: "🚨", color: "text-red-500" },
    {
      title: "Final Balance",
      value: monthlyStats.finalBalance,
      icon: "🏦",
      color: monthlyStats.finalBalance >= 0 ? "text-green-600" : "text-red-600",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>₹{stat.value.toLocaleString()}</p>
                  </div>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No expense data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Daily Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {dailyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                    <Legend />
                    <Line type="monotone" dataKey="spending" stroke="#8884d8" name="Daily Spending" />
                    <Line type="monotone" dataKey="total" stroke="#82ca9d" name="Total (incl. investments)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No spending data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Expense Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Daily Expense Log</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>🏠 Rent</TableHead>
                      <TableHead>🍽️ Food</TableHead>
                      <TableHead>🛒 Groceries</TableHead>
                      <TableHead>⚡ Electricity</TableHead>
                      <TableHead>📱 Recharge</TableHead>
                      <TableHead>🚗 Transport</TableHead>
                      <TableHead>💊 Medical</TableHead>
                      <TableHead>🛍️ Shopping</TableHead>
                      <TableHead>📝 Others</TableHead>
                      <TableHead>💰 Investment</TableHead>
                      <TableHead>🚨 Emergency</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <motion.tr
                        key={expense.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                        className="transition-colors duration-200"
                      >
                        <TableCell>{formatSafeDate(expense.date)}</TableCell>
                        <TableCell>₹{expense.rent || 0}</TableCell>
                        <TableCell>₹{expense.food || 0}</TableCell>
                        <TableCell>₹{expense.groceries || 0}</TableCell>
                        <TableCell>₹{expense.electricity || 0}</TableCell>
                        <TableCell>₹{expense.recharge || 0}</TableCell>
                        <TableCell>₹{expense.transport || 0}</TableCell>
                        <TableCell>₹{expense.medical || 0}</TableCell>
                        <TableCell>₹{expense.shopping || 0}</TableCell>
                        <TableCell>₹{expense.others || 0}</TableCell>
                        <TableCell>₹{expense.investment || 0}</TableCell>
                        <TableCell>₹{expense.emergencyFund || 0}</TableCell>
                        <TableCell className="font-semibold">₹{expense.total || 0}</TableCell>
                        <TableCell className="max-w-xs truncate">{expense.notes || ""}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(expense)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No expense entries found. Add your first expense to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, expenseId: "", expenseDate: "" })}
        onConfirm={handleDeleteConfirm}
        description={`Are you sure you want to delete the expense entry for ${formatSafeDate(deleteConfirmation.expenseDate, "PPP")}? This action cannot be undone.`}
      />
    </motion.div>
  )
}
