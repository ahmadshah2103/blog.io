"use client";
import React from "react";
import {
  Paper,
  Group,
  Avatar,
  Text,
  ActionIcon,
  Box,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/store/store";
import { canUserDeleteComment } from "@/utils/auth.util";

const CommentItem = ({ comment, postAuthorId, onDelete }) => {
  const { user } = useAuth();

  const formatTimeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  const handleDeleteComment = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      onDelete?.(comment.comment_id);
    }
  };

  const canDelete = canUserDeleteComment(
    user?.user_id,
    comment.user_id,
    postAuthorId
  );

  return (
    <Paper p="md" withBorder radius="md">
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start">
          <Avatar
            name={comment.author?.name || "Unknown"}
            color="brand"
            radius="xl"
            size="sm"
            src={comment.author?.avatar_url}
          />
          <Box flex={1}>
            <Group gap="xs" mb="xs">
              <Text size="sm" fw={500}>
                {comment.author?.name || "Unknown"}
              </Text>
              <Text size="xs" c="dimmed">
                {formatTimeAgo(comment.created_at)}
              </Text>
            </Group>
            <Text size="sm">{comment.content}</Text>
          </Box>
        </Group>
        
        {canDelete && (
          <ActionIcon
            variant="subtle"
            color="red"
            size="sm"
            onClick={handleDeleteComment}
          >
            <IconTrash size={14} />
          </ActionIcon>
        )}
      </Group>
    </Paper>
  );
};

export default CommentItem;
