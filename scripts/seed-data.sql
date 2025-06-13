-- Seed data for Treningsglede AS

-- Insert instructors
INSERT INTO instructors (name, email, role, bio, specialties, certifications, image_url) VALUES
('Emma Larsen', 'emma@treningsglede.no', 'Head Trainer & Founder', 
 'Emma founded Treningsglede AS with a vision to make fitness accessible to everyone. With over 10 years of experience in personal training and group fitness, she specializes in creating inclusive workout environments.',
 ARRAY['HIIT', 'Strength Training', 'Nutrition Coaching'],
 ARRAY['NASM-CPT', 'Precision Nutrition Level 1', 'HIIT Specialist'],
 '/placeholder.svg?height=300&width=300'),

('Marcus Andersen', 'marcus@treningsglede.no', 'Outdoor Activities Coordinator',
 'Marcus brings the excitement of outdoor adventures to our fitness programs. His background in sports science and love for nature creates unique training experiences that challenge both body and mind.',
 ARRAY['Outdoor Training', 'Functional Fitness', 'Adventure Sports'],
 ARRAY['Exercise Science Degree', 'Wilderness First Aid', 'Rock Climbing Instructor'],
 '/placeholder.svg?height=300&width=300'),

('Sofie Johannsen', 'sofie@treningsglede.no', 'Yoga & Mindfulness Instructor',
 'Sofie''s gentle approach to yoga and mindfulness helps members find balance in their busy lives. She believes in the power of breath and movement to transform both physical and mental well-being.',
 ARRAY['Hatha Yoga', 'Vinyasa Flow', 'Meditation', 'Stress Management'],
 ARRAY['RYT-500', 'Mindfulness-Based Stress Reduction', 'Trauma-Informed Yoga'],
 '/placeholder.svg?height=300&width=300'),

('Lars Eriksen', 'lars@treningsglede.no', 'Strength & Conditioning Coach',
 'Lars combines his background in physiotherapy with strength coaching to help members build functional strength safely. He''s passionate about making weightlifting accessible to people of all ages.',
 ARRAY['Powerlifting', 'Olympic Lifting', 'Rehabilitation', 'Senior Fitness'],
 ARRAY['Physiotherapy Degree', 'CSCS', 'Senior Fitness Specialist'],
 '/placeholder.svg?height=300&width=300'),

('Ingrid Haugen', 'ingrid@treningsglede.no', 'Dance & Cardio Instructor',
 'Ingrid brings energy and joy to every class with her infectious enthusiasm for dance and movement. She specializes in making cardio fun and accessible through dance-based fitness programs.',
 ARRAY['Zumba', 'Dance Fitness', 'Cardio Kickboxing', 'Youth Programs'],
 ARRAY['Zumba Instructor', 'Dance Fitness Certification', 'Youth Fitness Specialist'],
 '/placeholder.svg?height=300&width=300'),

('Thomas Berg', 'thomas@treningsglede.no', 'Adaptive Fitness Specialist',
 'Thomas is dedicated to ensuring that fitness is truly accessible to everyone. His expertise in adaptive training helps members with disabilities or special needs achieve their fitness goals in a supportive environment.',
 ARRAY['Adaptive Training', 'Disability Support', 'Inclusive Fitness', 'Aqua Therapy'],
 ARRAY['Adaptive Fitness Certification', 'Aqua Therapy Specialist', 'Inclusive Fitness Trainer'],
 '/placeholder.svg?height=300&width=300');

-- Insert session types
INSERT INTO session_types (title, description, duration, max_participants, price, difficulty_level, session_type, tags, image_url) VALUES
('Morning HIIT Blast', 'High-intensity interval training to kickstart your day with energy and endurance building exercises.', 45, 15, 250.00, 'Intermediate', 'outdoor', ARRAY['Cardio', 'Strength', 'Fat Burn'], '/placeholder.svg?height=200&width=400'),

('Mindful Yoga Flow', 'Gentle yoga practice focusing on breath, mindfulness, and flexibility in our peaceful studio environment.', 60, 20, 200.00, 'Beginner', 'indoor', ARRAY['Flexibility', 'Mindfulness', 'Relaxation'], '/placeholder.svg?height=200&width=400'),

('Strength & Power', 'Build functional strength with compound movements and progressive overload principles.', 50, 12, 300.00, 'Advanced', 'indoor', ARRAY['Strength', 'Muscle Building', 'Powerlifting'], '/placeholder.svg?height=200&width=400'),

('Dance Fitness Party', 'Fun, high-energy dance workout that combines cardio with easy-to-follow dance moves.', 45, 25, 220.00, 'Beginner', 'indoor', ARRAY['Dance', 'Cardio', 'Fun'], '/placeholder.svg?height=200&width=400'),

('Outdoor Adventure Circuit', 'Functional fitness training using natural obstacles and outdoor equipment in beautiful surroundings.', 60, 16, 280.00, 'Intermediate', 'outdoor', ARRAY['Functional', 'Adventure', 'Nature'], '/placeholder.svg?height=200&width=400'),

('Adaptive Fitness Class', 'Inclusive fitness session designed for people with disabilities or special needs, with full equipment adaptation.', 45, 8, 200.00, 'All Levels', 'indoor', ARRAY['Adaptive', 'Inclusive', 'Supportive'], '/placeholder.svg?height=200&width=400');

-- Insert actual sessions for the next week
INSERT INTO sessions (session_type_id, instructor_id, session_date, start_time, end_time, location, current_participants) VALUES
-- December 11, 2024
(1, 1, '2024-12-11', '07:00', '07:45', 'Frogner Park', 12),
(2, 3, '2024-12-11', '09:30', '10:30', 'Studio A', 18),
(3, 4, '2024-12-11', '18:00', '18:50', 'Strength Room', 12),
(4, 5, '2024-12-11', '19:00', '19:45', 'Studio B', 20),

-- December 12, 2024
(5, 2, '2024-12-12', '16:00', '17:00', 'Bygdøy Peninsula', 14),
(6, 6, '2024-12-12', '14:00', '14:45', 'Adaptive Studio', 6),
(2, 3, '2024-12-12', '08:00', '09:00', 'Studio A', 15),
(1, 1, '2024-12-12', '17:30', '18:15', 'Frogner Park', 10),

-- December 13, 2024
(3, 4, '2024-12-13', '06:30', '07:20', 'Strength Room', 8),
(4, 5, '2024-12-13', '18:30', '19:15', 'Studio B', 22),
(5, 2, '2024-12-13', '15:00', '16:00', 'Bygdøy Peninsula', 12),
(6, 6, '2024-12-13', '13:00', '13:45', 'Adaptive Studio', 4);

-- Note: Reviews, bookings, and waitlist entries will be created when real users sign up via Clerk
-- This avoids foreign key constraint issues since Clerk manages user creation
