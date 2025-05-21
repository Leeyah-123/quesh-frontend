import type { User } from "@/contexts/auth-context"

// Mock data for demonstration
const MOCK_USER: User = {
  id: "user-123",
  email: "user@example.com",
  name: "Demo User",
}

// In a real app, these functions would make API calls to your backend
export const authService = {
  // Get the current user from JWT token
  getCurrentUser: async (): Promise<User> => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("auth_token")

    if (!token) {
      throw new Error("No token found")
    }

    // In a real app, you would validate the token with your backend
    // For demo purposes, we'll just return the mock user
    return MOCK_USER
  },

  // Login with email and password
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, accept any credentials
    // Store token in localStorage
    localStorage.setItem("auth_token", "mock_jwt_token")

    // Return a user with the provided email
    return {
      ...MOCK_USER,
      email,
      name: email.split("@")[0],
    }
  },

  // Register a new user
  signup: async (name: string, email: string, password: string): Promise<User> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would register the user with your backend
    // For demo purposes, we'll just return the mock user with the provided name
    const newUser = { ...MOCK_USER, name, email }

    // Store token in localStorage
    localStorage.setItem("auth_token", "mock_jwt_token")

    return newUser
  },

  // Logout the user
  logout: async (): Promise<void> => {
    // Remove token from localStorage
    localStorage.removeItem("auth_token")

    // In a real app, you might also want to invalidate the token on the server
    return Promise.resolve()
  },

  // Login with Google
  loginWithGoogle: async (): Promise<User> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would redirect to Google OAuth
    // For demo purposes, we'll just return the mock user
    localStorage.setItem("auth_token", "mock_google_jwt_token")

    return { ...MOCK_USER, name: "Google User" }
  },

  // Login with GitHub
  loginWithGithub: async (): Promise<User> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would redirect to GitHub OAuth
    // For demo purposes, we'll just return the mock user
    localStorage.setItem("auth_token", "mock_github_jwt_token")

    return { ...MOCK_USER, name: "GitHub User" }
  },
}
