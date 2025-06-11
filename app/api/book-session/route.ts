import { sql } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = (await request.json()) as { sessionId: string }

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Start transaction
    await sql`BEGIN`

    try {
      // Check if session exists and get details
      const sessionCheck = await sql`
        SELECT 
          s.current_participants,
          st.max_participants,
          st.price
        FROM sessions s
        JOIN session_types st ON s.session_type_id = st.id
        WHERE s.id = ${sessionId}
      `

      const session = sessionCheck[0]
      if (!session) {
        await sql`ROLLBACK`
        return NextResponse.json({ error: "Session not found" }, { status: 404 })
      }

      // Check if user already booked this session
      const existingBooking = await sql`
        SELECT id FROM bookings 
        WHERE clerk_user_id = ${userId} AND session_id = ${sessionId}
      `

      if (existingBooking.length > 0) {
        await sql`ROLLBACK`
        return NextResponse.json({ error: "Already booked this session" }, { status: 400 })
      }

      // Check if user is already on waitlist
      const existingWaitlist = await sql`
        SELECT id FROM waitlist 
        WHERE clerk_user_id = ${userId} AND session_id = ${sessionId}
      `

      if (existingWaitlist.length > 0) {
        await sql`ROLLBACK`
        return NextResponse.json({ error: "Already on waitlist for this session" }, { status: 400 })
      }

      if (session.current_participants >= session.max_participants) {
        // Add to waitlist
        const waitlistPosition = await sql`
          SELECT COALESCE(MAX(position), 0) + 1 as next_position
          FROM waitlist
          WHERE session_id = ${sessionId}
        `

        await sql`
          INSERT INTO waitlist (clerk_user_id, session_id, position)
          VALUES (${userId}, ${sessionId}, ${waitlistPosition[0].next_position})
        `

        await sql`COMMIT`
        return NextResponse.json({
          success: true,
          waitlisted: true,
          position: waitlistPosition[0].next_position,
        })
      } else {
        // Book the session
        await sql`
          INSERT INTO bookings (clerk_user_id, session_id, payment_amount)
          VALUES (${userId}, ${sessionId}, ${session.price})
        `

        // Update participant count
        await sql`
          UPDATE sessions 
          SET current_participants = current_participants + 1
          WHERE id = ${sessionId}
        `

        await sql`COMMIT`
        return NextResponse.json({
          success: true,
          waitlisted: false,
        })
      }
    } catch (error) {
      await sql`ROLLBACK`
      throw error
    }
  } catch (error) {
    console.error("Error booking session:", error)
    return NextResponse.json({ error: "Failed to book session" }, { status: 500 })
  }
}
