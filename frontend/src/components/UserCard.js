"use client";
import React from "react";
import { Paper, Group, Avatar, Text, Button, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/store";
import {
  canUserFollowUser,
  getFollowButtonText,
  getFollowButtonVariant,
} from "@/utils/auth.util";

const UserCard = ({
  user: targetUser,
  isFollowing = false,
  onFollow,
  onUnfollow,
  showFollowButton = true,
}) => {
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const handleFollowToggle = () => {
    if (isFollowing) {
      onUnfollow?.(targetUser.user_id);
    } else {
      onFollow?.(targetUser.user_id);
    }
  };

  const handleUserClick = () => {
    router.push(`/profile/${targetUser.user_id}`);
  };

  const canFollow = canUserFollowUser(currentUser?.user_id, targetUser.user_id);
  return (
    <Paper p="md" withBorder>
      <Group justify="space-between">
        <Group style={{ cursor: "pointer" }} onClick={handleUserClick}>
          <Avatar
            src={targetUser.avatar_url}
            name={targetUser.name}
            size="md"
            color="brand"
          />
          <Stack gap={0}>
            <Text fw={500}>{targetUser.name}</Text>
            <Text size="sm" c="dimmed">
              {targetUser.email}
            </Text>
            {targetUser.bio && (
              <Text size="xs" c="dimmed" lineClamp={2}>
                {targetUser.bio}
              </Text>
            )}
          </Stack>
        </Group>

        {showFollowButton && canFollow && (
          <Button
            variant={getFollowButtonVariant(isFollowing)}
            size="sm"
            onClick={handleFollowToggle}
          >
            {getFollowButtonText(isFollowing)}
          </Button>
        )}
      </Group>
    </Paper>
  );
};

export default UserCard;
