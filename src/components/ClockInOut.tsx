import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, LogIn, LogOut, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClockRecord {
  id: string;
  date: string;
  timeIn: string;
  timeOut?: string;
  totalHours?: number;
  status: 'clocked-in' | 'clocked-out';
}

export const ClockInOut = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayRecord, setTodayRecord] = useState<ClockRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load today's record from localStorage
    const today = new Date().toDateString();
    const savedRecord = localStorage.getItem(`clock-${today}`);
    if (savedRecord) {
      setTodayRecord(JSON.parse(savedRecord));
    }

    return () => clearInterval(timer);
  }, []);

  const calculateHours = (timeIn: string, timeOut: string) => {
    const start = new Date(`${new Date().toDateString()} ${timeIn}`);
    const end = new Date(`${new Date().toDateString()} ${timeOut}`);
    return Math.round(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 100) / 100;
  };

  const handleClockIn = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const newRecord: ClockRecord = {
      id: `clock-${Date.now()}`,
      date: now.toDateString(),
      timeIn: timeString,
      status: 'clocked-in'
    };
    
    setTodayRecord(newRecord);
    localStorage.setItem(`clock-${now.toDateString()}`, JSON.stringify(newRecord));
    
    toast({
      title: "Clocked In Successfully",
      description: `Time: ${timeString}`,
    });
    
    setIsLoading(false);
  };

  const handleClockOut = async () => {
    if (!todayRecord) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const totalHours = calculateHours(todayRecord.timeIn, timeString);
    
    const updatedRecord: ClockRecord = {
      ...todayRecord,
      timeOut: timeString,
      totalHours,
      status: 'clocked-out'
    };
    
    setTodayRecord(updatedRecord);
    localStorage.setItem(`clock-${new Date().toDateString()}`, JSON.stringify(updatedRecord));
    
    toast({
      title: "Clocked Out Successfully",
      description: `Total hours worked: ${totalHours}h`,
    });
    
    setIsLoading(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getCurrentWorkingTime = () => {
    if (!todayRecord || todayRecord.status === 'clocked-out') return null;
    
    const start = new Date(`${new Date().toDateString()} ${todayRecord.timeIn}`);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="bg-gradient-card shadow-soft border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Clock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Time */}
        <div className="text-center">
          <p className="text-2xl font-mono font-bold text-foreground">
            {formatTime(currentTime)}
          </p>
          <p className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center">
          <Badge 
            variant={todayRecord?.status === 'clocked-in' ? 'default' : 'secondary'}
            className={
              todayRecord?.status === 'clocked-in' 
                ? 'bg-success text-success-foreground' 
                : 'bg-muted text-muted-foreground'
            }
          >
            {todayRecord?.status === 'clocked-in' ? 'Currently Working' : 'Not Clocked In'}
          </Badge>
        </div>

        {/* Working Time */}
        {todayRecord?.status === 'clocked-in' && (
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Working Time</p>
            <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
              <Timer className="h-4 w-4" />
              {getCurrentWorkingTime()}
            </p>
          </div>
        )}

        {/* Today's Record */}
        {todayRecord && (
          <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time In:</span>
              <span className="font-mono text-foreground">{todayRecord.timeIn}</span>
            </div>
            {todayRecord.timeOut && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time Out:</span>
                  <span className="font-mono text-foreground">{todayRecord.timeOut}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-muted-foreground">Total Hours:</span>
                  <span className="text-foreground">{todayRecord.totalHours}h</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!todayRecord || todayRecord.status === 'clocked-out' ? (
            <Button 
              onClick={handleClockIn}
              disabled={isLoading}
              className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
            >
              <LogIn className="h-4 w-4 mr-2" />
              {isLoading ? 'Clocking In...' : 'Clock In'}
            </Button>
          ) : (
            <Button 
              onClick={handleClockOut}
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoading ? 'Clocking Out...' : 'Clock Out'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};