"use client";
import React, { useEffect } from "react";
import {
  Button,
  PasswordInput,
  TextInput,
  Title,
  useMantineTheme,
  Flex,
  Center,
  Text,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { IconMail, IconEye, IconEyeOff } from "@tabler/icons-react";
import { loginSchema } from "@/schema/auth.schema";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { useLoginMutation } from "@/hooks/useAuthMutation";

const LogInPage = () => {
  useEffect(() => {
    document.title = "Login - Blog.io";
  }, []);

  const theme = useMantineTheme();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: yupResolver(loginSchema),
  });

  const { mutate: login, isPending } = useLoginMutation();

  const handleSubmit = () => {
    try {
      const validation = form.validate();
      if (validation.hasErrors) {
        console.error(error);
        return;
      }

      const loginData = {
        email: form.values.email,
        password: form.values.password,
      };

      login(loginData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Text ta="center" c={theme.colors.darkText[0]}>
        Sign in to your account.
      </Text>

      {/* Form Section */}
      {/* Username Input */}
      <TextInput
        label="Email"
        placeholder="Email"
        rightSection={<IconMail size={20} color="gray" />}
        {...form.getInputProps("email")}
        required
        error={form.errors.email}
      />
      {/* Password Input */}
      <PasswordInput
        label="Password"
        placeholder="Password"
        {...form.getInputProps("password")}
        required
        error={form.errors.password}
        visibilityToggleIcon={({ reveal }) =>
          reveal ? <IconEye size={20} /> : <IconEyeOff size={20} />
        }
      />
      {/* Submit Button */}
      <Button
        fullWidth
        mt="md"
        color="brand"
        size="md"
        onClick={handleSubmit}
        loading={isPending}
      >
        Sign In
      </Button>
      <Text ta="center" mt="md" c={theme.colors.darkText[0]}>
        Don't have an account?{" "}
        <Text
          component="span"
          c={theme.colors.brand[6]}
          onClick={() => router.push("/auth/register")}
          style={{ cursor: "pointer" }}
        >
          Sign Up
        </Text>
      </Text>
    </>
  );
};

export default LogInPage;
