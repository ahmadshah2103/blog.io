"use client";
import { ProgressProvider } from "@bprogress/next/app";
import "@bprogress/core/css";

const BarProgressProvider = ({ children }) => {
  return (
    <ProgressProvider
      height="3px"
      color="#0F172B"
      options={{ showSpinner: false }}
    >
      {children}
    </ProgressProvider>
  );
};

export default BarProgressProvider;
