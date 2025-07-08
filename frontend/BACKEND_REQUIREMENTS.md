# Backend API Requirements for Blog.io Frontend

## Overview
This document outlines the backend API requirements needed to fully support the Blog.io frontend application. The frontend has been built with comprehensive features including authorization logic, search functionality, follow system, and social sharing.

## Current API Endpoints Status

### ✅ Already Implemented (Based on Frontend Code)
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration  
- `GET /api/posts` - Get all posts with pagination
- `GET /api/posts/:id` - Get single post by ID
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like a post
- `DELETE /api/posts/:id/like` - Unlike a post
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/comments` - Add comment to post
- `DELETE /api/comments/:id` - Delete comment
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/posts` - Get user's posts
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user

### 🔄 Modifications Needed

#### 1. Search Enhancement
**Current:** `GET /api/posts`
**Required:** `GET /api/posts?search=query`

Add search parameter support to filter posts by title:
```javascript
// Query parameters
{
  search: string, // Filter posts by title containing this text
  page: number,
  limit: number
}
```

#### 2. Enhanced Post Response
**Current Post Object:**
```javascript
{
  post_id: number,
  title: string,
  content: string,
  user_id: number,
  created_at: string,
  updated_at: string,
  author: { name: string, avatar_url?: string },
  likes: [{ user_id: number }],
  comments: [{ comment_id: number, content: string, user_id: number }]
}
```

**Required Enhancements:**
```javascript
{
  post_id: number,
  title: string,
  content: string,
  user_id: number,
  created_at: string,
  updated_at: string,
  author: { 
    name: string, 
    avatar_url?: string 
  },
  likes: [{ user_id: number }],
  comments: [{ 
    comment_id: number, 
    content: string, 
    user_id: number,
    author: { name: string, avatar_url?: string },
    created_at: string 
  }],
  // New fields needed:
  is_liked: boolean,        // Whether current user has liked this post
  likes_count: number,      // Total number of likes
  comments_count: number    // Total number of comments
}
```

#### 3. Enhanced User Response
**Required User Object:**
```javascript
{
  user_id: number,
  name: string,
  email: string,
  avatar_url?: string,
  bio?: string,
  created_at: string,
  // New fields needed:
  is_following: boolean,    // Whether current user follows this user
  followers_count: number,  // Number of followers
  following_count: number,  // Number of users this user follows
  posts_count: number       // Number of posts by this user
}
```

### 🆕 New Endpoints Needed

#### 1. Get Liked Posts
```
GET /api/users/:id/liked-posts
```
Response: Array of posts that the user has liked

#### 2. Get User Followers/Following
```
GET /api/users/:id/followers
GET /api/users/:id/following
```
Response: Array of user objects

#### 3. Real-time Notifications (Optional but Recommended)
```
GET /api/notifications
POST /api/notifications/:id/read
```
For like, follow, and comment notifications

## Database Schema Considerations

### Posts Table Enhancement
```sql
-- Add indexes for better search performance
CREATE INDEX idx_posts_title ON posts USING GIN(to_tsvector('english', title));
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

### Performance Optimizations Needed

1. **Efficient Like Status Checking**
   - Use LEFT JOIN or EXISTS queries to determine `is_liked` status
   - Cache like counts to avoid repeated COUNT queries

2. **Follow Status Optimization** 
   - Similar to likes, use efficient queries for `is_following` status
   - Consider denormalizing follower/following counts

3. **Search Performance**
   - Implement full-text search for post titles
   - Consider using search engines like Elasticsearch for advanced search

4. **Pagination Optimization**
   - Use cursor-based pagination for better performance on large datasets
   - Implement consistent ordering (created_at DESC)

## Authorization Logic

The frontend implements comprehensive authorization checks:

1. **Like Restrictions:** Users cannot like their own posts
2. **Follow Restrictions:** Users cannot follow themselves  
3. **Edit/Delete Permissions:** Only post authors can edit/delete posts
4. **Comment Permissions:** Only comment authors can delete comments

Backend should validate these rules server-side as well.

## Response Format Standards

All API responses should follow this format:
```javascript
{
  success: boolean,
  data: any,
  message: string,
  pagination?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

## Error Handling

Standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security Considerations

1. **JWT Token Validation:** All protected endpoints should validate JWT tokens
2. **Rate Limiting:** Implement rate limiting for API endpoints
3. **Input Validation:** Validate and sanitize all input data
4. **CORS Configuration:** Properly configure CORS for frontend domain
5. **SQL Injection Prevention:** Use parameterized queries
6. **XSS Prevention:** Sanitize user-generated content

## Testing Requirements

1. **Unit Tests:** For all new endpoints and modifications
2. **Integration Tests:** For complete user flows (like, follow, search)
3. **Performance Tests:** For search and pagination functionality
4. **Security Tests:** For authorization and input validation

## Implementation Priority

1. **High Priority (Core Features)**
   - Search enhancement (`GET /api/posts?search=query`)
   - Enhanced post/user responses with `is_liked`, `is_following` fields
   - Liked posts endpoint

2. **Medium Priority (User Experience)**
   - Followers/following endpoints
   - Performance optimizations
   - Better error responses

3. **Low Priority (Nice to Have)**
   - Real-time notifications
   - Advanced search features
   - Analytics endpoints

## Frontend Configuration

The frontend is configured to use:
- Base URL: `http://localhost:3000/api` (configurable via environment)
- JWT token storage in localStorage
- Automatic token refresh (if implemented)

Update the backend CORS settings to allow requests from:
- `http://localhost:3001` (development)
- Production domain (when deployed)
