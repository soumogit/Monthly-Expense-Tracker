export interface User {
  username: string
  displayName: string
}

export const USERS: Record<string, { password: string; displayName: string }> = {
  soumodip: {
    password: "soumodip",
    displayName: "Soumodip",
  },
  soumya: {
    password: "soumya",
    displayName: "Soumya",
  },
}

export const authenticateUser = (username: string, password: string): User | null => {
  const user = USERS[username.toLowerCase()]
  if (user && user.password === password) {
    return {
      username: username.toLowerCase(),
      displayName: user.displayName,
    }
  }
  return null
}

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null

  try {
    const storedUser = localStorage.getItem("expense_tracker_user")
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

export const storeUser = (user: User): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("expense_tracker_user", JSON.stringify(user))
}

export const clearUser = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("expense_tracker_user")
}
