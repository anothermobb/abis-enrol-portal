import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Clock, Edit, Save, X, Bookmark, Plus, Trash2 } from "lucide-react";

interface ScheduleSettings {
  workStartTime: string;
  workEndTime: string;
  breakStartTime: string;
  breakDuration: number;
}

interface ScheduleTemplate {
  id: string;
  name: string;
  settings: ScheduleSettings;
  isCustom: boolean;
}

const defaultSettings: ScheduleSettings = {
  workStartTime: "08:00",
  workEndTime: "17:00",
  breakStartTime: "12:00",
  breakDuration: 60
};

const predefinedTemplates: ScheduleTemplate[] = [
  {
    id: "standard-office",
    name: "Standard Office Hours",
    settings: { workStartTime: "09:00", workEndTime: "17:00", breakStartTime: "12:00", breakDuration: 60 },
    isCustom: false
  },
  {
    id: "early-start",
    name: "Early Start",
    settings: { workStartTime: "07:00", workEndTime: "15:00", breakStartTime: "11:00", breakDuration: 30 },
    isCustom: false
  },
  {
    id: "retail-shift",
    name: "Retail Shift",
    settings: { workStartTime: "10:00", workEndTime: "18:00", breakStartTime: "14:00", breakDuration: 30 },
    isCustom: false
  },
  {
    id: "healthcare",
    name: "Healthcare 12-Hour",
    settings: { workStartTime: "07:00", workEndTime: "19:00", breakStartTime: "13:00", breakDuration: 60 },
    isCustom: false
  }
];

export const ScheduleSetup = () => {
  const [currentSettings, setCurrentSettings] = useState<ScheduleSettings>(defaultSettings);
  const [formSettings, setFormSettings] = useState<ScheduleSettings>(defaultSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customTemplates, setCustomTemplates] = useState<ScheduleTemplate[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const { toast } = useToast();

  const validateSettings = (settings: ScheduleSettings): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    const workStart = new Date(`2000-01-01T${settings.workStartTime}:00`);
    const workEnd = new Date(`2000-01-01T${settings.workEndTime}:00`);
    const breakStart = new Date(`2000-01-01T${settings.breakStartTime}:00`);
    
    if (workEnd <= workStart) {
      newErrors.workEndTime = "Work end time must be after work start time";
    }
    
    if (breakStart < workStart || breakStart > workEnd) {
      newErrors.breakStartTime = "Break start time must be between work start and end times";
    }
    
    const breakEnd = new Date(breakStart.getTime() + settings.breakDuration * 60000);
    if (breakEnd > workEnd) {
      newErrors.breakDuration = "Break duration extends beyond work end time";
    }
    
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateSettings(formSettings);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setCurrentSettings(formSettings);
    setIsEditing(false);
    setErrors({});
    toast({
      title: "Schedule Updated",
      description: "Company-wide schedule settings have been saved successfully.",
    });
  };

  const handleCancel = () => {
    setFormSettings(currentSettings);
    setIsEditing(false);
    setErrors({});
  };

  const handleEdit = () => {
    setFormSettings(currentSettings);
    setIsEditing(true);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}:00`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const applyTemplate = (template: ScheduleTemplate) => {
    const validationErrors = validateSettings(template.settings);
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Invalid Template",
        description: "This template contains invalid settings.",
        variant: "destructive"
      });
      return;
    }
    
    setFormSettings(template.settings);
    toast({
      title: "Template Applied",
      description: `"${template.name}" template has been applied to the form.`,
    });
  };

  const saveAsTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: "Template Name Required",
        description: "Please enter a name for your template.",
        variant: "destructive"
      });
      return;
    }

    const validationErrors = validateSettings(formSettings);
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Invalid Settings",
        description: "Please fix validation errors before saving as template.",
        variant: "destructive"
      });
      return;
    }

    const newTemplate: ScheduleTemplate = {
      id: `custom-${Date.now()}`,
      name: templateName,
      settings: { ...formSettings },
      isCustom: true
    };

    setCustomTemplates(prev => [...prev, newTemplate]);
    setTemplateName("");
    setShowSaveTemplate(false);
    toast({
      title: "Template Saved",
      description: `"${templateName}" has been saved as a custom template.`,
    });
  };

  const deleteTemplate = (templateId: string) => {
    setCustomTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Template Deleted",
      description: "Custom template has been deleted.",
    });
  };

  const allTemplates = [...predefinedTemplates, ...customTemplates];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Schedule Setup</h1>
        <p className="text-muted-foreground">
          Manage company-wide employee schedule settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Templates & Quick Presets */}
        <Card className="bg-gradient-card border shadow-medium">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <Bookmark className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Templates & Presets</CardTitle>
                <CardDescription>Quick schedule configurations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Predefined Templates</Label>
              <div className="space-y-2">
                {predefinedTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(template)}
                    className="w-full justify-start text-left h-auto p-3"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-medium">{template.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(template.settings.workStartTime)} - {formatTime(template.settings.workEndTime)}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {customTemplates.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Custom Templates</Label>
                <div className="space-y-2">
                  {customTemplates.map((template) => (
                    <div key={template.id} className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyTemplate(template)}
                        className="flex-1 justify-start text-left h-auto p-3"
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-medium">{template.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(template.settings.workStartTime)} - {formatTime(template.settings.workEndTime)}
                          </span>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                        className="px-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t">
              {!showSaveTemplate ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveTemplate(true)}
                  className="w-full gap-2"
                  disabled={!isEditing}
                >
                  <Plus className="h-4 w-4" />
                  Save Current as Template
                </Button>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Template name..."
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={saveAsTemplate}
                      className="flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowSaveTemplate(false);
                        setTemplateName("");
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Schedule Display */}
        <Card className="bg-gradient-card border shadow-medium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                  <Clock className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl">Current Schedule</CardTitle>
                  <CardDescription>Active company-wide settings</CardDescription>
                </div>
              </div>
              <Button onClick={handleEdit} size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Work Start</Label>
                <div className="text-lg font-semibold">{formatTime(currentSettings.workStartTime)}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Work End</Label>
                <div className="text-lg font-semibold">{formatTime(currentSettings.workEndTime)}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Break Start</Label>
                <div className="text-lg font-semibold">{formatTime(currentSettings.breakStartTime)}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Break Duration</Label>
                <div className="text-lg font-semibold">{currentSettings.breakDuration} minutes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Form */}
        <Card className={`bg-gradient-card border shadow-medium transition-all duration-300 ${
          isEditing ? 'ring-2 ring-primary/20' : 'opacity-60'
        }`}>
          <CardHeader>
            <CardTitle className="text-xl">Schedule Configuration</CardTitle>
            <CardDescription>
              {isEditing ? "Update schedule settings" : "Click Edit to modify settings"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workStartTime">Work Start Time</Label>
                <Input
                  id="workStartTime"
                  type="time"
                  value={formSettings.workStartTime}
                  onChange={(e) => setFormSettings(prev => ({
                    ...prev,
                    workStartTime: e.target.value
                  }))}
                  disabled={!isEditing}
                  className={errors.workStartTime ? "border-destructive" : ""}
                />
                {errors.workStartTime && (
                  <p className="text-sm text-destructive">{errors.workStartTime}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workEndTime">Work End Time</Label>
                <Input
                  id="workEndTime"
                  type="time"
                  value={formSettings.workEndTime}
                  onChange={(e) => setFormSettings(prev => ({
                    ...prev,
                    workEndTime: e.target.value
                  }))}
                  disabled={!isEditing}
                  className={errors.workEndTime ? "border-destructive" : ""}
                />
                {errors.workEndTime && (
                  <p className="text-sm text-destructive">{errors.workEndTime}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="breakStartTime">Break Start Time</Label>
                <Input
                  id="breakStartTime"
                  type="time"
                  value={formSettings.breakStartTime}
                  onChange={(e) => setFormSettings(prev => ({
                    ...prev,
                    breakStartTime: e.target.value
                  }))}
                  disabled={!isEditing}
                  className={errors.breakStartTime ? "border-destructive" : ""}
                />
                {errors.breakStartTime && (
                  <p className="text-sm text-destructive">{errors.breakStartTime}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="breakDuration">Break Duration</Label>
                <Select
                  value={formSettings.breakDuration.toString()}
                  onValueChange={(value) => setFormSettings(prev => ({
                    ...prev,
                    breakDuration: parseInt(value)
                  }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={errors.breakDuration ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
                {errors.breakDuration && (
                  <p className="text-sm text-destructive">{errors.breakDuration}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="gap-2 flex-1">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" className="gap-2 flex-1">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};