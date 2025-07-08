import AuthLayout from "@/layouts/AuthLayout";
import { Loader } from "@mantine/core";
import React, { Suspense } from "react";

const layout = ({ children }) => {
  return (
    <Suspense fallback={<Loader />}>
      <AuthLayout>{children}</AuthLayout>
    </Suspense>
  );
};

export default layout;
