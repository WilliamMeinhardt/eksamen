import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const instructors = await sql`
      SELECT 
        id,
        name,
        email,
        role,
        bio,
        specialties,
        certifications,
        image_url,
        active,
        created_at
      FROM instructors
      WHERE active = true
      ORDER BY name
    `

    return NextResponse.json(instructors)
  } catch (error) {
    console.error("Error fetching instructors:", error)
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 })
  }
}
