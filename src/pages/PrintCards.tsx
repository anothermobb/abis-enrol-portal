import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Printer, 
  Download, 
  FileText,
  User,
  Calendar,
  MapPin,
  CheckCircle
} from "lucide-react";

// Mock data for enrolled individuals
const enrolledIndividuals = [
  {
    id: "ENR-2024-001247",
    name: "John Michael Doe",
    dateOfBirth: "1985-03-15",
    address: "123 Main Street, City, State 12345",
    enrollmentDate: "2024-01-15",
    cardPrinted: false,
    photo: "/placeholder.svg"
  },
  {
    id: "ENR-2024-001246",
    name: "Sarah Elizabeth Johnson",
    dateOfBirth: "1990-07-22",
    address: "456 Oak Avenue, City, State 12345",
    enrollmentDate: "2024-01-14",
    cardPrinted: true,
    photo: "/placeholder.svg"
  },
  {
    id: "ENR-2024-001245",
    name: "Michael Robert Brown",
    dateOfBirth: "1978-11-08",
    address: "789 Pine Street, City, State 12345",
    enrollmentDate: "2024-01-14",
    cardPrinted: false,
    photo: "/placeholder.svg"
  }
];

export const PrintCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(enrolledIndividuals[0]);

  const filteredIndividuals = enrolledIndividuals.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGeneratePDF = () => {
    // Simulate PDF generation
    console.log("Generating PDF for:", selectedPerson.name);
  };

  const handlePrintCard = () => {
    // Simulate card printing
    console.log("Printing card for:", selectedPerson.name);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Print ID Cards</h1>
        <p className="text-muted-foreground">Generate and print ID cards for enrolled individuals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search and Select */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Select Individual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredIndividuals.map((person) => (
                    <div
                      key={person.id}
                      onClick={() => setSelectedPerson(person)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedPerson.id === person.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{person.name}</p>
                          <p className="text-sm text-muted-foreground">{person.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {person.cardPrinted && (
                            <Badge className="bg-success text-success-foreground">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Printed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card Preview and Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Preview */}
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                ID Card Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* ID Card Design */}
              <div className="bg-gradient-primary p-8 rounded-xl shadow-strong max-w-md mx-auto text-primary-foreground">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold">NATIONAL IDENTITY CARD</h3>
                    <p className="text-sm opacity-90">Republic of Example</p>
                  </div>

                  {/* Content */}
                  <div className="flex gap-4">
                    {/* Photo */}
                    <div className="w-24 h-32 bg-white/20 rounded-lg flex items-center justify-center">
                      <User className="w-12 h-12 opacity-60" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-2 text-sm">
                      <div>
                        <p className="opacity-75">Name</p>
                        <p className="font-semibold">{selectedPerson.name.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="opacity-75">ID Number</p>
                        <p className="font-mono">{selectedPerson.id}</p>
                      </div>
                      <div>
                        <p className="opacity-75">Date of Birth</p>
                        <p>{selectedPerson.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="opacity-75">Issue Date</p>
                        <p>{selectedPerson.enrollmentDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-white/20 text-center">
                    <p className="text-xs opacity-75">This card is property of the Republic</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Details */}
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Individual Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground font-medium">{selectedPerson.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ID Number</label>
                    <p className="text-foreground font-mono">{selectedPerson.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{selectedPerson.dateOfBirth}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <p className="text-foreground">{selectedPerson.address}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Enrollment Date</label>
                    <p className="text-foreground">{selectedPerson.enrollmentDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Card Status</label>
                    {selectedPerson.cardPrinted ? (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Already Printed
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Printed</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGeneratePDF}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
                <Button 
                  onClick={handlePrintCard}
                  className="flex-1 bg-gradient-primary"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print ID Card
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Ensure printer is connected and has sufficient card stock before printing
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};