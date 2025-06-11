import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test basic database connection
    const result = await sql`SELECT NOW() as current_time`

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: result[0]?.current_time,
    })
  } catch (error) {
    console.error("Database connection error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown database error",
        env_check: {
          has_database_url: !!process.env.DATABASE_URL,
          has_postgres_url: !!process.env.POSTGRES_URL,
          available_env_vars: Object.keys(process.env).filter(
            (key) => key.includes("DATABASE") || key.includes("POSTGRES") || key.includes("NEON"),
          ),
        },
      },
      { status: 500 },
    )
  }
}
