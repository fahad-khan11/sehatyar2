"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Check, FileText, Upload, X, AlertCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

type UploadedFile = {
  file: File;
  id: string;
  progress: number;
  status: "uploading" | "success" | "error";
  preview?: string;
};

type Appointment = {
  id: string;
  date: string;
  doctor: string;
  type: string;
  status: string;
};

// Sample completed appointments - replace with actual API call
const completedAppointments: Appointment[] = [
  {
    id: "3",
    date: "2023-07-15",
    doctor: "Dr. Lisa Patel",
    type: "Follow-up",
    status: "Completed",
  },
  {
    id: "7",
    date: "2023-07-05",
    doctor: "Dr. Jennifer Lee",
    type: "Annual Physical",
    status: "Completed",
  },
];

const categories = [
  "Lab Report",
  "X-Ray",
  "MRI",
  "CT Scan",
  "Ultrasound",
  "Prescription",
  "Medical Certificate",
  "Discharge Summary",
  "Other",
];

export default function UploadMedicalRecordsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((uploadedFile) => {
      simulateUpload(uploadedFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                progress,
                status: progress >= 100 ? "success" : "uploading",
              }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset form after 2 seconds
    setTimeout(() => {
      setSelectedAppointment("");
      setCategory("");
      setDescription("");
      setUploadedFiles([]);
      setSubmitSuccess(false);
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const canSubmit = selectedAppointment && category && uploadedFiles.length > 0 && uploadedFiles.every((f) => f.status === "success");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/patient-dashboard/medical-records">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Upload Medical Records</h2>
          </div>
          <p className="text-muted-foreground ml-12">Upload medical records and documents from your completed appointments.</p>
        </div>
      </div>

      {submitSuccess && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Success!</AlertTitle>
          <AlertDescription className="text-green-600">Your medical records have been uploaded successfully.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Appointment Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Appointment</CardTitle>
              <CardDescription>Choose the appointment these records are associated with.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appointment">Completed Appointment *</Label>
                <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
                  <SelectTrigger id="appointment">
                    <SelectValue placeholder="Select an appointment" />
                  </SelectTrigger>
                  <SelectContent>
                    {completedAppointments.map((appointment) => (
                      <SelectItem key={appointment.id} value={appointment.id}>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {appointment.date} - {appointment.doctor} ({appointment.type})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Document Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional notes or description about these records..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>Upload medical records, reports, or related documents (PDF, JPG, PNG)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drag and Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-12 transition-all cursor-pointer",
                  "hover:border-primary hover:bg-primary/5",
                  isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-1">Drop files here or click to browse</p>
                    <p className="text-sm text-muted-foreground">Supports: PDF, JPG, PNG (Max 10MB per file)</p>
                  </div>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Uploaded Files ({uploadedFiles.length})</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((uploadedFile) => (
                      <div key={uploadedFile.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{uploadedFile.file.name}</p>
                              <p className="text-sm text-muted-foreground">{formatFileSize(uploadedFile.file.size)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {uploadedFile.status === "success" && (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                <Check className="h-4 w-4 text-green-600" />
                              </div>
                            )}
                            {uploadedFile.status === "error" && (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              </div>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(uploadedFile.id)}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {uploadedFile.status === "uploading" && (
                          <div className="space-y-1">
                            <Progress value={uploadedFile.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">Uploading... {uploadedFile.progress}%</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/patient-dashboard/medical-records">Cancel</Link>
            </Button>
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Records
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
