"use client";
import React, { useState, useEffect } from "react";
import {
  Title,
  Stack,
  Text,
  Box,
  LoadingOverlay,
  Button,
  Pagination,
  Center,
  Paper,
} from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import {
  useLikePost,
  useUnlikePost,
  useDeletePost,
  useGetLikedPosts,
  useGetPosts,
} from "@/hooks/usePostMutations";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/store";
import PostCard from "@/components/PostCard";

const LikedPostsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: postsData,
    isLoading,
    error,
  } = useGetPosts({
    page: currentPage,
    limit: 50,
    liked: true,
  });
  const { mutate: likePostMutation } = useLikePost();
  const { mutate: unlikePostMutation } = useUnlikePost();
  const { mutate: deletePostMutation } = useDeletePost();

  useEffect(() => {
    document.title = "Liked Posts - Blog.io";
  }, []);

  const handleLike = (postId) => {
    likePostMutation(postId);
  };

  const handleUnlike = (postId) => {
    unlikePostMutation(postId);
  };

  const handleDelete = (postId) => {
    deletePostMutation(postId);
  };

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (error) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Text c="red">Error loading posts</Text>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Stack>
      </Center>
    );
  }

  const posts = postsData?.data || [];
  const pagination = postsData?.pagination || {};

  return (
    <Box p="md" maw={800} mx="auto">
      <Stack gap="lg">
        <Box>
          <Title order={2} mb="xs">
            Liked Posts
          </Title>
          <Text c="dimmed" size="sm">
            Posts you've liked will appear here
          </Text>
        </Box>{" "}
        {posts.length === 0 ? (
          <Paper p="xl" radius="md" withBorder>
            <Stack align="center" gap="md">
              <IconHeart size={48} color="gray" />
              <Stack align="center" gap="xs">
                <Text size="lg" fw={500}>
                  No liked posts yet
                </Text>
                <Text c="dimmed" ta="center">
                  Start exploring and liking posts to see them here
                </Text>
              </Stack>
              <Button onClick={() => router.push("/feed")}>
                Explore Posts
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Stack gap="md">
            {posts.map((post) => (
              <PostCard
                key={post.post_id}
                post={post}
                onLike={handleLike}
                onUnlike={handleUnlike}
                onDelete={handleDelete}
                isLiked={post.likes?.some(
                  (like) => like.user_id === user?.user_id
                )}
                likesCount={post?.likes?.length || 0}
                commentsCount={post.comments?.length || 0}
              />
            ))}
          </Stack>
        )}
        {/* Pagination would go here if there were actual liked posts */}
        {posts.length > 0 && (
          <Center>
            <Pagination
              total={pagination?.totalPages || 1}
              value={currentPage}
              onChange={setCurrentPage}
            />
          </Center>
        )}
      </Stack>
    </Box>
  );
};

export default LikedPostsPage;
