import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Report section schema for validation
const reportSectionValidator = v.object({
  title: v.string(),
  content: v.string(),
  confidence: v.number(),
  findings: v.array(v.string()),
});

// Get all reports for a patient
export const getByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();
  },
});

// Get report by ID
export const getById = query({
  args: { id: v.id("reports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.id);
    if (!report) return null;
    
    // Also get patient data for the report
    const patient = await ctx.db.get(report.patientId);
    
    return {
      ...report,
      patient,
    };
  },
});

// Get all reports with patient info
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db.query("reports").order("desc").collect();
    
    // Get patient info for each report
    const reportsWithPatients = await Promise.all(
      reports.map(async (report) => {
        const patient = await ctx.db.get(report.patientId);
        return {
          ...report,
          patient,
        };
      })
    );
    
    return reportsWithPatients;
  },
});

// Get reports by status
export const getByStatus = query({
  args: { status: v.union(v.literal("processing"), v.literal("completed"), v.literal("failed")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

// Get reports by urgency level
export const getByUrgency = query({
  args: { urgencyLevel: v.union(v.literal("routine"), v.literal("urgent"), v.literal("immediate")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_urgency", (q) => q.eq("urgencyLevel", args.urgencyLevel))
      .order("desc")
      .collect();
  },
});

// Create new AI analysis report
export const create = mutation({
  args: {
    patientId: v.id("patients"),
    patientIdentification: reportSectionValidator,
    anamnesis: reportSectionValidator,
    protocolConditions: reportSectionValidator,
    thermographicFindings: reportSectionValidator,
    interpretation: reportSectionValidator,
    recommendations: reportSectionValidator,
    differentialDiagnoses: v.array(v.string()),
    urgencyLevel: v.union(v.literal("routine"), v.literal("urgent"), v.literal("immediate")),
    confidence: v.number(),
    images: v.array(v.string()),
    status: v.union(v.literal("processing"), v.literal("completed"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    // Verify patient exists
    const patient = await ctx.db.get(args.patientId);
    if (!patient) {
      throw new Error("Patiënt niet gevonden");
    }
    
    return await ctx.db.insert("reports", args);
  },
});

// Update report status
export const updateStatus = mutation({
  args: {
    id: v.id("reports"),
    status: v.union(v.literal("processing"), v.literal("completed"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { status: args.status });
  },
});

// Update report with analysis results
export const updateAnalysis = mutation({
  args: {
    id: v.id("reports"),
    patientIdentification: v.optional(reportSectionValidator),
    anamnesis: v.optional(reportSectionValidator),
    protocolConditions: v.optional(reportSectionValidator),
    thermographicFindings: v.optional(reportSectionValidator),
    interpretation: v.optional(reportSectionValidator),
    recommendations: v.optional(reportSectionValidator),
    differentialDiagnoses: v.optional(v.array(v.string())),
    urgencyLevel: v.optional(v.union(v.literal("routine"), v.literal("urgent"), v.literal("immediate"))),
    confidence: v.optional(v.number()),
    status: v.optional(v.union(v.literal("processing"), v.literal("completed"), v.literal("failed"))),
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

// Delete report
export const remove = mutation({
  args: { id: v.id("reports") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get report statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allReports = await ctx.db.query("reports").collect();
    
    const statusCount = allReports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const urgencyCount = allReports.reduce((acc, report) => {
      acc[report.urgencyLevel] = (acc[report.urgencyLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const averageConfidence = allReports.length > 0
      ? allReports.reduce((sum, report) => sum + report.confidence, 0) / allReports.length
      : 0;
    
    return {
      total: allReports.length,
      statusBreakdown: statusCount,
      urgencyBreakdown: urgencyCount,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
    };
  },
});

// Get recent reports (last 10)
export const getRecent = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db.query("reports").order("desc").take(10);
    
    const reportsWithPatients = await Promise.all(
      reports.map(async (report) => {
        const patient = await ctx.db.get(report.patientId);
        return {
          ...report,
          patient,
        };
      })
    );
    
    return reportsWithPatients;
  },
}); 