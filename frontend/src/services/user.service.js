import apiClient from "./api/apiClient";

// User profile operations
export const getUserProfile = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId, userData) => {
  const response = await apiClient.patch(`/users/${userId}`, userData);
  return response.data;
};

// Follow operations
export const followUser = async (userId) => {
  const response = await apiClient.post(`/users/${userId}/follow`);
  return response.data;
};

export const unfollowUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}/follow`);
  return response.data;
};

export const checkFollowStatus = async (userId) => {
  const response = await apiClient.get(`/users/${userId}/follow/status`);
  return response.data;
};

// Get followers and following
export const getUserFollowers = async (userId, params = {}) => {
  const { limit = 10, offset = 0 } = params;
  const response = await apiClient.get(
    `/users/${userId}/followers?limit=${limit}&offset=${offset}`
  );
  return response.data;
};

export const getUserFollowing = async (userId, params = {}) => {
  const { limit = 10, offset = 0 } = params;
  const response = await apiClient.get(
    `/users/${userId}/followed?limit=${limit}&offset=${offset}`
  );
  return response.data;
};
