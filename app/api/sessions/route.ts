import { getAllSessions } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sessions = await getAllSessions()
    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}