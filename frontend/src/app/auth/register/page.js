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
import { IconUser, IconMail, IconEye, IconEyeOff } from "@tabler/icons-react";
import { registerSchema } from "@/schema/auth.schema";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { useLoginMutation, useRegisterMutation } from "@/hooks/useAuthMutation";

const RegisterPage = () => {
  useEffect(() => {
    document.title = "Register - Blog.io";
  }, []);

  const theme = useMantineTheme();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: yupResolver(registerSchema),
  });

  const { mutate: register, isPending } = useRegisterMutation();

  const handleSubmit = () => {
    try {
      const validation = form.validate();
      if (validation.hasErrors) {
        return;
      }

      const userData = {
        name: form.values.name,
        email: form.values.email,
        password: form.values.password,
        confirmPassword: form.values.confirmPassword,
      };

      register(userData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Text ta="center" c={theme.colors.darkText[0]}>
        Create your Blog.io account.
      </Text>

      {/* Form Section */}
      {/* Name */}
      <TextInput
        label="Name"
        placeholder="You Name"
        rightSection={<IconUser size={20} color="gray" />}
        {...form.getInputProps("name")}
        required
        error={form.errors.name}
      />
      {/* Username Input */}
      <TextInput
        label="Email"
        placeholder="you@email.com"
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
      {/* Confirm Password Input */}
      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm Password"
        {...form.getInputProps("confirmPassword")}
        required
        error={form.errors.confirmPassword}
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
        Sign Up
      </Button>
      <Text ta="center" mt="md" c={theme.colors.darkText[0]}>
        Already have an account?{" "}
        <Text
          component="span"
          c={theme.colors.brand[6]}
          onClick={() => router.push("/auth/login")}
          style={{ cursor: "pointer" }}
        >
          Login
        </Text>
      </Text>
    </>
  );
};

export default RegisterPage;
