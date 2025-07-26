import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Fingerprint, 
  Camera, 
  Eye, 
  Check, 
  AlertCircle,
  Save,
  RotateCcw
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Step = "demographics" | "biometrics" | "review";
type BiometricType = "fingerprint" | "photo" | "iris";

export const Enrollment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current step from URL or default to demographics
  const getStepFromPath = (): Step => {
    const path = location.pathname;
    if (path.includes('/biometrics')) return 'biometrics';
    if (path.includes('/review')) return 'review';
    return 'demographics';
  };

  const [currentStep, setCurrentStep] = useState<Step>(getStepFromPath());
  const [capturedBiometrics, setCapturedBiometrics] = useState<BiometricType[]>([]);
  const [enrollmentData, setEnrollmentData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    phoneNumber: "",
    email: "",
    sid: "",
    nationalId: "",
    rank: ""
  });

  // Update URL when step changes
  const handleStepChange = (step: Step) => {
    setCurrentStep(step);
    navigate(`/enroll/${step}`);
  };

  // Sync URL changes with step state
  useEffect(() => {
    const newStep = getStepFromPath();
    if (newStep !== currentStep) {
      setCurrentStep(newStep);
    }
  }, [location.pathname]);

  const steps = [
    { id: "demographics", label: "Bio Data", icon: User },
    { id: "biometrics", label: "Biometric Data", icon: Fingerprint },
    { id: "review", label: "Review", icon: Check }
  ];

  const stepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const handleBiometricCapture = (type: BiometricType) => {
    if (!capturedBiometrics.includes(type)) {
      setCapturedBiometrics([...capturedBiometrics, type]);
    }
  };

  const isBiometricsComplete = capturedBiometrics.length >= 2; // At least 2 biometric types

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">New Enrollment</h1>
        <p className="text-muted-foreground">Capture biometric and demographic data for new ID</p>
      </div>

      {/* Progress */}
      <Card className="mb-8 bg-gradient-card shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= stepIndex ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-1 mx-4 ${
                    index < stepIndex ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {stepIndex + 1} of {steps.length}: {steps[stepIndex].label}
          </p>
        </CardContent>
      </Card>

      {/* Demographics Step */}
      {currentStep === "demographics" && (
        <Card className="bg-gradient-card shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Bio Data Capture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  value={enrollmentData.firstName}
                  onChange={(e) => setEnrollmentData({...enrollmentData, firstName: e.target.value})}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName"
                  value={enrollmentData.lastName}
                  onChange={(e) => setEnrollmentData({...enrollmentData, lastName: e.target.value})}
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input 
                  id="dateOfBirth" 
                  type="date"
                  value={enrollmentData.dateOfBirth}
                  onChange={(e) => setEnrollmentData({...enrollmentData, dateOfBirth: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select value={enrollmentData.gender} onValueChange={(value) => setEnrollmentData({...enrollmentData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sid">SID *</Label>
                <Input 
                  id="sid"
                  value={enrollmentData.sid}
                  onChange={(e) => setEnrollmentData({...enrollmentData, sid: e.target.value})}
                  placeholder="Enter SID"
                />
              </div>
              <div>
                <Label htmlFor="nationalId">National ID</Label>
                <Input 
                  id="nationalId"
                  value={enrollmentData.nationalId}
                  onChange={(e) => setEnrollmentData({...enrollmentData, nationalId: e.target.value})}
                  placeholder="Enter National ID"
                />
              </div>
              <div>
                <Label htmlFor="rank">Rank *</Label>
                <Select value={enrollmentData.rank} onValueChange={(value) => setEnrollmentData({...enrollmentData, rank: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="captain">Captain</SelectItem>
                    <SelectItem value="chief-officer">Chief Officer</SelectItem>
                    <SelectItem value="second-officer">Second Officer</SelectItem>
                    <SelectItem value="third-officer">Third Officer</SelectItem>
                    <SelectItem value="chief-engineer">Chief Engineer</SelectItem>
                    <SelectItem value="first-engineer">First Engineer</SelectItem>
                    <SelectItem value="second-engineer">Second Engineer</SelectItem>
                    <SelectItem value="third-engineer">Third Engineer</SelectItem>
                    <SelectItem value="able-seaman">Able Seaman</SelectItem>
                    <SelectItem value="ordinary-seaman">Ordinary Seaman</SelectItem>
                    <SelectItem value="bosun">Bosun</SelectItem>
                    <SelectItem value="cook">Cook</SelectItem>
                    <SelectItem value="steward">Steward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input 
                  id="phoneNumber"
                  value={enrollmentData.phoneNumber}
                  onChange={(e) => setEnrollmentData({...enrollmentData, phoneNumber: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea 
                id="address"
                value={enrollmentData.address}
                onChange={(e) => setEnrollmentData({...enrollmentData, address: e.target.value})}
                placeholder="Enter full address"
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => handleStepChange("biometrics")}
                className="bg-gradient-primary"
                disabled={!enrollmentData.firstName || !enrollmentData.lastName || !enrollmentData.dateOfBirth || !enrollmentData.sid || !enrollmentData.rank}
              >
                Continue to Biometric Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Biometrics Step */}
      {currentStep === "biometrics" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Biometric Data Capture</h2>
          
          {/* 10 Finger Prints Section */}
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5" />
                Fingerprint Capture (10 Fingers)
                {capturedBiometrics.includes("fingerprint") && (
                  <Badge className="bg-success text-success-foreground">
                    <Check className="w-3 h-3 mr-1" />
                    All Captured
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4 mb-6">
                {/* Left Hand */}
                <div className="col-span-5 mb-4">
                  <h4 className="font-medium mb-2">Left Hand</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {["Thumb", "Index", "Middle", "Ring", "Little"].map((finger, index) => (
                      <div key={`left-${finger}`} className="text-center">
                        <div className="w-16 h-20 bg-muted rounded-lg flex items-center justify-center mb-2">
                          <Fingerprint className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-xs">{finger}</p>
                        <div className="w-2 h-2 bg-success rounded-full mx-auto mt-1"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Right Hand */}
                <div className="col-span-5">
                  <h4 className="font-medium mb-2">Right Hand</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {["Thumb", "Index", "Middle", "Ring", "Little"].map((finger, index) => (
                      <div key={`right-${finger}`} className="text-center">
                        <div className="w-16 h-20 bg-muted rounded-lg flex items-center justify-center mb-2">
                          <Fingerprint className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-xs">{finger}</p>
                        <div className="w-2 h-2 bg-success rounded-full mx-auto mt-1"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => handleBiometricCapture("fingerprint")}
                  variant={capturedBiometrics.includes("fingerprint") ? "outline" : "default"}
                >
                  {capturedBiometrics.includes("fingerprint") ? "Recapture All" : "Start Capture"}
                </Button>
                <Button variant="outline">Clear All</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo Capture */}
            <Card className="bg-gradient-card shadow-soft h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Photo ID
                  </div>
                  {capturedBiometrics.includes("photo") && (
                    <Badge className="bg-success text-success-foreground">
                      <Check className="w-3 h-3 mr-1" />
                      Captured
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] w-full bg-muted rounded-lg flex items-center justify-center mb-4">
                  {capturedBiometrics.includes("photo") ? (
                    <div className="text-center">
                      <Check className="w-16 h-16 text-success mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Excellent Quality</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Position face in frame</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleBiometricCapture("photo")}
                    variant={capturedBiometrics.includes("photo") ? "outline" : "default"}
                    className="w-full"
                  >
                    {capturedBiometrics.includes("photo") ? "Retake Photo" : "Capture Photo"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    Import from File
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Iris Capture */}
            <Card className="bg-gradient-card shadow-soft h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Iris Scan
                  </div>
                  {capturedBiometrics.includes("iris") && (
                    <Badge className="bg-success text-success-foreground">
                      <Check className="w-3 h-3 mr-1" />
                      Captured
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                  {capturedBiometrics.includes("iris") ? (
                    <div className="text-center">
                      <Check className="w-12 h-12 text-success mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Both Eyes Captured</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Position eyes in scanner</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-success rounded-full mx-auto mb-1"></div>
                    <p className="text-xs">Left Eye</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-success rounded-full mx-auto mb-1"></div>
                    <p className="text-xs">Right Eye</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleBiometricCapture("iris")}
                  variant={capturedBiometrics.includes("iris") ? "outline" : "default"}
                  className="w-full"
                  disabled
                >
                  {capturedBiometrics.includes("iris") ? "Recapture" : "Scanner Offline"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => handleStepChange("demographics")}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={() => handleStepChange("review")}
              className="bg-gradient-primary"
              disabled={!isBiometricsComplete}
            >
              Continue to Review
            </Button>
          </div>
        </div>
      )}

      {/* Review Step */}
      {currentStep === "review" && (
        <Card className="bg-gradient-card shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Review & Submit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview Card and Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ID Card Preview */}
              <div className="lg:col-span-1">
                <h3 className="font-semibold mb-3">ID Card Preview</h3>
                <div 
                  className="bg-gradient-primary p-4 rounded-xl shadow-strong text-primary-foreground"
                  style={{ width: '256px', height: '162px' }} // 85.6mm x 54mm at 3x scale
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 h-full">
                    {/* Header */}
                    <div className="text-center mb-2">
                      <h4 className="text-xs font-bold">SEAFARER IDENTITY DOCUMENT</h4>
                      <p className="text-[8px] opacity-90">Maritime Authority</p>
                    </div>

                    {/* Content */}
                    <div className="flex gap-2 text-[8px]">
                      {/* Photo */}
                      <div className="w-8 h-10 bg-white/20 rounded flex items-center justify-center">
                        <User className="w-4 h-4 opacity-60" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-1">
                        <div>
                          <p className="opacity-75 text-[6px]">Name</p>
                          <p className="font-semibold text-[7px]">{enrollmentData.firstName.toUpperCase()} {enrollmentData.lastName.toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="opacity-75 text-[6px]">SID</p>
                          <p className="font-mono text-[7px]">{enrollmentData.sid || 'SID-XXXX'}</p>
                        </div>
                        <div>
                          <p className="opacity-75 text-[6px]">Rank</p>
                          <p className="text-[7px] capitalize">{enrollmentData.rank}</p>
                        </div>
                        <div>
                          <p className="opacity-75 text-[6px]">DOB</p>
                          <p className="text-[7px]">{enrollmentData.dateOfBirth}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-2 pt-1 border-t border-white/20 text-center">
                      <p className="text-[6px] opacity-75">Valid until 2029</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Information */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Bio Data</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {enrollmentData.firstName} {enrollmentData.lastName}</p>
                    <p><span className="text-muted-foreground">SID:</span> {enrollmentData.sid}</p>
                    <p><span className="text-muted-foreground">National ID:</span> {enrollmentData.nationalId}</p>
                    <p><span className="text-muted-foreground">Date of Birth:</span> {enrollmentData.dateOfBirth}</p>
                    <p><span className="text-muted-foreground">Gender:</span> {enrollmentData.gender}</p>
                    <p><span className="text-muted-foreground">Rank:</span> {enrollmentData.rank}</p>
                    <p><span className="text-muted-foreground">Address:</span> {enrollmentData.address}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Biometric Data Captured</h3>
                  <div className="space-y-2">
                    {capturedBiometrics.map((biometric) => (
                      <div key={biometric} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success" />
                        <span className="text-sm capitalize">{biometric === 'fingerprint' ? '10 Fingerprints' : biometric}</span>
                        <Badge variant="outline" className="text-xs">High Quality</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Enrollment Data Grid */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">Recent Enrollments</h3>
              <div className="rounded-lg border">
                <div className="grid grid-cols-7 gap-4 p-4 bg-muted/50 font-medium text-sm">
                  <div>SID</div>
                  <div>Name</div>
                  <div>Rank</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div>Biometrics</div>
                  <div>Actions</div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-4 border-t text-sm">
                  <div className="font-mono">SID-2024-001</div>
                  <div>John Smith</div>
                  <div>Captain</div>
                  <div>2024-01-20</div>
                  <div><Badge className="bg-success text-success-foreground">Complete</Badge></div>
                  <div><Badge variant="outline">3/3</Badge></div>
                  <div><Button variant="outline" size="sm">View</Button></div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-4 border-t text-sm">
                  <div className="font-mono">SID-2024-002</div>
                  <div>Jane Doe</div>
                  <div>Chief Officer</div>
                  <div>2024-01-19</div>
                  <div><Badge variant="outline">Pending</Badge></div>
                  <div><Badge variant="outline">2/3</Badge></div>
                  <div><Button variant="outline" size="sm">View</Button></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6 border-t border-border">
              <Button variant="outline" onClick={() => handleStepChange("biometrics")}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="outline">
                  Save as Draft
                </Button>
                <Button 
                  className="bg-gradient-primary"
                  onClick={() => {
                    // Submit enrollment data
                    console.log('Submitting enrollment:', { enrollmentData, capturedBiometrics });
                    // Navigate to records after successful submission
                    navigate('/records');
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Submit Enrollment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};