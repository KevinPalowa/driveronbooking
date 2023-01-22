import Layout from "@/components/Layout";
import React from "react";
import UserList from "@/components/UserList";

function Employee() {
  return (
    <Layout>
      <UserList role="employee" />
    </Layout>
  );
}

export default Employee;
