import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useNotify } from "./useNotify";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getLikedPosts,
} from "@/services/post.service";

// Post queries
export const useGetPosts = (params = {}) => {
  // Create a stable query key by serializing params
  const queryKey = ["posts", JSON.stringify(params)];

  return useQuery({
    queryKey,
    queryFn: () => getAllPosts(params),
    staleTime: 1 * 60 * 1000,
    enabled: true,
  });
};

export const useGetPost = (postId) => {
  return useQuery({
    queryKey: ["post", String(postId)],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
    staleTime: 30 * 1000, // 30 seconds for individual posts
  });
};

export const useGetComments = (postId, params = {}) => {
  return useQuery({
    queryKey: ["comments", String(postId), JSON.stringify(params)],
    queryFn: () => getComments(postId, params),
    enabled: !!postId,
    staleTime: 30 * 1000, // 30 seconds for comments
  });
};

// Post mutations
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showError, showSuccess } = useNotify();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      // Invalidate all posts queries to refresh feed
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      router.push(`/post/${data.data.post_id}`);
    },
    onError: (error) => {
      showError({
        title: "Error",
        message: error.message || "Failed to create post",
      });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useNotify();

  return useMutation({
    mutationFn: ({ postId, postData }) => updatePost(postId, postData),
    onSuccess: (data) => {
      const postId = data.data.post_id;
      // Invalidate all posts queries and the specific post
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });
    },
    onError: (error) => {
      showError({
        title: "Error",
        message: error.message || "Failed to update post",
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showError, showSuccess } = useNotify();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (data, postId) => {
      // Remove specific post from cache and invalidate posts list
      queryClient.removeQueries({ queryKey: ["post", String(postId)] });
      queryClient.removeQueries({ queryKey: ["comments", String(postId)] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      router.push("/feed");
    },
    onError: (error) => {
      showError({
        title: "Error",
        message: error.message || "Failed to delete post",
      });
    },
  });
};

// Like mutations
export const useLikePost = () => {
  const queryClient = useQueryClient();
  const { showError } = useNotify();

  return useMutation({
    mutationFn: likePost,
    onSuccess: (data, postId) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });

      // Also invalidate user's liked posts if that page exists
      queryClient.invalidateQueries({ queryKey: ["user-liked-posts"] });
    },
    onError: (error) => {
      if (!error.message?.includes("already liked")) {
        showError({
          title: "Error",
          message: error.message || "Failed to like post",
        });
      }
    },
  });
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  const { showError } = useNotify();

  return useMutation({
    mutationFn: unlikePost,
    onSuccess: (data, postId) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });

      // Also invalidate user's liked posts if that page exists
      queryClient.invalidateQueries({ queryKey: ["user-liked-posts"] });
    },
    onError: (error) => {
      if (!error.message?.includes("have not liked")) {
        showError({
          title: "Error",
          message: error.message || "Failed to unlike post",
        });
      }
    },
  });
};

// Comment mutations
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useNotify();

  return useMutation({
    mutationFn: ({ postId, commentData }) => createComment(postId, commentData),
    onSuccess: (data, { postId }) => {
      // Invalidate specific post comments and the post itself
      queryClient.invalidateQueries({ queryKey: ["comments", String(postId)] });
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });

      // Also invalidate posts list to update comment counts
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      showError({
        title: "Error",
        message: error.message || "Failed to create comment",
      });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useNotify();

  return useMutation({
    mutationFn: ({ postId, commentId, commentData }) =>
      updateComment(postId, commentId, commentData),
    onSuccess: (data, { postId }) => {
      // Invalidate specific post comments only
      queryClient.invalidateQueries({ queryKey: ["comments", String(postId)] });
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });
    },
    onError: (error) => {
      showError({
        title: "Error",
        message: error.message || "Failed to update comment",
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useNotify();

  return useMutation({
    mutationFn: ({ postId, commentId }) => deleteComment(postId, commentId),
    onSuccess: (data, { postId }) => {
      // Invalidate specific post comments and the post itself
      queryClient.invalidateQueries({ queryKey: ["comments", String(postId)] });
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });

      // Also invalidate posts list to update comment counts
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      showError({
        title: "Error",
        message: error.message || "Failed to delete comment",
      });
    },
  });
};
