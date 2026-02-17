-- Create the watchlist table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS watchlist (
  id BIGSERIAL PRIMARY KEY,
  imdb_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  poster TEXT,
  rating TEXT,
  runtime TEXT,
  genre TEXT,
  plot TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on imdb_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_watchlist_imdb_id ON watchlist(imdb_id);

-- Enable Row Level Security (RLS)
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read, insert, and delete
-- (You can make this more restrictive based on your needs)
CREATE POLICY "Allow public access to watchlist" ON watchlist
  FOR ALL
  USING (true)
  WITH CHECK (true);
