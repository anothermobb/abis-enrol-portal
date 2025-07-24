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
    idNumber: ""
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
    { id: "demographics", label: "Demographics", icon: User },
    { id: "biometrics", label: "Biometrics", icon: Fingerprint },
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
              Demographic Information
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
                <Label htmlFor="idNumber">ID Number</Label>
                <Input 
                  id="idNumber"
                  value={enrollmentData.idNumber}
                  onChange={(e) => setEnrollmentData({...enrollmentData, idNumber: e.target.value})}
                  placeholder="Enter ID number"
                />
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
                disabled={!enrollmentData.firstName || !enrollmentData.lastName || !enrollmentData.dateOfBirth}
              >
                Continue to Biometrics
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Biometrics Step */}
      {currentStep === "biometrics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fingerprint Capture */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5" />
                    Fingerprint
                  </div>
                  {capturedBiometrics.includes("fingerprint") && (
                    <Badge className="bg-success text-success-foreground">
                      <Check className="w-3 h-3 mr-1" />
                      Captured
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                  {capturedBiometrics.includes("fingerprint") ? (
                    <div className="text-center">
                      <Check className="w-12 h-12 text-success mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">High Quality</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Fingerprint className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Place finger on scanner</p>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => handleBiometricCapture("fingerprint")}
                  variant={capturedBiometrics.includes("fingerprint") ? "outline" : "default"}
                  className="w-full"
                >
                  {capturedBiometrics.includes("fingerprint") ? "Recapture" : "Capture"}
                </Button>
              </CardContent>
            </Card>

            {/* Photo Capture */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Facial Photo
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
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                  {capturedBiometrics.includes("photo") ? (
                    <div className="text-center">
                      <Check className="w-12 h-12 text-success mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Excellent Quality</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Look at camera</p>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => handleBiometricCapture("photo")}
                  variant={capturedBiometrics.includes("photo") ? "outline" : "default"}
                  className="w-full"
                >
                  {capturedBiometrics.includes("photo") ? "Retake" : "Take Photo"}
                </Button>
              </CardContent>
            </Card>

            {/* Iris Capture */}
            <Card className="bg-gradient-card shadow-soft">
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
                      <p className="text-sm text-muted-foreground">Good Quality</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Look into scanner</p>
                    </div>
                  )}
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
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Demographics</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {enrollmentData.firstName} {enrollmentData.lastName}</p>
                  <p><span className="text-muted-foreground">Date of Birth:</span> {enrollmentData.dateOfBirth}</p>
                  <p><span className="text-muted-foreground">Gender:</span> {enrollmentData.gender}</p>
                  <p><span className="text-muted-foreground">Address:</span> {enrollmentData.address}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Biometrics Captured</h3>
                <div className="space-y-2">
                  {capturedBiometrics.map((biometric) => (
                    <div key={biometric} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-sm capitalize">{biometric}</span>
                      <Badge variant="outline" className="text-xs">High Quality</Badge>
                    </div>
                  ))}
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
                <Button className="bg-gradient-primary">
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