'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ViewPatientModalProps {
  open: boolean;
  onClose: () => void;
  patient: any;
}

export default function ViewPatientModal({ open, onClose, patient }: ViewPatientModalProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Detailed information about {patient.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={patient.patientProfile?.profilePic || "/assets/doctors.svg"} alt={patient.fullName} />
              <AvatarFallback>{patient.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{patient.fullName}</h3>
              <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
              <Badge variant={patient.isActive ? "default" : "secondary"} className="mt-1">
                {patient.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Phone Number</p>
              <p className="font-medium">{patient.phoneNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium truncate" title={patient.email}>{patient.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Condition</p>
              <p className="font-medium">{patient.patientProfile?.condition || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Last Visit</p>
              <p className="font-medium">
                {patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString() : "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">City</p>
              <p className="font-medium">{patient.city || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium capitalize">{patient.gender || "N/A"}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="default" onClick={() => window.location.href = `/doctor-dashboard/patients/${patient.id}`}>
            View Full Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
