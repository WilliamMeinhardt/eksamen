import { neon } from "@neondatabase/serverless"

// Try multiple environment variable names and provide better error handling
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL

if (!databaseUrl) {
  console.error(
    "Available environment variables:",
    Object.keys(process.env).filter(
      (key) => key.includes("DATABASE") || key.includes("POSTGRES") || key.includes("NEON"),
    ),
  )
  throw new Error("DATABASE_URL, POSTGRES_URL, or NEON_DATABASE_URL must be set")
}

console.log("Connecting to database with URL:", databaseUrl.substring(0, 20) + "...")

export const sql = neon(databaseUrl)

// Database helper functions
export async function createUser(clerkId: string, email: string, firstName?: string, lastName?: string) {
  const result = await sql`
    INSERT INTO users (clerk_id, email, first_name, last_name)
    VALUES (${clerkId}, ${email}, ${firstName || ""}, ${lastName || ""})
    ON CONFLICT (clerk_id) DO UPDATE SET
      email = EXCLUDED.email,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `
  return result[0]
}

export async function getUser(clerkId: string) {
  const result = await sql`
    SELECT * FROM users WHERE clerk_id = ${clerkId}
  `
  return result[0]
}

export async function getAllSessions() {
  const result = await sql`
    SELECT 
      s.*,
      st.title,
      st.description,
      st.duration,
      st.max_participants,
      st.price,
      st.difficulty_level,
      st.session_type,
      st.tags,
      st.image_url,
      i.name as instructor_name,
      (SELECT COUNT(*) FROM waitlist w WHERE w.session_id = s.id) as waitlist_count,
      (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews r WHERE r.session_id = s.id) as avg_rating,
      (SELECT COUNT(*) FROM reviews r WHERE r.session_id = s.id) as review_count
    FROM sessions s
    JOIN session_types st ON s.session_type_id = st.id
    JOIN instructors i ON s.instructor_id = i.id
    WHERE s.session_date >= CURRENT_DATE
    ORDER BY s.session_date, s.start_time
  `
  return result
}

export async function bookSession(clerkUserId: string, sessionId: number) {
  try {
    // Start transaction
    await sql`BEGIN`

    // Check if session is full
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
      throw new Error("Session not found")
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
        VALUES (${clerkUserId}, ${sessionId}, ${waitlistPosition[0].next_position})
        ON CONFLICT (clerk_user_id, session_id) DO NOTHING
      `

      await sql`COMMIT`
      return { success: true, waitlisted: true, position: waitlistPosition[0].next_position }
    } else {
      // Book the session
      await sql`
        INSERT INTO bookings (clerk_user_id, session_id, payment_amount)
        VALUES (${clerkUserId}, ${sessionId}, ${session.price})
        ON CONFLICT (clerk_user_id, session_id) DO NOTHING
      `

      // Update participant count
      await sql`
        UPDATE sessions 
        SET current_participants = current_participants + 1
        WHERE id = ${sessionId}
      `

      await sql`COMMIT`
      return { success: true, waitlisted: false }
    }
  } catch (error) {
    await sql`ROLLBACK`
    throw error
  }
}

export async function getUserBookings(clerkUserId: string) {
  const result = await sql`
    SELECT 
      b.*,
      s.session_date,
      s.start_time,
      s.location,
      st.title,
      st.duration,
      i.name as instructor_name
    FROM bookings b
    JOIN sessions s ON b.session_id = s.id
    JOIN session_types st ON s.session_type_id = st.id
    JOIN instructors i ON s.instructor_id = i.id
    WHERE b.clerk_user_id = ${clerkUserId}
    ORDER BY s.session_date, s.start_time
  `
  return result
}

export async function getUserWaitlistEntries(clerkUserId: string) {
  const result = await sql`
    SELECT 
      w.*,
      s.session_date,
      s.start_time,
      s.location,
      st.title,
      st.duration,
      i.name as instructor_name
    FROM waitlist w
    JOIN sessions s ON w.session_id = s.id
    JOIN session_types st ON s.session_type_id = st.id
    JOIN instructors i ON s.instructor_id = i.id
    WHERE w.clerk_user_id = ${clerkUserId}
    ORDER BY s.session_date, s.start_time
  `
  return result
}
