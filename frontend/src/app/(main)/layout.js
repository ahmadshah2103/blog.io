// /(dashboard)/layout.js
import React from "react";
import BlogLayout from "@/layouts/BlogLayout";
import WithAuth from "@/components/withAuth";

const Dashboard = ({ children }) => {
  return (
    <WithAuth>
      <BlogLayout>{children}</BlogLayout>
    </WithAuth>
  );
};
export default Dashboard;
