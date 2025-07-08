"use client";
import React, { useState } from "react";
import {
  Paper,
  Stack,
  Group,
  Avatar,
  Text,
  Title,
  ActionIcon,
  Box,
  Menu,
  Button,
} from "@mantine/core";
import {
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconShare,
  IconDots,
  IconEdit,
  IconTrash,
  IconUserPlus,
  IconUserMinus,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/store/store";
import { useNotify } from "@/hooks/useNotify";
import {
  canUserLikePost,
  canUserDeletePost,
  canUserEditPost,
  getLikeButtonProps,
} from "@/utils/auth.util";
import { NOTIFICATION_MESSAGES } from "@/utils/notifications.util";
import ShareModal from "./ShareModal";

const PostCard = ({
  post,
  onLike,
  onUnlike,
  onDelete,
  showActions = true,
  isLiked = false,
  likesCount = 0,
  commentsCount = 0,
  compact = false,
  showFullContent = false,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { showError, showSuccess } = useNotify();
  const [shareModalOpened, setShareModalOpened] = useState(false);

  const formatTimeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };
  const handleLikeToggle = (e) => {
    e.stopPropagation();
    if (!canUserLikePost(user?.user_id, post.user_id)) {
      showError({ message: "You cannot like your own posts" });
      return;
    }

    if (isLiked) {
      onUnlike?.(post.post_id);
    } else {
      onLike?.(post.post_id);
    }
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete?.(post.post_id);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShareModalOpened(true);
  };

  const canDelete = canUserDeletePost(user?.user_id, post.user_id);
  const canEdit = canUserEditPost(user?.user_id, post.user_id);
  const canLike = canUserLikePost(user?.user_id, post.user_id);
  const likeButtonProps = getLikeButtonProps(isLiked);

  return (
    <>
      <Paper
        p={compact ? "md" : "lg"}
        radius="md"
        withBorder
        style={{ cursor: "pointer" }}
        onClick={() => router.push(`/post/${post.post_id}`)}
      >
        {" "}
        <Stack gap={compact ? "sm" : "md"}>
          {/* Author Info */}
          <Group justify="space-between" align="flex-start">
            <Group>
              <Avatar
                name={post.author?.name || "Unknown"}
                color="brand"
                radius="xl"
                size={compact ? "sm" : "md"}
                src={post.author?.avatar_url}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${post.user_id}`);
                }}
              />
              <Box>
                <Text
                  size="sm"
                  fw={500}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profile/${post.user_id}`);
                  }}
                >
                  {post.author?.name || "Unknown Author"}
                </Text>
                <Text size="xs" c="dimmed">
                  {formatTimeAgo(post.created_at)}
                </Text>
              </Box>
            </Group>{" "}
            {/* Options */}
            <Group gap="xs">
              {/* Post Options Menu */}
              {(canEdit || canDelete) && (
                <Menu position="bottom-end">
                  <Menu.Target>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {canEdit && (
                      <Menu.Item
                        leftSection={<IconEdit size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/edit-post/${post.post_id}`);
                        }}
                      >
                        Edit Post
                      </Menu.Item>
                    )}
                    {canDelete && (
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost();
                        }}
                      >
                        Delete Post
                      </Menu.Item>
                    )}{" "}
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>
          </Group>

          {/* Post Content */}
          <Box
            onClick={
              showFullContent
                ? undefined
                : () => router.push(`/post/${post.post_id}`)
            }
          >
            <Title order={compact ? 5 : showFullContent ? 2 : 4} mb="xs">
              {post.title}
            </Title>
            <Text
              size={showFullContent ? "md" : "sm"}
              c={showFullContent ? "dark" : "dimmed"}
              lineClamp={showFullContent ? undefined : compact ? 2 : 3}
              style={{
                whiteSpace: "pre-wrap",
                cursor: showFullContent ? "default" : "pointer",
              }}
            >
              {post.content}
            </Text>
          </Box>

          {/* Actions */}
          {showActions && (
            <Group justify="space-between">
              <Group gap="lg">
                <Group gap="xs">
                  <ActionIcon
                    {...likeButtonProps}
                    size="sm"
                    onClick={handleLikeToggle}
                    disabled={!canLike}
                    style={{
                      opacity: canLike ? 1 : 0.5,
                      cursor: canLike ? "pointer" : "not-allowed",
                    }}
                  >
                    {isLiked ? (
                      <IconHeartFilled size={16} />
                    ) : (
                      <IconHeart size={16} />
                    )}
                  </ActionIcon>
                  <Text size="sm">{likesCount}</Text>
                </Group>

                <Group gap="xs">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/post/${post.post_id}`);
                    }}
                  >
                    <IconMessageCircle size={16} />
                  </ActionIcon>{" "}
                  <Text size="sm">{commentsCount}</Text>
                </Group>
              </Group>

              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={handleShareClick}
              >
                <IconShare size={16} />
              </ActionIcon>
            </Group>
          )}
        </Stack>
        {/* Share Modal */}
      </Paper>
      <ShareModal
        opened={shareModalOpened}
        onClose={() => setShareModalOpened(false)}
        post={post}
      />
    </>
  );
};

export default PostCard;
