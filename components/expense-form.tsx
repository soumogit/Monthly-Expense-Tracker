"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Loader2 } from "lucide-react"
import { format } from "date-fns"
import type { DailyExpense } from "../types/expense"
import { expenseCategories } from "../config/categories"
import { calculateDailyTotal } from "../utils/calculations"

interface ExpenseFormProps {
  onSubmit: (expense: Omit<DailyExpense, "id" | "createdAt" | "updatedAt">) => Promise<void>
  isLoading?: boolean
}

export function ExpenseForm({ onSubmit, isLoading = false }: ExpenseFormProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [formData, setFormData] = useState({
    rent: 0,
    food: 0,
    groceries: 0,
    electricity: 0,
    recharge: 0,
    transport: 0,
    medical: 0,
    shopping: 0,
    creditCardBill: 0, // New field
    others: 0,
    investment: 0,
    emergencyFund: 0,
    notes: "",
  })

  const handleInputChange = (key: string, value: number | string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const total = calculateDailyTotal(formData)
    const expense = {
      date: format(date, "yyyy-MM-dd"),
      ...formData,
      total,
    }

    await onSubmit(expense)

    // Reset form
    setFormData({
      rent: 0,
      food: 0,
      groceries: 0,
      electricity: 0,
      recharge: 0,
      transport: 0,
      medical: 0,
      shopping: 0,
      creditCardBill: 0,
      others: 0,
      investment: 0,
      emergencyFund: 0,
      notes: "",
    })
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <Card className="h-fit shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Plus className="h-5 w-5" />
            Daily Expense Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expenseCategories.map((category) => (
                <motion.div
                  key={category.key}
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Label className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.label}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData[category.key]}
                    onChange={(e) => handleInputChange(category.key, Number.parseFloat(e.target.value) || 0)}
                    placeholder="₹0.00"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </motion.div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Entry...
                </>
              ) : (
                "Add Expense Entry"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
