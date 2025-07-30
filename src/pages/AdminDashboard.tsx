import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Download, Edit, Calendar, Clock, Users, TrendingUp, AlertCircle, CheckCircle, XCircle, ArrowUpDown, Search, Filter, FileSpreadsheet, FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data with more entries for better demonstration
const attendanceData = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "John Smith",
    department: "Security",
    location: "Main Gate",
    date: "2024-01-29",
    clockIn: "08:00:00",
    clockOut: "17:00:00",
    totalHours: "9:00",
    status: "completed",
    notes: "",
    duration: 540 // minutes
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Sarah Johnson",
    department: "Administration",
    location: "Office Building",
    date: "2024-01-29",
    clockIn: "08:30:00",
    clockOut: null,
    totalHours: "0:00",
    status: "missing_out",
    notes: "Missing clock out",
    duration: 0
  },
  {
    id: 3,
    employeeId: "EMP003",
    name: "Michael Brown",
    department: "Technical",
    location: "Server Room",
    date: "2024-01-29",
    clockIn: "09:00:00",
    clockOut: "18:30:00",
    totalHours: "9:30",
    status: "overtime",
    notes: "Overtime approved",
    duration: 570
  },
  {
    id: 4,
    employeeId: "EMP004",
    name: "Emma Wilson",
    department: "Security",
    location: "Building B",
    date: "2024-01-29",
    clockIn: "07:45:00",
    clockOut: "16:45:00",
    totalHours: "9:00",
    status: "completed",
    notes: "",
    duration: 540
  },
  {
    id: 5,
    employeeId: "EMP005",
    name: "David Chen",
    department: "Technical",
    location: "Lab A",
    date: "2024-01-29",
    clockIn: "10:15:00",
    clockOut: "19:00:00",
    totalHours: "8:45",
    status: "late_arrival",
    notes: "Traffic delay",
    duration: 525
  }
];

const summaryStats = [
  {
    title: "Total Clock-ins Today",
    value: "24",
    change: "+3",
    icon: Users,
    trend: "up",
    description: "from yesterday"
  },
  {
    title: "Missing Clock-outs",
    value: "2",
    change: "-1",
    icon: AlertTriangle,
    trend: "down",
    description: "active issues"
  },
  {
    title: "Average Hours",
    value: "8.4",
    change: "+0.3",
    icon: Clock,
    trend: "up",
    description: "this week"
  },
  {
    title: "Late Arrivals",
    value: "5",
    change: "+2",
    icon: TrendingUp,
    trend: "up",
    description: "today"
  }
];

const alerts = [
  {
    id: 1,
    type: "missing_out",
    message: "Sarah Johnson missing clock-out for 9+ hours",
    employeeId: "EMP002",
    timestamp: "2 hours ago",
    severity: "high",
    actionable: true
  },
  {
    id: 2,
    type: "late_arrival",
    message: "5 employees arrived late today (>30 min)",
    timestamp: "4 hours ago",
    severity: "medium",
    actionable: true
  },
  {
    id: 3,
    type: "overtime",
    message: "Michael Brown exceeded standard hours",
    employeeId: "EMP003",
    timestamp: "1 hour ago",
    severity: "low",
    actionable: false
  },
  {
    id: 4,
    type: "system",
    message: "Biometric scanner #3 requires maintenance",
    timestamp: "3 hours ago",
    severity: "medium",
    actionable: true
  }
];

export const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState("2024-01-29");
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
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
      case "late_arrival":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300"><AlertTriangle className="h-3 w-3 mr-1" />Late</Badge>;
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

  const handleResolveAlert = (alertId: number) => {
    toast({
      title: "Alert Resolved",
      description: "Alert has been marked as resolved.",
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort data
  const filteredAndSortedData = attendanceData
    .filter(record => {
      if (selectedEmployee !== "all" && record.employeeId !== selectedEmployee) return false;
      if (selectedDepartment !== "all" && record.department !== selectedDepartment) return false;
      if (searchTerm && !record.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      const direction = sortDirection === "asc" ? 1 : -1;
      return aValue < bValue ? -direction : aValue > bValue ? direction : 0;
    });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time attendance monitoring and management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <FileText className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport("excel")}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Summary Stats - Secondary positioning */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Clock-In/Clock-Out Logs - Hero Section */}
        <div className="lg:col-span-3">
          <Card className="bg-gradient-card shadow-soft border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Clock-In/Clock-Out Logs
              </CardTitle>
              
              {/* Enhanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="date-select" className="text-sm">Date</Label>
                  <Input
                    id="date-select"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="search-input" className="text-sm">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search-input"
                      placeholder="Name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="employee-select" className="text-sm">Employee</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Employees" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      <SelectItem value="EMP001">John Smith</SelectItem>
                      <SelectItem value="EMP002">Sarah Johnson</SelectItem>
                      <SelectItem value="EMP003">Michael Brown</SelectItem>
                      <SelectItem value="EMP004">Emma Wilson</SelectItem>
                      <SelectItem value="EMP005">David Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="department-select" className="text-sm">Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                        <div className="flex items-center gap-1">
                          Employee
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("department")}>
                        <div className="flex items-center gap-1">
                          Department
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("clockIn")}>
                        <div className="flex items-center gap-1">
                          Clock In
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("clockOut")}>
                        <div className="flex items-center gap-1">
                          Clock Out
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("totalHours")}>
                        <div className="flex items-center gap-1">
                          Duration
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedData.map((record) => (
                      <TableRow key={record.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold">{record.name}</p>
                            <p className="text-sm text-muted-foreground">{record.employeeId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {record.department}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {record.location}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {record.clockIn}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {record.clockOut || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{record.totalHours}</span>
                            {record.duration > 540 && (
                              <div className="w-2 h-2 bg-warning rounded-full" title="Overtime" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditRecord(record)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View Details"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredAndSortedData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No attendance records found for the selected filters.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Attendance Anomalies Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-card shadow-soft border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Attendance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex gap-3 p-3 rounded-lg bg-secondary/30 border hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getAlertIcon(alert.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.timestamp}
                        </p>
                        {alert.actionable && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 h-7 text-xs"
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
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