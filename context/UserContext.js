"use client"

import { createContext, useState, useContext } from "react"

// Create the context
const UserContext = createContext()

// Create a provider component
export function UserProvider({ children }) {
  const [users, setUsers] = useState([])

  // Function to register a new user
  const registerUser = (name, email, password) => {
    const newUser = { name, email, password }
    setUsers([...users, newUser])
    return newUser
  }

  // Function to check if login credentials are valid
  const loginUser = (email, password) => {
    const user = users.find((user) => user.email === email && user.password === password)
    return user || null
  }

  return <UserContext.Provider value={{ users, registerUser, loginUser }}>{children}</UserContext.Provider>
}

// Custom hook to use the user context
export function useUser() {
  return useContext(UserContext)
}

