"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, Eye, FileText, Filter, MoreHorizontal, Plus, Search, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAppointmentsByPatientId } from "@/lib/api/apis";
import { saveAs } from "file-saver";

type MedicalRecord = {
  id: string;
  appointmentId: string;
  appointmentDate: string;
  doctor: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  category: string;
  status: string;
  description?: string;
};

export default function MedicalRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
        try {
            const userStr = localStorage.getItem("user_data");
            if (!userStr) return;
    
            const user = JSON.parse(userStr);
            if (user && user.id) {
              const data = await getAppointmentsByPatientId(user.id);
              let allRecords: MedicalRecord[] = [];

              data.forEach((appointment: any) => {
                  if(appointment.medicalHistoryFiles && appointment.medicalHistoryFiles.length > 0) {
                      appointment.medicalHistoryFiles.forEach((file: string, index: number) => {
                         // Extract filename from URL (decoding URI component to handle %20 etc)
                         let fileName = decodeURIComponent(file.split('/').pop() || `File_${index + 1}`);
                         // Clean up timestamps if present (assuming format like timestampfilename.ext)
                         // This regex looks for 13 digits followed by something
                         fileName = fileName.replace(/^\d{13}/, '');

                          allRecords.push({
                              id: `${appointment.id}-${index}`,
                              appointmentId: appointment.id.toString(),
                              appointmentDate: appointment.appointmentDate ? appointment.appointmentDate.split('T')[0] : "N/A",
                              doctor: appointment.doctor?.user?.fullName || "Unknown Doctor",
                              fileName: fileName,
                              fileUrl: file,
                              fileType: fileName.split('.').pop()?.toUpperCase() || "FILE",
                              fileSize: "Unknown", // API doesn't provide size
                              uploadDate: appointment.updatedAt ? appointment.updatedAt.split('T')[0] : "N/A",
                              category: "Medical History",
                              status: "Verified", // Assuming files attached to completed/existing appointments are verified
                              description: appointment.notes || "No description"
                          });
                      });
                  }
              });
              setRecords(allRecords);
              setFilteredRecords(allRecords);
            }
          } catch (error) {
            console.error("Failed to fetch medical records:", error);
          }
    };
    fetchRecords();
  }, []);

  // Apply search
  useEffect(() => {
    let result = [...records];

    // Apply search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (record) =>
          record.fileName.toLowerCase().includes(search) ||
          record.doctor.toLowerCase().includes(search) ||
          record.category.toLowerCase().includes(search) ||
          (record.description && record.description.toLowerCase().includes(search))
      );
    }

    setFilteredRecords(result);
  }, [searchTerm, records]);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Verified":
        return { variant: "success", className: "bg-green-500" };
      case "Pending Review":
        return { variant: "default", className: "bg-amber-500" };
      default:
        return { variant: "outline", className: "" };
    }
  };

  const getCategoryIcon = (category: string) => {
    return <FileText className="h-4 w-4" />;
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
      saveAs(fileUrl, fileName);
  };


  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Medical Records</h2>
          <p className="text-muted-foreground">View and manage your medical records from completed appointments.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/patient-dashboard/appointments">
              <FileText className="mr-2 h-4 w-4" />
              View Appointments
            </Link>
          </Button>
          <Button asChild>
            <Link href="/patient-dashboard/medical-records/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Records
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="mb-3">All Medical Records</CardTitle>
            <CardDescription>View all your uploaded medical records and documents.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search records..."
                className="pl-8 w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setSearchTerm("")}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="whitespace-nowrap">
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead className="table-cell">Category</TableHead>
                <TableHead className="table-cell">Doctor</TableHead>
                <TableHead>Appointment Date</TableHead>
                <TableHead className="table-cell">Upload Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="whitespace-nowrap">
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        {getCategoryIcon(record.category)}
                      </div>
                      <div>
                          {/* Truncate huge filenames */}
                        <p className="font-medium truncate max-w-[200px]" title={record.fileName}>{record.fileName}</p> 
                        <p className="text-sm text-muted-foreground">
                          {record.fileType} • {record.fileSize}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge variant="outline">{record.category}</Badge>
                  </TableCell>
                  <TableCell className="table-cell">{record.doctor}</TableCell>
                  <TableCell>{record.appointmentDate}</TableCell>
                  <TableCell className="table-cell">{record.uploadDate}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(record.status).variant as any} className={getBadgeVariant(record.status).className}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="mr-2 h-4 w-4" />
                              View file
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(record.fileUrl, record.fileName)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty state */}
          {filteredRecords.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No medical records found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search to find what you're looking for."
                  : "Upload your medical records from completed appointments."}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link href="/patient-dashboard/medical-records/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Records
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
