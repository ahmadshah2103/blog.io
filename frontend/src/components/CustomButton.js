import React from "react";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

const CustomButton = ({
  onClick,
  children,
  icon,
  variant = "filled",
  ...props
}) => {
  return (
    <Button
      leftSection={
        icon === "none" ? undefined : icon || <IconPlus stroke={3} size={14} />
      }
      variant={variant}
      onClick={onClick}
      size="sm"
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
