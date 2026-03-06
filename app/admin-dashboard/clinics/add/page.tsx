"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClinic } from "@/lib/api/apis";

const formSchema = z.object({
  name: z.string().min(2, "Clinic name must be at least 2 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters.")
    .regex(/^\+?\d+$/, "Phone number must only contain digits (and optional leading +)."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function AddClinicPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await createClinic({ ...values, isDoctorClinic: false });
      toast.success("Clinic added successfully!");
      router.push("/admin-dashboard/clinics");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add clinic. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full max-w-2xl items-center gap-2">
        <Link href="/admin-dashboard/clinics">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add New Clinic</h2>
          <p className="text-muted-foreground">Enter the details of the new clinic.</p>
        </div>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Clinic Details</CardTitle>
          <CardDescription>
            Fill in the form below to register a new clinic location. Fields marked with <span className="text-destructive">*</span> are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinic Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Central City Clinic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinic Address <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 123 Main St, New York, NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinic Email <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="e.g. contact@clinic.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinic Phone <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. +1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinic Password <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Link href="/admin-dashboard/clinics">
                  <Button variant="outline" type="button" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Clinic"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
