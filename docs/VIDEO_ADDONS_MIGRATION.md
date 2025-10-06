# Video Addons Migration to Database

## Overview

Successfully migrated video add-ons from static constants to Supabase `video_addons` table.

## Database Schema

### Table: `video_addons`

| Column       | Type          | Constraints           | Description                          |
|--------------|---------------|-----------------------|--------------------------------------|
| `id`         | UUID          | PRIMARY KEY           | Unique identifier                    |
| `slug`       | VARCHAR(50)   | UNIQUE, NOT NULL      | URL-friendly identifier              |
| `label`      | VARCHAR(100)  | NOT NULL              | Display name                         |
| `description`| TEXT          | NULL                  | Detailed description                 |
| `price`      | DECIMAL(10,2) | NOT NULL              | Price in currency                    |
| `is_active`  | BOOLEAN       | DEFAULT true          | Whether addon is active/visible      |
| `sort_order` | INTEGER       | DEFAULT 0             | Display order (lower = first)        |
| `created_at` | TIMESTAMP     | DEFAULT NOW()         | Creation timestamp                   |
| `updated_at` | TIMESTAMP     | DEFAULT NOW()         | Last update timestamp                |

## TypeScript Types

### VideoAddon (Database Type)

```typescript
export interface VideoAddon {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  price: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

### VideoAddonInput (Create/Update Type)

```typescript
export interface VideoAddonInput {
  slug: string;
  label: string;
  description?: string;
  price: number;
  is_active?: boolean;
  sort_order?: number;
}
```

### VideoAddonOption (Frontend Type)

```typescript
export interface VideoAddonOption {
  value: string;      // slug
  label: string;
  description: string;
  price: number;
}
```

## Service Layer

### VideoAddonsService

**Location:** `src/services/videoAddons.service.ts`

**Methods:**

- `getAllVideoAddons()` - Fetch all active video addons
- `getVideoAddonById(id)` - Fetch single addon by ID
- `getVideoAddonBySlug(slug)` - Fetch single addon by slug

**Usage:**

```typescript
import { videoAddonsService } from '@/services';

// Fetch all active addons
const addons = await videoAddonsService.getAllVideoAddons();

// Fetch by slug
const addon = await videoAddonsService.getVideoAddonBySlug('highlight-video');
```

## Example Data

```sql
INSERT INTO video_addons (slug, label, description, price, sort_order) VALUES
  ('highlight-video', 'Highlight Video', '3-5 minute cinematic highlight reel', 5000, 1),
  ('full-ceremony', 'Full Ceremony Recording', 'Complete unedited recording', 8000, 2),
  ('same-day-edit', 'Same Day Edit', 'Quick edit delivered during event', 15000, 3),
  ('drone-coverage', 'Drone Coverage', 'Aerial photography and videography', 12000, 4);
```

## Implementation Changes

### Before (constants.ts)

```typescript
export const VIDEO_ADDONS = [
  { value: 'highlight-video', label: 'Highlight Video', description: '...', price: 5000 },
  // ...
] as const;
```

### After (Database + Service)

```typescript
// In component
import { videoAddonsService } from '@/services';

const [addons, setAddons] = useState([]);

useEffect(() => {
  const fetchAddons = async () => {
    const data = await videoAddonsService.getAllVideoAddons();
    setAddons(data);
  };
  fetchAddons();
}, []);
```

## Updated Components

### Step-3 Page (`src/app/wizard/step-3/page.tsx`)

**Changes:**
- ✅ Fetches video addons from database on mount
- ✅ Shows loading spinner during fetch
- ✅ Displays error message on failure
- ✅ Provides retry mechanism
- ✅ Uses service layer (not direct Supabase calls)

**Loading States:**

```typescript
{loading ? (
  <div>Loading video add-ons...</div>
) : error ? (
  <div>Error: {error}</div>
) : (
  <div>
    {videoAddonOptions.map(addon => (
      <VideoAddonItem {...addon} />
    ))}
  </div>
)}
```

## Field Mapping

Database fields (snake_case) → Frontend fields (camelCase):

| Database Field | Frontend Field |
|----------------|----------------|
| `slug`         | `value`        |
| `label`        | `label`        |
| `description`  | `description`  |
| `price`        | `price`        |
| `is_active`    | N/A (filtered) |
| `sort_order`   | N/A (ordering) |

## Features

### ✅ Active/Inactive Toggle
Only active addons (`is_active = true`) are fetched and displayed.

### ✅ Custom Sort Order
Addons display in the order specified by `sort_order` field.

### ✅ Dynamic Pricing
Prices can be updated in database without code changes.

### ✅ Type Safety
Full TypeScript support with proper field mapping.

## Testing Checklist

- [ ] Navigate to `/wizard/step-3`
- [ ] Verify video addons load from database
- [ ] Check loading spinner appears
- [ ] Confirm all addons display correctly
- [ ] Select/deselect addons
- [ ] Verify prices display correctly
- [ ] Check no console errors
- [ ] Test navigation to next step

## Database Queries

### Fetch All Active Addons

```sql
SELECT * FROM video_addons 
WHERE is_active = true 
ORDER BY sort_order ASC;
```

### Update Addon Price

```sql
UPDATE video_addons 
SET price = 6000, updated_at = NOW() 
WHERE slug = 'highlight-video';
```

### Deactivate Addon

```sql
UPDATE video_addons 
SET is_active = false, updated_at = NOW() 
WHERE slug = 'old-addon';
```

### Add New Addon

```sql
INSERT INTO video_addons (slug, label, description, price, sort_order)
VALUES ('new-addon', 'New Addon', 'Description here', 10000, 5);
```

## Row Level Security (RLS)

### Recommended Policies

```sql
-- Enable RLS
ALTER TABLE video_addons ENABLE ROW LEVEL SECURITY;

-- Allow public to read active addons
CREATE POLICY "Allow public read active addons" ON video_addons
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to manage addons
CREATE POLICY "Allow authenticated manage addons" ON video_addons
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

## Benefits

### 1. **Dynamic Content**
- Update addons via database without code changes
- Add/remove addons easily
- Change pricing without deployment

### 2. **Flexible Ordering**
- Control display order via `sort_order`
- No need to reorder in code

### 3. **Active/Inactive Toggle**
- Hide addons without deleting them
- Seasonal addons can be toggled

### 4. **Accurate Pricing**
- Prices stored in database
- Easy to update pricing

### 5. **Clean Architecture**
- Service layer handles data fetching
- Components focus on UI
- Types ensure safety

## Next Steps (Optional)

### 1. Admin Interface
Create an admin page to manage video addons:
- Add new addons
- Edit existing addons
- Toggle active/inactive
- Reorder addons
- Update pricing

### 2. Addon Categories
Add categories for different types of addons:
```sql
ALTER TABLE video_addons ADD COLUMN category VARCHAR(50);
```

### 3. Addon Images
Add image URLs for visual representation:
```sql
ALTER TABLE video_addons ADD COLUMN image_url TEXT;
```

### 4. Package-Specific Pricing
Different prices for different packages:
```sql
CREATE TABLE video_addon_pricing (
  id UUID PRIMARY KEY,
  addon_id UUID REFERENCES video_addons(id),
  package_type VARCHAR(50),
  price DECIMAL(10,2)
);
```

## Troubleshooting

### Addons not loading?
1. Check environment variables in `.env.local`
2. Verify Supabase URL and key
3. Check browser console for errors
4. Verify table exists in Supabase dashboard

### RLS errors?
1. Ensure public read policy is enabled
2. Check SQL migration ran successfully
3. Verify policies in Supabase dashboard

### Wrong prices?
1. Verify `price` field in database
2. Check service mapping in `videoAddons.service.ts`
3. Ensure prices are DECIMAL(10,2) format

### Wrong order?
1. Check `sort_order` values in database
2. Lower numbers appear first
3. Update sort_order as needed

## Migration Checklist

- [x] Create TypeScript type definitions
- [x] Create service layer for data fetching
- [x] Update step-3 page to use service
- [x] Add loading and error states
- [x] Create database table
- [x] Write comprehensive documentation
- [x] Export services and types cleanly

## Conclusion

✅ **Migration Complete**

Video add-ons now fetch from the Supabase `video_addons` table with:
- Active/inactive filtering
- Custom sort ordering
- Dynamic pricing
- Full type safety
- Clean architecture

The system is ready for testing and production use!
