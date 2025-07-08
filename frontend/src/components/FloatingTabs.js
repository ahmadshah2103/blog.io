import { Button, Flex } from "@mantine/core";

const FloatingTabs = ({
  tabs = [],
  activeTab,
  onTabChange,
  direction = "row",
  gap = "md",
  className,
  ...props
}) => {
  return (
    <Flex direction={direction} gap={gap} className={className} {...props}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          variant={activeTab === tab.value ? "filled" : "outline"}
          onClick={() => onTabChange(tab.value)}
          disabled={tab?.disabled}
          radius="md"
          size="xs"
          leftSection={tab.icon}
        >
          {tab.label}
        </Button>
      ))}
    </Flex>
  );
};

export default FloatingTabs;
