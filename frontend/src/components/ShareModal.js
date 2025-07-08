"use client";
import React, { useState } from "react";
import {
  Modal,
  Stack,
  Group,
  Button,
  Text,
  ActionIcon,
  TextInput,
  Box,
  Notification,
} from "@mantine/core";
import {
  IconCopy,
  IconCheck,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconMail,
} from "@tabler/icons-react";

const ShareModal = ({ opened, onClose, post }) => {
  const [copied, setCopied] = useState(false);
  const postUrl = typeof window !== "undefined" ? `${window.location.origin}/post/${post?.post_id}` : "";
  const postTitle = post?.title || "Check out this blog post";
  const encodedTitle = encodeURIComponent(postTitle);
  const encodedUrl = encodeURIComponent(postUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareOptions = [
    {
      name: "Twitter",
      icon: IconBrandTwitter,
      color: "#1DA1F2",
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: IconBrandFacebook,
      color: "#4267B2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: IconBrandLinkedin,
      color: "#0077B5",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Email",
      icon: IconMail,
      color: "#EA4335",
      url: `mailto:?subject=${encodedTitle}&body=Check out this blog post: ${encodedUrl}`,
    },
  ];

  const handleSocialShare = (url) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Share this post"
      size="sm"
      centered
    >
      <Stack gap="md">
        {/* Post Preview */}
        <Box p="sm" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
          <Text fw={500} size="sm" lineClamp={1}>
            {post?.title}
          </Text>
          <Text size="xs" c="dimmed" mt="xs">
            by {post?.author?.name || "Unknown"}
          </Text>
        </Box>

        {/* Copy Link */}
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Copy Link
          </Text>
          <Group gap="xs">
            <TextInput
              value={postUrl}
              readOnly
              flex={1}
              size="sm"
            />
            <ActionIcon
              variant="filled"
              color={copied ? "green" : "blue"}
              onClick={handleCopyLink}
              size={36}
            >
              {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            </ActionIcon>
          </Group>
          {copied && (
            <Text size="xs" c="green">
              Link copied to clipboard!
            </Text>
          )}
        </Stack>

        {/* Social Media Options */}
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Share on Social Media
          </Text>
          <Group gap="sm">
            {shareOptions.map((option) => (
              <Button
                key={option.name}
                variant="light"
                leftSection={<option.icon size={16} />}
                onClick={() => handleSocialShare(option.url)}
                size="sm"
                style={{ color: option.color }}
              >
                {option.name}
              </Button>
            ))}
          </Group>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ShareModal;
