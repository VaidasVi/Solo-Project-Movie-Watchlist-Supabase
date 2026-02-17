# Supabase Setup Instructions

## Step 1: Create the Database Table

1. Go to your Supabase Dashboard: https://app.supabase.com/project/jxkdfgbcebpopyvtzjrp
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy and paste the contents of `supabase-migration.sql` into the editor
5. Click "Run" to execute the SQL

This will create:
- A `watchlist` table with all necessary columns
- An index on `imdb_id` for faster lookups
- Row Level Security (RLS) policies to allow public access

## Step 2: Verify the Table

1. Go to "Table Editor" in the left sidebar
2. You should see a new table called `watchlist`
3. The table should have these columns:
   - `id` (bigint, primary key)
   - `imdb_id` (text, unique)
   - `title` (text)
   - `poster` (text)
   - `rating` (text)
   - `runtime` (text)
   - `genre` (text)
   - `plot` (text)
   - `created_at` (timestamp)

## Step 3: Test the Application

1. Start the development server: `npm run dev`
2. Search for a movie and add it to your watchlist
3. Navigate to the watchlist page to see your saved movies
4. Check your Supabase table in the Table Editor to verify the data is being saved

## Environment Variables

Make sure your `.env` file has the following variables:

```env
VITE_OMDB_API_KEY=your_omdb_api_key
VITE_SUPABASE_URL=https://jxkdfgbcebpopyvtzjrp.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features

- **Add to Watchlist**: Search for movies and add them to your Supabase database
- **View Watchlist**: See all your saved movies with real-time data from Supabase
- **Remove from Watchlist**: Delete movies from your Supabase database
- **Search Watchlist**: Filter your saved movies by title, genre, or plot

## Troubleshooting

If you encounter errors:

1. **"Failed to add movie"**: Check that the table exists and RLS policies are enabled
2. **"Failed to load watchlist"**: Verify your Supabase credentials in `.env`
3. **CORS errors**: Make sure your domain is allowed in Supabase project settings

## Migration from localStorage

If you had data in localStorage before, you'll need to manually add those movies again through the UI. The localStorage data is not automatically migrated to Supabase.
