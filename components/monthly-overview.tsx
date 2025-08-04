"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { DailyExpense, MonthlyStats } from "../types/expense"
import { getWeeklyData, getTopCategories } from "../utils/calculations"

interface MonthlyOverviewProps {
  expenses: DailyExpense[]
  monthlyStats: MonthlyStats
}

const COLORS = ["#8B5CF6", "#EF4444", "#10B981", "#F59E0B", "#3B82F6"]

export function MonthlyOverview({ expenses, monthlyStats }: MonthlyOverviewProps) {
  const weeklyData = getWeeklyData(expenses)
  const topCategories = getTopCategories(expenses)

  const statsCards = [
    {
      title: "Monthly Income",
      value: monthlyStats.totalIncome,
      icon: "💰",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Food Deduction",
      value: monthlyStats.foodDeduction,
      icon: "🍽️",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      title: "Net Income",
      value: monthlyStats.netIncome,
      icon: "💵",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Total Expenses",
      value: monthlyStats.totalSpent,
      icon: "💸",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Total Investment",
      value: monthlyStats.totalInvestment,
      icon: "📈",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Emergency Fund",
      value: monthlyStats.totalEmergencyFund,
      icon: "🚨",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      title: "Final Balance",
      value: monthlyStats.finalBalance,
      icon: "🏦",
      color: monthlyStats.finalBalance >= 0 ? "text-green-600" : "text-red-600",
      bgColor: monthlyStats.finalBalance >= 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20",
    },
    {
      title: "Savings Rate",
      value: `${monthlyStats.savingsRate.toFixed(1)}%`,
      icon: "📊",
      color:
        monthlyStats.savingsRate >= 20
          ? "text-green-600"
          : monthlyStats.savingsRate >= 10
            ? "text-yellow-600"
            : "text-red-600",
      bgColor:
        monthlyStats.savingsRate >= 20
          ? "bg-green-50 dark:bg-green-900/20"
          : monthlyStats.savingsRate >= 10
            ? "bg-yellow-50 dark:bg-yellow-900/20"
            : "bg-red-50 dark:bg-red-900/20",
      isPercentage: true,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Monthly Financial Overview</h2>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive analysis of your monthly expenses and savings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className={`${stat.bgColor} border-0 shadow-lg`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.isPercentage
                        ? stat.value
                        : `₹${typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}`}
                    </p>
                  </div>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📊 Weekly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {weeklyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                    <Legend />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                    <Bar dataKey="investment" fill="#10B981" name="Investment" />
                    <Bar dataKey="emergencyFund" fill="#F59E0B" name="Emergency Fund" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-gray-500">No weekly data available</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🏆 Top Spending Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {topCategories.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={topCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-gray-500">
                  No category data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">💡</div>
              <h3 className="text-lg font-semibold mb-2">Financial Health</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {monthlyStats.savingsRate >= 20
                  ? "Excellent! You're saving well."
                  : monthlyStats.savingsRate >= 10
                    ? "Good savings rate. Consider increasing it."
                    : "Consider reducing expenses to improve savings."}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Investment Goal</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You've invested ₹{monthlyStats.totalInvestment.toLocaleString()} this month.
                {monthlyStats.totalInvestment >= 5000 ? " Great job!" : " Consider increasing your SIP amount."}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">🛡️</div>
              <h3 className="text-lg font-semibold mb-2">Emergency Fund</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Emergency fund: ₹{monthlyStats.totalEmergencyFund.toLocaleString()}.
                {monthlyStats.totalEmergencyFund >= 2000 ? " Well prepared!" : " Consider building it up."}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
