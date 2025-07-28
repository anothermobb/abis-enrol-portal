import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, TrendingUp, Download, Filter } from "lucide-react";
import { ClockInOut } from "@/components/ClockInOut";

interface AttendanceRecord {
  id: string;
  date: string;
  timeIn: string;
  timeOut?: string;
  totalHours?: number;
  status: 'clocked-in' | 'clocked-out' | 'absent';
}

export const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    // Load attendance records from localStorage
    const records: AttendanceRecord[] = [];
    const today = new Date();
    
    // Generate sample data for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      // Check if there's a real record
      const savedRecord = localStorage.getItem(`clock-${dateString}`);
      if (savedRecord) {
        records.push(JSON.parse(savedRecord));
      } else if (i < 20) { // Generate sample data for past days
        // Skip weekends for sample data
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          const timeIn = `0${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
          const timeOut = `1${7 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
          const start = new Date(`${dateString} ${timeIn}`);
          const end = new Date(`${dateString} ${timeOut}`);
          const totalHours = Math.round(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 100) / 100;
          
          records.push({
            id: `record-${i}`,
            date: dateString,
            timeIn,
            timeOut,
            totalHours,
            status: 'clocked-out'
          });
        }
      }
    }
    
    setAttendanceRecords(records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const calculateStats = () => {
    const totalDays = attendanceRecords.length;
    const totalHours = attendanceRecords.reduce((sum, record) => sum + (record.totalHours || 0), 0);
    const avgHours = totalDays > 0 ? (totalHours / totalDays).toFixed(1) : '0';
    const presentDays = attendanceRecords.filter(r => r.status !== 'absent').length;
    const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : '0';
    
    return { totalDays, totalHours: totalHours.toFixed(1), avgHours, attendanceRate };
  };

  const stats = calculateStats();

  const getFilteredRecords = () => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      default:
        cutoffDate = new Date(0); // Show all
    }
    
    return attendanceRecords.filter(record => new Date(record.date) >= cutoffDate);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (record: AttendanceRecord) => {
    if (record.status === 'clocked-in') {
      return <Badge className="bg-warning text-warning-foreground">In Progress</Badge>;
    } else if (record.status === 'clocked-out') {
      return <Badge className="bg-success text-success-foreground">Complete</Badge>;
    } else {
      return <Badge variant="destructive">Absent</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Track your work hours and attendance history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Clock In/Out Widget and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clock In/Out */}
        <div className="lg:col-span-1">
          <ClockInOut />
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-card shadow-soft border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalHours}h</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Avg: {stats.avgHours}h per day
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold text-foreground">{stats.attendanceRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.totalDays} total days tracked
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance History */}
      <Card className="bg-gradient-card shadow-soft border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Attendance History
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-background border border-border rounded px-3 py-1 text-sm"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredRecords().map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {formatDate(record.date)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {record.timeIn || '-'}
                  </TableCell>
                  <TableCell className="font-mono">
                    {record.timeOut || (record.status === 'clocked-in' ? 'In Progress' : '-')}
                  </TableCell>
                  <TableCell>
                    {record.totalHours ? `${record.totalHours}h` : (record.status === 'clocked-in' ? 'In Progress' : '-')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(record)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {getFilteredRecords().length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records found for the selected period.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};