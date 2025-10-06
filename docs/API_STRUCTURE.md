# API Structure & Database Integration

This document outlines the structure for fetching event functions from the Supabase database.

## Folder Structure

```
src/
├── services/              # API service layer
│   └── events.service.ts  # Event-related database operations
├── types/                 # TypeScript type definitions
│   └── events.ts          # Event-related types
├── utlis/
│   └── supabase/          # Supabase client configuration
│       ├── client.ts      # Client-side Supabase client
│       └── server.ts      # Server-side Supabase client
└── app/
    └── wizard/
        └── step-2/
            └── page.tsx   # Uses the service to fetch data
```

## Database Schema

### Table: `events_catalog`

| Column        | Type      | Description                                    |
|---------------|-----------|------------------------------------------------|
| id            | string    | Unique identifier (primary key)                |
| label         | string    | Display name of the event                      |
| icon          | string    | Emoji or icon representation                   |
| category      | string    | Category: 'main', 'other', or 'additional'     |
| default_hours | number    | Default duration in hours                      |
| created_at    | timestamp | Record creation timestamp                      |
| updated_at    | timestamp | Record update timestamp                        |

## Service Layer

### EventsService (`src/services/events.service.ts`)

A singleton service class that handles all event-related database operations.

#### Methods:

- **`getAllEvents()`** - Fetch all events from the catalog
- **`getEventsByCategory(category)`** - Fetch events by category
- **`getMainFunctions()`** - Fetch main functions (wedding, engagement, etc.)
- **`getOtherFunctions()`** - Fetch other functions (birthday, anniversary, etc.)
- **`getAdditionalFunctions()`** - Fetch additional functions (haldi, mehendi, etc.)
- **`getEventById(id)`** - Fetch a single event by ID

#### Usage Example:

```typescript
import { eventsService } from '@/services/events.service';

// Fetch main functions
const mainFunctions = await eventsService.getMainFunctions();

// Fetch by category
const additionalFunctions = await eventsService.getEventsByCategory('additional');

// Fetch all events
const allEvents = await eventsService.getAllEvents();
```

## Type Definitions

### EventCatalog (Database Type)

```typescript
interface EventCatalog {
  id: string;
  label: string;
  icon: string;
  category: 'main' | 'other' | 'additional';
  default_hours: number;
  created_at?: string;
  updated_at?: string;
}
```

### EventFunction (Frontend Type)

```typescript
interface EventFunction {
  id: string;
  label: string;
  icon: string;
  defaultHours: number;
}
```

## Implementation in Components

### Step 2 Page Example

```typescript
import { eventsService } from '@/services/events.service';
import { EventFunction } from '@/types/events';
import { useEffect, useState } from 'react';

export default function Step2Page() {
  const [mainFunctions, setMainFunctions] = useState<EventFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunctions = async () => {
      try {
        setLoading(true);
        const main = await eventsService.getMainFunctions();
        setMainFunctions(main);
      } catch (err) {
        setError('Failed to load event functions');
      } finally {
        setLoading(false);
      }
    };

    fetchFunctions();
  }, []);

  // Render loading, error, or data
}
```

## Best Practices

### 1. **Service Layer Pattern**
   - All database operations go through the service layer
   - Components never directly call Supabase
   - Easy to mock for testing

### 2. **Error Handling**
   - Services throw errors with descriptive messages
   - Components catch and display user-friendly errors
   - Always log errors to console for debugging

### 3. **Type Safety**
   - Database types (`EventCatalog`) separate from frontend types (`EventFunction`)
   - Service layer handles mapping between types
   - TypeScript ensures type safety throughout

### 4. **Loading States**
   - Always show loading indicators during data fetch
   - Provide retry mechanisms on errors
   - Handle empty states gracefully

### 5. **Performance**
   - Use `Promise.all()` for parallel requests
   - Cache data when appropriate
   - Minimize re-renders with proper state management

## Supabase Client Configuration

### Client-Side (`src/utlis/supabase/client.ts`)

Used in client components (with "use client" directive):

```typescript
import { createClient } from '@/utlis/supabase/client';

const supabase = createClient();
```

### Server-Side (`src/utlis/supabase/server.ts`)

Used in server components and API routes:

```typescript
import { createClient } from '@/utlis/supabase/server';

const supabase = await createClient();
```

## Migration from Constants

### Before (constants.ts):

```typescript
export const MAIN_FUNCTIONS = [
  { id: "engagement", label: "Engagement", icon: "💍", defaultHours: 8 },
  // ...
];
```

### After (Supabase):

```typescript
const mainFunctions = await eventsService.getMainFunctions();
```

## Adding New Event Categories

To add a new category:

1. Insert data into `events_catalog` table with the new category
2. Add the category to the TypeScript type union in `src/types/events.ts`
3. Create a new method in `EventsService` if needed:

```typescript
async getNewCategoryFunctions(): Promise<EventFunction[]> {
  return this.getEventsByCategory('new-category');
}
```

## Environment Variables

Ensure these are set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

## Testing

### Unit Testing Services:

```typescript
import { eventsService } from '@/services/events.service';

describe('EventsService', () => {
  it('should fetch main functions', async () => {
    const functions = await eventsService.getMainFunctions();
    expect(functions).toBeInstanceOf(Array);
  });
});
```

## Future Enhancements

- Add caching layer (React Query, SWR)
- Implement optimistic updates
- Add pagination for large datasets
- Create admin interface for managing events
- Add search and filtering capabilities
