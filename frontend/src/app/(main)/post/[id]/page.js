"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Stack,
  Group,
  Avatar,
  Text,
  Title,
  Button,
  ActionIcon,
  Textarea,
  LoadingOverlay,
  Divider,
} from "@mantine/core";
import {
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconShare,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  useGetPost,
  useLikePost,
  useUnlikePost,
  useDeletePost,
} from "@/hooks/usePostMutations";
import {
  useGetComments,
  useCreateComment,
  useDeleteComment,
} from "@/hooks/usePostMutations";
import { useForm } from "@mantine/form";
import { useAuth } from "@/store/store";
import { canUserLikePost, getLikeButtonProps } from "@/utils/auth.util";
import PostCard from "@/components/PostCard";
import CommentItem from "@/components/CommentItem";

const PostPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const postId = params.id;

  const {
    data: postData,
    isLoading: postLoading,
    error: postError,
  } = useGetPost(postId);
  const { data: commentsData, isLoading: commentsLoading } =
    useGetComments(postId);

  const { mutate: likePost } = useLikePost();
  const { mutate: unlikePost } = useUnlikePost();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment();
  const { mutate: deleteComment } = useDeleteComment();

  const commentForm = useForm({
    initialValues: {
      content: "",
    },
    validate: {
      content: (value) =>
        !value.trim()
          ? "Comment cannot be empty"
          : value.length > 500
          ? "Comment must be less than 500 characters"
          : null,
    },
  });

  useEffect(() => {
    if (postData?.data?.title) {
      document.title = `${postData.data.title} - Blog.io`;
    }
  }, [postData]);

  const formatTimeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };
  const handleLike = (postId) => {
    likePost(postId);
  };

  const handleUnlike = (postId) => {
    unlikePost(postId);
  };

  const handleDelete = (postId) => {
    deletePost(postId);
  };

  const handleCommentSubmit = () => {
    const validation = commentForm.validate();
    if (validation.hasErrors) return;

    createComment(
      { postId, commentData: { content: commentForm.values.content } },
      {
        onSuccess: () => {
          commentForm.reset();
        },
      }
    );
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(postId);
    }
  };

  const handleDeleteComment = (commentId) => {
    deleteComment({ postId, commentId });
  };

  if (postLoading) {
    return (
      <Box maw={800} mx="auto" p="md">
        <LoadingOverlay visible />
      </Box>
    );
  }

  if (postError || !postData?.data) {
    return (
      <Box maw={800} mx="auto" p="md" ta="center">
        <Text c="red">
          Error loading post: {postError?.message || "Post not found"}
        </Text>
        <Button mt="md" onClick={() => router.push("/feed")}>
          Back to Feed
        </Button>
      </Box>
    );
  }

  const post = postData.data;
  const comments = commentsData?.data || [];

  return (
    <Box maw={800} mx="auto" p="md">
      <Stack gap="lg">
        {/* Header */}
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => router.back()}
          >
            Back
          </Button>
        </Group>{" "}
        {/* Post */}
        <PostCard
          post={post}
          onLike={handleLike}
          onUnlike={handleUnlike}
          onDelete={handleDelete}
          isLiked={post?.likes?.some((p) => {
            return p.user_id === user?.user_id;
          })}
          likesCount={post?.likes?.length}
          commentsCount={comments.length}
          showActions={true}
          showFullContent={true}
        />
        {/* Comments Section */}
        <Paper p="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={4}>Comments ({comments.length})</Title>
            {/* Add Comment */}
            <Box>
              <Textarea
                placeholder="Write a comment..."
                {...commentForm.getInputProps("content")}
                error={commentForm.errors.content}
                mb="sm"
              />
              <Button
                onClick={handleCommentSubmit}
                loading={isCreatingComment}
                disabled={!commentForm.values.content.trim()}
                size="sm"
              >
                Post Comment
              </Button>
            </Box>
            <Divider /> {/* Comments List */}
            {commentsLoading ? (
              <LoadingOverlay visible />
            ) : comments.length > 0 ? (
              <Stack gap="md">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.comment_id}
                    comment={comment}
                    postAuthorId={post.user_id}
                    onDelete={handleDeleteComment}
                  />
                ))}
              </Stack>
            ) : (
              <Text ta="center" c="dimmed" py="lg">
                No comments yet. Be the first to comment!
              </Text>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default PostPage;
