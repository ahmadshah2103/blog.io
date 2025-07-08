"use client";
import React from "react";
import { Center, Loader as MantineLoader, Text } from "@mantine/core";

const CustomLoader = ({ message = "Loading...", size = "md" }) => {
  return (
    <Center w="100%" h="100%" style={{ flexDirection: "column" }}>
      <MantineLoader color="brand" size={size} />
      <Text mt="md" c="dimmed">
        {message}
      </Text>
    </Center>
  );
};

export default CustomLoader;
