"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DollarSign, Receipt, PiggyBank, Menu, X } from "lucide-react"
import { useState } from "react"

interface SidebarNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function SidebarNavigation({ activeSection, onSectionChange }: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigationItems = [
    { id: "incomes", label: "Incomes", icon: DollarSign, color: "text-green-600" },
    { id: "expenses", label: "Expenses", icon: Receipt, color: "text-blue-600" },
    { id: "savings", label: "Savings", icon: PiggyBank, color: "text-purple-600" },
  ]

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-transparent"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isCollapsed ? -280 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full w-70 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 z-40 shadow-lg"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">💰</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">Expense Tracker</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Financial Dashboard</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <motion.div key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                    onClick={() => onSectionChange(item.id)}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : item.color}`} />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                </motion.div>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Personal Finance</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Management Tool</p>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
}
