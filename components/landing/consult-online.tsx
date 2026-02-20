import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import Link from 'next/link';

const doctorSpecialties = [
  { id: 1,  name: 'Cardiology',        searchQuery: 'Cardiology',        icon: '/assets/specialityIcons/Dermatologist.png',    isOnline: true },
  { id: 2,  name: 'Gynecologist',      searchQuery: 'Gynecology',        icon: '/assets/specialityIcons/Gynecologist.png',     isOnline: true },
  { id: 3,  name: 'Gastroenterologist',searchQuery: 'Gastroenterology',  icon: '/assets/specialityIcons/Cardiologist.png',     isOnline: true },
  { id: 4,  name: 'Urologist',         searchQuery: 'Urology',           icon: '/assets/specialityIcons/Urologist.png',        isOnline: true },
  { id: 5,  name: 'Dentist',           searchQuery: 'Dental Surgery',    icon: '/assets/specialityIcons/Dentist.png',          isOnline: true },
  { id: 6,  name: 'Obesity Specialist',searchQuery: 'Obesity',           icon: '/assets/specialityIcons/ObesitySpecialist.png',isOnline: true },
  { id: 7,  name: 'ENT Specialist',    searchQuery: 'Otolaryngology',    icon: '/assets/specialityIcons/ENTSpecialist.png',    isOnline: true },
  { id: 8,  name: 'Orthopedic Surgeon',searchQuery: 'Orthopedic Surgery',icon: '/assets/specialityIcons/OrthopedicSurgeon.png',isOnline: true },
  { id: 9,  name: 'Sexologist',        searchQuery: 'Sexology',          icon: '/assets/specialityIcons/Sexologist.png',       isOnline: true },
  { id: 10, name: 'Neurologist',       searchQuery: 'Neurology',         icon: '/assets/specialityIcons/Neurologist.png',      isOnline: true },
  { id: 11, name: 'Child Specialist',  searchQuery: 'Pediatrics',        icon: '/assets/specialityIcons/ChildSpecialist.png',  isOnline: true },
  { id: 12, name: 'Pulmonologist',     searchQuery: 'Pulmonary Disease', icon: '/assets/specialityIcons/Pulmonologist.png',    isOnline: true },
];

// Doctor card component
const DoctorCard = ({ name, searchQuery, isOnline, icon }: {
  name: string;
  searchQuery: string;
  isOnline: boolean;
  icon: string;
}) => {
  return (
    <Link href={{
            pathname: "/doctor",
            query: {
              query: searchQuery,
            },
          }}>
    <div className="group flex items-center h-20 px-4 sm:px-5 transition-all rounded-[2rem] border-[1px] border-gray-300 gap-3 sm:gap-4 hover:bg-[#F9F9F9]">
      <div className='bg-[#4e148c] group-hover:bg-[#ff6701] p-3 rounded-full flex-shrink-0 transition-colors duration-200'>
        <Image src={icon} alt={name} width={20} height={20} className='w-5 h-5 invert brightness-0 contrast-200'/>
      </div>
      <div className='flex flex-col gap-1.5 min-w-0'>
        <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900 leading-tight">{name}</h3>
        <span className={cn(
          "px-3 py-0.5 text-xs font-medium rounded-full w-fit transition-colors duration-200",
          isOnline
            ? "bg-[#ede0f7] text-[#4e148c] group-hover:bg-[#ff6701] group-hover:text-white"
            : "bg-gray-100 text-gray-800"
        )}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
    </Link>
  );
};

export default function ConsultOnline() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter doctors based on search query
  const filteredDoctors = doctorSpecialties.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="w-full mx-auto px-2 sm:px-0 bg-white">
      {/* Title - visible on mobile */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center block sm:hidden">Consult Online</h2>
      
      {/* Search Input */}
      <div className="flex items-center gap-2 bg-[#F4F4F4] text-[#616161] rounded-full px-4 sm:px-5 py-3 sm:py-4 mb-4 sm:mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#616161] w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input
          type="text"
          placeholder="Search for specialization"
          className="bg-transparent outline-none border-none w-full text-sm sm:text-base text-gray-800 placeholder:text-[#616161] placeholder:font-light"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>


      {/* Grid of doctors */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-1'>
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            name={doctor.name}
            searchQuery={doctor.searchQuery}
            isOnline={doctor.isOnline}
            icon={doctor.icon}
          />
        ))}
      </div>
    </div>
  )
}
