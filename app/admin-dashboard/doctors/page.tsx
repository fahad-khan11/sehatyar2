"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, MoreHorizontal, Plus, Search, X, Trash } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { getDoctors, deleteDoctor } from "@/lib/api/apis";

const SPECIALIZATIONS = [
  "Allergy and Immunology",
  "Anesthesiology",
  "Cardiology",
  "Cardiothoracic Surgery",
  "Cardiovascular Surgery",
  "Clinical Neurophysiology",
  "Clinical Pharmacology",
  "Colon and Rectal Surgery",
  "Community Medicine",
  "Critical Care Medicine",
  "Dental Surgery",
  "Dermatology",
  "Diagnostic Radiology",
  "Emergency Medicine",
  "Endocrinology, Diabetes & Metabolism",
  "Family Medicine",
  "Gastroenterology",
  "General Practice",
  "General Surgery",
  "Genetics and Genomics",
  "Geriatric Medicine",
  "Gynecologic Oncology",
  "Hand Surgery",
  "Head and Neck Surgery",
  "Hematology",
  "Hepatology",
  "Hospital Medicine",
  "Infectious Disease",
  "Internal Medicine",
  "Interventional Cardiology",
  "Interventional Radiology",
  "Legal Medicine",
  "Maternal and Fetal Medicine",
  "Medical Oncology",
  "Medical Toxicology",
  "Neonatal-Perinatal Medicine",
  "Nephrology",
  "Neurocritical Care",
  "Neurodevelopmental Disabilities",
  "Nerve Doctor",
  "Neurology",
  "Neuromuscular Medicine",
  "Neuroradiology",
  "Neurosurgery",
  "Nuclear Medicine",
  "Obstetrics & Gynecology",
  "Gynecology",
  "Gynecologist",
  "Occupational Medicine",
  "Oncology",
  "Ophthalmology",
  "Optometry",
  "Oral and Maxillofacial Surgery",
  "Orthopedic Surgery",
  "Otolaryngology (ENT)",
  "Pain Medicine",
  "Palliative Care",
  "Pathology",
  "Pediatric Allergy & Immunology",
  "Pediatric Anesthesiology",
  "Pediatric Cardiology",
  "Pediatric Critical Care Medicine",
  "Pediatric Dermatology",
  "Pediatric Emergency Medicine",
  "Pediatric Endocrinology",
  "Pediatric Gastroenterology",
  "Pediatric Hematology & Oncology",
  "Pediatric Infectious Diseases",
  "Pediatric Nephrology",
  "Pediatric Neurology",
  "Pediatric Neurosurgery",
  "Pediatric Oncology",
  "Pediatric Ophthalmology",
  "Pediatric Orthopedics",
  "Pediatric Otolaryngology",
  "Pediatric Pathology",
  "Pediatric Pulmonology",
  "Pediatric Radiology",
  "Pediatric Rheumatology",
  "Pediatric Surgery",
  "Pediatric Urology",
  "Pediatrics",
  "Physical Medicine & Rehabilitation",
  "Plastic Surgery",
  "Preventive Medicine",
  "Psychiatry",
  "Psychosomatic Medicine",
  "Public Health",
  "Pulmonary Disease",
  "Radiation Oncology",
  "Radiology",
  "Reproductive Endocrinology and Infertility",
  "Rheumatology",
  "Sleep Medicine",
  "Spinal Cord Injury Medicine",
  "Sports Medicine",
  "Surgical Critical Care",
  "Thoracic Surgery",
  "Transplant Surgery",
  "Trauma Surgery",
  "Urology",
  "Vascular Neurology",
  "Vascular Surgery",
  "Adolescent Medicine",
  "Aerospace Medicine",
  "Biochemical Genetics",
  "Chemical Pathology",
  "Clinical Biochemistry",
  "Clinical Cytogenetics",
  "Clinical Immunology",
  "Clinical Microbiology",
  "Clinical Pathology",
  "Clinical Psychology",
  "Community Health",
  "Dental Public Health",
  "Developmental Pediatrics",
  "Endodontics",
  "Epidemiology",
  "Forensic Medicine",
  "Forensic Pathology",
  "Gastrointestinal Surgery",
  "General Internal Medicine",
  "Geriatric Psychiatry",
  "Health Informatics",
  "Hematopathology",
  "Hospice and Palliative Medicine",
  "Immunopathology",
  "Interventional Neuroradiology",
  "Laboratory Medicine",
  "Laparoscopic Surgery",
  "Lifestyle Medicine",
  "Maxillofacial Surgery",
  "Medical Biochemistry",
  "Medical Genetics",
  "Medical Microbiology",
  "Military Medicine",
  "Molecular Pathology",
  "Musculoskeletal Radiology",
  "Neonatology",
  "Neuroendocrinology",
  "Neuroimaging",
  "Neurointerventional Surgery",
  "Neuropathology",
  "Neuropsychiatry",
  "Nuclear Cardiology",
  "Occupational Health",
  "Oncologic Surgery",
  "Oral Medicine",
  "Oral Pathology",
  "Orthodontics",
  "Orthopedic Oncology",
  "Pain Rehabilitation",
  "Pediatric Dentistry",
  "Pediatric Emergency Care",
  "Pediatric Gastrohepatic Surgery",
  "Pediatric Infectious Medicine",
  "Pediatric Intensive Care",
  "Pediatric Neuroradiology",
  "Pediatric Pathology",
  "Pediatric Plastic Surgery",
  "Pediatric Rehabilitation",
  "Pediatric Thoracic Surgery",
  "Perinatal Medicine",
  "Phlebology",
  "Physician Executive",
  "Plastic and Reconstructive Surgery",
  "Primary Care",
  "Proctology",
  "Pulmonology (Respiratory Medicine)",
  "Radiologic Physics",
  "Rehabilitation Psychology",
  "Reproductive Medicine",
  "Rural Medicine",
  "Sleep Disorders Medicine",
  "Spine Surgery",
  "Surgical Oncology",
  "Tropical Medicine",
  "Undersea and Hyperbaric Medicine",
  "Urgent Care Medicine",
  "Urogynecology",
  "Vascular and Interventional Radiology",
  "Virology",
  "Women's Health",
  "Wound Care Medicine"
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  // Experience filter logic might need adjustment based on data format, keeping simplistic for now or removing if complex to map
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Specialties Autocomplete State
  const [specializationInput, setSpecializationInput] = useState("");
  const [isSpecializationOpen, setIsSpecializationOpen] = useState(false);

  // Added delete handler
  const handleDelete = async (id: number) => {
    try {
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
    } catch (err) {
      console.error("Failed to delete doctor:", err);
      alert("Failed to delete doctor.");
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch doctors");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Derived data for filters
  const uniqueSpecialties = Array.from(new Set(doctors.flatMap((d) => d.primarySpecialization || [])));
  const uniqueStatuses = ["Active", "Inactive"]; // specific set based on boolean

  // Filter doctors based on search query and selected filters
  const filteredDoctors = doctors.filter((doctor) => {
    const name = doctor.user?.fullName || "";
    const email = doctor.user?.email || "";
    const specialty = doctor.primarySpecialization?.[0] || ""; // Check first specialty for simple search
    const allSpecialties = doctor.primarySpecialization || [];
    const status = doctor.isActive ? "Active" : "Inactive";
    
    // Search filter
    const matchesSearch = 
      searchQuery === "" || 
      name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allSpecialties.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    // Specialty filter
    const matchesSpecialty = selectedSpecialties.length === 0 || allSpecialties.some((s: string) => selectedSpecialties.includes(s));

    // Status filter
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(status);

    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  // Toggle specialty filter
  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) => (prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]));
  };

  const removeSpecialty = (field: any, value: string) => {
    setSelectedSpecialties((prev) => prev.filter((s) => s !== value));
  };

  const addSpecialty = (field: any, value: string) => {
    if (!selectedSpecialties.includes(value)) {
      setSelectedSpecialties((prev) => [...prev, value]);
    }
    setSpecializationInput("");
  };

  // Toggle status filter
  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedSpecialties([]);
    setSelectedStatuses([]);
    setActiveFilters(0);
  };

  // Apply filters
  const applyFilters = () => {
    const totalActiveFilters = selectedSpecialties.length + selectedStatuses.length;
    setActiveFilters(totalActiveFilters);
    setIsFilterOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Doctors</h2>
            <p className="text-muted-foreground">Manage your medical staff and their information.</p>
          </div>
          {/* <Button asChild>
            <Link href="/doctors/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
            </Link>
          </Button> */}
        </div>

        <Card>
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Doctors List</CardTitle>
              <CardDescription>A list of all doctors in your clinic with their details.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search doctors..." className="pl-8 w-full md:w-[250px]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className={activeFilters > 0 ? "relative bg-primary/10" : ""}>
                    <Filter className="h-4 w-4" />
                    {activeFilters > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">{activeFilters}</span>}
                    <span className="sr-only">Filter</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="end">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filters</h4>
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-muted-foreground">
                        Reset
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <AutocompleteField
                        label="Specialty"
                        placeholder="Search specialty..."
                        inputValue={specializationInput}
                        setInputValue={setSpecializationInput}
                        selectedItems={selectedSpecialties}
                        allOptions={SPECIALIZATIONS}
                        fieldName="primarySpecializations"
                        dropdownOpen={isSpecializationOpen}
                        setDropdownOpen={setIsSpecializationOpen}
                        addItem={addSpecialty}
                        removeItem={removeSpecialty}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Status</h5>
                      <div className="grid grid-cols-1 gap-2">
                        {uniqueStatuses.map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox id={`status-${status}`} checked={selectedStatuses.includes(status)} onCheckedChange={() => toggleStatus(status)} />
                            <Label htmlFor={`status-${status}`} className="text-sm font-normal">
                              {status}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={applyFilters}>
                      Apply Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeFilters > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedSpecialties.map((specialty) => (
                  <Badge key={`badge-specialty-${specialty}`} variant="outline" className="flex items-center gap-1">
                    {specialty}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        toggleSpecialty(specialty);
                        setActiveFilters((prev) => prev - 1);
                      }}
                    />
                  </Badge>
                ))}
                {selectedStatuses.map((status) => (
                  <Badge key={`badge-status-${status}`} variant="outline" className="flex items-center gap-1">
                    {status}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        toggleStatus(status);
                        setActiveFilters((prev) => prev - 1);
                      }}
                    />
                  </Badge>
                ))}
                {activeFilters > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                    Clear all
                  </Button>
                )}
              </div>
            )}
            <Table className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="table-cell">Experience</TableHead>
                  <TableHead className="table-cell">Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="whitespace-nowrap">
                {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Loading doctors...
                      </TableCell>
                    </TableRow>
                ) : error ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-red-500">
                          {error}
                        </TableCell>
                    </TableRow>
                ) : filteredDoctors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No doctors found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="max-w-[200px]">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={doctor.profilePic || "/user-2.png"} alt={doctor.user?.fullName} />
                            <AvatarFallback>{doctor.user?.fullName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="overflow-hidden">
                            <p className="font-medium truncate" title={doctor.user?.fullName}>{doctor.user?.fullName}</p>
                            <p className="text-sm text-muted-foreground md:hidden truncate">{doctor.primarySpecialization?.[0]}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="table-cell max-w-[200px] truncate" title={doctor.primarySpecialization?.join(", ")}>{doctor.primarySpecialization?.join(", ")}</TableCell>
                      <TableCell>
                        <Badge variant={doctor.isActive ? "default" : "secondary"}>
                          {doctor.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="table-cell">{doctor.yearsOfExperience} years</TableCell>
                      <TableCell className="table-cell max-w-[200px]">
                        <div className="text-sm overflow-hidden">
                          <p className="mb-1 truncate" title={doctor.user?.email}>{doctor.user?.email}</p>
                          <p className="text-muted-foreground truncate">{doctor.user?.phoneNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(doctor.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to Deactivate this doctor?</AlertDialogTitle>
            <AlertDialogDescription>This action will remove the doctor from active status and they will no longer be visible to patients. You can reactivate them later if needed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setDeleteDialogOpen(false)} className="bg-red-500 text-neutral-50 hover:bg-red-700">
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
function AutocompleteField({
  label,
  placeholder,
  inputValue,
  setInputValue,
  selectedItems,
  allOptions,
  fieldName,
  dropdownOpen,
  setDropdownOpen,
  addItem,
  removeItem,
  error,
}: {
  label: string;
  placeholder: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  selectedItems: string[];
  allOptions: string[];
  fieldName: any;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  addItem: (field: any, value: string) => void;
  removeItem: (field: any, value: string) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const normalizedInput = inputValue.trim();
  const [debouncedInput, setDebouncedInput] = useState(normalizedInput);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedInput(normalizedInput.toLowerCase()), 150);
    return () => clearTimeout(t);
  }, [normalizedInput]);

  const uniqueOptions = useMemo(() => Array.from(new Set(allOptions)), [allOptions]);
  const loweredUniqueOptions = useMemo(() => uniqueOptions.map((o) => o.toLowerCase()), [uniqueOptions]);

  const filteredOptions = useMemo(() => {
    if (!debouncedInput) return uniqueOptions.filter((o) => !selectedItems.includes(o)).slice(0, 8);
    return uniqueOptions.filter((option, i) => !selectedItems.includes(option) && loweredUniqueOptions[i].includes(debouncedInput));
  }, [debouncedInput, uniqueOptions, loweredUniqueOptions, selectedItems]);

  const focusInput = () => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
      setDropdownOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        addItem(fieldName, filteredOptions[highlightedIndex]);
        focusInput();
      } else {
        const value = inputValue.trim();
        if (value) {
          addItem(fieldName, value);
          focusInput();
        }
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <div
          className={`flex flex-wrap gap-1 p-2 min-h-[40px] rounded-md border bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${error ? "border-red-500" : "border-input"}`}
        >
          {selectedItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-xs"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeItem(fieldName, item)}
                className="ml-1 rounded-full outline-none hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          <input
            ref={inputRef}
            type="text"
            placeholder={selectedItems.length === 0 ? placeholder : "Add more..."}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setDropdownOpen(true);
              setHighlightedIndex(-1);
            }}
            onFocus={() => {
              setDropdownOpen(true);
              setHighlightedIndex(-1);
            }}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            onKeyDown={onKeyDown}
            className="flex-1 min-w-[80px] bg-transparent outline-none placeholder:text-muted-foreground text-xs"
          />
        </div>

        {dropdownOpen && filteredOptions.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 border rounded-md bg-popover shadow-md z-[100] max-h-40 overflow-auto"
          >
            {filteredOptions.map((option, idx) => (
              <button
                key={option}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addItem(fieldName, option);
                  focusInput();
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors border-b last:border-b-0 ${
                  idx === highlightedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 text-popover-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {inputValue && !allOptions.map((o) => o.toLowerCase()).includes(inputValue.trim().toLowerCase()) && (
          <Button
            type="button"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              addItem(fieldName, inputValue);
              focusInput();
            }}
            className="absolute right-2 top-2 h-6 text-[10px] px-2"
          >
            Add
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
