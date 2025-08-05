import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, CreditCard, AlertTriangle, Download, Printer, Check, Clock, X, ArrowUpDown, Search, Filter, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for cards
const cardData = [
  {
    id: "CARD001",
    employeeId: "EMP001",
    employeeName: "John Smith",
    department: "Security",
    issueDate: "2023-01-15",
    expiryDate: "2025-01-15",
    status: "active",
    cardType: "access",
    location: "Main Gate",
    daysUntilExpiry: 356,
    renewalStatus: "not_due"
  },
  {
    id: "CARD002",
    employeeId: "EMP002",
    employeeName: "Sarah Johnson",
    department: "Administration",
    issueDate: "2022-06-20",
    expiryDate: "2024-06-20",
    status: "expires_soon",
    cardType: "access",
    location: "Office Building",
    daysUntilExpiry: 142,
    renewalStatus: "pending"
  },
  {
    id: "CARD003",
    employeeId: "EMP003",
    employeeName: "Michael Brown",
    department: "Technical",
    issueDate: "2021-12-10",
    expiryDate: "2024-03-10",
    status: "expired",
    cardType: "full_access",
    location: "Server Room",
    daysUntilExpiry: -49,
    renewalStatus: "overdue"
  },
  {
    id: "CARD004",
    employeeId: "EMP004",
    employeeName: "Emma Wilson",
    department: "Security",
    issueDate: "2023-03-05",
    expiryDate: "2024-03-05",
    status: "expires_soon",
    cardType: "access",
    location: "Building B",
    daysUntilExpiry: 35,
    renewalStatus: "approved"
  },
  {
    id: "CARD005",
    employeeId: "EMP005",
    employeeName: "David Chen",
    department: "Technical",
    issueDate: "2022-09-12",
    expiryDate: "2024-09-12",
    status: "active",
    cardType: "temporary",
    location: "Lab A",
    daysUntilExpiry: 226,
    renewalStatus: "processing"
  }
];

const summaryStats = [
  {
    title: "Total Active Cards",
    value: "156",
    change: "+12",
    icon: CreditCard,
    trend: "up",
    description: "this month"
  },
  {
    title: "Expiring Soon",
    value: "23",
    change: "+5",
    icon: AlertTriangle,
    trend: "up",
    description: "next 90 days"
  },
  {
    title: "Renewal Pending",
    value: "8",
    change: "-3",
    icon: Clock,
    trend: "down",
    description: "awaiting approval"
  },
  {
    title: "Overdue Cards",
    value: "4",
    change: "+2",
    icon: X,
    trend: "up",
    description: "expired cards"
  }
];

export const CardRenewal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [sortField, setSortField] = useState("expiryDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
  const [renewalPeriod, setRenewalPeriod] = useState("2");
  const { toast } = useToast();

  const getStatusBadge = (status: string, daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Expired</Badge>;
    } else if (daysUntilExpiry <= 90) {
      return <Badge className="bg-warning text-warning-foreground"><AlertTriangle className="h-3 w-3 mr-1" />Expires Soon</Badge>;
    } else {
      return <Badge className="bg-success text-success-foreground"><Check className="h-3 w-3 mr-1" />Active</Badge>;
    }
  };

  const getRenewalStatusBadge = (renewalStatus: string) => {
    switch (renewalStatus) {
      case "not_due":
        return <Badge variant="secondary">Not Due</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Pending</Badge>;
      case "approved":
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Processing</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{renewalStatus}</Badge>;
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectCard = (cardId: string, checked: boolean) => {
    if (checked) {
      setSelectedCards([...selectedCards, cardId]);
    } else {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCards(filteredAndSortedData.map(card => card.id));
    } else {
      setSelectedCards([]);
    }
  };

  const handleRenewCard = (cardId: string) => {
    toast({
      title: "Card Renewal Initiated",
      description: `Renewal process started for card ${cardId}`,
    });
  };

  const handleBulkRenewal = () => {
    if (selectedCards.length === 0) {
      toast({
        title: "No cards selected",
        description: "Please select cards to renew",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Bulk Renewal Started",
      description: `Processing renewal for ${selectedCards.length} cards`,
    });
    setRenewalDialogOpen(false);
    setSelectedCards([]);
  };

  const handlePrintCard = (cardId: string) => {
    toast({
      title: "Print Job Initiated",
      description: `Sending card ${cardId} to printer`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Downloading card renewal report...",
    });
  };

  // Filter and sort data
  const filteredAndSortedData = cardData
    .filter(card => {
      if (selectedStatus !== "all") {
        if (selectedStatus === "expired" && card.daysUntilExpiry >= 0) return false;
        if (selectedStatus === "expires_soon" && (card.daysUntilExpiry > 90 || card.daysUntilExpiry < 0)) return false;
        if (selectedStatus === "active" && card.daysUntilExpiry <= 90) return false;
      }
      if (selectedDepartment !== "all" && card.department !== selectedDepartment) return false;
      if (searchTerm && !card.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !card.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !card.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      const direction = sortDirection === "asc" ? 1 : -1;
      
      if (sortField === "expiryDate" || sortField === "issueDate") {
        return new Date(aValue as string).getTime() - new Date(bValue as string).getTime() * direction;
      }
      
      return aValue < bValue ? -direction : aValue > bValue ? direction : 0;
    });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Card Renewal Management</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage ID card renewals and expiry tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={renewalDialogOpen} onOpenChange={setRenewalDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={selectedCards.length === 0}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Bulk Renewal ({selectedCards.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Card Renewal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="renewal-period">Renewal Period (Years)</Label>
                  <Select value={renewalPeriod} onValueChange={setRenewalPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="2">2 Years</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  This will renew {selectedCards.length} selected cards for {renewalPeriod} year(s).
                </p>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setRenewalDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBulkRenewal}>
                    Confirm Renewal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
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
                <span className={stat.trend === 'up' ? 'text-destructive' : 'text-success'}>
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Card Table */}
      <Card className="bg-gradient-card shadow-soft border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            ID Card Management
          </CardTitle>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="search-input" className="text-sm">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-input"
                  placeholder="Name, ID, or Card..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              <Label htmlFor="status-select" className="text-sm">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expires_soon">Expires Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
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
            
            <div className="flex flex-col space-y-1">
              <Label className="text-sm">Quick Actions</Label>
              <Button variant="outline" size="sm" className="justify-start">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCards.length === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Card ID</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("employeeName")}>
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
                  <TableHead className="cursor-pointer" onClick={() => handleSort("expiryDate")}>
                    <div className="flex items-center gap-1">
                      Expiry Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Days Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Renewal Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((card) => (
                  <TableRow key={card.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedCards.includes(card.id)}
                        onCheckedChange={(checked) => handleSelectCard(card.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">
                      {card.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{card.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{card.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {card.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {new Date(card.expiryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${card.daysUntilExpiry < 0 ? 'text-destructive' : 
                          card.daysUntilExpiry <= 90 ? 'text-warning' : 'text-success'}`}>
                          {card.daysUntilExpiry < 0 ? `${Math.abs(card.daysUntilExpiry)} days ago` : 
                           `${card.daysUntilExpiry} days`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(card.status, card.daysUntilExpiry)}</TableCell>
                    <TableCell>{getRenewalStatusBadge(card.renewalStatus)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRenewCard(card.id)}
                          disabled={card.renewalStatus === "processing"}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrintCard(card.id)}
                          title="Print Card"
                        >
                          <Printer className="h-3 w-3" />
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
              No cards found for the selected filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};