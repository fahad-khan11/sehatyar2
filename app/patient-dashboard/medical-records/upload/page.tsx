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
import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getAppointmentById, updateAppointmentFile } from "@/lib/api/apis";
import router from "next/router";

type UploadedFile = {
  file: File;
  id: string;
  progress: number;
  status: "uploading" | "success" | "error";
  preview?: string;
};


export default function UploadMedicalRecordsPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
        const userStr = localStorage.getItem("user_data");
        if (userStr) {
             const user = JSON.parse(userStr);
             if (user && user.id) {
                 try {
                     // The user requested to use getAppointmentById to fetch the list 
                     // (since getAppointmentById currently points to /patient/{id} which returns a list)
                     const data = await getAppointmentById(user.id);
                     if (data && data.length > 0) {
                         // Assuming we upload to the first/latest appointment since selection UI is removed
                         setAppointmentId(data[0].id);
                     }
                 } catch (error) {
                     console.error("Error fetching appointment for upload context:", error);
                 }
             }
        }
    };
    fetchAppointment();
  }, []);

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
      status: "success", // Initially mark simple drag/drop as success in UI until actual submit
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) return;
    
    setIsSubmitting(true);

    try {
        const formData = new FormData();
        const userStr = localStorage.getItem("user_data");
        if (userStr) {
             const user = JSON.parse(userStr);
             if (user && user.id) {
                 formData.append("userId", user.id);
             }
        }
        
        // Append all files. Backend likely expects 'medicalHistoryFiles' for multiple files 
        // or loop if it handles array. Based on previous response examples, it's an array.
        uploadedFiles.forEach((fileObj) => {
            formData.append("medicalHistoryFiles", fileObj.file);
        });

        if (!appointmentId) {
            alert("No appointment found to upload to.");
            setIsSubmitting(false);
            return;
        }

        // Use the ID fetched from getAppointmentById
        await updateAppointmentFile(appointmentId, formData);
        // Navigate to the medical records page after successful upload

        setSubmitSuccess(true);
        // Reset form after 2 seconds
        setTimeout(() => {
          setUploadedFiles([]);
          setSubmitSuccess(false);
        }, 2000);
        
    } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload files. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const canSubmit = uploadedFiles.length > 0;

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
          <p className="text-muted-foreground ml-12">Upload medical records and documents.</p>
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
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>Upload medical records, reports, or related documents (PDF, JPG, PNG)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
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
