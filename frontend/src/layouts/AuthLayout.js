"use client";
import React from "react";
import {
  Box,
  Card,
  Center,
  Container,
  Flex,
  Paper,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";

const AuthLayout = ({ children }) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 991px)");
  const isSmallScreen = isMobile || isTablet;

  return (
    <Container fluid p="0" h="100dvh">
      <Flex align="center" justify="center" h="100%" gap="xl">
        <Box w="100%" maw={400}>
          <Paper shadow="md" p="xl" radius="md" h="100%">
              <Flex direction="column" gap="16px" p={0}>
                <Title order={2} ta="center" mb="md">
                  Welcome to Blog.io
                </Title>
                {children}
              </Flex>
          </Paper>
        </Box>
      </Flex>
    </Container>
  );
};

export default AuthLayout;
