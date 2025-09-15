import { NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"

export async function POST(request) {
  try {
    const userData = await request.json()

    // Hash password (in production, use proper hashing like bcrypt)
    const passwordHash = btoa(userData.password) // Simple base64 for demo

    // Insert user data using existing table structure
    const { error } = await supabase.from("users").insert([
      {
        email: userData.email,
        password_hash: passwordHash,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: Number.parseInt(userData.phoneNumber), // Convert to int8 as per schema
        birthday: userData.birthday, // Using birthday field from existing schema
        address: userData.address || `${userData.latitude}, ${userData.longitude}`,
        valid_id_url: userData.idImageUrl || null, // Store ID image URL
        profile_pic: userData.profilePicUrl || null,
        is_verified: true, // Set to true after OTP and face verification
        verified: true, // Both verification fields set to true
      },
    ])

    if (error) {
      console.error("Registration error:", error)
      return NextResponse.json({ error: "Registration failed" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully",
    })
  } catch (error) {
    console.error("Complete registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
