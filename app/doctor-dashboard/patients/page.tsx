'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  FileText, 
  Trash2, 
  Loader2, 
  Filter, 
  X,
  User
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { getPatientAppointmentsByDoctorId, deletePatientById } from "@/lib/Api/Doctor/doctor_api";
import ViewPatientModal from "./modals/ViewPatientModal";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal state
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<any>(null);

  async function fetchPatients() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPatientAppointmentsByDoctorId();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch patients");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDeleteClick = (patient: any) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    try {
      await deletePatientById(patientToDelete.id);
      setPatients((prev) => prev.filter((p) => p.id !== patientToDelete.id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete patient");
    } finally {
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  // Filter logic
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phoneNumber?.includes(searchQuery) ||
      patient.id?.toString().includes(searchQuery);
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && patient.isActive) ||
      (statusFilter === "inactive" && !patient.isActive);

    return matchesSearch && matchesStatus;
  });

  const activeFilterCount = (searchQuery ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Patients</h1>
          <p className="text-muted-foreground">Manage and view your patient records.</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/doctor-dashboard/patients/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Patients List</CardTitle>
              <CardDescription>A complete list of patients assigned to you.</CardDescription>
            </div>
            
            <div className="flex flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search by name, ID or phone..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="ml-2 bg-primary text-primary-foreground h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px]" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filters</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                        className="h-8 px-2"
                      >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading patient data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchPatients} variant="outline">Try Again</Button>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              {patients.length === 0 ? "No patients found." : "No patients match your search criteria."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={patient.patientProfile?.profilePic || "/assets/doctors.svg"} alt={patient.fullName} />
                            <AvatarFallback>{patient.fullName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{patient.fullName}</span>
                            <span className="text-xs text-muted-foreground font-normal">ID: {patient.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.phoneNumber}</TableCell>
                      <TableCell>
                        <span className="truncate max-w-[150px] inline-block">
                          {patient.patientProfile?.condition || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={patient.isActive ? "default" : "secondary"}>
                          {patient.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="View Reports"
                            onClick={() => handleViewDetails(patient)}
                          >
                            <FileText className="h-4 w-4 text-primary" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Patient Details"
                            onClick={() => handleViewDetails(patient)}
                          >
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewDetails(patient)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem asChild>
                                <Link href={`/doctor-dashboard/patients/${patient.id}`}>
                                  <User className="mr-2 h-4 w-4" /> Full Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/doctor-dashboard/patients/${patient.id}/history`}>
                                  <FileText className="mr-2 h-4 w-4" /> Medical History
                                </Link>
                              </DropdownMenuItem> */}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDeleteClick(patient)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Patient
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedPatient && (
        <ViewPatientModal 
          open={showViewModal} 
          onClose={() => setShowViewModal(false)} 
          patient={selectedPatient} 
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete <strong>{patientToDelete?.fullName}</strong> and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
