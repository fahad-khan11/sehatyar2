"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Save,
} from "lucide-react"

export default function SettingsPage() {
  const [education, setEducation] = useState([
    { id: 1, degree: "MBBS", institution: "King Edward Medical University", year: "2010" },
    { id: 2, degree: "FCPS (Cardiology)", institution: "College of Physicians and Surgeons Pakistan", year: "2015" },
  ])

  const [experience, setExperience] = useState([
    {
      id: 1,
      designation: "Senior Cardiologist",
      hospital: "Mayo Hospital",
      location: "Lahore",
      startDate: "2015-01-01",
      endDate: "",
      isCurrent: true
    },
    {
      id: 2,
      designation: "Resident Doctor",
      hospital: "Jinnah Hospital",
      location: "Lahore",
      startDate: "2010-01-01",
      endDate: "2015-01-01",
      isCurrent: false
    },
  ])

  const addEducation = () => {
    setEducation([...education, { id: Date.now(), degree: "", institution: "", year: "" }])
  }

  const removeEducation = (id: number) => {
    setEducation(education.filter((item) => item.id !== id))
  }

  const addExperience = () => {
    setExperience([...experience, {
      id: Date.now(),
      designation: "",
      hospital: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false
    }])
  }

  const removeExperience = (id: number) => {
    setExperience(experience.filter((item) => item.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Doctor Profile Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your professional information and public profile</p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="specialization">Specialization</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Update your personal and professional identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" defaultValue="Dr. Misbah Batool" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prefix">Professional Prefix</Label>
                  <Select defaultValue="dr">
                    <SelectTrigger id="prefix">
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr">Dr.</SelectItem>
                      <SelectItem value="prof">Prof.</SelectItem>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">About Me / Biography</Label>
                <Textarea
                  id="bio"
                  className="min-h-[120px]"
                  defaultValue="Dr. Misbah Batool is a highly experienced Senior Cardiologist with over 18 years of clinical expertise. She specializes in interventional cardiology and has performed numerous successful procedures."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="focus">Clinical Focus</Label>
                  <Input id="focus" placeholder="e.g. Heart Rhythm Disorders" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience-years">Years of Experience</Label>
                  <Input id="experience-years" type="number" defaultValue="18" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="verification-id">Verification ID (PMC/NMC)</Label>
                  <Input id="verification-id" defaultValue="12345-P-LAH" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verification-body">Verification Body</Label>
                  <Input id="verification-body" defaultValue="Pakistan Medical Commission" />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Basic Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specialization Tab */}
        <TabsContent value="specialization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="mr-2 h-5 w-5" />
                Medical Specialization
              </CardTitle>
              <CardDescription>Define your specialties and healthcare services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary-specialty">Primary Specialty</Label>
                  <Input id="primary-specialty" defaultValue="Cardiology" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-specialty">Secondary Specialty</Label>
                  <Input id="secondary-specialty" defaultValue="Interventional Cardiology" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="services">Services Provided</Label>
                <Textarea
                  id="services"
                  placeholder="e.g. Echocardiography, Stress Testing"
                  defaultValue="Echocardiography, Heart Transplant, Valve Surgery, Stress Testing"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions">Conditions Treated</Label>
                <Textarea
                  id="conditions"
                  placeholder="e.g. Heart Failure, Arrythmia"
                  defaultValue="Heart Failure, PCOS, Arrythmia, High Blood Pressure"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Languages Spoken</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["English", "Urdu", "Punjabi"].map((lang) => (
                    <div key={lang} className="bg-secondary/50 px-3 py-1 rounded-md text-xs font-medium flex items-center gap-2 border border-border">
                      {lang}
                      <button className="text-muted-foreground hover:text-foreground">×</button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Plus className="h-3 w-3 mr-1" /> Add Language
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Specialization</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div className="space-y-1">
                <CardTitle className="flex items-center text-xl font-bold">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Education & Training
                </CardTitle>
                <CardDescription>Manage your academic qualifications</CardDescription>
              </div>
              <Button onClick={addEducation} size="sm" variant="outline" className="font-medium">
                <Plus className="mr-2 h-4 w-4" /> Add Degree
              </Button>
            </CardHeader>
            <CardContent className="space-y-8 pt-0">
              {education.map((item, index) => (
                <div key={item.id} className="space-y-6">
                  {index > 0 && <Separator className="mb-8" />}
                  <div className="relative group">
                    <div className="flex items-center justify-end mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 h-8 font-medium"
                        onClick={() => removeEducation(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Degree / Certification</Label>
                        <Input defaultValue={item.degree} placeholder="e.g. MBBS" />
                      </div>
                      <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input defaultValue={item.institution} placeholder="e.g. Medical College" />
                      </div>
                      <div className="space-y-2">
                        <Label>Graduation Year</Label>
                        <Input defaultValue={item.year} placeholder="e.g. 2010" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Separator />
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Education
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div className="space-y-1">
                <CardTitle className="flex items-center text-xl font-bold">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Professional Experience
                </CardTitle>
                <CardDescription>Your clinical and professional work history</CardDescription>
              </div>
              <Button onClick={addExperience} size="sm" variant="outline" className="font-medium">
                <Plus className="mr-2 h-4 w-4" /> Add Experience
              </Button>
            </CardHeader>
            <CardContent className="space-y-8 pt-0">
              {experience.map((item, index) => (
                <div key={item.id} className="space-y-6">
                  {index > 0 && <Separator className="mb-8" />}
                  <div className="relative group">
                    <div className="flex items-center justify-end mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 h-8 font-medium"
                        onClick={() => removeExperience(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Designation</Label>
                        <Input defaultValue={item.designation} placeholder="e.g. Senior Surgeon" />
                      </div>
                      <div className="space-y-2">
                        <Label>Hospital / Clinic</Label>
                        <Input defaultValue={item.hospital} placeholder="e.g. City General Hospital" />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input defaultValue={item.location} placeholder="e.g. Lahore, Pakistan" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 h-[38px]">
                          <Switch
                            id={`current-${item.id}`}
                            checked={item.isCurrent}
                            onCheckedChange={(checked) => {
                              const newExp = experience.map(exp =>
                                exp.id === item.id ? { ...exp, isCurrent: checked } : exp
                              );
                              setExperience(newExp);
                            }}
                          />
                          <Label htmlFor={`current-${item.id}`} className="font-medium">I currently work here</Label>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 mt-6">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input type="date" defaultValue={item.startDate} />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          defaultValue={item.endDate}
                          disabled={item.isCurrent}
                          className={item.isCurrent ? "opacity-50" : ""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Separator />
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Experience
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
