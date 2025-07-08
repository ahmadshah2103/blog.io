"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Text,
  Title,
  TextInput,
  LoadingOverlay,
  Center,
  Button,
  Group,
} from "@mantine/core";
import { IconSearch, IconArrowLeft } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetPosts,
  useLikePost,
  useUnlikePost,
  useDeletePost,
} from "@/hooks/usePostMutations";
import { useFollowUser, useUnfollowUser } from "@/hooks/useUserMutations";
import { useAuth } from "@/store/store";
import PostCard from "@/components/PostCard";
import { FeedSkeleton } from "@/components/LoadingStates";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { mutate: likePostMutation } = useLikePost();
  const { mutate: unlikePostMutation } = useUnlikePost();
  const { mutate: deletePostMutation } = useDeletePost();
  const { mutate: followUserMutation } = useFollowUser();
  const { mutate: unfollowUserMutation } = useUnfollowUser();

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

  const { data: postsData, isLoading } = useGetPosts({
    page: 1,
    limit: 100,
    search: debouncedQuery,
  });

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      setDebouncedQuery(query);
    }
    document.title = query ? `Search: ${query} - Blog.io` : "Search - Blog.io";
  }, [searchParams]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

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
          <Title order={2}>Search Posts</Title>
        </Group>
        {/* Search Input */}
        <TextInput
          placeholder="Search for blog posts by title..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          size="md"
          radius="md"
        />{" "}
        {/* Search Results */}
        {isLoading ? (
          <FeedSkeleton count={3} />
        ) : debouncedQuery.trim() ? (
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              {postsData?.data?.length || 0} result
              {(postsData?.data?.length || 0) !== 1 ? "s" : ""} found for "
              {debouncedQuery}"
            </Text>{" "}
            {postsData?.data?.length > 0 ? (
              <Stack gap="md">
                {postsData.data.map((post) => (
                  <PostCard
                    key={post.post_id}
                    post={post}
                    onLike={handleLike}
                    onUnlike={handleUnlike}
                    onDelete={handleDelete}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                    isLiked={post.likes?.some(
                      (like) => like.user_id === user?.user_id
                    )}
                    likesCount={post?.likes?.length || 0}
                    commentsCount={post.comments?.length || 0}
                  />
                ))}
              </Stack>
            ) : (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <IconSearch size={48} color="gray" />
                  <Stack align="center" gap="xs">
                    <Text size="lg" fw={500}>
                      No posts found
                    </Text>
                    <Text c="dimmed" ta="center">
                      Try searching with different keywords
                    </Text>
                  </Stack>
                  <Button onClick={() => router.push("/feed")}>
                    Browse All Posts
                  </Button>
                </Stack>
              </Center>
            )}
          </Stack>
        ) : (
          <Center py="xl">
            <Stack align="center" gap="md">
              <IconSearch size={48} color="gray" />
              <Stack align="center" gap="xs">
                <Text size="lg" fw={500}>
                  Search for blog posts
                </Text>
                <Text c="dimmed" ta="center">
                  Enter keywords to find posts by title
                </Text>
              </Stack>
            </Stack>
          </Center>
        )}
      </Stack>
    </Box>
  );
};

export default SearchPage;
