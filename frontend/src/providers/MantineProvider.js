import { MantineProvider } from "@mantine/core";
import { theme } from "@/constants/theme";

export default function CustomMantineProvider({ children }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
