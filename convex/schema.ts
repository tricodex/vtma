import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  patients: defineTable({
    // Patiënt Identificatie
    patientNumber: v.string(),
    patientName: v.string(),
    patientId: v.string(),
    species: v.string(),
    breed: v.string(),
    gender: v.string(),
    age: v.string(),
    weight: v.string(),
    
    // Eigenaar Gegevens
    ownerName: v.string(),
    ownerEmail: v.string(),
    ownerPhone: v.string(),
    ownerAddress: v.string(),
    
    // Verwijzend Dierenarts
    veterinarianName: v.string(),
    clinicName: v.string(),
    veterinarianPhone: v.string(),
    
    // Anamnese
    primaryComplaint: v.string(),
    symptomDuration: v.string(),
    previousTreatments: v.string(),
    currentMedications: v.string(),
    activityLevel: v.string(),
    behaviorChanges: v.string(),
    
    // Onderzoeksomstandigheden
    ambientTemperature: v.string(),
    humidity: v.string(),
    lastActivity: v.string(),
    acclimationTime: v.string(),
    skinCondition: v.string(),
    
    // Specifieke Symptomen
    tailSwishing: v.boolean(),
    behaviorResistance: v.boolean(),
    sensitiveBrushing: v.boolean(),
    reluctantBending: v.boolean(),
    performanceDrop: v.boolean(),
    gaitIrregularity: v.boolean(),
    
    // Metadata
    status: v.union(v.literal("active"), v.literal("archived")),
    thumbnail: v.optional(v.string()),
  })
  .index("by_patient_number", ["patientNumber"])
  .index("by_patient_name", ["patientName"])
  .index("by_status", ["status"]),

  reports: defineTable({
    patientId: v.id("patients"),
    
    // AI Analysis Result Structure
    patientIdentification: v.object({
      title: v.string(),
      content: v.string(),
      confidence: v.number(),
      findings: v.array(v.string()),
    }),
    
    anamnesis: v.object({
      title: v.string(),
      content: v.string(),
      confidence: v.number(),
      findings: v.array(v.string()),
    }),
    
    protocolConditions: v.object({
      title: v.string(),
      content: v.string(),
      confidence: v.number(),
      findings: v.array(v.string()),
    }),
    
    thermographicFindings: v.object({
      title: v.string(),
      content: v.string(),
      confidence: v.number(),
      findings: v.array(v.string()),
    }),
    
    interpretation: v.object({
      title: v.string(),
      content: v.string(),
      confidence: v.number(),
      findings: v.array(v.string()),
    }),
    
    recommendations: v.object({
      title: v.string(),
      content: v.string(),
      confidence: v.number(),
      findings: v.array(v.string()),
    }),
    
    differentialDiagnoses: v.array(v.string()),
    urgencyLevel: v.union(
      v.literal("routine"),
      v.literal("urgent"), 
      v.literal("immediate")
    ),
    confidence: v.number(),
    
    // Thermographic images (base64 encoded)
    images: v.array(v.string()),
    
    // Report metadata
    status: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
  })
  .index("by_patient", ["patientId"])
  .index("by_status", ["status"])
  .index("by_urgency", ["urgencyLevel"]),
}); 