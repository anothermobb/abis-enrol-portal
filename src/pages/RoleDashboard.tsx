import { useRole } from "@/components/RoleProvider";
import { Dashboard } from "./Dashboard";
import { OperatorDashboard } from "./OperatorDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { useLocation } from "react-router-dom";

export const RoleDashboard = () => {
  const { role } = useRole();
  const location = useLocation();

  // If on /admin route, always show admin dashboard
  if (location.pathname === "/admin") {
    return <AdminDashboard />;
  }

  // For home route, show role-specific dashboard
  if (location.pathname === "/") {
    return role === "admin" ? <Dashboard /> : <OperatorDashboard />;
  }

  // Default fallback
  return <Dashboard />;
};