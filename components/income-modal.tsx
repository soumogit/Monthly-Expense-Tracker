"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Save, DollarSign } from "lucide-react"
import type { UserIncome } from "../types/expense"
import { calculateTotalIncome } from "../lib/income"

interface IncomeModalProps {
  isOpen: boolean
  onClose: () => void
  income: UserIncome
  onSave: (income: UserIncome) => void
}

export function IncomeModal({ isOpen, onClose, income, onSave }: IncomeModalProps) {
  const [formData, setFormData] = useState({
    baseSalary: income.baseSalary,
    foodDeduction: income.foodDeduction,
    pf: income.pf,
  })

  useEffect(() => {
    setFormData({
      baseSalary: income.baseSalary,
      foodDeduction: income.foodDeduction,
      pf: income.pf,
    })
  }, [income])

  const handleInputChange = (field: string, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const totalIncome = calculateTotalIncome(formData.baseSalary, formData.foodDeduction)
    const updatedIncome: UserIncome = {
      ...income,
      ...formData,
      totalIncome,
      lastUpdated: new Date().toISOString(),
    }
    onSave(updatedIncome)
    onClose()
  }

  const totalIncome = calculateTotalIncome(formData.baseSalary, formData.foodDeduction)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Manage Income
          </DialogTitle>
          <DialogDescription>Update your monthly income details and deductions.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseSalary">Base Salary (₹/month)</Label>
              <Input
                id="baseSalary"
                type="number"
                min="0"
                step="100"
                value={formData.baseSalary}
                onChange={(e) => handleInputChange("baseSalary", Number.parseFloat(e.target.value) || 0)}
                placeholder="Enter base salary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foodDeduction">Food Deduction (₹/month)</Label>
              <Input
                id="foodDeduction"
                type="number"
                min="0"
                step="50"
                value={formData.foodDeduction}
                onChange={(e) => handleInputChange("foodDeduction", Number.parseFloat(e.target.value) || 0)}
                placeholder="Enter food deduction"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pf">PF Contribution (₹/month)</Label>
              <Input
                id="pf"
                type="number"
                min="0"
                step="100"
                value={formData.pf}
                onChange={(e) => handleInputChange("pf", Number.parseFloat(e.target.value) || 0)}
                placeholder="Enter PF contribution"
              />
              <p className="text-xs text-muted-foreground">PF is shown separately and not deducted from salary</p>
            </div>
          </div>

          <Separator />

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-green-800 dark:text-green-200">Net Monthly Income:</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                ₹{totalIncome.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-300 mt-1">
              Base Salary (₹{formData.baseSalary.toLocaleString()}) - Food Deduction (₹
              {formData.foodDeduction.toLocaleString()})
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
