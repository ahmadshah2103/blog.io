"use client";

import React, { useEffect, useState } from "react";
import {
  Title,
  Flex,
  SegmentedControl,
  Stack,
  Text,
  Box,
  LoadingOverlay,
  Button,
  Pagination,
  Center,
  Group,
} from "@mantine/core";
import {
  useGetPosts,
  useLikePost,
  useUnlikePost,
  useDeletePost,
} from "@/hooks/usePostMutations";
import { useFollowUser, useUnfollowUser } from "@/hooks/useUserMutations";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/store";
import PostCard from "@/components/PostCard";
import { FeedSkeleton, CenteredLoader } from "@/components/LoadingStates";

const HomePage = () => {
  const [feedType, setFeedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: postsData,
    isLoading,
    error,
  } = useGetPosts({
    page: currentPage,
    limit: 10,
    feedType,
  });
  const { mutate: likePostMutation } = useLikePost();
  const { mutate: unlikePostMutation } = useUnlikePost();
  const { mutate: deletePostMutation } = useDeletePost();
  const { mutate: followUserMutation } = useFollowUser();
  const { mutate: unfollowUserMutation } = useUnfollowUser();

  useEffect(() => {
    console.log(postsData);
  }, [postsData]);

  const handleLike = (postId) => {
    likePostMutation(postId);
  };

  const handleUnlike = (postId) => {
    unlikePostMutation(postId);
  };

  const handleDelete = (postId) => {
    deletePostMutation(postId);
  };

  const handleFollow = (userId) => {
    followUserMutation(userId);
  };

  const handleUnfollow = (userId) => {
    unfollowUserMutation(userId);
  };

  if (isLoading) {
    return (
      <Box maw={800} mx="auto" p="md">
        <Stack gap="lg">
          <Flex justify="space-between" align="center">
            <Title order={2}>Your Feed</Title>
            <SegmentedControl
              value={feedType}
              onChange={setFeedType}
              data={[
                { label: "All", value: "all" },
                { label: "Following", value: "following" },
              ]}
            />
          </Flex>
          <FeedSkeleton />
        </Stack>
      </Box>
    );
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
  const pagination = postsData?.pagination;
  return (
    <Box maw={800} mx="auto" p="md">
      <LoadingOverlay visible={isLoading} />
      <Stack gap="lg">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Title
            order={2}
            onClick={() => {
              console.log(posts);
            }}
          >
            Your Feed
          </Title>
          <Group>
            <SegmentedControl
              value={feedType}
              onChange={setFeedType}
              data={[
                { label: "All", value: "all" },
                { label: "Following", value: "following" },
              ]}
            />
          </Group>
        </Flex>
        {/* Error State */}
        {error && (
          <Text ta="center" c="red" py="xl">
            Error loading posts: {error.message}
          </Text>
        )}
        {/* Feed Content */}
        <Stack gap="md">
          {posts.length > 0 ? (
            posts.map((post) => (
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
            ))
          ) : (
            <Text ta="center" c="dimmed" py="xl">
              No posts available. Be the first to create one!
            </Text>
          )}
        </Stack>
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Center mt="lg">
            <Pagination
              total={pagination.totalPages}
              value={currentPage}
              onChange={setCurrentPage}
              color="brand"
            />
          </Center>
        )}
      </Stack>
    </Box>
  );
};

export default HomePage;
