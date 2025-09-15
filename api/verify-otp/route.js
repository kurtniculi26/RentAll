import { NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"

export async function POST(request) {
  try {
    const { email, otpCode } = await request.json()

    if (!email || !otpCode) {
      return NextResponse.json({ error: "Email and OTP code are required" }, { status: 400 })
    }

    // Verify OTP
    const { data, error } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("email", email)
      .eq("otp_code", otpCode)
      .eq("is_used", false)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Invalid or expired OTP code" }, { status: 400 })
    }

    // Mark OTP as used
    await supabase.from("otp_verifications").update({ is_used: true }).eq("id", data.id)

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
