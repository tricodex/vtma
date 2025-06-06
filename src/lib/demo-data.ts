export interface DemoPatient {
  id: string;
  patientNumber: string;
  patientName: string;
  patientId: string;
  species: string;
  breed: string;
  gender: string;
  age: string;
  weight: string;
  
  // Eigenaar Gegevens
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
  
  // Verwijzend Dierenarts
  veterinarianName: string;
  clinicName: string;
  veterinarianPhone: string;
  
  // Anamnese
  primaryComplaint: string;
  symptomDuration: string;
  previousTreatments: string;
  currentMedications: string;
  activityLevel: string;
  behaviorChanges: string;
  
  // Onderzoeksomstandigheden
  ambientTemperature: string;
  humidity: string;
  lastActivity: string;
  acclimationTime: string;
  skinCondition: string;
  
  // Specifieke Symptomen
  tailSwishing: boolean;
  behaviorResistance: boolean;
  sensitiveBrushing: boolean;
  reluctantBending: boolean;
  performanceDrop: boolean;
  gaitIrregularity: boolean;
  
  // Extra metadata
  createdAt: string;
  lastUpdated: string;
  status: 'active' | 'archived';
  thumbnail?: string;
}

export const demoPatients: DemoPatient[] = [
  {
    id: "demo-001",
    patientNumber: "P429442",
    patientName: "Bella",
    patientId: "NL 528 003 200 123 456",
    species: "paard",
    breed: "KWPN",
    gender: "merrie",
    age: "8 jaar, 3 maanden",
    weight: "550kg",
    
    // Eigenaar Gegevens
    ownerName: "Marieke van der Berg",
    ownerEmail: "marieke.vandenberg@email.nl",
    ownerPhone: "+31 6 12 34 56 78",
    ownerAddress: "Paardenlaan 12\n3721 AB Bilthoven",
    
    // Verwijzend Dierenarts
    veterinarianName: "Dr. P. Ooms",
    clinicName: "Praktijk Healthy Horse",
    veterinarianPhone: "+31 578 620 578",
    
    // Anamnese
    primaryComplaint: "Verzet tijdens rijden, vooral bij laterale buiging naar rechts. Staartzwiepen bij het geven van hulpen. Gevoelig bij borstelen van de rug. Prestatieverval in de dressuur, vooral bij verzamelde oefeningen.",
    symptomDuration: "chronisch",
    previousTreatments: "Zadelcontrole door zadelmaker (geen problemen gevonden). Massage therapie 3x uitgevoerd. Rusperiode van 2 weken zonder verbetering. Hoefbeslag gecontroleerd door smid.",
    currentMedications: "Geen medicatie. Wel magnesium supplementen sinds 1 maand.",
    activityLevel: "matig",
    behaviorChanges: "Vroeger zeer werkwillig paard, nu duidelijk minder enthousiasme. Reageert defensief op zadelen. Moeilijker op te halen uit de wei.",
    
    // Onderzoeksomstandigheden  
    ambientTemperature: "20°C",
    humidity: "55%",
    lastActivity: "2 uur geleden lichte stap",
    acclimationTime: "25 minuten",
    skinCondition: "Droog en schoon, goede conditie",
    
    // Specifieke Symptomen (volgens Praktijk Healthy Horse)
    tailSwishing: true,
    behaviorResistance: true,
    sensitiveBrushing: true,
    reluctantBending: true,
    performanceDrop: true,
    gaitIrregularity: false,
    
    // Metadata
    createdAt: "2024-12-20T10:30:00Z",
    lastUpdated: "2024-12-20T14:45:00Z",
    status: "active",
    thumbnail: "/horse-head.png"
  }
];

export function getDemoPatient(id: string): DemoPatient | undefined {
  return demoPatients.find(patient => patient.id === id);
}

export function getAllDemoPatients(): DemoPatient[] {
  return demoPatients;
}

export function searchDemoPatients(query: string): DemoPatient[] {
  if (!query.trim()) return demoPatients;
  
  const lowerQuery = query.toLowerCase();
  return demoPatients.filter(patient => 
    patient.patientName.toLowerCase().includes(lowerQuery) ||
    patient.patientNumber.toLowerCase().includes(lowerQuery) ||
    patient.breed.toLowerCase().includes(lowerQuery) ||
    patient.ownerName.toLowerCase().includes(lowerQuery)
  );
}
