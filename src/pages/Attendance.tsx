import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, TrendingUp, Download, Filter, Search, Users, UserCheck, UserX } from "lucide-react";
import { StaffAttendanceTable } from "@/components/StaffAttendanceTable";
import { StaffClockManager } from "@/components/StaffClockManager";

interface StaffMember {
  id: string;
  name: string;
  department: string;
  position: string;
  status: 'clocked-in' | 'clocked-out' | 'on-break';
  timeIn?: string;
  timeOut?: string;
  totalHours?: number;
}

export const Attendance = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  useEffect(() => {
    // Generate sample staff data
    const sampleStaff: StaffMember[] = [
      {
        id: "EMP-001",
        name: "John Smith",
        department: "Security",
        position: "Security Officer",
        status: "clocked-in",
        timeIn: "08:00"
      },
      {
        id: "EMP-002", 
        name: "Sarah Johnson",
        department: "Administration",
        position: "Data Entry Clerk",
        status: "clocked-in",
        timeIn: "08:15"
      },
      {
        id: "EMP-003",
        name: "Michael Brown",
        department: "IT Support",
        position: "System Administrator", 
        status: "on-break",
        timeIn: "07:45"
      },
      {
        id: "EMP-004",
        name: "Emma Davis",
        department: "Quality Control",
        position: "QC Specialist",
        status: "clocked-out",
        timeIn: "08:00",
        timeOut: "17:00",
        totalHours: 8.5
      },
      {
        id: "EMP-005",
        name: "James Wilson",
        department: "Operations",
        position: "Operations Manager",
        status: "clocked-in",
        timeIn: "07:30"
      },
      {
        id: "EMP-006",
        name: "Lisa Anderson",
        department: "HR",
        position: "HR Assistant",
        status: "clocked-out",
        timeIn: "09:00",
        timeOut: "18:00", 
        totalHours: 8.0
      }
    ];

    setStaffMembers(sampleStaff);
    
    // Check URL params for employee selection
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('employee');
    if (employeeId) {
      setSelectedEmployee(employeeId);
    }
  }, []);

  const handleStaffStatusChange = (staffId: string, newStatus: StaffMember['status']) => {
    setStaffMembers(prev => 
      prev.map(staff => 
        staff.id === staffId 
          ? { ...staff, status: newStatus }
          : staff
      )
    );
  };

  const calculateStats = () => {
    const totalStaff = staffMembers.length;
    const activeStaff = staffMembers.filter(s => s.status === 'clocked-in').length;
    const onBreak = staffMembers.filter(s => s.status === 'on-break').length;
    const offDuty = staffMembers.filter(s => s.status === 'clocked-out').length;
    
    return { totalStaff, activeStaff, onBreak, offDuty };
  };

  const stats = calculateStats();

  const getFilteredStaff = () => {
    return staffMembers.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           staff.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  };

  const departments = ['all', ...Array.from(new Set(staffMembers.map(s => s.department)))];
  const selectedStaff = selectedEmployee ? staffMembers.find(s => s.id === selectedEmployee) : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Staff Attendance Management</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage staff attendance across all departments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          {selectedEmployee && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedEmployee(null)}
            >
              Back to Overview
            </Button>
          )}
        </div>
      </div>

      {/* Individual Employee View */}
      {selectedStaff ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StaffClockManager 
              staff={selectedStaff} 
              onStatusChange={handleStaffStatusChange}
            />
          </div>
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card shadow-soft border-border">
              <CardHeader>
                <CardTitle>Attendance History - {selectedStaff.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Historical attendance data would be displayed here.
                  <br />
                  Integration with backend needed for historical records.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-card shadow-soft border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Staff</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalStaff}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Now</p>
                    <p className="text-2xl font-bold text-foreground">{stats.activeStaff}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">On Break</p>
                    <p className="text-2xl font-bold text-foreground">{stats.onBreak}</p>
                  </div>
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Off Duty</p>
                    <p className="text-2xl font-bold text-foreground">{stats.offDuty}</p>
                  </div>
                  <UserX className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="bg-gradient-card shadow-soft border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept === 'all' ? 'All Departments' : dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Search Employee</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Staff Attendance Table */}
          <Card className="bg-gradient-card shadow-soft border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Attendance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StaffAttendanceTable 
                limit={undefined} 
                showActions={true}
              />
              {getFilteredStaff().length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No staff members found matching the current filters.
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};