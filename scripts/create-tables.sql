-- Create database schema for Treningsglede AS

-- Users table (extends Clerk user data)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    emergency_contact VARCHAR(255),
    medical_notes TEXT,
    membership_type VARCHAR(50) DEFAULT 'basic',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff/Instructors table
CREATE TABLE IF NOT EXISTS instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL,
    bio TEXT,
    specialties TEXT[], -- Array of specialties
    certifications TEXT[], -- Array of certifications
    image_url VARCHAR(500),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session types/templates
CREATE TABLE IF NOT EXISTS session_types (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    max_participants INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    difficulty_level VARCHAR(50) NOT NULL,
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('indoor', 'outdoor')),
    tags TEXT[], -- Array of tags
    image_url VARCHAR(500),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Actual session instances
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_type_id INTEGER REFERENCES session_types(id),
    instructor_id INTEGER REFERENCES instructors(id),
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    current_participants INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table (user_id will be populated when users sign up via Clerk)
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL, -- Store Clerk user ID directly
    session_id INTEGER REFERENCES sessions(id),
    booking_status VARCHAR(20) DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    payment_amount DECIMAL(10,2),
    notes TEXT,
    UNIQUE(clerk_user_id, session_id) -- Prevent duplicate bookings
);

-- Waitlist table (using Clerk user ID directly)
CREATE TABLE IF NOT EXISTS waitlist (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL, -- Store Clerk user ID directly
    session_id INTEGER REFERENCES sessions(id),
    position INTEGER NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notified BOOLEAN DEFAULT false,
    UNIQUE(clerk_user_id, session_id) -- Prevent duplicate waitlist entries
);

-- Reviews/Ratings table (using Clerk user ID directly)
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL, -- Store Clerk user ID directly
    session_id INTEGER REFERENCES sessions(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(clerk_user_id, session_id) -- One review per user per session
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_instructor ON sessions(instructor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_clerk_user ON bookings(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_session ON bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_session ON waitlist(session_id);
CREATE INDEX IF NOT EXISTS idx_reviews_clerk_user ON reviews(clerk_user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
