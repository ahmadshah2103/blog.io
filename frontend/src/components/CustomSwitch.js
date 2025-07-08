import { Switch, Group, Text } from "@mantine/core";

const CustomSwitch = ({ form, label, name, ...props }) => {
  return (
    <Group>
      <Switch
        {...form.getInputProps(name, { type: "checkbox" })}
        styles={{
          track: {
            cursor: "pointer",
          },
        }}
        {...props}
      />

      <Text size="sm">{label}</Text>
    </Group>
  );
};

export default CustomSwitch;
