"use client";

import {createDoctorProfileForClinic } from "@/lib/api/apis";
import { toast } from "sonner";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Upload, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; // Keeping for safety if needed

// --- Local Data & Types ---

// Mock Cities
const CITIES = [
  "Abbottabad", "Bahawalpur", "Faisalabad", "Gujranwala", "Hyderabad", 
  "Islamabad", "Karachi", "Lahore", "Multan", "Peshawar", "Quetta", 
  "Rawalpindi", "Sargodha", "Sialkot", "Sukkur"
];

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

const TREATMENTS = [
  "Cupping Therapy",
  "Acupuncture",
  "Massage Therapy",
  "Herbal Treatment",
  "Physical Therapy",
  "Homeopathy",
];

const CONDITIONS = [
  "High Blood Pressure",
  "Piles",
  "Diarrhea",
  "Acne",
  "Pregnancy",
  "Fever",
  "Heart Attack",
  "Hypertension",
  "Low Blood Pressure",
  "Chest Pain",
  "Heart Failure",
  "Arrhythmia",
  "Stroke",
  "Angina",
  "Coronary Artery Disease",
  "Peripheral Vascular Disease",
  "Constipation",
  "Acid Reflux / GERD",
  "Irritable Bowel Syndrome",
  "Peptic Ulcer",
  "Liver Disease",
  "Hepatitis",
  "Jaundice",
  "Hemorrhoids",
  "Appendicitis",
  "Gallstones",
  "Nausea & Vomiting",
  "Bloating",
  "Asthma",
  "Bronchitis",
  "Pneumonia",
  "Tuberculosis",
  "Shortness of Breath",
  "Cough",
  "Sinusitis",
  "Allergic Rhinitis",
  "Sleep Apnea",
  "Eczema",
  "Psoriasis",
  "Skin Allergy",
  "Fungal Infection",
  "Rash",
  "Dandruff",
  "Warts",
  "Hair Loss",
  "Vitiligo",
  "Back Pain",
  "Knee Pain",
  "Arthritis",
  "Joint Pain",
  "Neck Pain",
  "Gout",
  "Osteoporosis",
  "Fracture",
  "Sciatica",
  "Migraine",
  "Headache",
  "Epilepsy",
  "Vertigo / Dizziness",
  "Parkinson's Disease",
  "Anxiety",
  "Depression",
  "Insomnia",
  "Memory Loss",
  "Diabetes",
  "Diabetes Type 1",
  "Diabetes Type 2",
  "Thyroid Disorder",
  "Hypothyroidism",
  "Hyperthyroidism",
  "PCOS",
  "Obesity",
  "High Cholesterol",
  "Kidney Stones",
  "Urinary Tract Infection",
  "Kidney Disease",
  "Prostate Problems",
  "Incontinence",
  "Eye Infection",
  "Cataract",
  "Glaucoma",
  "Ear Infection",
  "Tonsillitis",
  "Hearing Loss",
  "Nasal Polyps",
  "Menstrual Disorders",
  "Infertility",
  "Menopause",
  "Uterine Fibroids",
  "Endometriosis",
  "Growth Disorders",
  "Childhood Asthma",
  "Malnutrition",
  "Developmental Delay",
  "Toothache",
  "Gum Disease",
  "Tooth Decay",
  "Mouth Ulcer",
  "Anemia",
  "Dehydration",
  "Malaria",
  "Dengue",
  "Typhoid",
  "COVID-19",
  "Chickenpox",
  "Weight Loss",
  "Fatigue",
  "Cupping Therapy",
  "Acupuncture",
  "Massage Therapy",
  "Herbal Treatment",
  "Physiotherapy",
  "Chiropractic",
];

export default function AddDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- State for User Fields ---
  const [userFields, setUserFields] = useState({
    fullName: "",
    gender: "male",
    country: "Pakistan", // Default as per snippet
    city: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // --- State for Doctor Profile ---
  const [profilePic, setProfilePic] = useState("");
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

  const [doctorData, setDoctorData] = useState({
    title: "",
    yearsOfExperience: "",
    primarySpecializations: [] as string[],
    servicesTreatment: [] as string[],
    conditionsTreatment: [] as string[],
    education: "", // temp input for fallback
    FeesPerConsultation: "",
  });

  // Education list
  const [educationList, setEducationList] = useState<Array<{
    degreeName: string;
    institute: string;
    fieldOfStudy: string;
  }>>([]);

  const [showEducationPopup, setShowEducationPopup] = useState(false);
  const [educationFields, setEducationFields] = useState({
    degreeName: "",
    institute: "",
    fieldOfStudy: ""
  });

  // --- City Autocomplete State ---
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [cityFocusedIndex, setCityFocusedIndex] = useState(-1);
  const cityInputRef = useRef<HTMLInputElement>(null);

  // --- Autocomplete Helper State ---
  const [specializationInput, setSpecializationInput] = useState("");
  const [treatmentInput, setTreatmentInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // --- Handlers ---

  const handleCityInputChange = (value: string) => {
    setUserFields(prev => ({ ...prev, city: value }));
    if (!value.trim()) {
      setCitySuggestions([]);
      return;
    }
    const filtered = CITIES.filter(c => c.toLowerCase().includes(value.toLowerCase()));
    setCitySuggestions(filtered);
    setCityFocusedIndex(-1);
  };

  const handleCitySelect = (city: string) => {
    setUserFields(prev => ({ ...prev, city }));
    setCitySuggestions([]);
    setIsCityFocused(false);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePicFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addEducationEntry = () => {
    if (educationFields.degreeName.trim()) {
      setEducationList(prev => [...prev, { ...educationFields }]);
      setEducationFields({ degreeName: "", institute: "", fieldOfStudy: "" });
      setShowEducationPopup(false);
    }
  };

  const removeEducationEntry = (index: number) => {
    setEducationList(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = (field: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment", value: string) => {
    if (value.trim() && !doctorData[field].includes(value)) {
      setDoctorData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
      if (field === "primarySpecializations") setSpecializationInput("");
      if (field === "servicesTreatment") setTreatmentInput("");
      if (field === "conditionsTreatment") setConditionInput("");
      setOpenDropdown(null);
    }
  };

  const removeItem = (field: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment", value: string) => {
    setDoctorData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
  };

  const handleRegister = async () => {
    setErrors({});
    
    if (userFields.password !== userFields.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      toast.error("Passwords do not match");
      return;
    }

    // Comprehensive validation
    const newErrors: Record<string, string> = {};
    if (!userFields.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!userFields.email.trim()) newErrors.email = "Email is required";
    if (!userFields.city.trim()) newErrors.city = "City is required";
    if (!userFields.password.trim()) newErrors.password = "Password is required";
    if (!doctorData.yearsOfExperience.trim()) newErrors.yearsOfExperience = "Experience is required";
    if (doctorData.primarySpecializations.length === 0) newErrors.primarySpecializations = "At least one specialization is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare Education
    let finalEducation = [...educationList];
    if (finalEducation.length === 0 && doctorData.education.trim()) {
      finalEducation.push({
        degreeName: doctorData.education,
        institute: "",
        fieldOfStudy: "",
      });
    }

    const formDataToSend = new FormData();

    const userData = {
      fullName: userFields.fullName,
      gender: userFields.gender,
      country: userFields.country,
      city: userFields.city,
      email: userFields.email,
      phoneNumber: userFields.phoneNumber,
      password: userFields.password,
      role: "clinic_doctor" // Added based on instruction
    };
    formDataToSend.append("user", JSON.stringify(userData));

    const doctorProfileData = {
      yearsOfExperience: Number(doctorData.yearsOfExperience),
      FeesPerConsultation: doctorData.FeesPerConsultation || "0",
      Description: "",
      primarySpecialization: doctorData.primarySpecializations,
      servicesTreatementOffered: doctorData.servicesTreatment,
      conditionTreatments: doctorData.conditionsTreatment,
      education: finalEducation,
    };
    formDataToSend.append("doctorProfile", JSON.stringify(doctorProfileData));

    if (profilePicFile) {
      formDataToSend.append("profilePic", profilePicFile);
    }

    setLoading(true);
    try {
      await createDoctorProfileForClinic(formDataToSend);
      toast.success("Doctor registered successfully!");
      router.push("/clinic-dashboard/doctors");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin-dashboard/individual-doctors">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Add Doctor</h1>
          <p className="text-muted-foreground">Register a new doctor in the system.</p>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="professional">Professional Details</TabsTrigger>
        </TabsList>

        {/* --- PERSONAL TAB --- */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic personal details for the doctor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <Label>Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="Enter full name" 
                    value={userFields.fullName}
                    onChange={(e) => {
                      setUserFields({ ...userFields, fullName: e.target.value });
                      if (errors.fullName) setErrors(prev => { const n = {...prev}; delete n.fullName; return n; });
                    }}
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select 
                    value={userFields.gender} 
                    onValueChange={(val) => setUserFields({ ...userFields, gender: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={userFields.country} disabled />
                </div>

                <div className="space-y-2 relative">
                  <Label>City <span className="text-red-500">*</span></Label>
                  <Input
                    ref={cityInputRef}
                    placeholder="Search city..."
                    value={userFields.city}
                    onChange={(e) => {
                      handleCityInputChange(e.target.value);
                      if (errors.city) setErrors(prev => { const n = {...prev}; delete n.city; return n; });
                    }}
                    onFocus={() => setIsCityFocused(true)}
                    onBlur={() => setTimeout(() => setIsCityFocused(false), 200)}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                  {isCityFocused && citySuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-[200px] overflow-y-auto">
                      {citySuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onMouseDown={() => handleCitySelect(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-muted text-sm"
                        >
                          <MapPin className="inline w-3 h-3 mr-2" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email <span className="text-red-500">*</span></Label>
                  <Input 
                    type="email" 
                    placeholder="doctor@example.com" 
                    value={userFields.email}
                    onChange={(e) => {
                      setUserFields({ ...userFields, email: e.target.value });
                      if (errors.email) setErrors(prev => { const n = {...prev}; delete n.email; return n; });
                    }}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input 
                    placeholder="+92 300 1234567" 
                    value={userFields.phoneNumber}
                    onChange={(e) => setUserFields({ ...userFields, phoneNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password <span className="text-red-500">*</span></Label>
                  <Input 
                    type="password" 
                    placeholder="Min. 8 characters" 
                    value={userFields.password}
                    onChange={(e) => {
                      setUserFields({ ...userFields, password: e.target.value });
                      if (errors.password) setErrors(prev => { const n = {...prev}; delete n.password; return n; });
                    }}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password <span className="text-red-500">*</span></Label>
                  <Input 
                    type="password" 
                    placeholder="Repeat password" 
                    value={userFields.confirmPassword}
                    onChange={(e) => {
                      setUserFields({ ...userFields, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors(prev => { const n = {...prev}; delete n.confirmPassword; return n; });
                    }}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
              
              {passwordError && (
                <div className="text-red-500 text-sm">{passwordError}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PROFESSIONAL TAB --- */}
        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>Profile specific details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Profile Pic */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center relative overflow-hidden bg-muted">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-sm text-muted-foreground">Upload Profile Picture</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <Label>Title <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="Dr." 
                    value={doctorData.title}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Years of Experience <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 5" 
                    value={doctorData.yearsOfExperience}
                    onChange={(e) => {
                      setDoctorData({ ...doctorData, yearsOfExperience: e.target.value });
                      if (errors.yearsOfExperience) setErrors(prev => { const n = {...prev}; delete n.yearsOfExperience; return n; });
                    }}
                    className={errors.yearsOfExperience ? "border-red-500" : ""}
                  />
                  {errors.yearsOfExperience && <p className="text-xs text-red-500">{errors.yearsOfExperience}</p>}
                </div>

                <div className="col-span-1 md:col-span-2 space-y-4">
                  <AutocompleteField
                  label="Primary Specializations"
                  placeholder="Start typing..."
                  fieldName="primarySpecializations"
                  allOptions={SPECIALIZATIONS}
                  selectedItems={doctorData.primarySpecializations}
                  inputValue={specializationInput}
                  setInputValue={setSpecializationInput}
                  dropdownOpen={openDropdown === "specializations"}
                  setDropdownOpen={(open) => setOpenDropdown(open ? "specializations" : null)}
                  addItem={(f, v) => {
                    addItem(f, v);
                    if (errors.primarySpecializations) setErrors(prev => { const n = {...prev}; delete n.primarySpecializations; return n; });
                  }}
                  removeItem={removeItem}
                  error={errors.primarySpecializations}
                />

                  <AutocompleteField
                    label="Services / Treatments Offered"
                    placeholder="Start typing..."
                    inputValue={treatmentInput}
                    setInputValue={setTreatmentInput}
                    selectedItems={doctorData.servicesTreatment}
                    allOptions={TREATMENTS}
                    fieldName="servicesTreatment"
                    dropdownOpen={openDropdown === "treatment"}
                    setDropdownOpen={(open: boolean) => setOpenDropdown(open ? "treatment" : null)}
                    addItem={(f, v) => {
                      addItem(f, v);
                      if (errors.servicesTreatment) setErrors(prev => { const n = {...prev}; delete n.servicesTreatment; return n; });
                    }}
                    removeItem={removeItem}
                    error={errors.servicesTreatment}
                  />

                   <AutocompleteField
                    label="Conditions Treated"
                    placeholder="Start typing..."
                    inputValue={conditionInput}
                    setInputValue={setConditionInput}
                    selectedItems={doctorData.conditionsTreatment}
                    allOptions={CONDITIONS}
                    fieldName="conditionsTreatment"
                    dropdownOpen={openDropdown === "condition"}
                    setDropdownOpen={(open: boolean) => setOpenDropdown(open ? "condition" : null)}
                    addItem={(f, v) => {
                      addItem(f, v);
                      if (errors.conditionsTreatment) setErrors(prev => { const n = {...prev}; delete n.conditionsTreatment; return n; });
                    }}
                    removeItem={removeItem}
                    error={errors.conditionsTreatment}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fees per Consultation (PKR)</Label>
                  <Input 
                    type="number"
                    placeholder="1000"
                    value={doctorData.FeesPerConsultation}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, FeesPerConsultation: e.target.value }))}
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Education</Label>
                  <div className="border rounded-md p-4 space-y-3">
                    {educationList.map((edu, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-secondary p-2 rounded">
                        <div className="text-sm">
                          <strong>{edu.degreeName}</strong> — {edu.institute} ({edu.fieldOfStudy})
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeEducationEntry(idx)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2 items-center">
                      <Input 
                        placeholder="Quick add degree... (or click Add Details)"
                        value={doctorData.education}
                        onChange={(e) => setDoctorData(prev => ({ ...prev, education: e.target.value }))}
                      />
                      <Button type="button" onClick={() => setShowEducationPopup(true)}>Add Details</Button>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleRegister} disabled={loading}>
          {loading ? "Submitting..." : "Save Doctor"}
        </Button>
      </div>

       {/* Education Modal */}
       {showEducationPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-background rounded-lg p-6 w-full max-w-md shadow-lg border">
            <h3 className="text-lg font-semibold mb-4">Add Education</h3>
            <div className="space-y-4">
               <div>
                  <Label>Degree Name</Label>
                  <Input 
                    value={educationFields.degreeName} 
                    onChange={(e) => setEducationFields(p => ({ ...p, degreeName: e.target.value }))}
                    placeholder="e.g. MBBS"
                  />
               </div>
               <div>
                  <Label>Institute</Label>
                  <Input 
                    value={educationFields.institute} 
                    onChange={(e) => setEducationFields(p => ({ ...p, institute: e.target.value }))}
                    placeholder="e.g. University of Health Sciences"
                  />
               </div>
               <div>
                  <Label>Field of Study</Label>
                  <Input 
                    value={educationFields.fieldOfStudy} 
                    onChange={(e) => setEducationFields(p => ({ ...p, fieldOfStudy: e.target.value }))}
                    placeholder="e.g. Medicine"
                  />
               </div>
               <div className="flex justify-end gap-2 pt-2">
                 <Button variant="outline" onClick={() => setShowEducationPopup(false)}>Cancel</Button>
                 <Button onClick={addEducationEntry}>Add</Button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --- Reusable Autocomplete Component ---

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
  fieldName: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment";
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  addItem: (field: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment", value: string) => void;
  removeItem: (field: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment", value: string) => void;
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
      <Label>{label}</Label>
      <div className="relative">
        <div
          className={`flex flex-wrap gap-2 p-2 min-h-[40px] rounded-md border bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${error ? "border-red-500" : "border-input"}`}
        >
          {selectedItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
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
            className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>

        {dropdownOpen && filteredOptions.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 border rounded-md bg-popover shadow-md z-[100] max-h-52 overflow-auto"
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
                className={`w-full text-left px-3 py-2 text-sm transition-colors border-b last:border-b-0 ${
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
            className="absolute right-2 top-2 h-7"
          >
            Add
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
