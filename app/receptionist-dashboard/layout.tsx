"use client";
import { Toaster } from "sonner";
import { ReceptionistDashboardLayout } from "@/components/Receptionist-dashboard-layout";
import RoleGuard from "@/components/RoleGuard";
import { UserRole } from "@/lib/types";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.RECEPTIONIST, UserRole.CLINICRECEPTIONIST ]}>
      <ReceptionistDashboardLayout>
        <Toaster richColors position="top-right" />
        {children}
      </ReceptionistDashboardLayout>
    </RoleGuard>
  );
}
