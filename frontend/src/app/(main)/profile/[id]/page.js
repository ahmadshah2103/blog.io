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
  LoadingOverlay,
  Tabs,
  Center,
} from "@mantine/core";
import {
  IconUser,
  IconUserPlus,
  IconUserMinus,
  IconUsers,
  IconFileText,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/store/store";
import {
  useGetUserProfile,
  useGetUserFollowers,
  useGetUserFollowing,
  useFollowUser,
  useUnfollowUser,
  useCheckFollowStatus,
} from "@/hooks/useUserMutations";
import { useGetPosts } from "@/hooks/usePostMutations";
import {
  canUserFollowUser,
  getFollowButtonText,
  getFollowButtonVariant,
} from "@/utils/auth.util";
import PostCard from "@/components/PostCard";
import UserCard from "@/components/UserCard";

const UserProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");

  const userId = params.id;

  const { data: profileData, isLoading: profileLoading } =
    useGetUserProfile(userId);
  const { data: userPosts, isLoading: postsLoading } = useGetPosts({
    page: 1,
    limit: 100,
  });
  const { data: followers } = useGetUserFollowers(userId);
  const { data: following } = useGetUserFollowing(userId);
  const { data: followStatus } = useCheckFollowStatus(userId);

  const isFollowing = followStatus?.data?.is_following || false;

  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();

  useEffect(() => {
    if (profileData?.data) {
      document.title = `${profileData.data.name} - Blog.io`;
    }
  }, [profileData]);

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  const formatTimeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  if (profileLoading) {
    return <LoadingOverlay visible />;
  }

  if (!profileData?.data) {
    return (
      <Box maw={800} mx="auto" p="md" ta="center">
        <Title order={3} c="red">
          User not found
        </Title>
        <Button mt="md" onClick={() => router.push("/feed")}>
          Back to Feed
        </Button>
      </Box>
    );
  }

  const profile = profileData.data;
  const allPosts = userPosts?.data || [];
  const posts = allPosts.filter((post) => post.user_id === userId);
  const followersCount = followers?.data?.length || 0;
  const followingCount = following?.data?.length || 0;
  const canFollow = canUserFollowUser(currentUser?.user_id, userId);

  return (
    <Box p="md" maw={800} mx="auto">
      <Stack gap="lg">
        {/* Back Button */}
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => router.back()}
          >
            Back
          </Button>
        </Group>

        {/* Profile Header */}
        <Paper p="xl" radius="md" withBorder>
          <Group align="flex-start" gap="xl">
            <Avatar
              src={profile.avatar_url}
              name={profile.name}
              size={120}
              radius="md"
              color="brand"
            />

            <Stack flex={1} gap="md">
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs">
                  <Title order={2}>{profile.name}</Title>
                  <Text c="dimmed" size="sm">
                    {profile.email}
                  </Text>
                  {profile.bio && <Text size="sm">{profile.bio}</Text>}
                  <Text size="xs" c="dimmed">
                    Joined {formatTimeAgo(profile.created_at)}
                  </Text>
                </Stack>

                {canFollow && (
                  <Button
                    leftSection={
                      isFollowing ? (
                        <IconUserMinus size={16} />
                      ) : (
                        <IconUserPlus size={16} />
                      )
                    }
                    variant={getFollowButtonVariant(isFollowing)}
                    onClick={handleFollowToggle}
                  >
                    {getFollowButtonText(isFollowing)}
                  </Button>
                )}
              </Group>

              {/* Stats */}
              <Group gap="xl">
                <Group gap="xs">
                  <IconFileText size={16} />
                  <Text size="sm" fw={500}>
                    {posts.length}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Posts
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconUsers size={16} />
                  <Text size="sm" fw={500}>
                    {followersCount}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Followers
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconUserPlus size={16} />
                  <Text size="sm" fw={500}>
                    {followingCount}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Following
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Group>
        </Paper>

        {/* Tabs Section */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="posts" leftSection={<IconFileText size={16} />}>
              Posts ({posts.length})
            </Tabs.Tab>
            <Tabs.Tab value="followers" leftSection={<IconUsers size={16} />}>
              Followers ({followersCount})
            </Tabs.Tab>
            <Tabs.Tab
              value="following"
              leftSection={<IconUserPlus size={16} />}
            >
              Following ({followingCount})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="posts" pt="lg">
            {postsLoading ? (
              <LoadingOverlay visible />
            ) : posts.length > 0 ? (
              <Stack gap="md">
                {posts.map((post) => (
                  <PostCard
                    key={post.post_id}
                    post={post}
                    isLiked={false}
                    likesCount={0}
                    commentsCount={0}
                    compact={true}
                    showFollowButton={false}
                  />
                ))}
              </Stack>
            ) : (
              <Text ta="center" c="dimmed" py="xl">
                No posts yet
              </Text>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="followers" pt="lg">
            {followers?.data?.length > 0 ? (
              <Stack gap="md">
                {followers.data.map((follower) => (
                  <UserCard
                    key={follower.user_id}
                    user={follower}
                    showFollowButton={canUserFollowUser(
                      currentUser?.user_id,
                      follower.user_id
                    )}
                  />
                ))}
              </Stack>
            ) : (
              <Text ta="center" c="dimmed" py="xl">
                No followers yet
              </Text>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="following" pt="lg">
            {following?.data?.length > 0 ? (
              <Stack gap="md">
                {following.data.map((followedUser) => (
                  <UserCard
                    key={followedUser.user_id}
                    user={followedUser}
                    showFollowButton={canUserFollowUser(
                      currentUser?.user_id,
                      followedUser.user_id
                    )}
                  />
                ))}
              </Stack>
            ) : (
              <Text ta="center" c="dimmed" py="xl">
                Not following anyone yet
              </Text>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Box>
  );
};

export default UserProfilePage;
