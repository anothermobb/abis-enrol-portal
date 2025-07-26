import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  Edit, 
  Download, 
  Printer,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Shield,
  Fingerprint
} from "lucide-react";

// Mock data - same structure as Records page
const mockRecords = [
  {
    id: "ENR-2024-001247",
    name: "Kwaku Mensah",
    dateOfBirth: "15 JUL 1987",
    enrollmentDate: "2024-03-15",
    reviewDate: "2024-03-20",
    status: "active",
    biometrics: "Complete",
    quality: "Excellent",
    officer: "John Smith",
    nationality: "GHANAIAN",
    rank: "ABLE SEAMAN",
    expiryDate: "31 DEC 2029",
    idNumber: "GHA123456",
    email: "kwaku.mensah@email.com",
    phone: "+233 123 456 789",
    address: "123 Harbour Street, Tema, Ghana",
    emergencyContact: {
      name: "Ama Mensah",
      phone: "+233 987 654 321",
      relationship: "Spouse"
    },
    documents: [
      { name: "Birth Certificate", status: "Verified" },
      { name: "Educational Certificate", status: "Verified" },
      { name: "Medical Certificate", status: "Pending" }
    ]
  },
  // Add other mock records here if needed
];

export const RecordView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<any>(null);

  useEffect(() => {
    // Find the record by ID
    const foundRecord = mockRecords.find(r => r.id === id);
    setRecord(foundRecord);
  }, [id]);

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Record Not Found</h2>
          <Button onClick={() => navigate('/records')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Records
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      pending: "secondary",
      review: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getQualityBadge = (quality: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Excellent: "default",
      Good: "secondary",
      Fair: "outline"
    };
    return <Badge variant={variants[quality] || "outline"}>{quality}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/records')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Records
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Record Details</h1>
              <p className="text-muted-foreground">ID: {record.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button>
              <Printer className="w-4 h-4 mr-2" />
              Print Card
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ID Card Display */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Seafarer Identity Document</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Front of Card */}
                <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-6 rounded-xl shadow-strong text-white mb-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Shield className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold">GHANA SEAFARER</h3>
                          <h3 className="text-sm font-bold">IDENTITY DOCUMENT</h3>
                        </div>
                      </div>
                      <div className="w-12 h-8 bg-yellow-400 rounded-sm flex items-center justify-center">
                        <div className="w-8 h-6 bg-yellow-500 rounded-sm"></div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex gap-4">
                      {/* Photo */}
                      <div className="w-20 h-24 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                        <User className="w-10 h-10 opacity-60" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-2 text-xs">
                        <div>
                          <p className="opacity-75">SID No.</p>
                          <p className="font-bold text-sm">{record.idNumber}</p>
                        </div>
                        <div>
                          <p className="opacity-75">Name</p>
                          <p className="font-bold text-sm">{record.name.toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="opacity-75">Rank</p>
                          <p className="font-semibold">{record.rank}</p>
                        </div>
                        <div>
                          <p className="opacity-75">Date of Birth</p>
                          <p className="font-semibold">{record.dateOfBirth}</p>
                        </div>
                        <div>
                          <p className="opacity-75">Nationality</p>
                          <p className="font-semibold">{record.nationality}</p>
                        </div>
                        <div>
                          <p className="opacity-75">Date of Expiry</p>
                          <p className="font-semibold">{record.expiryDate}</p>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="w-16 h-16 bg-white/90 rounded-lg flex items-center justify-center">
                        <div className="w-12 h-12 bg-black rounded-sm grid grid-cols-4 gap-px p-1">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-black'} rounded-sm`}></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-white/20 text-center">
                      <p className="text-xs font-bold">MIFARE DESFire EV3 8K</p>
                    </div>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-xl shadow-strong text-gray-800">
                  <div className="bg-black h-12 mb-4 rounded"></div>
                  <div className="bg-yellow-400 h-1 mb-6"></div>
                  
                  <h3 className="text-lg font-bold mb-4">SEAFARER IDENTITY DOCUMENT</h3>
                  
                  <div className="space-y-2 text-sm mb-6">
                    <p>• This card is the property of the issuing government.</p>
                    <p>• It is an internationally recognized identity document.</p>
                    <p>• Return if found to the nearest maritime authority</p>
                    <p>• Refer to the information on the front of the card</p>
                  </div>

                  <div className="font-mono text-xs bg-white p-3 rounded">
                    <p>I&lt;&lt; CCCCCCCCCCCCCCCCCCCC&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
                    <p>CCC0000000000000000000000&lt;&lt;&lt;&lt;&lt;&lt;</p>
                  </div>

                  <div className="flex justify-end mt-4">
                    <div className="w-12 h-8 border-2 border-gray-400 rounded flex items-center justify-center">
                      <div className="flex flex-col gap-1">
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-semibold">{record.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-semibold">{record.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nationality</p>
                  <p className="font-semibold">{record.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className="font-semibold">{record.rank}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID Number</p>
                  <p className="font-mono font-semibold">{record.idNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(record.status)}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold">{record.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-semibold">{record.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-semibold">{record.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enrollment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Enrollment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Enrollment Date</p>
                  <p className="font-semibold">{record.enrollmentDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Review Date</p>
                  <p className="font-semibold">{record.reviewDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-semibold">{record.expiryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Enrollment Officer</p>
                  <p className="font-semibold">{record.officer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Biometrics Status</p>
                  <Badge variant="default">{record.biometrics}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quality</p>
                  {getQualityBadge(record.quality)}
                </div>
              </CardContent>
            </Card>

            {/* Biometric Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5" />
                  Biometric Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Fingerprint Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Right Thumb</span>
                        <Badge variant="default">Captured</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Right Index</span>
                        <Badge variant="default">Captured</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Left Thumb</span>
                        <Badge variant="default">Captured</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Left Index</span>
                        <Badge variant="default">Captured</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Other Biometrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Facial Recognition</span>
                        <Badge variant="default">Captured</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Iris Scan</span>
                        <Badge variant="secondary">Optional</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{record.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">{record.emergencyContact.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Relationship</p>
                  <p className="font-semibold">{record.emergencyContact.relationship}</p>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Supporting Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {record.documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                      <Badge variant={doc.status === 'Verified' ? 'default' : 'secondary'}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};