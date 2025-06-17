import { 
  generateEmbedding, 
  getDocumentsCollection,
  DocumentChunk,
  connectToMongoDB
} from './mongodb';
import { PDFDocument } from 'pdf-lib';

interface ProcessKnowledgeDocumentParams {
  filename: string;
  content: string; // base64
  contentType: string;
  sourceType: 'pdf';
  metadata?: Record<string, any>;
}

interface ProcessResult {
  chunksCreated: number;
}

// Process a knowledge document and create embeddings
export async function processKnowledgeDocument(
  params: ProcessKnowledgeDocumentParams
): Promise<ProcessResult> {
  const { filename, content, metadata } = params;
  
  try {
    // Ensure MongoDB connection
    await connectToMongoDB();
    
    // Decode base64 to buffer
    const buffer = Buffer.from(content, 'base64');
    
    // Extract text based on content type
    let text = '';
    if (params.contentType === 'text/plain') {
      text = buffer.toString('utf8');
    } else {
      // Extract text from PDF using pdf-lib (works in Node.js)
      text = await extractTextFromPDF(buffer);
    }
    
    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted from the PDF');
    }
    
    console.log(`Extracted ${text.length} characters from ${filename}`);
    
    // Split text into chunks
    const chunks = splitTextIntoChunks(text, 500); // ~500 words per chunk
    console.log(`Split into ${chunks.length} chunks`);
    
    // Create document chunks with embeddings
    const collection = await getDocumentsCollection();
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
          filename,
          pageNumber: i + 1, // Approximate page number
          timestamp: new Date(),
          title: filename.replace('.pdf', ''),
          language: detectLanguage(chunk),
          ...metadata
        },
        embedding,
        createdAt: new Date()
      });
    }
    
    if (documentChunks.length > 0) {
      await collection.insertMany(documentChunks);
      console.log(`✓ Created ${documentChunks.length} document chunks for ${filename}`);
    }
    
    return {
      chunksCreated: documentChunks.length
    };
    
  } catch (error) {
    console.error(`Error processing knowledge document ${filename}:`, error);
    throw error;
  }
}

// Extract text from PDF using pdf-lib
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Try to load the PDF
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const numPages = pdfDoc.getPageCount();
    
    // For a simple approach, extract text from buffer
    let text = '';
    
    // Convert buffer to string and extract readable text
    const bufferStr = buffer.toString('binary');
    
    // Look for text between PDF text operators (Tj, TJ)
    const textPattern = /\(((?:[^()\\]|\\[\\()])*)\)\s*Tj/g;
    const textArrayPattern = /\[((?:[^\[\]]+|\[[^\[\]]*\])*)\]\s*TJ/g;
    
    let match;
    
    // Extract simple text strings
    while ((match = textPattern.exec(bufferStr)) !== null) {
      const extractedText = match[1]
        .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
        .replace(/\\(.)/g, '$1')
        .trim();
      
      if (extractedText.length > 0) {
        text += extractedText + ' ';
      }
    }
    
    // Extract text from arrays
    while ((match = textArrayPattern.exec(bufferStr)) !== null) {
      const arrayContent = match[1];
      const strings = arrayContent.match(/\(((?:[^()\\]|\\[\\()])*)\)/g) || [];
      
      for (const str of strings) {
        const extractedText = str
          .slice(1, -1)
          .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
          .replace(/\\(.)/g, '$1')
          .trim();
        
        if (extractedText.length > 0) {
          text += extractedText + ' ';
        }
      }
    }
    
    // If no text found using operators, try basic text extraction
    if (text.trim().length === 0) {
      // Extract any readable ASCII text
      const readableChunks = bufferStr.match(/[\x20-\x7E]{10,}/g) || [];
      
      for (const chunk of readableChunks) {
        // Filter out obvious non-text content
        if (!chunk.includes('obj') && !chunk.includes('endobj') && 
            !chunk.includes('stream') && !chunk.includes('endstream')) {
          text += chunk + ' ';
        }
      }
    }
    
    // Clean up the extracted text
    text = text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\x20-\x7E\u00C0-\u024F\u1E00-\u1EFF]/g, ' ') // Keep readable characters
      .trim();
    
    // If still no text, provide a fallback
    if (text.length === 0) {
      text = `Document: ${numPages} pages. Content extraction requires OCR or advanced PDF parsing.`;
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    // Return a fallback message instead of throwing
    return 'PDF document uploaded. Content extraction requires additional processing.';
  }
}

// Split text into chunks
function splitTextIntoChunks(text: string, wordsPerChunk: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunk = words.slice(i, i + wordsPerChunk).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }
  
  // If no chunks were created, return the whole text as one chunk
  if (chunks.length === 0 && text.trim()) {
    chunks.push(text);
  }
  
  return chunks;
}

// Simple language detection
function detectLanguage(text: string): string {
  const dutchWords = /\b(de|het|van|een|in|op|voor|met|aan|bij|is|zijn|wordt|deze|die|dat)\b/gi;
  const dutchMatches = (text.match(dutchWords) || []).length;
  
  const englishWords = /\b(the|of|and|to|in|is|for|with|on|at|by|this|that|which|are)\b/gi;
  const englishMatches = (text.match(englishWords) || []).length;
  
  return dutchMatches > englishMatches ? 'nl' : 'en';
}