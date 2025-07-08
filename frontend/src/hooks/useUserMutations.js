import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotify } from "./useNotify";
import {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
  checkFollowStatus,
} from "@/services/user.service";

// User queries
export const useGetUserProfile = (userId) => {
  return useQuery({
    queryKey: ["user", String(userId)],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetUserFollowers = (userId, params = {}) => {
  return useQuery({
    queryKey: ["userFollowers", String(userId), JSON.stringify(params)],
    queryFn: () => getUserFollowers(userId, params),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useGetUserFollowing = (userId, params = {}) => {
  return useQuery({
    queryKey: ["userFollowing", String(userId), JSON.stringify(params)],
    queryFn: () => getUserFollowing(userId, params),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// User mutations
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useNotify();

  return useMutation({
    mutationFn: ({ userId, userData }) => updateUserProfile(userId, userData),
    onSuccess: (data) => {
      const userId = data.data.user_id;
      queryClient.invalidateQueries({ queryKey: ["user", String(userId)] });

      // Also invalidate posts to update author info
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      showError({
        title: "Error",
        message: error.message || "Failed to update profile",
      });
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useNotify();

  return useMutation({
    mutationFn: followUser,
    onSuccess: (data, userId) => {
      // Invalidate user profile and follow-related queries
      queryClient.invalidateQueries({ queryKey: ["user", String(userId)] });
      queryClient.invalidateQueries({
        queryKey: ["userFollowers", String(userId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["followStatus", String(userId)],
      });

      // Invalidate posts to update follow status in PostCards
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      if (!error.message?.includes("already following")) {
        showError({
          title: "Error",
          message: error.message || "Failed to follow user",
        });
      }
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useNotify();

  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: (data, userId) => {
      // Invalidate user profile and follow-related queries
      queryClient.invalidateQueries({ queryKey: ["user", String(userId)] });
      queryClient.invalidateQueries({
        queryKey: ["userFollowers", String(userId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["followStatus", String(userId)],
      });

      // Invalidate posts to update follow status in PostCards
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      if (!error.message?.includes("not following")) {
        showError({
          title: "Error",
          message: error.message || "Failed to unfollow user",
        });
      }
    },
  });
};

export const useCheckFollowStatus = (userId) => {
  return useQuery({
    queryKey: ["followStatus", String(userId)],
    queryFn: () => checkFollowStatus(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
