# Query Invalidation and Caching Fixes

## Issues Fixed

### 1. Manual Refresh Required for Latest Data

**Problem:** Data wasn't updating automatically after mutations due to improper query invalidation and incorrect QueryClient configuration.

**Root Causes:**
- `staleTime: Infinity` in QueryClient prevented data from ever becoming stale
- Inconsistent query key formats caused cache misses
- Missing query invalidation in mutation success handlers
- `useNotify` hook called at module level instead of inside components

**Solutions:**

#### QueryClient Configuration Fixed
```javascript
// Before: Data never became stale
staleTime: Infinity,
retry: false,
refetchOnWindowFocus: false,

// After: Proper caching and refetching
staleTime: 30 * 1000, // 30 seconds
cacheTime: 5 * 60 * 1000, // 5 minutes
retry: 1,
refetchOnWindowFocus: true,
refetchOnReconnect: true,
```

#### Query Key Standardization
```javascript
// Before: Inconsistent formats
queryKey: ["posts", params]
queryKey: ["post", postId]
queryKey: ["comments", postId, params]

// After: Consistent string conversion and serialization
queryKey: ["posts", JSON.stringify(params)]
queryKey: ["post", String(postId)]
queryKey: ["comments", String(postId), JSON.stringify(params)]
```

#### Comprehensive Query Invalidation
```javascript
// Before: Limited invalidation
queryClient.invalidateQueries({ queryKey: ["posts"] });

// After: Complete invalidation patterns
queryClient.invalidateQueries({ queryKey: ["posts"] });
queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });
queryClient.invalidateQueries({ queryKey: ["comments", String(postId)] });
queryClient.invalidateQueries({ queryKey: ["user-liked-posts"] });
```

### 2. Comments from One Post Appearing on Another

**Problem:** Comments were bleeding between different posts due to unstable query keys and improper cache invalidation.

**Root Causes:**
- Object references in query keys causing cache key instability
- Insufficient specificity in query invalidation
- Generic comment queries without proper post association

**Solutions:**

#### Specific Query Keys
```javascript
// Before: Unstable object references
queryKey: ["comments", postId, params]

// After: Stable serialized keys
queryKey: ["comments", String(postId), JSON.stringify(params)]
```

#### Targeted Invalidation
```javascript
// Before: Broad invalidation affecting all comments
queryClient.invalidateQueries({ queryKey: ["comments"] });

// After: Post-specific invalidation
queryClient.invalidateQueries({ queryKey: ["comments", String(postId)] });
queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });
```

## Implementation Details

### Fixed Hook Patterns

#### Before: Module-level hook calls (incorrect)
```javascript
const { showError, showSuccess } = useNotify(); // At module level

export const useCreatePost = () => {
  // Hook called outside component
}
```

#### After: Component-level hook calls (correct)
```javascript
export const useCreatePost = () => {
  const { showError, showSuccess } = useNotify(); // Inside hook
  // ...
}
```

### Enhanced Mutation Patterns

#### Complete Invalidation Strategy
```javascript
export const useCreateComment = () => {
  return useMutation({
    mutationFn: ({ postId, commentData }) => createComment(postId, commentData),
    onSuccess: (data, { postId }) => {
      // Specific post comments
      queryClient.invalidateQueries({ queryKey: ["comments", String(postId)] });
      // The post itself (for comment count)
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });
      // All posts (for comment counts in feed)
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
```

### Optimized Stale Times
```javascript
// Posts feed: 1 minute (frequent updates needed)
staleTime: 1 * 60 * 1000,

// Individual posts: 30 seconds (comments/likes change frequently)  
staleTime: 30 * 1000,

// User profiles: 2 minutes (less frequent changes)
staleTime: 2 * 60 * 1000,
```

## Benefits

1. **Automatic Data Updates**: No more manual refresh needed
2. **Isolated Comments**: Comments stay with their correct posts
3. **Efficient Caching**: Proper balance between freshness and performance
4. **Consistent UI**: Real-time updates across all components
5. **Better UX**: Immediate feedback on user actions

## Testing Verification

To verify fixes:

1. **Create a post** → Should appear in feed immediately
2. **Like a post** → Like count updates instantly
3. **Add a comment** → Comment appears immediately, count updates
4. **Follow a user** → Follow status updates across UI
5. **Switch between posts** → Comments stay isolated to correct posts
6. **Open in multiple tabs** → Data syncs when switching focus

## Query Key Utility

Created `queryKeys.util.js` for consistent key management:

```javascript
export const QueryKeys = {
  posts: (params = {}) => ["posts", JSON.stringify(params)],
  post: (postId) => ["post", String(postId)],
  comments: (postId, params = {}) => ["comments", String(postId), JSON.stringify(params)],
  // ... more key generators
};
```

This ensures all components use identical query keys for proper caching behavior.
