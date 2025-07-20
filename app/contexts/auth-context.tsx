import React, { createContext, useContext } from "react"

type User = {
  name: string
  // Add more user fields as needed
}

type AuthContextType = {
  user: User | null
}

const AuthContext = createContext<AuthContextType>({ user: null })

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Replace with your real authentication logic
  const user = { name: "Demo User" } // or null if not logged in

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}