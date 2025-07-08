import apiClient from "./api/apiClient";

// Post CRUD operations
export const createPost = async (postData) => {
  const response = await apiClient.post("/posts", postData);
  return response.data;
};

export const getAllPosts = async (params = {}) => {
  const { page = 1, limit = 10, search, liked } = params;
  let url = `/posts?page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (liked) {
    url += `&liked=${liked}`;
  }
  const response = await apiClient.get(url);
  return response.data;
};

export const getPostById = async (postId) => {
  const response = await apiClient.get(`/posts/${postId}`);
  return response.data;
};

export const updatePost = async (postId, postData) => {
  const response = await apiClient.put(`/posts/${postId}`, postData);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await apiClient.delete(`/posts/${postId}`);
  return response.data;
};

// Post likes
export const likePost = async (postId) => {
  const response = await apiClient.post(`/posts/${postId}/like`);
  return response.data;
};

export const unlikePost = async (postId) => {
  const response = await apiClient.delete(`/posts/${postId}/like`);
  return response.data;
};

// Comments
export const createComment = async (postId, commentData) => {
  const response = await apiClient.post(
    `/posts/${postId}/comment`,
    commentData
  );
  return response.data;
};

export const getComments = async (postId, params = {}) => {
  const { page = 1, limit = 10 } = params;
  const response = await apiClient.get(
    `/posts/${postId}/comment?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const updateComment = async (postId, commentId, commentData) => {
  const response = await apiClient.put(
    `/posts/${postId}/comment/${commentId}`,
    commentData
  );
  return response.data;
};

export const deleteComment = async (postId, commentId) => {
  const response = await apiClient.delete(
    `/posts/${postId}/comment/${commentId}`
  );
  return response.data;
};
