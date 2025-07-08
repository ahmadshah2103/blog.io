"use client";
import React, { useState } from "react";
import {
  AppShell,
  Avatar,
  Text,
  ActionIcon,
  Flex,
  useMantineTheme,
  Menu,
  Box,
  Title,
  TextInput,
  Button,
  Group,
} from "@mantine/core";
import {
  IconSearch,
  IconLogout,
  IconUser,
  IconHome,
  IconPlus,
  IconHeart,
} from "@tabler/icons-react";
import { useAuth } from "@/store/store";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HEADER_HEIGHT = 60;

function BlogLayout({ children }) {
  const theme = useMantineTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const navItems = [
    { icon: IconHome, label: "Home", path: "/feed" },
    { icon: IconHeart, label: "Liked", path: "/liked" },
  ];

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      styles={{
        main: {
          background: theme.colors.gray[0],
        },
      }}
    >
      {/* Header */}
      <AppShell.Header
        p="md"
        style={{
          background: "white",
          borderBottom: `1px solid ${theme.colors.gray[2]}`,
        }}
      >
        <Flex align="center" justify="space-between" h="100%">
          {/* Left side - Logo and Navigation */}
          <Flex align="center" gap="xl">
            {/* Logo */}
            <Flex
              align="center"
              gap="sm"
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/dashboard")}
            >
              <Title order={3} fw={700} c="brand">
                Blog.io
              </Title>
            </Flex>

            {/* Navigation */}
            <Group gap="md" visibleFrom="sm">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="subtle"
                  leftSection={<item.icon size={18} />}
                  onClick={() => router.push(item.path)}
                  size="sm"
                >
                  {item.label}
                </Button>
              ))}
            </Group>
          </Flex>          {/* Center - Search Bar */}
          <Box style={{ flex: 1, maxWidth: 400 }} mx="xl" visibleFrom="md">
            <TextInput
              placeholder="Search blogs..."
              leftSection={<IconSearch size={16} />}
              value={searchValue}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && searchValue.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
                }
              }}
              radius="xl"
            />
          </Box>

          {/* Right side - Create button and Profile */}
          <Flex align="center" gap="md">            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => router.push("/create-post")}
              radius="xl"
            >
              Create
            </Button>

            {/* Profile Menu */}
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="subtle" radius="xl" size="lg">
                  <Avatar
                    name={user?.name || user?.email}
                    color="brand"
                    alt={user?.name || "User"}
                    radius="xl"
                    size="md"
                  />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {/* User Info */}
                <Menu.Item style={{ cursor: "default" }}>
                  <Box>
                    <Text fw={500} size="sm" truncate>
                      {user?.name || "User Name"}
                    </Text>
                    <Text size="xs" c="dimmed" truncate>
                      {user?.email || "user@example.com"}
                    </Text>
                  </Box>
                </Menu.Item>

                <Menu.Divider />

                {/* Menu Items */}
                <Menu.Item
                  leftSection={<IconUser size={16} />}
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </Menu.Item>

                <Menu.Divider />

                {/* Logout */}
                <Menu.Item
                  onClick={handleLogout}
                  leftSection={<IconLogout size={16} />}
                  color="red"
                >
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Flex>
      </AppShell.Header>

      {/* Main Content */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default BlogLayout;
