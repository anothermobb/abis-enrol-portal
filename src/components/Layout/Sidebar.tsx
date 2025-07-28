import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  UserPlus, 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  Shield,
  Clock
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "New Enrollment", href: "/enroll", icon: UserPlus },
  { name: "Records", href: "/records", icon: Users },
  { name: "Attendance", href: "/attendance", icon: Clock },
  { name: "Print Cards", href: "/print", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-card border-r border-border shadow-medium">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-8 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
          <Shield className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">ABIS</h1>
          <p className="text-sm text-muted-foreground">Biometric System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2024 ABIS System</p>
        </div>
      </div>
    </div>
  );
};