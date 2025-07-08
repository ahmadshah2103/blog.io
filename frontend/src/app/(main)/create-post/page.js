"use client";
import React, { useEffect } from "react";
import {
  Button,
  TextInput,
  Textarea,
  Title,
  Stack,
  Box,
  Paper,
  Group,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useCreatePost } from "@/hooks/usePostMutations";
import { IconArrowLeft } from "@tabler/icons-react";
import * as yup from "yup";

const createPostSchema = yup.object().shape({
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

const CreatePostPage = () => {
  const router = useRouter();
  const { mutate: createPost, isPending } = useCreatePost();

  useEffect(() => {
    document.title = "Create Post - Blog.io";
  }, []);

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
    },
    validate: yupResolver(createPostSchema),
  });

  const handleSubmit = () => {
    try {
      const validation = form.validate();
      if (validation.hasErrors) {
        return;
      }

      const postData = {
        title: form.values.title,
        content: form.values.content,
      };

      createPost(postData);
    } catch (error) {
      console.error("Error creating post:", error);
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
          <Title order={2}>Create New Post</Title>
        </Group>

        {/* Form */}
        <Paper p="lg" radius="md" withBorder>
          <Stack gap="md">
            <TextInput
              label="Title"
              placeholder="Enter your post title..."
              size="md"
              {...form.getInputProps("title")}
              error={form.errors.title}
              required
            />

            <Textarea
              label="Content"
              placeholder="Write your blog post content here..."
              minRows={10}
              autosize
              {...form.getInputProps("content")}
              error={form.errors.content}
              required
            />

            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                loading={isPending}
                color="brand"
              >
                Publish Post
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default CreatePostPage;
