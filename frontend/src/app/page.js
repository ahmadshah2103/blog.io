"use client";
import CustomButton from "@/components/CustomButton";
import { Center, Flex, Title } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Center h="100vh">
        <Flex direction="column" gap="md">
          <Title>Welcome to Blog.io</Title>
          <CustomButton
            children={"Start Blogging"}
            icon="none"
            onClick={() => {
              router.push("./auth/login");
            }}
          />
        </Flex>
      </Center>
    </>
  );
}
