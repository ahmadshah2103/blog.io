// Comprehensive loading states for better UX
"use client";
import React from "react";
import {
  Box,
  Stack,
  Skeleton,
  Group,
  Paper,
  Center,
  Loader,
  Text,
} from "@mantine/core";

export const PostCardSkeleton = ({ compact = false }) => (
  <Paper p={compact ? "md" : "lg"} radius="md" withBorder>
    <Stack gap={compact ? "sm" : "md"}>
      {/* Author Info Skeleton */}
      <Group justify="space-between" align="flex-start">
        <Group>
          <Skeleton height={compact ? 32 : 40} circle />
          <Box>
            <Skeleton height={16} width={120} mb="xs" />
            <Skeleton height={12} width={80} />
          </Box>
        </Group>
        <Skeleton height={24} width={60} />
      </Group>

      {/* Content Skeleton */}
      <Box>
        <Skeleton height={compact ? 18 : 24} width="80%" mb="xs" />
        <Stack gap="xs">
          <Skeleton height={14} />
          <Skeleton height={14} />
          <Skeleton height={14} width="60%" />
        </Stack>
      </Box>

      {/* Actions Skeleton */}
      <Group justify="space-between">
        <Group gap="lg">
          <Group gap="xs">
            <Skeleton height={24} width={24} />
            <Skeleton height={12} width={20} />
          </Group>
          <Group gap="xs">
            <Skeleton height={24} width={24} />
            <Skeleton height={12} width={20} />
          </Group>
        </Group>
        <Skeleton height={24} width={24} />
      </Group>
    </Stack>
  </Paper>
);

export const CommentSkeleton = () => (
  <Box p="md" withBorder radius="md">
    <Group align="flex-start" mb="sm">
      <Skeleton height={32} circle />
      <Box flex={1}>
        <Skeleton height={14} width={100} mb="xs" />
        <Skeleton height={12} width={60} />
      </Box>
    </Group>
    <Skeleton height={14} mb="xs" />
    <Skeleton height={12} width="80%" />
  </Box>
);

export const UserCardSkeleton = () => (
  <Paper p="md" radius="md" withBorder>
    <Group>
      <Skeleton height={48} circle />
      <Box flex={1}>
        <Skeleton height={16} width={120} mb="xs" />
        <Skeleton height={12} width={80} mb="xs" />
        <Skeleton height={12} width={60} />
      </Box>
      <Skeleton height={32} width={80} />
    </Group>
  </Paper>
);

export const FeedSkeleton = ({ count = 5 }) => (
  <Stack gap="md">
    {Array.from({ length: count }, (_, index) => (
      <PostCardSkeleton key={index} />
    ))}
  </Stack>
);

export const SearchSkeleton = () => (
  <Box>
    <Skeleton height={40} mb="lg" />
    <FeedSkeleton count={3} />
  </Box>
);

export const ProfileSkeleton = () => (
  <Stack gap="lg">
    {/* Profile Header */}
    <Paper p="xl" radius="md" withBorder>
      <Group align="flex-start" mb="lg">
        <Skeleton height={80} circle />
        <Box flex={1}>
          <Skeleton height={24} width={200} mb="sm" />
          <Skeleton height={16} width={150} mb="sm" />
          <Group gap="lg" mb="sm">
            <Box>
              <Skeleton height={20} width={40} mb="xs" />
              <Skeleton height={14} width={60} />
            </Box>
            <Box>
              <Skeleton height={20} width={40} mb="xs" />
              <Skeleton height={14} width={80} />
            </Box>
          </Group>
        </Box>
        <Skeleton height={36} width={100} />
      </Group>
      <Skeleton height={14} width="100%" mb="xs" />
      <Skeleton height={14} width="80%" />
    </Paper>

    {/* Posts */}
    <FeedSkeleton count={3} />
  </Stack>
);

export const CenteredLoader = ({ message = "Loading..." }) => (
  <Center py="xl">
    <Stack align="center" gap="md">
      <Loader color="brand" size="md" />
      <Text c="dimmed" size="sm">
        {message}
      </Text>
    </Stack>
  </Center>
);

export const InlineLoader = ({ size = "sm" }) => (
  <Group gap="xs">
    <Loader size={size} />
    <Text size={size} c="dimmed">
      Loading...
    </Text>
  </Group>
);
