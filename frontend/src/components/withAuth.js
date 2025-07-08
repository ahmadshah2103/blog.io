"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/store";
import CustomLoader from "@/components/CustomLoader";
import { Center } from "@mantine/core";

const WithAuth = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, token, checkAuthentication } = useAuth();
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    checkAuthentication();
    setIsAuthResolved(true);
  }, [checkAuthentication]);

  useEffect(() => {
    if (isAuthResolved && (!isAuthenticated || !token)) {
      router.push("/auth/login");
    }
  }, [isAuthResolved, isAuthenticated, token, router]);

  if (!isAuthResolved) {
    return (
      <Center h="100vh" w="100vw" bg="white">
        <CustomLoader message="Authenticating..." />
      </Center>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
};

export default WithAuth;
