import { NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP in database
    const { error } = await supabase.from("otp_verifications").insert([
      {
        email: email,
        otp_code: otpCode,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      },
    ])

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 })
    }

    // In a real application, you would send the OTP via email service
    // For demo purposes, we'll return it in the response
    console.log(`[v0] OTP for ${email}: ${otpCode}`)

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      // Remove this in production - only for demo
      otp: otpCode,
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
