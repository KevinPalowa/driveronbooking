import React from "react";
import Layout from "@/components/Layout";
import UserDetail from "@/components/UserDetail";
function EmployeeDetail() {
  return (
    <Layout>
      <UserDetail role="employee" />
    </Layout>
  );
}

export default EmployeeDetail;
