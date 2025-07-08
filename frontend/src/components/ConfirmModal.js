"use client";

import React from "react";
import { Modal, Button, Text, Flex } from "@mantine/core";

const ConfirmModal = ({
  opened,
  onClose = () => {
    console.log("Modal closed");
  },
  onConfirm = () => {
    console.log("Confirmed");
  },
  title = "Confirm Action",
  message = "Are you sure?",
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmButtonColor = "brand",
  isLoading = false,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="sm"
      radius="lg"
      c="dark"
      centered
    >
      <Text size="sm">{message}</Text>
      <Flex justify="space-between" mt="lg" gap="md">
        <Button onClick={onClose} variant="subtle" px="sm" color="red">
          {cancelText}
        </Button>
        <Button
          color={confirmButtonColor}
          onClick={onConfirm}
          loading={isLoading}
        >
          {confirmText}
        </Button>
      </Flex>
    </Modal>
  );
};

export default ConfirmModal;
