import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserPlus, 
  Search, 
  CreditCard, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react";

// Mock data for operator view
const todayQueue = [
  { id: "EN001", name: "John Smith", type: "New Enrollment", priority: "High", status: "Pending" },
  { id: "EN002", name: "Maria Garcia", type: "Re-enrollment", priority: "Medium", status: "In Progress" },
  { id: "EN003", name: "David Chen", type: "Update", priority: "Low", status: "Pending" },
];

const recentActivity = [
  { id: "AC001", action: "Enrolled", name: "Sarah Johnson", time: "2 mins ago", quality: "Excellent" },
  { id: "AC002", action: "ID Card Printed", name: "Mike Wilson", time: "15 mins ago", quality: "Good" },
  { id: "AC003", action: "Record Updated", name: "Lisa Brown", time: "1 hour ago", quality: "Fair" },
];

const quickStats = [
  { title: "Today's Enrollments", value: "12", icon: UserPlus, color: "text-green-600" },
  { title: "Pending Queue", value: "3", icon: Clock, color: "text-orange-600" },
  { title: "Cards Printed", value: "8", icon: CreditCard, color: "text-blue-600" },
  { title: "Success Rate", value: "95%", icon: CheckCircle, color: "text-green-600" },
];

export const OperatorDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Complete": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-orange-100 text-orange-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Good Morning, Operator</h1>
          <p className="text-muted-foreground mt-1">Ready to help people today?</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/enroll")} className="bg-primary hover:bg-primary/90">
            <UserPlus className="mr-2 h-4 w-4" />
            New Enrollment
          </Button>
          <Button variant="outline" onClick={() => navigate("/print")}>
            <CreditCard className="mr-2 h-4 w-4" />
            Print Cards
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg bg-primary/10`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Quick Lookup
          </CardTitle>
          <CardDescription>
            Search for existing records by name, ID, or biometric
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              placeholder="Search by name, ID, or scan fingerprint..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => navigate("/records")}>
              <Search className="h-4 w-4 mr-2" />
              Search Records
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="queue">Today's Queue</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Work Queue ({todayQueue.length} items)
              </CardTitle>
              <CardDescription>
                Enrollments and updates scheduled for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayQueue.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/enroll/${item.id}`)}
                        >
                          Process
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent enrollments and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        {activity.action === "Enrolled" && <UserPlus className="h-4 w-4 text-green-600" />}
                        {activity.action === "ID Card Printed" && <CreditCard className="h-4 w-4 text-blue-600" />}
                        {activity.action === "Record Updated" && <AlertCircle className="h-4 w-4 text-orange-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.action} - {activity.name}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Quality: {activity.quality}</Badge>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};