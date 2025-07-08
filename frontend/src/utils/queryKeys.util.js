// Query key management utilities for consistent caching
export const QueryKeys = {
  // Posts
  posts: (params = {}) => ["posts", JSON.stringify(params)],
  post: (postId) => ["post", String(postId)],
  comments: (postId, params = {}) => ["comments", String(postId), JSON.stringify(params)],
  
  // Users
  user: (userId) => ["user", String(userId)],
  userFollowers: (userId, params = {}) => ["userFollowers", String(userId), JSON.stringify(params)],
  userFollowing: (userId, params = {}) => ["userFollowing", String(userId), JSON.stringify(params)],
  userPosts: (userId, params = {}) => ["userPosts", String(userId), JSON.stringify(params)],
  userLikedPosts: (userId, params = {}) => ["userLikedPosts", String(userId), JSON.stringify(params)],
  
  // Search
  search: (query, params = {}) => ["search", query, JSON.stringify(params)],
};

// Helper function to invalidate related queries
export const invalidateRelatedQueries = (queryClient, action, data) => {
  switch (action) {
    case 'POST_CREATED':
    case 'POST_UPDATED':
    case 'POST_DELETED':
      // Invalidate all posts queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (data?.postId) {
        queryClient.invalidateQueries({ queryKey: ["post", String(data.postId)] });
      }
      break;
      
    case 'COMMENT_CREATED':
    case 'COMMENT_UPDATED':
    case 'COMMENT_DELETED':
      if (data?.postId) {
        queryClient.invalidateQueries({ queryKey: ["comments", String(data.postId)] });
        queryClient.invalidateQueries({ queryKey: ["post", String(data.postId)] });
        queryClient.invalidateQueries({ queryKey: ["posts"] }); // For comment counts
      }
      break;
      
    case 'POST_LIKED':
    case 'POST_UNLIKED':
      if (data?.postId) {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["post", String(data.postId)] });
        queryClient.invalidateQueries({ queryKey: ["userLikedPosts"] });
      }
      break;
      
    case 'USER_FOLLOWED':
    case 'USER_UNFOLLOWED':
      if (data?.userId) {
        queryClient.invalidateQueries({ queryKey: ["user", String(data.userId)] });
        queryClient.invalidateQueries({ queryKey: ["userFollowers", String(data.userId)] });
        queryClient.invalidateQueries({ queryKey: ["posts"] }); // For follow status in PostCards
      }
      break;
      
    case 'PROFILE_UPDATED':
      if (data?.userId) {
        queryClient.invalidateQueries({ queryKey: ["user", String(data.userId)] });
        queryClient.invalidateQueries({ queryKey: ["posts"] }); // For author info
      }
      break;
      
    default:
      console.warn(`Unknown action: ${action}`);
  }
};

// Helper to create stable query keys
export const createQueryKey = (base, ...params) => {
  return [base, ...params.map(param => 
    typeof param === 'object' ? JSON.stringify(param) : String(param)
  )];
};
