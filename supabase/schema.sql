-- Create the resume_ratings table
CREATE TABLE resume_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  industry TEXT NOT NULL,
  total_score INTEGER NOT NULL,
  presentation_scores JSONB NOT NULL,
  substance_scores JSONB NOT NULL,
  feedback JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES auth.users(id)
);

-- Create an index on total_score for faster leaderboard queries
CREATE INDEX idx_resume_ratings_total_score ON resume_ratings(total_score DESC);

-- Create a function to automatically set created_at
CREATE OR REPLACE FUNCTION set_created_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set created_at
CREATE TRIGGER set_resume_ratings_created_at
BEFORE INSERT ON resume_ratings
FOR EACH ROW
EXECUTE FUNCTION set_created_at();

-- Enable Row Level Security (RLS)
ALTER TABLE resume_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON resume_ratings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON resume_ratings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a view for the leaderboard
CREATE VIEW leaderboard AS
SELECT 
  nickname,
  industry,
  total_score,
  created_at,
  ROW_NUMBER() OVER (ORDER BY total_score DESC) as rank
FROM resume_ratings
ORDER BY total_score DESC
LIMIT 50; 