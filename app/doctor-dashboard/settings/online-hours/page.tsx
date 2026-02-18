"use client"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

type TimeSlot = {
  id: string;
  start: string;
  end: string;
  location: string;
}

type DayConfig = {
  day: string;
  isOpen: boolean;
  slots: TimeSlot[];
}

const INITIAL_HOURS: DayConfig[] = [
  { day: "Monday", isOpen: true, slots: [{ id: "1", start: "08:00", end: "18:00", location: "main" }] },
  { day: "Tuesday", isOpen: true, slots: [{ id: "2", start: "08:00", end: "18:00", location: "main" }] },
  { day: "Wednesday", isOpen: true, slots: [{ id: "3", start: "08:00", end: "18:00", location: "main" }] },
  { day: "Thursday", isOpen: true, slots: [{ id: "4", start: "08:00", end: "18:00", location: "main" }] },
  { day: "Friday", isOpen: true, slots: [{ id: "5", start: "08:00", end: "18:00", location: "main" }] },
  { day: "Saturday", isOpen: true, slots: [{ id: "6", start: "09:00", end: "15:00", location: "main" }] },
  { day: "Sunday", isOpen: false, slots: [{ id: "7", start: "09:00", end: "15:00", location: "main" }] },
];

export default function OnlineConsultationPage() {
  const [workingHours, setWorkingHours] = useState<DayConfig[]>(INITIAL_HOURS);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Availability updated successfully");
    }, 1000);
  };

  const toggleAllDays = (checked: boolean) => {
    const newHours = workingHours.map(day => ({
      ...day,
      isOpen: checked
    }));
    setWorkingHours(newHours);
    toast.info(checked ? "All days turned on" : "All days turned off");
  };

  const toggleDay = (dayIndex: number) => {
    const newHours = [...workingHours];
    newHours[dayIndex].isOpen = !newHours[dayIndex].isOpen;
    setWorkingHours(newHours);
  };

  const addSlot = (dayIndex: number) => {
    const newHours = [...workingHours];
    newHours[dayIndex].slots.push({
      id: Math.random().toString(36).substr(2, 9),
      start: "09:00",
      end: "17:00",
      location: "main"
    });
    setWorkingHours(newHours);
  };

  const removeSlot = (dayIndex: number, slotId: string) => {
    const newHours = [...workingHours];
    // Keep at least one slot
    if (newHours[dayIndex].slots.length > 1) {
      newHours[dayIndex].slots = newHours[dayIndex].slots.filter(s => s.id !== slotId);
      setWorkingHours(newHours);
    }
  };

  const updateSlot = (dayIndex: number, slotId: string, field: keyof TimeSlot, value: string) => {
    const newHours = [...workingHours];
    const slot = newHours[dayIndex].slots.find(s => s.id === slotId);
    if (slot) {
      slot[field] = value;
      setWorkingHours(newHours);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center space-x-2">

          <h1 className="text-2xl font-bold tracking-tight">Online Consultation Availability</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className={`mr-2 h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 flex-wrap gap-4">
            <div className="space-y-1">
              <CardTitle>Online Session Hours</CardTitle>
              <CardDescription>Set your availability for telemedicine and online consultation sessions. You can add multiple slots per day.</CardDescription>
            </div>
            <div className="flex items-center space-x-2 bg-muted/50 px-4 py-2 rounded-lg border">
              <Label htmlFor="all-days-toggle" className="text-sm font-medium cursor-pointer">All Days Open</Label>
              <Switch
                id="all-days-toggle"
                checked={workingHours.every(day => day.isOpen)}
                onCheckedChange={toggleAllDays}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              {workingHours.map((dayConfig, dayIndex) => (
                <div key={dayConfig.day} className="flex flex-col space-y-3">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-3 w-32 pt-2">
                      <Checkbox
                        id={`day-${dayIndex}`}
                        checked={dayConfig.isOpen}
                        onCheckedChange={() => toggleDay(dayIndex)}
                      />
                      <Label htmlFor={`day-${dayIndex}`} className="font-semibold cursor-pointer">
                        {dayConfig.day}
                      </Label>
                    </div>

                    <div className="flex-1 space-y-3">
                      {dayConfig.isOpen ? (
                        dayConfig.slots.map((slot, slotIndex) => (
                          <div key={slot.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex flex-1 items-center space-x-2">
                              <Select
                                value={slot.start}
                                onValueChange={(v) => updateSlot(dayIndex, slot.id, "start", v)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Start time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 48 }, (_, i) => {
                                    const hour = Math.floor(i / 2);
                                    const minute = i % 2 === 0 ? "00" : "30";
                                    const time = `${hour.toString().padStart(2, "0")}:${minute}`;
                                    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                    const ampm = hour < 12 ? "AM" : "PM";
                                    return <SelectItem key={time} value={time}>{`${displayHour}:${minute} ${ampm}`}</SelectItem>;
                                  })}
                                </SelectContent>
                              </Select>
                              <span className="text-muted-foreground">to</span>
                              <Select
                                value={slot.end}
                                onValueChange={(v) => updateSlot(dayIndex, slot.id, "end", v)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="End time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 48 }, (_, i) => {
                                    const hour = Math.floor(i / 2);
                                    const minute = i % 2 === 0 ? "00" : "30";
                                    const time = `${hour.toString().padStart(2, "0")}:${minute}`;
                                    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                    const ampm = hour < 12 ? "AM" : "PM";
                                    return <SelectItem key={time} value={time}>{`${displayHour}:${minute} ${ampm}`}</SelectItem>;
                                  })}
                                </SelectContent>
                              </Select>
                            </div>



                            <div className="w-10 flex justify-end">
                              {dayConfig.slots.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => removeSlot(dayIndex, slot.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-10 flex items-center">
                          <span className="text-sm text-muted-foreground italic">Closed</span>
                        </div>
                      )}
                    </div>

                    <div className="w-32 flex justify-end pt-1">
                      {dayConfig.isOpen && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs font-medium"
                          onClick={() => addSlot(dayIndex)}
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Add Slot
                        </Button>
                      )}
                    </div>
                  </div>
                  {dayIndex < workingHours.length - 1 && <Separator className="opacity-50" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Slots</CardTitle>
          <CardDescription>Configure default appointment duration and scheduling rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="default-duration">Default Appointment Duration</Label>
              <Select defaultValue="30">
                <SelectTrigger id="default-duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buffer-time">Buffer Time Between Appointments</Label>
              <Select defaultValue="5">
                <SelectTrigger id="buffer-time">
                  <SelectValue placeholder="Select buffer time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="advance-booking">Maximum Advance Booking</Label>
              <Select defaultValue="60">
                <SelectTrigger id="advance-booking">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>




        </CardContent>
      </Card>
    </div>
  );
}
