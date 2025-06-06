import type { Id } from '@/../convex/_generated/dataModel';

// Patient type matching Convex schema
export interface Patient {
  _id: Id<"patients">;
  _creationTime: number;
  
  // Patiënt Identificatie
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
  
  // Metadata
  status: 'active' | 'archived';
  thumbnail?: string;
}

// Report section type
export interface ReportSection {
  title: string;
  content: string;
  confidence: number;
  findings: string[];
}

// AI Analysis Report type matching Convex schema
export interface Report {
  _id: Id<"reports">;
  _creationTime: number;
  patientId: Id<"patients">;
  
  patientIdentification: ReportSection;
  anamnesis: ReportSection;
  protocolConditions: ReportSection;
  thermographicFindings: ReportSection;
  interpretation: ReportSection;
  recommendations: ReportSection;
  differentialDiagnoses: string[];
  urgencyLevel: 'routine' | 'urgent' | 'immediate';
  confidence: number;
  images: string[];
  status: 'processing' | 'completed' | 'failed';
}

// Report with patient info (for convenience)
export interface ReportWithPatient extends Report {
  patient?: Patient;
} 