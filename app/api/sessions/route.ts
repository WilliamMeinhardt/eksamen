import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sessions = await sql`
      SELECT 
        s.id,
        s.session_date,
        s.start_time,
        s.end_time,
        s.location,
        s.current_participants,
        s.status,
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

    // Transform the data to match the frontend format
    const transformedSessions = sessions.map((session) => ({
      id: session.id,
      title: session.title,
      description: session.description,
      instructor: session.instructor_name,
      type: session.session_type,
      duration: session.duration,
      maxParticipants: session.max_participants,
      currentParticipants: session.current_participants,
      waitlist: Number.parseInt(session.waitlist_count) || 0,
      difficulty: session.difficulty_level,
      time: session.start_time.substring(0, 5), // Format HH:MM
      date: session.session_date,
      location: session.location,
      price: Number.parseFloat(session.price),
      rating: Number.parseFloat(session.avg_rating) || 0,
      reviews: Number.parseInt(session.review_count) || 0,
      image: session.image_url,
      tags: session.tags || [],
    }))

    return NextResponse.json(transformedSessions)
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
