import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Eye, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StaffMember {
  id: string;
  name: string;
  department: string;
  position: string;
  status: 'clocked-in' | 'clocked-out' | 'on-break';
  timeIn?: string;
  timeOut?: string;
  totalHours?: number;
  lastSeen?: string;
}

interface StaffAttendanceTableProps {
  limit?: number;
  showActions?: boolean;
}

export const StaffAttendanceTable = ({ limit, showActions = true }: StaffAttendanceTableProps) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Generate sample staff data
    const sampleStaff: StaffMember[] = [
      {
        id: "EMP-001",
        name: "John Smith",
        department: "Security",
        position: "Security Officer",
        status: "clocked-in",
        timeIn: "08:00",
        lastSeen: "2 minutes ago"
      },
      {
        id: "EMP-002", 
        name: "Sarah Johnson",
        department: "Administration",
        position: "Data Entry Clerk",
        status: "clocked-in",
        timeIn: "08:15",
        lastSeen: "5 minutes ago"
      },
      {
        id: "EMP-003",
        name: "Michael Brown",
        department: "IT Support",
        position: "System Administrator", 
        status: "on-break",
        timeIn: "07:45",
        lastSeen: "15 minutes ago"
      },
      {
        id: "EMP-004",
        name: "Emma Davis",
        department: "Quality Control",
        position: "QC Specialist",
        status: "clocked-out",
        timeIn: "08:00",
        timeOut: "17:00",
        totalHours: 8.5,
        lastSeen: "1 hour ago"
      },
      {
        id: "EMP-005",
        name: "James Wilson",
        department: "Operations",
        position: "Operations Manager",
        status: "clocked-in",
        timeIn: "07:30",
        lastSeen: "10 minutes ago"
      },
      {
        id: "EMP-006",
        name: "Lisa Anderson",
        department: "HR",
        position: "HR Assistant",
        status: "clocked-out",
        timeIn: "09:00",
        timeOut: "18:00", 
        totalHours: 8.0,
        lastSeen: "2 hours ago"
      }
    ];

    setStaffMembers(limit ? sampleStaff.slice(0, limit) : sampleStaff);
  }, [limit]);

  const getStatusBadge = (status: StaffMember['status']) => {
    switch (status) {
      case 'clocked-in':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'on-break':
        return <Badge className="bg-warning text-warning-foreground">On Break</Badge>;
      case 'clocked-out':
        return <Badge variant="secondary">Off Duty</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCurrentWorkingTime = (timeIn: string) => {
    if (!timeIn) return '-';
    
    const start = new Date(`${new Date().toDateString()} ${timeIn}`);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Time In</TableHead>
          <TableHead>Working Time</TableHead>
          <TableHead>Last Seen</TableHead>
          {showActions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {staffMembers.map((staff) => (
          <TableRow key={staff.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{staff.name}</p>
                  <p className="text-sm text-muted-foreground">{staff.position}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{staff.department}</TableCell>
            <TableCell>{getStatusBadge(staff.status)}</TableCell>
            <TableCell className="font-mono">{staff.timeIn || '-'}</TableCell>
            <TableCell>
              {staff.status === 'clocked-in' || staff.status === 'on-break' 
                ? getCurrentWorkingTime(staff.timeIn || '') 
                : staff.totalHours ? `${staff.totalHours}h` : '-'
              }
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">{staff.lastSeen}</TableCell>
            {showActions && (
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/attendance?employee=${staff.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};