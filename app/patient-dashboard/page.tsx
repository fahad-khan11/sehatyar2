"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const CITIES = ["Abbottabad", "Haripur", "Manshera", "Battagram"];

const POPULAR_SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "General Surgery",
];

const specializations = [
  "Allergy and Immunology",
  "Anesthesiology",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "General Surgery",
  "Hematology",
  "Infectious Disease",
  "Internal Medicine",
  "Nephrology",
  "Neurology",
  "Obstetrics & Gynecology",
  "Gynecology",
  "Gynecologist",
  "Oncology",
  "Ophthalmology",
  "Orthopedic Surgery",
  "Otolaryngology (ENT)",
  "Pediatrics",
  "Plastic Surgery",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Rheumatology",
  "Urology",
];

export default function PatientDashboardPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [isQueryFocused, setIsQueryFocused] = useState(false);

  const citySuggestions = useMemo(() => {
    if (!city.trim()) return CITIES;
    return CITIES.filter((c) =>
      c.toLowerCase().includes(city.toLowerCase())
    ).slice(0, 5);
  }, [city]);

  const filteredSpecializations = useMemo(() => {
    if (!query.trim()) return POPULAR_SPECIALIZATIONS;
    return specializations
      .filter((spec) => spec.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }, [query]);

  const handleSearch = () => {
    if (!query.trim() && !city.trim()) return;
    setLoadingSearch(true);
    router.push(
      `/doctor?query=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Welcome back, patient</h2>
          <p className="text-muted-foreground">Find and book the best doctors near you.</p>
        </div>

        {/* Doctor Search Widget */}
        <Card className="border-primary/20 shadow-sm relative overflow-visible">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none rounded-xl" />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-xl font-bold text-foreground mb-1">Find a Doctor</h3>
            <p className="text-muted-foreground text-sm mb-6">Search for specialists, hospitals, or conditions and book an appointment instantly.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
                <Input 
                  placeholder="Doctors, Hospitals, Specialties, Conditions" 
                  className="pl-10 h-14 bg-background shadow-sm text-base"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsQueryFocused(true)}
                  onBlur={() => setTimeout(() => setIsQueryFocused(false), 300)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                      setIsQueryFocused(false);
                    }
                  }}
                />
                {isQueryFocused && filteredSpecializations.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                    {filteredSpecializations.map((spec) => (
                      <div
                        key={spec}
                        onMouseDown={() => {
                          setQuery(spec);
                          setIsQueryFocused(false);
                        }}
                        className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-2"
                      >
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{spec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1 sm:max-w-xs relative rounded-md">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
                <Input 
                  placeholder="Enter City" 
                  className="pl-10 h-14 bg-background shadow-sm text-base"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onFocus={() => setIsCityFocused(true)}
                  onBlur={() => setTimeout(() => setIsCityFocused(false), 300)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                      setIsCityFocused(false);
                    }
                  }}
                />
                {isCityFocused && citySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                    {citySuggestions.map((suggestion) => (
                      <div
                        key={suggestion}
                        onMouseDown={() => {
                          setCity(suggestion);
                          setIsCityFocused(false);
                        }}
                        className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleSearch} disabled={loadingSearch} className="h-14 px-8 shadow-sm">
                {loadingSearch ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search & Book"}
              </Button>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
