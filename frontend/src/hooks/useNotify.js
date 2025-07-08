import { notifications } from "@mantine/notifications";
import { IconX, IconCheck } from "@tabler/icons-react";

export const useNotify = () => {
  const showError = ({ title, message }) => {
    notifications.show({
      title: title || "Something went wrong!",
      message: message || "We are unable to process your request!",
      color: "red",
      position: "top-center",
      autoClose: 5000,
      icon: <IconX />,
      radius: "md",
    });
  };

  const showSuccess = ({ title, message }) => {
    notifications.show({
      title: title || "Success",
      message: message || "Operation completed successfully!",
      color: "green",
      position: "top-center",
      autoClose: 5000,
      icon: <IconCheck />,
      radius: "md",
    });
  };

  return { showError, showSuccess };
};
