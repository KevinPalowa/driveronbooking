import Layout from "@/components/Layout";
import RequestApproval from "@/components/RequestApproval";
import { useUser } from "@/hooks/useUser";
import RouterList from "@/components/RouteList";
import MyRoutes from "@/components/MyRoutes";
export default function Dashboard() {
  const { user } = useUser();
  return (
    <Layout>
      {user?.role === "admin" && <RequestApproval />}
      {user?.role === "employee" && <RouterList role="employee" />}
      {user?.role === "driver" && <MyRoutes />}
    </Layout>
  );
}
