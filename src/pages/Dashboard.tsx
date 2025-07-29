import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, FileText, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Total Enrolled",
    value: "12,847",
    change: "+8.2%",
    icon: Users,
    trend: "up"
  },
  {
    title: "Today's Enrollments",
    value: "47",
    change: "+12.5%",
    icon: UserPlus,
    trend: "up"
  },
  {
    title: "Cards Printed",
    value: "12,203",
    change: "+5.1%",
    icon: FileText,
    trend: "up"
  },
  {
    title: "Pending Reviews",
    value: "23",
    change: "-2.3%",
    icon: AlertTriangle,
    trend: "down"
  }
];

const recentEnrollments = [
  {
    id: "ENR-2024-001247",
    name: "John Doe",
    time: "10 minutes ago",
    status: "completed",
    quality: "excellent"
  },
  {
    id: "ENR-2024-001246",
    name: "Sarah Johnson",
    time: "25 minutes ago",
    status: "pending",
    quality: "good"
  },
  {
    id: "ENR-2024-001245",
    name: "Michael Brown",
    time: "1 hour ago",
    status: "completed",
    quality: "excellent"
  },
  {
    id: "ENR-2024-001244",
    name: "Emma Wilson",
    time: "2 hours ago",
    status: "review",
    quality: "fair"
  }
];

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Officer Smith</h1>
          <p className="text-muted-foreground mt-1">
            Here's your enrollment dashboard overview for today
          </p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => navigate("/enroll")}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          New Enrollment
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-gradient-card shadow-soft border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className={`h-3 w-3 ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`} />
                <span className={stat.trend === 'up' ? 'text-success' : 'text-destructive'}>
                  {stat.change}
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <Card className="bg-gradient-card shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-foreground">{enrollment.name}</p>
                    <p className="text-sm text-muted-foreground">{enrollment.id}</p>
                    <p className="text-xs text-muted-foreground">{enrollment.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={enrollment.status === 'completed' ? 'default' : 
                              enrollment.status === 'pending' ? 'secondary' : 'destructive'}
                      className={
                        enrollment.status === 'completed' ? 'bg-success text-success-foreground' :
                        enrollment.status === 'pending' ? 'bg-warning text-warning-foreground' : ''
                      }
                    >
                      {enrollment.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {enrollment.quality}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate("/records")}
            >
              View All Records
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-gradient-card shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Fingerprint Scanner</span>
                <Badge className="bg-success text-success-foreground">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Camera System</span>
                <Badge className="bg-success text-success-foreground">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Iris Scanner</span>
                <Badge className="bg-warning text-warning-foreground">Maintenance</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Database Connection</span>
                <Badge className="bg-success text-success-foreground">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Backup System</span>
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate("/logs")}
            >
              View System Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};