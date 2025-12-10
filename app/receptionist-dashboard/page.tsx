"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarClock, ClipboardList, FileText, Users, Stethoscope, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { getAppointmentsByClinic, getDoctorsByClinic, getPatientsByClinic, deleteAppointment } from "@/lib/api/apis";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ReceptionistDashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptData, patData, docData] = await Promise.all([
          getAppointmentsByClinic(),
          getPatientsByClinic(),
          getDoctorsByClinic()
        ]);
        setAppointments(Array.isArray(apptData) ? apptData : []);
        setPatients(Array.isArray(patData) ? patData : []);
        setDoctors(Array.isArray(docData) ? docData : []);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteAppointment = async (id: number) => {
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      toast.success("Appointment deleted successfully");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Receptionist Dashboard</h2>
        <p className="text-muted-foreground">Overview of clinic operations, patients, and schedule.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Appointments Card */}
        <Card className="border-blue-100 dark:border-blue-900/60 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                  <CalendarClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-slate-600 dark:text-slate-300">Total Appointments</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-3xl font-bold text-slate-800 dark:text-white">{appointments.length}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Scheduled appointments</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Patients Card */}
        <Card className="border-amber-100 dark:border-amber-900/60 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="font-medium text-slate-600 dark:text-slate-300">Total Patients</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-3xl font-bold text-slate-800 dark:text-white">{patients.length}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Registered patients</p>
            </div>
          </CardContent>
        </Card>

        {/* Doctors Card */}
        <Card className="border-emerald-100 dark:border-emerald-900/60 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="font-medium text-slate-600 dark:text-slate-300">Doctors</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-3xl font-bold text-slate-800 dark:text-white">{doctors.length}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Active doctors</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Reports Card (Placeholder) */}
        <Card className="border-rose-100 dark:border-rose-900/60 overflow-hidden">
           <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-rose-100 dark:bg-rose-900/50 p-2 rounded-lg">
                  <ClipboardList className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <span className="font-medium text-slate-600 dark:text-slate-300">Pending Tasks</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-3xl font-bold text-slate-800 dark:text-white">0</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tasks requiring attention</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointments List</CardTitle>
              <CardDescription>Manage and view all scheduled appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No appointments found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell className="font-medium">{apt.patientName || "N/A"}</TableCell>
                        <TableCell>{apt.phoneNumber || "N/A"}</TableCell>
                        <TableCell>{apt.email || "N/A"}</TableCell>
                        <TableCell className="capitalize">{apt.paymentMethod || "N/A"}</TableCell>
                        <TableCell>{apt.amount ? `$${apt.amount}` : "N/A"}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={apt.notes}>
                          {apt.notes || "N/A"}
                        </TableCell>
                        <TableCell>
                          {apt.appointmentDate 
                            ? new Date(apt.appointmentDate).toLocaleDateString() 
                            : (apt.date ? new Date(apt.date).toLocaleDateString() : "N/A")}
                        </TableCell>
                        <TableCell>{apt.appointmentTime || apt.time || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                            {apt.status || 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Patients</CardTitle>
              <CardDescription>View details of all patients registered in this clinic.</CardDescription>
            </CardHeader>
            <CardContent>
               {patients.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No patients found.</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {patients.map((patient, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={patient.profilePicture} />
                        <AvatarFallback>{patient.fullName?.[0] || patient.name?.[0] || "P"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{patient.fullName || patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                        <p className="text-xs text-muted-foreground">{patient.phoneNumber || patient.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle> Doctors</CardTitle>
              <CardDescription>Medical professionals assigned to this clinic.</CardDescription>
            </CardHeader>
            <CardContent>
               {doctors.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No doctors found.</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {doctors.map((doc, index) => {
                     // Handle nested user object if it exists
                     const name = doc.user?.fullName || doc.name;
                     const email = doc.user?.email || doc.email;
                     const profilePic = doc.profilePic || doc.user?.profilePic;
                     // Handle specialty which might be an array or string
                     const specialization = Array.isArray(doc.primarySpecialization) 
                        ? doc.primarySpecialization[0] 
                        : (doc.primarySpecialization || doc.specialization);

                     return (
                      <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Avatar>
                          <AvatarImage src={profilePic} />
                          <AvatarFallback>{name?.[0] || "D"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{name}</p>
                          <p className="text-sm text-muted-foreground">{specialization}</p>
                          <p className="text-xs text-muted-foreground">{email}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
