import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all patients
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("patients").order("desc").collect();
  },
});

// Get patient by ID
export const getById = query({
  args: { id: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Search patients
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) {
      return await ctx.db.query("patients").order("desc").collect();
    }
    
    const lowerQuery = args.query.toLowerCase();
    const allPatients = await ctx.db.query("patients").collect();
    
    return allPatients.filter(patient => 
      patient.patientName.toLowerCase().includes(lowerQuery) ||
      patient.patientNumber.toLowerCase().includes(lowerQuery) ||
      patient.breed.toLowerCase().includes(lowerQuery) ||
      patient.ownerName.toLowerCase().includes(lowerQuery)
    );
  },
});

// Get patient by patient number
export const getByPatientNumber = query({
  args: { patientNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("patients")
      .withIndex("by_patient_number", (q) => q.eq("patientNumber", args.patientNumber))
      .first();
  },
});

// Create new patient
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Check if patient number already exists
    const existingPatient = await ctx.db
      .query("patients")
      .withIndex("by_patient_number", (q) => q.eq("patientNumber", args.patientNumber))
      .first();
    
    if (existingPatient) {
      throw new Error("Patiëntnummer bestaat al");
    }
    
    return await ctx.db.insert("patients", args);
  },
});

// Update patient
export const update = mutation({
  args: {
    id: v.id("patients"),
    // All the same fields as create (optional for partial updates)
    patientNumber: v.optional(v.string()),
    patientName: v.optional(v.string()),
    patientId: v.optional(v.string()),
    species: v.optional(v.string()),
    breed: v.optional(v.string()),
    gender: v.optional(v.string()),
    age: v.optional(v.string()),
    weight: v.optional(v.string()),
    ownerName: v.optional(v.string()),
    ownerEmail: v.optional(v.string()),
    ownerPhone: v.optional(v.string()),
    ownerAddress: v.optional(v.string()),
    veterinarianName: v.optional(v.string()),
    clinicName: v.optional(v.string()),
    veterinarianPhone: v.optional(v.string()),
    primaryComplaint: v.optional(v.string()),
    symptomDuration: v.optional(v.string()),
    previousTreatments: v.optional(v.string()),
    currentMedications: v.optional(v.string()),
    activityLevel: v.optional(v.string()),
    behaviorChanges: v.optional(v.string()),
    ambientTemperature: v.optional(v.string()),
    humidity: v.optional(v.string()),
    lastActivity: v.optional(v.string()),
    acclimationTime: v.optional(v.string()),
    skinCondition: v.optional(v.string()),
    tailSwishing: v.optional(v.boolean()),
    behaviorResistance: v.optional(v.boolean()),
    sensitiveBrushing: v.optional(v.boolean()),
    reluctantBending: v.optional(v.boolean()),
    performanceDrop: v.optional(v.boolean()),
    gaitIrregularity: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal("active"), v.literal("archived"))),
    thumbnail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );
    
    return await ctx.db.patch(id, filteredUpdates);
  },
});

// Delete patient (soft delete - change status to archived)
export const archive = mutation({
  args: { id: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { status: "archived" });
  },
});

// Get patient statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allPatients = await ctx.db.query("patients").collect();
    const activePatients = allPatients.filter(p => p.status === "active");
    const archivedPatients = allPatients.filter(p => p.status === "archived");
    
    // Group by species
    const speciesCount = allPatients.reduce((acc, patient) => {
      acc[patient.species] = (acc[patient.species] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: allPatients.length,
      active: activePatients.length,
      archived: archivedPatients.length,
      speciesBreakdown: speciesCount,
    };
  },
}); 