"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Plus, Info } from "lucide-react"
import type { UserIncome } from "../types/expense"

interface IncomeSummaryCardProps {
  income: UserIncome
  onEditClick: () => void
}

export function IncomeSummaryCard({ income, onEditClick }: IncomeSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Monthly Income Overview</h3>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Last updated: {new Date(income.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onEditClick}
              className="flex items-center gap-2 border-green-300 hover:bg-green-100 dark:hover:bg-green-800/30 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Base Salary</p>
              <p className="text-xl font-bold text-green-800 dark:text-green-200">
                ₹{income.baseSalary.toLocaleString()}
              </p>
            </div>

            {income.foodDeduction > 0 && (
              <div className="text-center">
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">Food Deduction</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-300">
                  -₹{income.foodDeduction.toLocaleString()}
                </p>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Net Income</p>
              <p className="text-xl font-bold text-blue-800 dark:text-blue-200">
                ₹{income.totalIncome.toLocaleString()}
              </p>
            </div>

            {income.pf > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <p className="text-sm text-purple-600 dark:text-purple-400">PF Contribution</p>
                  <Info className="h-3 w-3 text-purple-500" title="PF is shown separately, not deducted from salary" />
                </div>
                <p className="text-xl font-bold text-purple-700 dark:text-purple-300">₹{income.pf.toLocaleString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
