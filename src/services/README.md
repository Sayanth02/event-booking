# Services Layer

This directory contains service classes that handle all data fetching and business logic for the application.

## Architecture Pattern

We follow the **Service Layer Pattern** to separate business logic from UI components:

```
Component → Service → Database
```

### Benefits:
- ✅ **Separation of Concerns**: Components focus on UI, services handle data
- ✅ **Reusability**: Services can be used across multiple components
- ✅ **Testability**: Easy to mock services for unit testing
- ✅ **Maintainability**: Changes to data fetching logic are centralized
- ✅ **Type Safety**: Strong TypeScript typing throughout

## Available Services

### EventsService (`events.service.ts`)

Handles all event-related database operations.

#### Import:
```typescript
import { eventsService } from '@/services';
```

#### Methods:

| Method | Description | Returns |
|--------|-------------|---------|
| `getAllEvents()` | Fetch all events | `Promise<EventFunction[]>` |
| `getEventsByCategory(category)` | Fetch events by category | `Promise<EventFunction[]>` |
| `getMainFunctions()` | Fetch main functions | `Promise<EventFunction[]>` |
| `getOtherFunctions()` | Fetch other functions | `Promise<EventFunction[]>` |
| `getAdditionalFunctions()` | Fetch additional functions | `Promise<EventFunction[]>` |
| `getEventById(id)` | Fetch single event | `Promise<EventFunction \| null>` |

### VideoAddonsService (`videoAddons.service.ts`)

Handles all video addon-related database operations.

#### Import:
```typescript
import { videoAddonsService } from '@/services';
```

#### Methods:

| Method | Description | Returns |
|--------|-------------|---------|
| `getAllVideoAddons()` | Fetch all active video addons | `Promise<VideoAddonOption[]>` |
| `getVideoAddonById(id)` | Fetch single addon by ID | `Promise<VideoAddonOption \| null>` |
| `getVideoAddonBySlug(slug)` | Fetch single addon by slug | `Promise<VideoAddonOption \| null>` |

### AlbumConfigService (`albumConfig.service.ts`)

Handles album configuration database operations.

#### Import:
```typescript
import { albumConfigService } from '@/services';
```

#### Methods:

| Method | Description | Returns |
|--------|-------------|---------|
| `getAlbumConfiguration()` | Fetch all configuration settings | `Promise<AlbumConfiguration>` |
| `getConfigValue(key)` | Fetch single config value by key | `Promise<number \| null>` |

#### Usage Examples:

**Events - Basic Fetch:**
```typescript
const mainFunctions = await eventsService.getMainFunctions();
```

**Events - With Error Handling:**
```typescript
try {
  const functions = await eventsService.getMainFunctions();
  setFunctions(functions);
} catch (error) {
  console.error('Failed to fetch:', error);
  setError('Failed to load functions');
}
```

**Events - Parallel Fetching:**
```typescript
const [main, other, additional] = await Promise.all([
  eventsService.getMainFunctions(),
  eventsService.getOtherFunctions(),
  eventsService.getAdditionalFunctions(),
]);
```

**Video Addons - Basic Fetch:**
```typescript
const videoAddons = await videoAddonsService.getAllVideoAddons();
```

**Video Addons - With Error Handling:**
```typescript
try {
  const addons = await videoAddonsService.getAllVideoAddons();
  setVideoAddons(addons);
} catch (error) {
  console.error('Failed to fetch video addons:', error);
  setError('Failed to load video add-ons');
}
```

**Album Configuration - Basic Fetch:**
```typescript
const config = await albumConfigService.getAlbumConfiguration();
console.log(config.basePages); // 60
console.log(config.per10PagesCost); // 500
```

**Album Configuration - Fetch Single Value:**
```typescript
const basePages = await albumConfigService.getConfigValue('base_pages');
```

**In React Component:**
```typescript
import { eventsService } from '@/services/events.service';
import { useEffect, useState } from 'react';

function MyComponent() {
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await eventsService.getMainFunctions();
        setFunctions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render functions */}</div>;
}
```

## Creating New Services

### Template:

```typescript
import { createClient } from '@/utlis/supabase/client';
import { YourType } from '@/types/your-type';

/**
 * Service for [description]
 */
export class YourService {
  private supabase = createClient();

  /**
   * [Method description]
   */
  async yourMethod(): Promise<YourType[]> {
    const { data, error } = await this.supabase
      .from('your_table')
      .select('*');

    if (error) {
      console.error('Error:', error);
      throw new Error(`Failed: ${error.message}`);
    }

    return data || [];
  }
}

// Export singleton instance
export const yourService = new YourService();
```

### Best Practices:

1. **Use Singleton Pattern**
   ```typescript
   export const myService = new MyService();
   ```

2. **Always Handle Errors**
   ```typescript
   if (error) {
     console.error('Error:', error);
     throw new Error(`Failed: ${error.message}`);
   }
   ```

3. **Add JSDoc Comments**
   ```typescript
   /**
    * Fetches all users from the database
    * @returns Promise resolving to array of users
    * @throws Error if database query fails
    */
   async getAllUsers(): Promise<User[]> { }
   ```

4. **Type Everything**
   ```typescript
   async getUser(id: string): Promise<User | null> { }
   ```

5. **Map Database Types to Frontend Types**
   ```typescript
   private mapToFrontendType(dbRecord: DbType): FrontendType {
     return {
       id: dbRecord.id,
       name: dbRecord.display_name, // Transform field names
     };
   }
   ```

## Error Handling

### In Services:
```typescript
async getData() {
  const { data, error } = await this.supabase.from('table').select();
  
  if (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
  
  return data;
}
```

### In Components:
```typescript
try {
  const data = await service.getData();
  setData(data);
} catch (error) {
  console.error('Error:', error);
  setError('Failed to load data. Please try again.');
}
```

## Testing Services

### Unit Test Example:

```typescript
import { eventsService } from './events.service';

// Mock Supabase
jest.mock('@/utlis/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [{ id: '1', label: 'Test' }],
          error: null,
        })),
      })),
    })),
  })),
}));

describe('EventsService', () => {
  it('should fetch main functions', async () => {
    const result = await eventsService.getMainFunctions();
    expect(result).toBeInstanceOf(Array);
  });

  it('should handle errors', async () => {
    // Mock error scenario
    await expect(eventsService.getMainFunctions()).rejects.toThrow();
  });
});
```

## Performance Optimization

### 1. Parallel Requests
```typescript
// ❌ Sequential (slow)
const main = await eventsService.getMainFunctions();
const other = await eventsService.getOtherFunctions();

// ✅ Parallel (fast)
const [main, other] = await Promise.all([
  eventsService.getMainFunctions(),
  eventsService.getOtherFunctions(),
]);
```

### 2. Caching (Future Enhancement)
```typescript
// Consider using React Query or SWR
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['mainFunctions'],
  queryFn: () => eventsService.getMainFunctions(),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 3. Selective Fields
```typescript
// Fetch only needed fields
const { data } = await this.supabase
  .from('events_catalog')
  .select('id, label, icon'); // Don't fetch unnecessary fields
```

## Common Patterns

### Pagination:
```typescript
async getEventsPaginated(page: number, pageSize: number) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await this.supabase
    .from('events_catalog')
    .select('*', { count: 'exact' })
    .range(from, to);

  return { data, count };
}
```

### Filtering:
```typescript
async searchEvents(query: string) {
  const { data, error } = await this.supabase
    .from('events_catalog')
    .select('*')
    .ilike('label', `%${query}%`);

  return data || [];
}
```

### Sorting:
```typescript
async getEventsSorted(sortBy: string, ascending: boolean) {
  const { data, error } = await this.supabase
    .from('events_catalog')
    .select('*')
    .order(sortBy, { ascending });

  return data || [];
}
```

## Future Services

Consider creating these services as the app grows:

- **`bookings.service.ts`** - Handle booking operations
- **`clients.service.ts`** - Manage client data
- **`packages.service.ts`** - Package pricing and configuration
- **`media.service.ts`** - Handle file uploads and media
- **`notifications.service.ts`** - Email/SMS notifications
- **`analytics.service.ts`** - Track usage and metrics

## Migration from Direct Supabase Calls

### Before:
```typescript
// In component
const supabase = createClient();
const { data } = await supabase.from('events_catalog').select('*');
```

### After:
```typescript
// In component
import { eventsService } from '@/services/events.service';
const data = await eventsService.getAllEvents();
```

## Resources

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)
- [React Query](https://tanstack.com/query/latest) - For advanced data fetching
