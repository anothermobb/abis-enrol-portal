import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Download, Edit, Calendar, Clock, Users, TrendingUp, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const attendanceData = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "John Smith",
    department: "Security",
    date: "2024-01-29",
    clockIn: "08:00:00",
    clockOut: "17:00:00",
    totalHours: "9:00",
    status: "completed",
    notes: ""
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Sarah Johnson",
    department: "Administration",
    date: "2024-01-29",
    clockIn: "08:30:00",
    clockOut: null,
    totalHours: "0:00",
    status: "missing_out",
    notes: "Missing clock out"
  },
  {
    id: 3,
    employeeId: "EMP003",
    name: "Michael Brown",
    department: "Technical",
    date: "2024-01-29",
    clockIn: "09:00:00",
    clockOut: "18:30:00",
    totalHours: "9:30",
    status: "overtime",
    notes: "Overtime approved"
  },
  {
    id: 4,
    employeeId: "EMP004",
    name: "Emma Wilson",
    department: "Security",
    date: "2024-01-29",
    clockIn: "07:45:00",
    clockOut: "16:45:00",
    totalHours: "9:00",
    status: "completed",
    notes: ""
  }
];

const summaryStats = [
  {
    title: "Total Present Today",
    value: "23",
    change: "+2",
    icon: Users,
    trend: "up"
  },
  {
    title: "Missing Clock-outs",
    value: "3",
    change: "-1",
    icon: AlertTriangle,
    trend: "down"
  },
  {
    title: "Average Hours",
    value: "8.5",
    change: "+0.2",
    icon: Clock,
    trend: "up"
  },
  {
    title: "Overtime Today",
    value: "5",
    change: "+2",
    icon: TrendingUp,
    trend: "up"
  }
];

const alerts = [
  {
    id: 1,
    type: "missing_out",
    message: "Sarah Johnson has been clocked in for 9+ hours without clocking out",
    timestamp: "2 hours ago",
    severity: "high"
  },
  {
    id: 2,
    type: "late_arrival",
    message: "3 employees arrived more than 30 minutes late today",
    timestamp: "4 hours ago",
    severity: "medium"
  },
  {
    id: 3,
    type: "overtime",
    message: "Michael Brown has exceeded 9 hours - overtime approval needed",
    timestamp: "1 hour ago",
    severity: "low"
  }
];

export const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState("2024-01-29");
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Complete</Badge>;
      case "missing_out":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Missing Out</Badge>;
      case "overtime":
        return <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Overtime</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "low":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Downloading attendance data as ${format.toUpperCase()}...`,
    });
  };

  const handleEditRecord = (record: any) => {
    setEditingRecord(record);
  };

  const handleSaveEdit = () => {
    toast({
      title: "Record Updated",
      description: "Attendance record has been successfully updated.",
    });
    setEditingRecord(null);
  };

  const filteredData = attendanceData.filter(record => {
    if (selectedEmployee !== "all" && record.employeeId !== selectedEmployee) return false;
    if (selectedDepartment !== "all" && record.department !== selectedDepartment) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Staff attendance monitoring and management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport("excel")}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat) => (
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
                <span>from yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card shadow-soft border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Attendance Management
              </CardTitle>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="date-select" className="text-sm">Date</Label>
                  <Input
                    id="date-select"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-fit"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="employee-select" className="text-sm">Employee</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      <SelectItem value="EMP001">John Smith</SelectItem>
                      <SelectItem value="EMP002">Sarah Johnson</SelectItem>
                      <SelectItem value="EMP003">Michael Brown</SelectItem>
                      <SelectItem value="EMP004">Emma Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="department-select" className="text-sm">Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daily" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="daily">Daily View</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
                </TabsList>
                
                <TabsContent value="daily" className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Clock In</TableHead>
                          <TableHead>Clock Out</TableHead>
                          <TableHead>Total Hours</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              <div>
                                <p>{record.name}</p>
                                <p className="text-sm text-muted-foreground">{record.employeeId}</p>
                              </div>
                            </TableCell>
                            <TableCell>{record.department}</TableCell>
                            <TableCell>{record.clockIn}</TableCell>
                            <TableCell>{record.clockOut || "-"}</TableCell>
                            <TableCell>{record.totalHours}</TableCell>
                            <TableCell>{getStatusBadge(record.status)}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditRecord(record)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="weekly">
                  <div className="text-center py-8 text-muted-foreground">
                    Weekly summary view - Coming soon
                  </div>
                </TabsContent>
                
                <TabsContent value="monthly">
                  <div className="text-center py-8 text-muted-foreground">
                    Monthly report view - Coming soon
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-card shadow-soft border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex gap-3 p-3 rounded-lg bg-secondary/50 border"
                  >
                    {getAlertIcon(alert.severity)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Record Dialog */}
      <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
          </DialogHeader>
          {editingRecord && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-employee" className="text-right">
                  Employee
                </Label>
                <Input
                  id="edit-employee"
                  value={editingRecord.name}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                  Date
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingRecord.date}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-clock-in" className="text-right">
                  Clock In
                </Label>
                <Input
                  id="edit-clock-in"
                  type="time"
                  value={editingRecord.clockIn}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-clock-out" className="text-right">
                  Clock Out
                </Label>
                <Input
                  id="edit-clock-out"
                  type="time"
                  value={editingRecord.clockOut || ""}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="edit-notes"
                  value={editingRecord.notes || ""}
                  className="col-span-3"
                  placeholder="Add notes..."
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditingRecord(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};