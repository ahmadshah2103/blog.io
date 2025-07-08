// Authorization utility functions
export const canUserLikePost = (currentUserId, postAuthorId) => {
  if (!currentUserId) return false;
  return currentUserId !== postAuthorId;
};

export const canUserFollowUser = (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) return false;
  return currentUserId !== targetUserId;
};

export const canUserDeletePost = (currentUserId, postAuthorId) => {
  if (!currentUserId || !postAuthorId) return false;
  return currentUserId === postAuthorId;
};

export const canUserEditPost = (currentUserId, postAuthorId) => {
  if (!currentUserId || !postAuthorId) return false;
  return currentUserId === postAuthorId;
};

export const canUserDeleteComment = (
  currentUserId,
  commentAuthorId,
  postAuthorId
) => {
  if (!currentUserId) return false;
  // User can delete their own comments OR comments on their own posts
  return currentUserId === commentAuthorId || currentUserId === postAuthorId;
};

export const canUserEditComment = (currentUserId, commentAuthorId) => {
  if (!currentUserId || !commentAuthorId) return false;
  return currentUserId === commentAuthorId;
};

// UI state helpers
export const getFollowButtonText = (isFollowing) => {
  return isFollowing ? "Unfollow" : "Follow";
};

export const getFollowButtonVariant = (isFollowing) => {
  return isFollowing ? "outline" : "filled";
};

export const getLikeButtonProps = (isLiked) => {
  return {
    variant: isLiked ? "filled" : "subtle",
    color: isLiked ? "red" : "gray",
  };
};
