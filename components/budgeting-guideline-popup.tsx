"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DollarSign, PiggyBank, Wallet, Lightbulb } from "lucide-react"

interface BudgetingGuidelinePopupProps {
  isOpen: boolean
  onClose: () => void
}

export function BudgetingGuidelinePopup({ isOpen, onClose }: BudgetingGuidelinePopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="text-center">
          <Lightbulb className="mx-auto h-12 w-12 text-purple-500 mb-2" />
          <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">Smart Budgeting Tips!</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Master your money with these simple guidelines:
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">50% for Needs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Allocate half of your income to essential expenses like rent, food, and utilities.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400 shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">30% for Wants</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enjoy your discretionary spending on things like entertainment, dining out, and hobbies.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <PiggyBank className="h-6 w-6 text-yellow-600 dark:text-yellow-400 shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">20% for Savings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Prioritize your future by saving for investments, retirement, or large purchases.
              </p>
            </div>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
            <h3 className="font-semibold text-lg text-red-700 dark:text-red-300 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" /> Emergency Fund
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              Aim to save at least 3-6 months' worth of living expenses in an easily accessible emergency fund. This
              provides a crucial safety net for unexpected events.
            </p>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={onClose} className="w-full">
            Got It!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
