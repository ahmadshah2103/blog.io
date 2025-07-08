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
  TextInput,
  Textarea,
  LoadingOverlay,
  Tabs,
  Grid,
  Badge,
  ActionIcon,
  Modal,
} from "@mantine/core";
import {
  IconUser,
  IconMail,
  IconEdit,
  IconUserPlus,
  IconUserMinus,
  IconUsers,
  IconFileText,
} from "@tabler/icons-react";
import { useForm, yupResolver } from "@mantine/form";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/store";
import { 
  useGetUserProfile, 
  useUpdateUserProfile,
  useGetUserFollowers,
  useGetUserFollowing,
  useFollowUser,
  useUnfollowUser 
} from "@/hooks/useUserMutations";
import { useGetPosts, useDeletePost } from "@/hooks/usePostMutations";
import PostCard from "@/components/PostCard";
import UserCard from "@/components/UserCard";
import * as yup from "yup";

const profileSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  bio: yup
    .string()
    .max(500, "Bio must be less than 500 characters"),
  avatar_url: yup
    .string()
    .url("Must be a valid URL")
    .nullable(),
});

const ProfilePage = () => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  
  // For now, we'll show the current user's profile
  // Later this can be extended to show other users' profiles
  const userId = currentUser?.user_id;
  const { data: profileData, isLoading: profileLoading, refetch: refetchProfile } = useGetUserProfile(userId);
  const { data: userPosts, isLoading: postsLoading } = useGetPosts({ page: 1, limit: 100 }); // Get all posts for now
  const { data: followers } = useGetUserFollowers(userId);  const { data: following } = useGetUserFollowing(userId);
  
  const { mutate: updateProfile, isPending: updatePending } = useUpdateUserProfile();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();

  useEffect(() => {
    document.title = "Profile - Blog.io";
  }, []);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      bio: "",
      avatar_url: "",
    },
    validate: yupResolver(profileSchema),
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profileData?.data) {
      form.setValues({
        name: profileData.data.name || "",
        email: profileData.data.email || "",
        bio: profileData.data.bio || "",
        avatar_url: profileData.data.avatar_url || "",
      });
    }
  }, [profileData]);
  const handleUpdateProfile = () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    updateProfile(
      { userId, userData: form.values },
      {
        onSuccess: () => {
          setEditMode(false);
          refetchProfile();
        },
      }
    );
  };

  const handleDeletePost = (postId) => {
    deletePost(postId);
  };

  const handleFollowUser = (targetUserId) => {
    followUser(targetUserId);
  };

  const handleUnfollowUser = (targetUserId) => {
    unfollowUser(targetUserId);
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
  const profile = profileData?.data;
  const allPosts = userPosts?.data || [];
  // Filter posts by current user
  const posts = allPosts.filter(post => post.user_id === userId);
  const followersCount = followers?.data?.length || 0;
  const followingCount = following?.data?.length || 0;

  return (
    <Box p="md" maw={800} mx="auto">
      <Stack gap="lg">
        {/* Profile Header */}
        <Paper p="xl" radius="md" withBorder>
          <Group align="flex-start" gap="xl">
            <Avatar
              src={profile?.avatar_url}
              name={profile?.name}
              size={120}
              radius="md"
              color="brand"
            />
            
            <Stack flex={1} gap="md">
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs">
                  <Title order={2}>{profile?.name || "User Name"}</Title>
                  <Text c="dimmed" size="sm">{profile?.email}</Text>
                  {profile?.bio && <Text size="sm">{profile.bio}</Text>}
                  <Text size="xs" c="dimmed">
                    Joined {formatTimeAgo(profile?.created_at)}
                  </Text>
                </Stack>
                
                <Button
                  leftSection={<IconEdit size={16} />}
                  variant="light"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              </Group>

              {/* Stats */}
              <Group gap="xl">
                <Group gap="xs">
                  <IconFileText size={16} />
                  <Text size="sm" fw={500}>{posts.length}</Text>
                  <Text size="sm" c="dimmed">Posts</Text>
                </Group>
                <Group gap="xs">
                  <IconUsers size={16} />
                  <Text size="sm" fw={500}>{followersCount}</Text>
                  <Text size="sm" c="dimmed">Followers</Text>
                </Group>
                <Group gap="xs">
                  <IconUserPlus size={16} />
                  <Text size="sm" fw={500}>{followingCount}</Text>
                  <Text size="sm" c="dimmed">Following</Text>
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
            <Tabs.Tab value="following" leftSection={<IconUserPlus size={16} />}>
              Following ({followingCount})
            </Tabs.Tab>
          </Tabs.List>          <Tabs.Panel value="posts" pt="lg">
            {postsLoading ? (
              <LoadingOverlay visible />
            ) : posts.length > 0 ? (
              <Stack gap="md">
                {posts.map((post) => (
                  <PostCard
                    key={post.post_id}
                    post={post}
                    onDelete={handleDeletePost}
                    isLiked={false} // TODO: Get from API
                    likesCount={0} // TODO: Get from API
                    commentsCount={0} // TODO: Get from API
                    compact={true}
                  />
                ))}
              </Stack>
            ) : (
              <Text ta="center" c="dimmed" py="xl">
                No posts yet
              </Text>
            )}
          </Tabs.Panel>          <Tabs.Panel value="followers" pt="lg">
            {followers?.data?.length > 0 ? (
              <Stack gap="md">
                {followers.data.map((follower) => (
                  <UserCard
                    key={follower.user_id}
                    user={follower}
                    showFollowButton={false}
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
                    isFollowing={true}
                    onUnfollow={handleUnfollowUser}
                    showFollowButton={true}
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

      {/* Edit Profile Modal */}
      <Modal
        opened={editMode}
        onClose={() => setEditMode(false)}
        title="Edit Profile"
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="Your name"
            leftSection={<IconUser size={16} />}
            {...form.getInputProps("name")}
            required
          />
          
          <TextInput
            label="Email"
            placeholder="your@email.com"
            leftSection={<IconMail size={16} />}
            {...form.getInputProps("email")}
            required
          />
          
          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            minRows={3}
            maxRows={5}
            {...form.getInputProps("bio")}
          />
          
          <TextInput
            label="Avatar URL"
            placeholder="https://example.com/avatar.jpg"
            {...form.getInputProps("avatar_url")}
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProfile}
              loading={updatePending}
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default ProfilePage;
