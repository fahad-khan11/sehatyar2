"use client";
import { Toaster } from "sonner";

import { DoctorDashboardLayout } from "@/components/doctor-dashboard-layout";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DoctorDashboardLayout>
      <Toaster richColors position="top-right" />
      {children}
    </DoctorDashboardLayout>
  );
}
