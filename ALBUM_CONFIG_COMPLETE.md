# Album Configuration Migration Complete ✅

## Summary

Successfully migrated album configuration from static constants to Supabase `album_config` table.

## What Was Created

### 1. Type Definitions (`src/types/events.ts`)

```typescript
// Database type
export interface AlbumConfigDB {
  id: string;
  config_key: string;
  config_value: number | null;
  config_type: 'number' | 'text' | 'boolean';
  description: string | null;
  is_active: boolean;
  created_at: string;
}

// Frontend type
export interface AlbumConfiguration {
  basePages: number;
  basePriceSingle: number;
  per10PagesCost: number;
  doubleAlbumMultiplier: number;
  pagesIncrement: number;
}
```

### 2. Service Layer (`src/services/albumConfig.service.ts`)

**Methods:**
- `getAlbumConfiguration()` - Fetch all configuration settings
- `getConfigValue(key)` - Fetch single config value by key

**Usage:**
```typescript
import { albumConfigService } from '@/services';

const config = await albumConfigService.getAlbumConfiguration();
// Returns: { basePages: 60, basePriceSingle: 8000, ... }
```

### 3. Updated AlbumConfig Component

**New Props:**
- `basePages` - Base number of pages (from DB)
- `pagesIncrement` - Increment value (from DB)
- `pricePerTenPages` - Cost per increment (from DB)

**Before:**
```typescript
<AlbumConfig
  pages={60}
  type="one-photobook"
  onPagesChange={handleChange}
  onTypeChange={handleTypeChange}
  pricePerTenPages={500}
/>
```

**After:**
```typescript
<AlbumConfig
  pages={albumConfig.pages}
  type={albumConfig.type}
  onPagesChange={handlePagesChange}
  onTypeChange={handleTypeChange}
  basePages={albumConfiguration.basePages}
  pagesIncrement={albumConfiguration.pagesIncrement}
  pricePerTenPages={albumConfiguration.per10PagesCost}
/>
```

### 4. Updated Step-3 Page

**Changes:**
- ✅ Fetches album config from database on mount
- ✅ Fetches video addons in parallel
- ✅ Shows loading spinner during fetch
- ✅ Displays error message on failure
- ✅ Passes config values to AlbumConfig component

## Database Schema

```sql
CREATE TABLE album_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_key VARCHAR(50) UNIQUE NOT NULL,
  config_value DECIMAL(10,2),
  config_type VARCHAR(20) DEFAULT 'number',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Configuration Keys

| Key | Value | Description |
|-----|-------|-------------|
| `base_pages` | 60 | Default number of pages in base album |
| `base_price_single` | 8000 | Base price for single 60-page album |
| `per_10_pages_cost` | 500 | Cost per additional 10 pages |
| `double_album_multiplier` | 1.8 | Price multiplier for two photo-books |
| `pages_increment` | 10 | Pages must be added in increments of this value |

## Key Features

✅ **Dynamic Configuration** - Update values in database without code changes
✅ **Type Safety** - Full TypeScript support
✅ **Loading States** - Shows spinner while fetching
✅ **Error Handling** - Retry mechanism on failure
✅ **Parallel Fetching** - Loads album config and video addons together

## File Structure

```
src/
├── services/
│   ├── albumConfig.service.ts      ✅ NEW - Album config service
│   ├── events.service.ts           ✅ Existing
│   ├── videoAddons.service.ts      ✅ Existing
│   └── index.ts                    ✅ Updated - exports album service
│
├── types/
│   ├── events.ts                   ✅ Updated - album config types
│   └── index.ts                    ✅ Updated - exports album types
│
├── components/
│   └── AlbumConfig.tsx             ✅ Updated - accepts config props
│
└── app/wizard/step-3/
    └── page.tsx                    ✅ Updated - fetches from DB
```

## Usage Examples

### Fetch Configuration

```typescript
import { albumConfigService } from '@/services';

const config = await albumConfigService.getAlbumConfiguration();

console.log(config.basePages);              // 60
console.log(config.per10PagesCost);         // 500
console.log(config.doubleAlbumMultiplier);  // 1.8
```

### Fetch Single Value

```typescript
const basePages = await albumConfigService.getConfigValue('base_pages');
// Returns: 60
```

### In React Component

```typescript
import { albumConfigService, AlbumConfiguration } from '@/services';
import { useEffect, useState } from 'react';

function MyComponent() {
  const [config, setConfig] = useState<AlbumConfiguration | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const data = await albumConfigService.getAlbumConfiguration();
      setConfig(data);
    };
    fetchConfig();
  }, []);

  if (!config) return <div>Loading...</div>;

  return <div>Base Pages: {config.basePages}</div>;
}
```

## Database Operations

### Update Configuration Value

```sql
UPDATE album_config 
SET config_value = 70 
WHERE config_key = 'base_pages';
```

### Add New Configuration

```sql
INSERT INTO album_config (config_key, config_value, description)
VALUES ('max_pages', 200, 'Maximum allowed pages in album');
```

### Deactivate Configuration

```sql
UPDATE album_config 
SET is_active = false 
WHERE config_key = 'old_config';
```

## Testing Checklist

- [ ] Navigate to `/wizard/step-3`
- [ ] Verify album configuration loads from database
- [ ] Check loading spinner appears briefly
- [ ] Confirm base pages value is correct
- [ ] Test increment/decrement buttons
- [ ] Verify increment matches database value
- [ ] Check reset button uses base pages from DB
- [ ] Test error state (disconnect internet)
- [ ] Test retry button
- [ ] Check no console errors

## Benefits

### 1. **Dynamic Configuration**
- Update album settings via database
- No code changes needed
- No deployment required

### 2. **Centralized Settings**
- All configuration in one place
- Easy to manage and update
- Consistent across application

### 3. **Flexible Pricing**
- Change pricing without code changes
- A/B test different pricing models
- Seasonal pricing adjustments

### 4. **Clean Architecture**
- Service layer handles data fetching
- Components receive props
- Types ensure safety

## Migration Summary

You now have **three database-driven features**:

1. ✅ **Events** (`event_catalog` table)
   - Main, other, and additional functions
   
2. ✅ **Video Add-ons** (`video_addons` table)
   - All video add-on options
   
3. ✅ **Album Configuration** (`album_config` table)
   - Base pages, pricing, increments

All follow the same clean architecture pattern! 🎉

## Next Steps (Optional)

### 1. Remove Old Constants

If everything works, optionally remove from `src/lib/constants.ts`:

```typescript
// Can be removed if not used elsewhere:
// export const PRICING_CONFIG = { ... }
```

### 2. Add More Configurations

```sql
INSERT INTO album_config (config_key, config_value, description) VALUES
('min_pages', 40, 'Minimum allowed pages'),
('max_pages', 200, 'Maximum allowed pages'),
('default_album_type', 'one-photobook', 'Default album type selection');
```

### 3. Admin Interface

Create an admin page to manage configurations:
- Update pricing
- Change base values
- Toggle active/inactive

## Conclusion

✅ **Album Configuration Migration Complete!**

Album settings now fetch from Supabase with:
- Dynamic configuration values
- Full type safety
- Loading and error states
- Clean architecture

The system is ready for testing and production use!
