"use client";

import CustomMantineProvider from "./MantineProvider";
import CustomQueryClientProvider from "./QueryClientProvider";
import BarProgressProvider from "./BarProgressProvider";

export default function RootProvider({ children }) {
  return (
    <CustomMantineProvider>
      <CustomQueryClientProvider>
        <BarProgressProvider>{children}</BarProgressProvider>
      </CustomQueryClientProvider>
    </CustomMantineProvider>
  );
}
