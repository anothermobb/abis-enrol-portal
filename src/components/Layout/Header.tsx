import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, LogOut } from "lucide-react";

export const Header = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-soft">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">Enrollment Dashboard</h2>
        <Badge variant="secondary" className="bg-success text-success-foreground">
          System Online
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Officer Jane Smith</p>
            <p className="text-xs text-muted-foreground">ID: EO-001</p>
          </div>
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};