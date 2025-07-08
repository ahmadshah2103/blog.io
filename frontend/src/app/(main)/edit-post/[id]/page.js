"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Stack,
  TextInput,
  Textarea,
  Button,
  Title,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useParams, useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { useAuth } from "@/store/store";
import { useGetPost, useUpdatePost } from "@/hooks/usePostMutations";
import { canUserEditPost } from "@/utils/auth.util";
import * as yup from "yup";

const editPostSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  content: yup
    .string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must be less than 5000 characters"),
});

const EditPostPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const postId = params.id;

  const { data: postData, isLoading: postLoading, error: postError } = useGetPost(postId);
  const { mutate: updatePost, isPending: updatePending } = useUpdatePost();

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
    },
    validate: yupResolver(editPostSchema),
  });

  useEffect(() => {
    if (postData?.data) {
      const post = postData.data;
      
      // Check if user can edit this post
      if (!canUserEditPost(user?.user_id, post.user_id)) {
        router.push("/feed");
        return;
      }

      form.setValues({
        title: post.title || "",
        content: post.content || "",
      });
      
      document.title = `Edit: ${post.title} - Blog.io`;
    }
  }, [postData, user, router]);

  const handleSubmit = () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    updatePost(
      { postId, postData: form.values },
      {
        onSuccess: () => {
          router.push(`/post/${postId}`);
        },
      }
    );
  };

  if (postLoading) {
    return (
      <Box maw={800} mx="auto" p="md">
        <LoadingOverlay visible />
      </Box>
    );
  }

  if (postError || !postData?.data) {
    return (
      <Box maw={800} mx="auto" p="md" ta="center">
        <Title order={3} c="red">Post not found</Title>
        <Button mt="md" onClick={() => router.push("/feed")}>
          Back to Feed
        </Button>
      </Box>
    );
  }

  const post = postData.data;

  // Double-check authorization
  if (!canUserEditPost(user?.user_id, post.user_id)) {
    return (
      <Box maw={800} mx="auto" p="md" ta="center">
        <Title order={3} c="red">Unauthorized</Title>
        <Text c="dimmed" mb="md">You don't have permission to edit this post.</Text>
        <Button onClick={() => router.push("/feed")}>
          Back to Feed
        </Button>
      </Box>
    );
  }

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
          <Title order={2}>Edit Post</Title>
        </Group>

        {/* Form */}
        <Paper p="lg" radius="md" withBorder>
          <Stack gap="md">
            <TextInput
              label="Title"
              placeholder="Enter post title..."
              {...form.getInputProps("title")}
              required
            />

            <Textarea
              label="Content"
              placeholder="Write your post content..."
              minRows={10}
              maxRows={20}
              {...form.getInputProps("content")}
              required
            />

            <Group justify="flex-end">
              <Button
                variant="light"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                loading={updatePending}
                disabled={!form.values.title.trim() || !form.values.content.trim()}
              >
                Update Post
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default EditPostPage;
