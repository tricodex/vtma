import { mutation } from "./_generated/server";

// Seed the demo horse data into Convex
export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if demo data already exists
    const existingPatient = await ctx.db
      .query("patients")
      .withIndex("by_patient_number", (q) => q.eq("patientNumber", "P429442"))
      .first();
    
    if (existingPatient) {
      return { message: "Demo data already exists", patientId: existingPatient._id };
    }
    
    // Insert demo horse "Bella"
    const demoPatientId = await ctx.db.insert("patients", {
      // Patiënt Identificatie
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
      
      // Specifieke Symptomen
      tailSwishing: true,
      behaviorResistance: true,
      sensitiveBrushing: true,
      reluctantBending: true,
      performanceDrop: true,
      gaitIrregularity: false,
      
      // Metadata
      status: "active" as const,
      thumbnail: "/horse-head.png",
    });
    
    return { message: "Demo data seeded successfully", patientId: demoPatientId };
  },
});

// Clear all data (for testing purposes)
export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all reports first (due to foreign key constraints)
    const reports = await ctx.db.query("reports").collect();
    for (const report of reports) {
      await ctx.db.delete(report._id);
    }
    
    // Delete all patients
    const patients = await ctx.db.query("patients").collect();
    for (const patient of patients) {
      await ctx.db.delete(patient._id);
    }
    
    return { message: "All data cleared successfully" };
  },
}); 