/*
  # Create progress logging table

  1. New Tables
    - `progress_logs` - Track user learning progress
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `skill_name` (text, name of the skill)  
      - `progress_amount` (integer, progress percentage)
      - `notes` (text, optional learning notes)
      - `created_at` (timestamptz, creation timestamp)

  2. Security
    - Enable RLS on `progress_logs` table
    - Add policies for users to manage their own progress logs
*/

CREATE TABLE IF NOT EXISTS progress_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_name text NOT NULL CHECK (length(trim(skill_name)) > 0),
  progress_amount integer NOT NULL CHECK (progress_amount >= 0 AND progress_amount <= 100),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;

-- Users can manage their own progress logs
CREATE POLICY "Users can read own progress logs"
  ON progress_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress logs"
  ON progress_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_progress_logs_user_id ON progress_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_logs_user_skill ON progress_logs(user_id, skill_name);
CREATE INDEX IF NOT EXISTS idx_progress_logs_created_at ON progress_logs(created_at DESC);