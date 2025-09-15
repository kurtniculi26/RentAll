"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "../style/LoginScreen.css"

export default function LoginScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert("Login Failed: Invalid email or password. Please try again.")
    } else if (data?.user) {
      navigate("/home") // Navigate to home screen on success
    } else {
      alert("Login Failed: Account not found. Please register first.")
    }
  }



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="main-container">
      <div className="login-card">
        <div className="brand-section">
          <div className="brand-icon">
            <div className="icon-box">📦</div>
          </div>
          <h1 className="brand-name">RentAll</h1>
        </div>

        <div className="form-section">
          <p className="form-subtitle">Please enter your details</p>
          <h2 className="form-title">Welcome back</h2>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input password-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <div className="form-options">
              <button type="button" className="forgot-link">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="sign-up-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

  

            <p className="signup-prompt">
              Don't have an account?{" "}
              <button type="button" className="signup-link" onClick={() => navigate("/register")}>
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}