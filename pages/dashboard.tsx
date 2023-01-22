import Layout from "@/components/Layout";
import RequestApproval from "@/components/RequestApproval";
import Request from "@/components/Request";
import { useUser } from "@/hooks/useUser";
export default function Dashboard() {
  const { user } = useUser();
  return (
    <Layout>
      {user?.role === "admin" && <RequestApproval />}
      {user?.role === "employee" && <Request />}
    </Layout>
  );
}
