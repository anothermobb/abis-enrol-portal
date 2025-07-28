import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, LogIn, LogOut, Coffee, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: string;
  name: string;
  department: string;
  position: string;
  status: 'clocked-in' | 'clocked-out' | 'on-break';
  timeIn?: string;
  timeOut?: string;
}

interface StaffClockManagerProps {
  staff: StaffMember;
  onStatusChange?: (staffId: string, newStatus: StaffMember['status']) => void;
}

export const StaffClockManager = ({ staff, onStatusChange }: StaffClockManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClockAction = async (action: 'clock-in' | 'clock-out' | 'break') => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    let newStatus: StaffMember['status'];
    let message = '';

    switch (action) {
      case 'clock-in':
        newStatus = 'clocked-in';
        message = `${staff.name} clocked in at ${timeString}`;
        break;
      case 'clock-out':
        newStatus = 'clocked-out';
        message = `${staff.name} clocked out at ${timeString}`;
        break;
      case 'break':
        newStatus = staff.status === 'on-break' ? 'clocked-in' : 'on-break';
        message = `${staff.name} is ${newStatus === 'on-break' ? 'on break' : 'back from break'}`;
        break;
    }

    onStatusChange?.(staff.id, newStatus);
    
    toast({
      title: "Status Updated",
      description: message,
    });
    
    setIsLoading(false);
  };

  const getStatusBadge = (status: StaffMember['status']) => {
    switch (status) {
      case 'clocked-in':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'on-break':
        return <Badge className="bg-warning text-warning-foreground">On Break</Badge>;
      case 'clocked-out':
        return <Badge variant="secondary">Off Duty</Badge>;
    }
  };

  const getCurrentWorkingTime = () => {
    if (!staff.timeIn || staff.status === 'clocked-out') return null;
    
    const start = new Date(`${new Date().toDateString()} ${staff.timeIn}`);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="bg-gradient-card shadow-soft border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{staff.name}</p>
            <p className="text-sm text-muted-foreground">{staff.position}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status and Working Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Status:</span>
          </div>
          {getStatusBadge(staff.status)}
        </div>

        {/* Time Information */}
        <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
          {staff.timeIn && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time In:</span>
              <span className="font-mono text-foreground">{staff.timeIn}</span>
            </div>
          )}
          {staff.timeOut && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time Out:</span>
              <span className="font-mono text-foreground">{staff.timeOut}</span>
            </div>
          )}
          {getCurrentWorkingTime() && (
            <div className="flex justify-between text-sm font-bold">
              <span className="text-muted-foreground">Working Time:</span>
              <span className="text-foreground">{getCurrentWorkingTime()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {staff.status === 'clocked-out' ? (
            <Button 
              onClick={() => handleClockAction('clock-in')}
              disabled={isLoading}
              className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Clock In
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => handleClockAction('break')}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <Coffee className="h-4 w-4 mr-2" />
                {staff.status === 'on-break' ? 'End Break' : 'Break'}
              </Button>
              <Button 
                onClick={() => handleClockAction('clock-out')}
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Clock Out
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};