"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import MapLocationPicker from "../components/MapLocationPicker"
import "../style/RegisterScreen.css"

export default function RegisterScreen() {
  const [currentStep, setCurrentStep] = useState(1) // 1: Registration, 2: OTP, 3: Face Matching
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    phoneNumber: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
    idImage: null,
    gender: "",
    address: "",
    idType: "",
    idNumber: "",
    latitude: null,
    longitude: null,
  })
  const [otpData, setOtpData] = useState({
    code: "",
    isVerifying: false,
    resendCooldown: 0,
  })
  const [faceMatchData, setFaceMatchData] = useState({
    capturedImage: null,
    isMatching: false,
    matchResult: null,
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    // Password strength calculation
    if (field === "password") {
      calculatePasswordStrength(value)
    }
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    setPasswordStrength(strength)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.birthday) newErrors.birthday = "Birthday is required"

    // Phone validation (10 digits after +63)
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    // Password validation (alphanumeric)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must contain letters and numbers (min 8 characters)"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.idImage) {
      newErrors.idImage = "ID image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      console.log("[v0] Starting registration process...")

      // Send OTP to email
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

      console.log("[v0] Generated OTP code:", otpCode)
      console.log("[v0] Inserting OTP for email:", formData.email)

      const { error } = await supabase.from("otp_verifications").insert([
        {
          email: formData.email,
          otp_code: otpCode,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        },
      ])

      if (error) {
        console.error("[v0] Supabase OTP insert error:", error)
        throw error
      }

      console.log("[v0] OTP inserted successfully")
      // In a real app, you would send email here
      console.log(`[v0] OTP Code for ${formData.email}: ${otpCode}`)
      alert(`OTP sent to ${formData.email}. Check console for demo code: ${otpCode}`)

      setCurrentStep(2)
      startResendCooldown()
    } catch (error) {
      console.error("[v0] Registration error:", error)
      alert(`Registration failed: ${error.message || "Please ensure the database is set up correctly."}`)
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerification = async (e) => {
    e.preventDefault()

    if (otpData.code.length !== 6) {
      alert("Please enter a valid 6-digit OTP code")
      return
    }

    setOtpData((prev) => ({ ...prev, isVerifying: true }))

    try {
      const { data, error } = await supabase
        .from("otp_verifications")
        .select("*")
        .eq("email", formData.email)
        .eq("otp_code", otpData.code)
        .eq("is_used", false)
        .gt("expires_at", new Date().toISOString())
        .single()

      if (error || !data) {
        alert("Invalid or expired OTP code")
        return
      }

      // Mark OTP as used
      await supabase.from("otp_verifications").update({ is_used: true }).eq("id", data.id)

      setCurrentStep(3)
    } catch (error) {
      console.error("OTP verification error:", error)
      alert("OTP verification failed. Please try again.")
    } finally {
      setOtpData((prev) => ({ ...prev, isVerifying: false }))
    }
  }

  const handleFaceMatching = async () => {
    setFaceMatchData((prev) => ({ ...prev, isMatching: true }))

    try {
      // Get user's camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      // Capture image after 3 seconds
      setTimeout(async () => {
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d")
        ctx.drawImage(video, 0, 0)

        const capturedImageBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"))

        // Stop camera
        stream.getTracks().forEach((track) => track.stop())

        // In a real app, you would use face recognition API here
        // For demo, we'll simulate a successful match
        setTimeout(() => {
          setFaceMatchData((prev) => ({
            ...prev,
            capturedImage: URL.createObjectURL(capturedImageBlob),
            matchResult: "success",
            isMatching: false,
          }))

          // Complete registration
          completeRegistration()
        }, 2000)
      }, 3000)
    } catch (error) {
      console.error("Face matching error:", error)
      alert("Camera access denied or face matching failed")
      setFaceMatchData((prev) => ({ ...prev, isMatching: false }))
    }
  }

  const completeRegistration = async () => {
    try {
      // Hash password (in real app, use proper hashing)
      const passwordHash = btoa(formData.password) // Simple base64 for demo

      const { error } = await supabase.from("users").insert([
        {
          email: formData.email,
          password_hash: passwordHash,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: Number.parseInt(formData.phoneNumber), // Convert to int8 as per existing schema
          birthday: formData.birthday, // Using birthday field from existing schema
          address: formData.address || formData.location,
          valid_id_url: formData.idImage ? URL.createObjectURL(formData.idImage) : null, // Store ID image URL
          profile_pic: null, // Can be added later
          is_verified: true, // Set to true after OTP and face verification
          verified: true, // Both verification fields set to true
        },
      ])

      if (error) throw error

      alert("Registration completed successfully!")
      window.location.href = "/"
    } catch (error) {
      console.error("Complete registration error:", error)
      alert("Registration completion failed. Please try again.")
    }
  }

  const startResendCooldown = () => {
    setOtpData((prev) => ({ ...prev, resendCooldown: 60 }))
    const interval = setInterval(() => {
      setOtpData((prev) => {
        if (prev.resendCooldown <= 1) {
          clearInterval(interval)
          return { ...prev, resendCooldown: 0 }
        }
        return { ...prev, resendCooldown: prev.resendCooldown - 1 }
      })
    }, 1000)
  }

  const handleResendOTP = async () => {
    if (otpData.resendCooldown > 0) return

    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

      console.log("[v0] Generated new OTP code:", otpCode)
      console.log("[v0] Inserting new OTP for email:", formData.email)

      const { error } = await supabase.from("otp_verifications").insert([
        {
          email: formData.email,
          otp_code: otpCode,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        },
      ])

      if (error) {
        console.error("[v0] Supabase OTP insert error:", error)
        throw error
      }

      console.log("[v0] New OTP inserted successfully")
      console.log(`[v0] New OTP Code for ${formData.email}: ${otpCode}`)
      alert(`New OTP sent! Check console: ${otpCode}`)
      startResendCooldown()
    } catch (error) {
      console.error("[v0] Resend OTP error:", error)
      alert("Failed to resend OTP. Please try again.")
    }
  }

  const renderOTPStep = () => (
    <div className="otp-container">
      <div className="step-header">
        <h2 className="form-title">Verify Your Email</h2>
        <p className="form-subtitle">Enter the 6-digit code sent to {formData.email}</p>
      </div>

      <form onSubmit={handleOTPVerification} className="otp-form">
        <div className="otp-input-group">
          <input
            type="text"
            placeholder="000000"
            value={otpData.code}
            onChange={(e) => setOtpData((prev) => ({ ...prev, code: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
            className="otp-input"
            maxLength="6"
            required
          />
        </div>

        <button type="submit" className="verify-button" disabled={otpData.isVerifying}>
          {otpData.isVerifying ? "Verifying..." : "Verify Email"}
        </button>

        <div className="resend-section">
          <button
            type="button"
            className="resend-button"
            onClick={handleResendOTP}
            disabled={otpData.resendCooldown > 0}
          >
            {otpData.resendCooldown > 0 ? `Resend in ${otpData.resendCooldown}s` : "Resend Code"}
          </button>
        </div>
      </form>
    </div>
  )

  const renderFaceMatchingStep = () => (
    <div className="face-match-container">
      <div className="step-header">
        <h2 className="form-title">Face Verification</h2>
        <p className="form-subtitle">We'll match your face with your ID for security</p>
      </div>

      <div className="face-match-content">
        {!faceMatchData.capturedImage && !faceMatchData.isMatching && (
          <div className="face-match-instructions">
            <div className="face-icon">📷</div>
            <p>Position your face in the camera frame</p>
            <button className="start-face-match-button" onClick={handleFaceMatching}>
              Start Face Verification
            </button>
          </div>
        )}

        {faceMatchData.isMatching && (
          <div className="face-match-progress">
            <div className="face-scanning">🔍</div>
            <p>Scanning your face...</p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        )}

        {faceMatchData.capturedImage && faceMatchData.matchResult === "success" && (
          <div className="face-match-success">
            <div className="success-icon">✅</div>
            <p>Face verification successful!</p>
            <p>Completing your registration...</p>
          </div>
        )}
      </div>
    </div>
  )

  const handleLocationChange = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      location: locationData.displayText,
      address: locationData.address,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    }))

    // Clear location error when location is selected
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: "" }))
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        setFormData((prev) => ({ ...prev, idImage: file }))
        if (errors.idImage) {
          setErrors((prev) => ({ ...prev, idImage: "" }))
        }
      } else {
        setErrors((prev) => ({ ...prev, idImage: "Please upload an image file (.jpg, .png)" }))
      }
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "#ef4444"
    if (passwordStrength < 75) return "#f59e0b"
    return "#10b981"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak"
    if (passwordStrength < 50) return "Fair"
    if (passwordStrength < 75) return "Good"
    return "Strong"
  }

  return (
    <div className="main-container">
      <div className="register-card">
        <div className="brand-section">
          <div className="brand-icon">
            <div className="icon-box">📦</div>
          </div>
          <h1 className="brand-name">RentAll</h1>
        </div>

        <div className="form-section">
          {currentStep === 1 && (
            <>
              <p className="form-subtitle">Join our community</p>
              <h2 className="form-title">Create your account</h2>

              <form onSubmit={handleRegister} className="register-form">
                {/* Name Fields */}
                <div className="name-row">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={`form-input ${errors.firstName ? "error" : ""}`}
                      required
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={`form-input ${errors.lastName ? "error" : ""}`}
                      required
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>

                {/* Birthday */}
                <div className="input-group">
                  <div className="input-with-icon">
                    <input
                      type="date"
                      placeholder="Birthday"
                      value={formData.birthday}
                      onChange={(e) => handleInputChange("birthday", e.target.value)}
                      className={`form-input ${errors.birthday ? "error" : ""}`}
                      required
                    />
                    <span className="input-icon">📅</span>
                  </div>
                  {errors.birthday && <span className="error-text">{errors.birthday}</span>}
                </div>

                {/* Phone Number */}
                <div className="input-group">
                  <div className="phone-input">
                    <span className="country-code">+63</span>
                    <input
                      type="tel"
                      placeholder="9123456789"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className={`form-input phone-field ${errors.phoneNumber ? "error" : ""}`}
                      required
                    />
                  </div>
                  {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                </div>

                {/* Email */}
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`form-input ${errors.email ? "error" : ""}`}
                    required
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                {/* Location */}
                <div className="input-group">
                  <MapLocationPicker
                    value={formData.location}
                    onChange={handleLocationChange}
                    error={errors.location}
                  />
                </div>

                {/* Password */}
                <div className="input-group password-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`form-input password-input ${errors.password ? "error" : ""}`}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
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
                  {formData.password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div
                          className="strength-fill"
                          style={{
                            width: `${passwordStrength}%`,
                            backgroundColor: getPasswordStrengthColor(),
                          }}
                        ></div>
                      </div>
                      <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                  )}
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                {/* Confirm Password */}
                <div className="input-group password-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`form-input password-input ${errors.confirmPassword ? "error" : ""}`}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
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
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>

                {/* ID Upload */}
                <div className="input-group">
                  <div className="upload-section">
                    <label className="upload-label">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="upload-input" />
                      <div className="upload-area">
                        {formData.idImage ? (
                          <div className="upload-preview">
                            <span className="upload-icon">✅</span>
                            <span className="upload-text">{formData.idImage.name}</span>
                          </div>
                        ) : (
                          <div className="upload-placeholder">
                            <span className="upload-icon">📄</span>
                            <span className="upload-text">Upload ID Image</span>
                            <span className="upload-subtext">Drag & drop or click to browse</span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  {errors.idImage && <span className="error-text">{errors.idImage}</span>}
                </div>

                <button type="submit" className="register-button" disabled={loading}>
                  {loading ? "Creating Account..." : "Register"}
                </button>

                <p className="login-prompt">
                  Already have an account?{" "}
                  <button type="button" className="login-link" onClick={() => (window.location.href = "/")}>
                    Log In
                  </button>
                </p>
              </form>
            </>
          )}

          {currentStep === 2 && renderOTPStep()}
          {currentStep === 3 && renderFaceMatchingStep()}
        </div>
      </div>
    </div>
  )
}
