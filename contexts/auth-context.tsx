"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "../lib/auth"
import { getStoredUser, storeUser, clearUser } from "../lib/auth"

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)
    setIsLoading(false)
  }, [])

  const login = (user: User) => {
    setUser(user)
    storeUser(user)
  }

  const logout = () => {
    setUser(null)
    clearUser()
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
