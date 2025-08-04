"use client"

import { useAuth } from "./contexts/auth-context"
import { LoginPage } from "./components/login-page"
import ExpenseTracker from "./expense-tracker"
import { Loader2 } from "lucide-react"

export default function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? <ExpenseTracker /> : <LoginPage />
}
