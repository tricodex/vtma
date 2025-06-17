import { 
  generateEmbedding, 
  getReportsCollection,
  ReportSearchDocument,
  connectToMongoDB
} from './mongodb';

// Process a single report and create embeddings
export async function processReportForSearch(
  reportId: string,
  patientId: string,
  reportData: {
    patientIdentification?: { content: string; findings: string[]; confidence: number };
    anamnesis?: { content: string; findings: string[]; confidence: number };
    protocolConditions?: { content: string; findings: string[]; confidence: number };
    thermographicFindings?: { content: string; findings: string[]; confidence: number };
    interpretation?: { content: string; findings: string[]; confidence: number };
    recommendations?: { content: string; findings: string[]; confidence: number };
  }
): Promise<void> {
  try {
    // Ensure MongoDB connection
    await connectToMongoDB();
    
    const collection = await getReportsCollection();
    
    const sections = Object.entries(reportData).filter(([_, sectionData]) => sectionData);
    const searchDocuments: ReportSearchDocument[] = [];
    
    for (const [sectionName, sectionData] of sections) {
      if (!sectionData || !sectionData.content) continue;
      
      const fullContent = `${sectionData.content}\n\nFindings: ${sectionData.findings.join(', ')}`;
      const embedding = await generateEmbedding(fullContent, 'RETRIEVAL_DOCUMENT');
      
      searchDocuments.push({
        reportId,
        patientId,
        content: sectionData.content,
        section: sectionName,
        findings: sectionData.findings,
        confidence: sectionData.confidence,
        embedding,
        createdAt: new Date()
      });
    }
    
    if (searchDocuments.length > 0) {
      await collection.insertMany(searchDocuments);
      console.log(`✓ Created ${searchDocuments.length} search documents for report ${reportId}`);
    }
    
  } catch (error) {
    console.error(`Error processing report ${reportId} for search:`, error);
    throw error;
  }
}