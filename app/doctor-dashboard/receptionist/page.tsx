"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getReceptionists, addReceptionist, AddReceptionistPayload } from "@/lib/api/apis";
import { Calendar, Loader2, Mail, MapPin, Phone, Plus, User, UserPlus, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Receptionist {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  country: string;
  city: string;
  role: string;
  isActive: boolean;
  isOnline: boolean;
  createdAt: string;
  clinicId: number | null;
}

interface DoctorProfileResponse {
  id: number;
  receptionist: Receptionist | null;
}

export default function ReceptionistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [receptionist, setReceptionist] = useState<Receptionist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<AddReceptionistPayload>({
    fullName: "",
    gender: "male",
    country: "",
    city: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "receptionist",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Check if user is individual doctor
  useEffect(() => {
    if (user && user.role !== UserRole.INDIVIDUALDOCTOR) {
      router.push("/doctor-dashboard");
    }
  }, [user, router]);

  // Fetch receptionist
  useEffect(() => {
    const fetchReceptionist = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data: DoctorProfileResponse = await getReceptionists();
        setReceptionist(data?.receptionist || null);
      } catch (err) {
        console.error("Failed to fetch receptionist:", err);
        setError("Failed to load receptionist data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === UserRole.INDIVIDUALDOCTOR) {
      fetchReceptionist();
    }
  }, [user]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.fullName.trim()) {
      setFormError("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      setFormError("Email is required");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setFormError("Phone number is required");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      await addReceptionist(formData);
      const data: DoctorProfileResponse = await getReceptionists();
      setReceptionist(data?.receptionist || null);
      setFormData({
        fullName: "",
        gender: "male",
        country: "",
        city: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "receptionist",
      });
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Failed to add receptionist:", err);
      setFormError(err.response?.data?.message || "Failed to add receptionist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header - Compact & Single Line */}
      <div className="flex flex-col items-center justify-center text-center space-y-1">
       
        {!receptionist && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full px-6 border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-all font-semibold mt-2">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Receptionist
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-border shadow-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                  Add Receptionist
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Credentials provided here will be used by your staff to access the dashboard.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 py-4">
                  {formError && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm font-medium border border-destructive/20 text-center">
                      {formError}
                    </div>
                  )}
                  
                  <div className="grid gap-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold">Full Name *</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Staff member's full name" className="rounded-xl border-border" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="staff@clinic.com" className="rounded-xl" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-semibold">Phone *</Label>
                      <Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Contact number" className="rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="gender" className="text-sm font-semibold">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value: "male" | "female" | "other") => setFormData(prev => ({ ...prev, gender: value }))}>
                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password" className="text-sm font-semibold">Password *</Label>
                      <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Security code" className="rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="country" className="text-sm font-semibold">Country</Label>
                      <Input id="country" name="country" value={formData.country} onChange={handleInputChange} placeholder="e.g. Pakistan" className="rounded-xl" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="city" className="text-sm font-semibold">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Faisalabad" className="rounded-xl" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="rounded-xl px-8 bg-foreground text-background hover:opacity-90">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto">
        {/* No Receptionist State - Compact */}
        {!error && !receptionist && (
          <div className="text-center py-12 px-6 rounded-3xl border border-dashed border-border bg-muted/10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background border border-border flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Initialize Staff Portal</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm leading-relaxed">
              Experience efficient clinic management by adding your first receptionist member today.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="rounded-full px-8 bg-foreground text-background font-bold shadow hover:opacity-90 transition-all">
              Add Receptionist
            </Button>
          </div>
        )}

        {/* Receptionist Card - Compact Monochrome */}
        {!error && receptionist && (
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="bg-muted/50 p-6 flex items-center gap-6 border-b border-border">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
                  <AvatarFallback className="text-2xl bg-foreground text-background font-black">
                    {receptionist.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {receptionist.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center border-2 border-background">
                    <div className="w-2.5 h-2.5 bg-foreground rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tighter uppercase">{receptionist.fullName}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full px-3 py-0 border-foreground text-[10px] font-bold uppercase tracking-wider bg-background">
                    Authorized
                  </Badge>
                  <Badge className="rounded-full px-3 py-0 bg-foreground text-background text-[10px] font-bold uppercase tracking-wider">
                    {receptionist.gender}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6 bg-background">
              {/* Data Grid - 2x2 Clean */}
              <div className="grid grid-cols-2 gap-px bg-border/30 rounded-2xl overflow-hidden border border-border/30">
                <div className="p-4 bg-background flex flex-col space-y-1 hover:bg-muted/10 transition-colors">
                  <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Email Contact</span>
                  <span className="text-sm font-medium truncate">{receptionist.email}</span>
                </div>
                <div className="p-4 bg-background flex flex-col space-y-1 hover:bg-muted/10 transition-colors">
                  <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Phone Number</span>
                  <span className="text-sm font-medium">{receptionist.phoneNumber || "---"}</span>
                </div>
                <div className="p-4 bg-background flex flex-col space-y-1 hover:bg-muted/10 transition-colors">
                  <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Location</span>
                  <span className="text-sm font-medium">{receptionist.city || "Clinic"}, {receptionist.country || ""}</span>
                </div>
                <div className="p-4 bg-background flex flex-col space-y-1 hover:bg-muted/10 transition-colors">
                  <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Joined Since</span>
                  <span className="text-sm font-medium">{formatDate(receptionist.createdAt)}</span>
                </div>
              </div>

              {/* Security Banner - Minimal */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border flex items-center gap-4">
                <CheckCircle2 className="h-5 w-5 text-foreground shrink-0" />
                <p className="text-[12px] text-muted-foreground italic leading-tight">
                  Staff actions are historically logged for compliance.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
