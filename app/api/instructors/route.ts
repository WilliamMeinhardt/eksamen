import { getInstructors } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const instructors = await getInstructors()
    return NextResponse.json(instructors)
  } catch (error) {
    console.error("Error fetching instructors:", error)
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 })
  }
}