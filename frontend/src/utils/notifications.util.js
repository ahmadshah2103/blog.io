// Notification messages for better user experience
export const NOTIFICATION_MESSAGES = {
  // Post actions
  POST_LIKED: "Post liked successfully!",
  POST_UNLIKED: "Post unliked",
  POST_DELETED: "Post deleted successfully",
  POST_CREATED: "Post created successfully!",
  POST_UPDATED: "Post updated successfully!",
  
  // User actions
  USER_FOLLOWED: "User followed successfully!",
  USER_UNFOLLOWED: "User unfollowed",
  PROFILE_UPDATED: "Profile updated successfully!",
  
  // Comment actions
  COMMENT_ADDED: "Comment added successfully!",
  COMMENT_DELETED: "Comment deleted successfully",
  
  // Auth actions
  LOGIN_SUCCESS: "Welcome back!",
  LOGOUT_SUCCESS: "Logged out successfully",
  REGISTER_SUCCESS: "Account created successfully!",
  
  // Errors
  UNAUTHORIZED: "You must be logged in to perform this action",
  FORBIDDEN: "You don't have permission to perform this action",
  NETWORK_ERROR: "Network error. Please check your connection",
  GENERIC_ERROR: "Something went wrong. Please try again",
  
  // Validation
  VALIDATION_ERROR: "Please check your input and try again",
  REQUIRED_FIELDS: "Please fill in all required fields",
  
  // Share
  LINK_COPIED: "Link copied to clipboard!",
  SHARE_ERROR: "Failed to share. Please try again",
};

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

export const showSuccessNotification = (message, title = "Success") => ({
  title,
  message,
  color: "green",
  autoClose: 3000,
});

export const showErrorNotification = (message, title = "Error") => ({
  title,
  message,
  color: "red",
  autoClose: 5000,
});

export const showWarningNotification = (message, title = "Warning") => ({
  title,
  message,
  color: "yellow",
  autoClose: 4000,
});

export const showInfoNotification = (message, title = "Info") => ({
  title,
  message,
  color: "blue",
  autoClose: 3000,
});
