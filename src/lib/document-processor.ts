import fs from 'fs';
import path from 'path';
// Use the more direct approach for server-side PDF processing
import * as PDFJS from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { 
  generateEmbedding, 
  getDocumentsCollection, 
  getReportsCollection,
  DocumentChunk, 
  ReportSearchDocument 
} from './mongodb';

// Configure PDF.js for server-side usage
PDFJS.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.mjs';

// PDF processing functions using pdfjs-dist
export async function processPDFFile(filePath: string): Promise<DocumentChunk[]> {
  try {
    console.log(`Processing PDF file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }
    
    const stats = fs.statSync(filePath);
    console.log(`File size: ${stats.size} bytes`);
    
    const dataBuffer = fs.readFileSync(filePath);
    console.log(`Read ${dataBuffer.length} bytes from file`);
    
    // Extract text using pdfjs-dist
    const text = await extractTextFromPDF(dataBuffer);
    console.log(`Extracted ${text.length} characters from PDF`);
    
    const filename = path.basename(filePath);
    
    // Split text into meaningful chunks (around 500 words each)
    const chunks = splitTextIntoChunks(text, 500);
    console.log(`Split into ${chunks.length} chunks`);
    
    const documentChunks: DocumentChunk[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (chunk.trim().length < 50) continue; // Skip very short chunks
      
      const embedding = await generateEmbedding(chunk, 'RETRIEVAL_DOCUMENT');
      
      documentChunks.push({
        content: chunk,
        source: filename,
        sourceType: 'pdf',
        metadata: {
          filename: filename,
          pageNumber: Math.floor(i / 2) + 1, // Rough page estimation
          timestamp: new Date(),
          title: extractTitleFromFilename(filename),
          language: detectLanguage(chunk)
        },
        embedding,
        createdAt: new Date()
      });
    }
    
    console.log(`Created ${documentChunks.length} document chunks for ${filename}`);
    return documentChunks;
  } catch (error) {
    console.error(`Error processing PDF ${filePath}:`, error);
    throw error;
  }
}

// Extract text from PDF using pdfjs-dist
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const uint8Array = new Uint8Array(buffer);
    
    // Use PDFJS.getDocument with minimal configuration
    const loadingTask = PDFJS.getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .filter((item): item is TextItem => 'str' in item)
        .map((item) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}

// Split text into chunks
function splitTextIntoChunks(text: string, maxWords: number = 500): string[] {
  const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';
  let wordCount = 0;
  
  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/).length;
    
    if (wordCount + sentenceWords > maxWords && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
      wordCount = sentenceWords;
    } else {
      currentChunk += ' ' + sentence;
      wordCount += sentenceWords;
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Extract title from filename
function extractTitleFromFilename(filename: string): string {
  return filename
    .replace('.pdf', '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Simple language detection
function detectLanguage(text: string): string {
  // Dutch indicators
  const dutchWords = ['de', 'het', 'van', 'een', 'en', 'voor', 'met', 'bij', 'thermografie', 'paarden'];
  const englishWords = ['the', 'and', 'of', 'to', 'a', 'in', 'is', 'it', 'with', 'for'];
  
  const words = text.toLowerCase().split(/\s+/).slice(0, 50); // Check first 50 words
  
  let dutchCount = 0;
  let englishCount = 0;
  
  words.forEach(word => {
    if (dutchWords.includes(word)) dutchCount++;
    if (englishWords.includes(word)) englishCount++;
  });
  
  return dutchCount > englishCount ? 'nl' : 'en';
}

// Process all PDFs in the data directory
export async function processDataDirectory(dataPath: string): Promise<void> {
  try {
    const collection = await getDocumentsCollection();
    
    // Check if documents already exist
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing documents. Skipping processing.`);
      return;
    }
    
    const files = fs.readdirSync(dataPath);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    console.log(`Processing ${pdfFiles.length} PDF files from ${dataPath}`);
    
    for (const pdfFile of pdfFiles) {
      const filePath = path.join(dataPath, pdfFile);
      console.log(`Processing: ${pdfFile}`);
      
      try {
        const chunks = await processPDFFile(filePath);
        
        if (chunks.length > 0) {
          await collection.insertMany(chunks);
          console.log(`  ✓ Inserted ${chunks.length} chunks from ${pdfFile}`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to process ${pdfFile}:`, error);
        continue;
      }
    }
    
    const totalDocuments = await collection.countDocuments();
    console.log(`✓ Processing complete. Total documents: ${totalDocuments}`);
    
  } catch (error) {
    console.error('Error processing data directory:', error);
    throw error;
  }
}

// Create embeddings for existing reports
export async function processExistingReports(): Promise<void> {
  try {
    // This would typically connect to Convex to get existing reports
    // For now, we'll create a placeholder that can be called when reports are created
    console.log('Report embedding processing is handled in report creation workflow');
  } catch (error) {
    console.error('Error processing existing reports:', error);
    throw error;
  }
}

// Process a single report and create embeddings
export async function processReportForSearch(
  reportId: string,
  patientId: string,
  reportData: {
    patientIdentification: { content: string; findings: string[]; confidence: number };
    anamnesis: { content: string; findings: string[]; confidence: number };
    protocolConditions: { content: string; findings: string[]; confidence: number };
    thermographicFindings: { content: string; findings: string[]; confidence: number };
    interpretation: { content: string; findings: string[]; confidence: number };
    recommendations: { content: string; findings: string[]; confidence: number };
  }
): Promise<void> {
  try {
    const collection = await getReportsCollection();
    
    const sections = Object.entries(reportData);
    const searchDocuments: ReportSearchDocument[] = [];
    
    for (const [sectionName, sectionData] of sections) {
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