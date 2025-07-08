// Error handling utilities for better user experience
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const isNetworkError = (error) => {
  return error?.code === "NETWORK_ERROR" || error?.message?.includes("Network");
};

export const isAuthError = (error) => {
  return error?.response?.status === 401 || error?.response?.status === 403;
};

export const handleApiError = (error, showNotification) => {
  if (isAuthError(error)) {
    showNotification({
      title: "Authentication Error",
      message: "Please log in again to continue",
      color: "red",
    });
  } else if (isNetworkError(error)) {
    showNotification({
      title: "Network Error",
      message: "Please check your internet connection",
      color: "red",
    });
  } else {
    showNotification({
      title: "Error",
      message: getErrorMessage(error),
      color: "red",
    });
  }
};

export const validatePost = (post) => {
  const errors = {};

  if (!post.title?.trim()) {
    errors.title = "Title is required";
  } else if (post.title.length > 200) {
    errors.title = "Title must be less than 200 characters";
  }

  if (!post.content?.trim()) {
    errors.content = "Content is required";
  } else if (post.content.length < 10) {
    errors.content = "Content must be at least 10 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateComment = (comment) => {
  const errors = {};

  if (!comment.content?.trim()) {
    errors.content = "Comment cannot be empty";
  } else if (comment.content.length > 500) {
    errors.content = "Comment must be less than 500 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
