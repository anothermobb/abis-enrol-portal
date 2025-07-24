import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Download,
  Users,
  Calendar
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const mockRecords = [
  {
    id: "ENR-2024-001247",
    name: "John Michael Doe",
    dateOfBirth: "1985-03-15",
    enrollmentDate: "2024-01-15",
    status: "active",
    biometrics: ["fingerprint", "photo", "iris"],
    quality: "excellent",
    officer: "Jane Smith"
  },
  {
    id: "ENR-2024-001246",
    name: "Sarah Elizabeth Johnson",
    dateOfBirth: "1990-07-22",
    enrollmentDate: "2024-01-14",
    status: "pending",
    biometrics: ["fingerprint", "photo"],
    quality: "good",
    officer: "John Wilson"
  },
  {
    id: "ENR-2024-001245",
    name: "Michael Robert Brown",
    dateOfBirth: "1978-11-08",
    enrollmentDate: "2024-01-14",
    status: "active",
    biometrics: ["fingerprint", "photo", "iris"],
    quality: "excellent",
    officer: "Jane Smith"
  },
  {
    id: "ENR-2024-001244",
    name: "Emma Grace Wilson",
    dateOfBirth: "1995-02-14",
    enrollmentDate: "2024-01-13",
    status: "review",
    biometrics: ["fingerprint", "photo"],
    quality: "fair",
    officer: "Mike Davis"
  },
  {
    id: "ENR-2024-001243",
    name: "David Alexander Lee",
    dateOfBirth: "1982-09-30",
    enrollmentDate: "2024-01-13",
    status: "active",
    biometrics: ["fingerprint", "photo", "iris"],
    quality: "excellent",
    officer: "Jane Smith"
  }
];

export const Records = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [records] = useState(mockRecords);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "review":
        return <Badge variant="destructive">Review</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case "excellent":
        return <Badge variant="outline" className="border-success text-success">Excellent</Badge>;
      case "good":
        return <Badge variant="outline" className="border-warning text-warning">Good</Badge>;
      case "fair":
        return <Badge variant="outline" className="border-destructive text-destructive">Fair</Badge>;
      default:
        return <Badge variant="outline">{quality}</Badge>;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Enrollment Records</h1>
        <p className="text-muted-foreground">View and manage all enrolled individuals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-xl font-bold text-foreground">{records.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-bold text-foreground">
                  {records.filter(r => r.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Badge className="bg-warning text-warning-foreground">Pending</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-foreground">
                  {records.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Badge variant="destructive">Review</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Review</p>
                <p className="text-xl font-bold text-foreground">
                  {records.filter(r => r.status === 'review').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 bg-gradient-card shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="review">Review</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle>Enrollment Records ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date of Birth</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Enrollment Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Quality</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Biometrics</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="p-4">
                      <code className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                        {record.id}
                      </code>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{record.name}</p>
                        <p className="text-sm text-muted-foreground">by {record.officer}</p>
                      </div>
                    </td>
                    <td className="p-4 text-foreground">{record.dateOfBirth}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{record.enrollmentDate}</span>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(record.status)}</td>
                    <td className="p-4">{getQualityBadge(record.quality)}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {record.biometrics.map((biometric) => (
                          <Badge key={biometric} variant="outline" className="text-xs">
                            {biometric}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/records/${record.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/enroll/${record.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/print?id=${record.id}`)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};