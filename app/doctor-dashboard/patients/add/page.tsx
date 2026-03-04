"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Link from "next/link";
import { Upload, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { createPatientForClinic } from "@/lib/api/apis";

export default function AddPatientPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "male",
    bloodGroup: "A+",
    country: "Pakistan",
    city: "Karachi",
    password: "patient123",
    role: "patient",
    phoneNumber: "+92",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("email", formData.email);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("gender", formData.gender);
      payload.append("country", formData.country);
      payload.append("city", formData.city);
      payload.append("password", formData.password);
      payload.append("role", formData.role);
      payload.append("bloodGroup", formData.bloodGroup);
      
      // if (selectedFile) {
      //   payload.append("medicalRecords", selectedFile);
      // }

      await createPatientForClinic(payload);
      toast.success("Patient added successfully");
      router.push("/doctor-dashboard/patients");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="hover:bg-accent hover:text-accent-foreground">
          <Link href="/doctor-dashboard/patients">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Registration</h1>
      </div>

      <Card className="bg-card text-card-foreground border-border shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4 mb-6">
          <CardTitle className="text-xl font-semibold">Add Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="bg-background border-input focus-visible:ring-ring"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-background border-input focus-visible:ring-ring"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(v) => handleSelectChange("gender", v)}
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Blood Group */}
              <div className="space-y-2">
                <Label htmlFor="bloodGroup" className="text-sm font-medium">Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(v) => handleSelectChange("bloodGroup", v)}
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="bg-background border-input"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="bg-background border-input"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-background border-input"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  disabled
                  className="bg-muted text-muted-foreground border-input opacity-70"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+92 3XX XXXXXXX"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="bg-background border-input"
                />
              </div>
            </div>

            {/* Upload Section */}
            <div className="pt-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {/* <div 
                onClick={triggerFileSelect}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-full bg-background shadow-sm border border-border group-hover:shadow-md transition-shadow">
                    <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {selectedFile ? `Selected: ${selectedFile.name}` : "Upload Medical Records"}
                  </p>
                </div>
              </div> */}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/doctor-dashboard/patients")}
                className="text-muted-foreground hover:text-foreground font-medium px-0"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[160px] rounded-full h-12 text-base font-semibold transition-all shadow-sm"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Add Patient"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
