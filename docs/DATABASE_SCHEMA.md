# Database Schema Reference

## Table: `events_catalog`

### Schema

| Column                      | Type      | Constraints           | Description                                    |
|-----------------------------|-----------|-----------------------|------------------------------------------------|
| `id`                        | UUID      | PRIMARY KEY           | Unique identifier                              |
| `slug`                      | TEXT      | UNIQUE, NOT NULL      | URL-friendly identifier                        |
| `label`                     | TEXT      | NOT NULL              | Display name of the event                      |
| `category`                  | TEXT      | NOT NULL              | Category: 'main', 'other', or 'additional'     |
| `icon`                      | TEXT      | NOT NULL              | Emoji or icon representation                   |
| `flat_price`                | NUMERIC   | NOT NULL              | Base price for the event                       |
| `included_hours`            | INTEGER   | NOT NULL              | Number of hours included in base price         |
| `included_photographers`    | INTEGER   | NOT NULL              | Number of photographers included               |
| `included_cinematographers` | INTEGER   | NOT NULL              | Number of cinematographers included            |
| `is_active`                 | BOOLEAN   | DEFAULT true          | Whether the event is active/visible            |
| `sort_order`                | INTEGER   | DEFAULT 0             | Display order (lower numbers appear first)     |
| `created_at`                | TIMESTAMP | DEFAULT NOW()         | Record creation timestamp                      |
| `updated_at`                | TIMESTAMP | DEFAULT NOW()         | Record update timestamp                        |

### Indexes

- Primary key on `id`
- Unique index on `slug`
- Index on `category` for faster category queries
- Index on `is_active` for filtering active events
- Composite index on `(category, sort_order)` for sorted category queries

### Categories

- **`main`** - Primary wedding events (engagement, wedding, reception, etc.)
- **`other`** - Other event types (birthday, anniversary, baptism, etc.)
- **`additional`** - Add-on functions (haldi, mehendi, sangeet, etc.)

## TypeScript Types

### Event (Database Type)

```typescript
export interface Event {
  id: string;
  slug: string;
  label: string;
  category: EventCategory;
  icon: string;
  flat_price: number;
  included_hours: number;
  included_photographers: number;
  included_cinematographers: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

### EventInput (Create/Update Type)

```typescript
export interface EventInput {
  slug: string;
  label: string;
  category: EventCategory;
  icon?: string;
  flat_price: number;
  included_hours: number;
  included_photographers: number;
  included_cinematographers: number;
  is_active?: boolean;
  sort_order?: number;
}
```

### EventFunction (Frontend Type)

```typescript
export interface EventFunction {
  id: string;
  label: string;
  icon: string;
  defaultHours: number;
  flatPrice: number;
  includedPhotographers: number;
  includedCinematographers: number;
}
```

## Example Data

### Main Functions

```sql
INSERT INTO events_catalog (slug, label, category, icon, flat_price, included_hours, included_photographers, included_cinematographers, sort_order) VALUES
  ('engagement', 'Engagement', 'main', '💍', 50000, 8, 2, 2, 1),
  ('wedding', 'Wedding', 'main', '👰', 80000, 8, 3, 3, 2),
  ('wedding-engagement', 'Wedding and Engagement', 'main', '💒', 120000, 10, 4, 4, 3),
  ('reception', 'Reception', 'main', '🎊', 60000, 6, 2, 2, 4),
  ('nikah', 'Nikah', 'main', '☪️', 40000, 4, 2, 2, 5);
```

### Other Functions

```sql
INSERT INTO events_catalog (slug, label, category, icon, flat_price, included_hours, included_photographers, included_cinematographers, sort_order) VALUES
  ('birthday', 'Birthday', 'other', '🎂', 20000, 4, 1, 1, 1),
  ('anniversary', 'Anniversary', 'other', '❤️', 25000, 4, 1, 1, 2),
  ('baptism', 'Baptism', 'other', '⛪', 15000, 3, 1, 1, 3),
  ('newborn', 'Newborn Photography', 'other', '👶', 10000, 2, 1, 0, 4),
  ('neouluettu', 'Neouluettu', 'other', '🎭', 20000, 4, 1, 1, 5);
```

### Additional Functions

```sql
INSERT INTO events_catalog (slug, label, category, icon, flat_price, included_hours, included_photographers, included_cinematographers, sort_order) VALUES
  ('haldi', 'Haldi', 'additional', '✨', 15000, 3, 1, 1, 1),
  ('mehendi', 'Mehendi', 'additional', '🌿', 20000, 4, 1, 1, 2),
  ('sangeet', 'Sangeet', 'additional', '🎶', 25000, 5, 2, 2, 3),
  ('ring-ceremony', 'Ring Ceremony', 'additional', '💍', 10000, 2, 1, 1, 4),
  ('tilak', 'Tilak Ceremony', 'additional', '🙏', 10000, 2, 1, 1, 5);
```

## Queries

### Fetch All Active Events

```sql
SELECT * FROM events_catalog 
WHERE is_active = true 
ORDER BY sort_order ASC;
```

### Fetch Events by Category

```sql
SELECT * FROM events_catalog 
WHERE category = 'main' AND is_active = true 
ORDER BY sort_order ASC;
```

### Search Events

```sql
SELECT * FROM events_catalog 
WHERE label ILIKE '%wedding%' AND is_active = true 
ORDER BY sort_order ASC;
```

### Update Event Pricing

```sql
UPDATE events_catalog 
SET flat_price = 90000, updated_at = NOW() 
WHERE slug = 'wedding';
```

### Deactivate Event

```sql
UPDATE events_catalog 
SET is_active = false, updated_at = NOW() 
WHERE slug = 'old-event';
```

## Service Layer Usage

### Fetch Main Functions

```typescript
import { eventsService } from '@/services';

const mainFunctions = await eventsService.getMainFunctions();
```

### Fetch by Category

```typescript
const additionalFunctions = await eventsService.getEventsByCategory('additional');
```

### Fetch All Events

```typescript
const allEvents = await eventsService.getAllEvents();
```

## Row Level Security (RLS)

### Policies

- **Public Read**: Anyone can read active events
- **Authenticated Write**: Only authenticated users can insert/update/delete

### Example Policies

```sql
-- Allow public to read active events
CREATE POLICY "Allow public read active events" ON events_catalog
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to manage events
CREATE POLICY "Allow authenticated manage events" ON events_catalog
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

## Field Mapping

Database fields use snake_case, frontend types use camelCase:

| Database Field              | Frontend Field             |
|-----------------------------|----------------------------|
| `flat_price`                | `flatPrice`                |
| `included_hours`            | `defaultHours`             |
| `included_photographers`    | `includedPhotographers`    |
| `included_cinematographers` | `includedCinematographers` |
| `is_active`                 | N/A (filtered in query)    |
| `sort_order`                | N/A (used for ordering)    |

## Best Practices

1. **Always filter by `is_active`** when fetching for frontend
2. **Use `sort_order`** for consistent ordering
3. **Use `slug`** for URL-friendly identifiers
4. **Update `updated_at`** on every modification
5. **Validate pricing** before insertion/update
6. **Use transactions** for bulk operations

## Migration Notes

- The service layer automatically filters for `is_active = true`
- Events are ordered by `sort_order` ascending
- Field names are mapped from snake_case to camelCase
- Pricing information is now included in the event data
- Default crew counts come from the database
