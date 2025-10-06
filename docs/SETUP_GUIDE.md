# Setup Guide: Database Migration

This guide will help you set up the `events_catalog` table in Supabase.

## Prerequisites

- Supabase project created
- Environment variables configured in `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
  ```

## Option 1: Using Supabase Dashboard (Recommended)

1. **Navigate to SQL Editor**
   - Go to your Supabase project dashboard
   - Click on "SQL Editor" in the left sidebar

2. **Run the Migration**
   - Copy the contents of `supabase/migrations/001_create_events_catalog.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

3. **Verify the Table**
   - Go to "Table Editor" in the left sidebar
   - You should see the `events_catalog` table with all the data

## Option 2: Using Supabase CLI

1. **Install Supabase CLI** (if not already installed)
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link Your Project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Run Migrations**
   ```bash
   supabase db push
   ```

## Verify the Setup

### Check Table Structure

Run this query in SQL Editor:

```sql
SELECT * FROM events_catalog ORDER BY category, label;
```

You should see:
- 5 main functions (engagement, wedding, etc.)
- 5 other functions (birthday, anniversary, etc.)
- 5 additional functions (haldi, mehendi, etc.)

### Test the API

In your Next.js app, navigate to `/wizard/step-2` and verify:
- ✅ Functions load from database
- ✅ Loading spinner appears briefly
- ✅ All categories display correctly
- ✅ No console errors

## Troubleshooting

### Error: "relation 'events_catalog' does not exist"

**Solution:** The table wasn't created. Re-run the migration SQL.

### Error: "Failed to fetch events"

**Solution:** Check:
1. Environment variables are set correctly
2. Supabase URL and key are valid
3. Row Level Security policies allow read access

### Functions not appearing

**Solution:** 
1. Check if data was inserted:
   ```sql
   SELECT COUNT(*) FROM events_catalog;
   ```
   Should return 15 (5 main + 5 other + 5 additional)

2. If count is 0, re-run the INSERT statements from the migration file

### RLS (Row Level Security) Issues

If you get permission errors, temporarily disable RLS for testing:

```sql
ALTER TABLE events_catalog DISABLE ROW LEVEL SECURITY;
```

**Note:** Re-enable RLS after testing for production security.

## Adding New Events

### Via SQL Editor:

```sql
INSERT INTO events_catalog (id, label, icon, category, default_hours)
VALUES ('new-event', 'New Event', '🎉', 'main', 6);
```

### Via Supabase Dashboard:

1. Go to "Table Editor"
2. Select `events_catalog`
3. Click "Insert row"
4. Fill in the fields
5. Click "Save"

## Updating Existing Events

```sql
UPDATE events_catalog
SET label = 'Updated Label', default_hours = 10
WHERE id = 'engagement';
```

## Database Schema

```
events_catalog
├── id (TEXT, PRIMARY KEY)
├── label (TEXT, NOT NULL)
├── icon (TEXT, NOT NULL)
├── category (TEXT, CHECK: 'main'|'other'|'additional')
├── default_hours (INTEGER, CHECK: > 0)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Security Policies

The table has the following RLS policies:

- **Public Read**: Anyone can read events (SELECT)
- **Authenticated Insert**: Only authenticated users can add events
- **Authenticated Update**: Only authenticated users can modify events
- **Authenticated Delete**: Only authenticated users can delete events

## Next Steps

After successful setup:

1. ✅ Test the application at `/wizard/step-2`
2. ✅ Verify all event categories load correctly
3. ✅ Check browser console for any errors
4. ✅ Test selecting and configuring functions
5. ✅ Remove or comment out old constants from `src/lib/constants.ts` (optional)

## Rollback (If Needed)

To remove the table and start over:

```sql
DROP TABLE IF EXISTS events_catalog CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
```

Then re-run the migration.

## Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Review browser console for client-side errors
3. Verify environment variables are loaded
4. Test Supabase connection with a simple query
