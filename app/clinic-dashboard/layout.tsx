"use client";
import { ClinicDashboardLayout } from "@/components/clinic-dashboard-layout";
import { Toaster } from "sonner";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClinicDashboardLayout>
      <Toaster richColors position="top-right" />
      {children}
    </ClinicDashboardLayout>
  );
}
