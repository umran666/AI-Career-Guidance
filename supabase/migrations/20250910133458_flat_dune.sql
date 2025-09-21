/*
  # Create profiles table for AI Career Advisor

  1. New Tables
    - `profiles` - User profile information
      - `id` (uuid, primary key) 
      - `user_id` (uuid, foreign key to auth.users)
      - `full_name` (text, user's full name)
      - `age` (integer, user's age)
      - `education` (text, education level)
      - `timeline` (text, career timeline preference)
      - `current_skills` (text array, list of user skills)
      - `career_interests` (text array, career interests)
      - `profile_completion` (integer, percentage of profile completion)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, last update timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for users to manage their own profiles
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text,
  age integer CHECK (age >= 16 AND age <= 100),
  education text CHECK (education IN ('high-school', 'associate', 'bachelor', 'master', 'phd')),
  timeline text CHECK (timeline IN ('6-months', '1-year', '2-years', '3-years')),
  current_skills text[] DEFAULT '{}',
  career_interests text[] DEFAULT '{}',
  profile_completion integer DEFAULT 0 CHECK (profile_completion >= 0 AND profile_completion <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();