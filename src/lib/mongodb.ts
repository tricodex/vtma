import { MongoClient, Db, Collection } from 'mongodb';
import { GoogleGenAI } from '@google/genai';

if (!process.env.MONGODB_URL) {
  throw new Error('MONGODB_URL environment variable is not set');
}

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

// MongoDB client singleton
let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToMongoDB(): Promise<Db> {
  if (db) return db;

  try {
    client = new MongoClient(process.env.MONGODB_URL!);
    await client.connect();
    db = client.db('vtma_thermography');
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Google AI client for embeddings using the new SDK
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateEmbedding(
  text: string, 
  taskType: 'SEMANTIC_SIMILARITY' | 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' = 'RETRIEVAL_QUERY'
): Promise<number[]> {
  try {
    const response = await genAI.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
      config: {
        taskType: taskType,
      }
    });

    if (!response.embeddings || !response.embeddings[0] || !response.embeddings[0].values) {
      throw new Error('No embeddings returned from API');
    }

    return response.embeddings[0].values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Vector search collection interfaces
export interface DocumentChunk {
  _id?: string;
  content: string;
  source: string;
  sourceType: 'pdf' | 'report' | 'patient_data';
  metadata: {
    filename?: string;
    pageNumber?: number;
    patientId?: string;
    reportId?: string;
    timestamp?: Date;
    title?: string;
    language?: string;
  };
  embedding: number[];
  createdAt: Date;
}

export interface ReportSearchDocument {
  _id?: string;
  reportId: string;
  patientId: string;
  content: string;
  section: string; // 'patientIdentification', 'anamnesis', etc.
  findings: string[];
  confidence: number;
  embedding: number[];
  createdAt: Date;
}

// Collection getters
export async function getDocumentsCollection(): Promise<Collection<DocumentChunk>> {
  const database = await connectToMongoDB();
  return database.collection<DocumentChunk>('documents');
}

export async function getReportsCollection(): Promise<Collection<ReportSearchDocument>> {
  const database = await connectToMongoDB();
  return database.collection<ReportSearchDocument>('documents');
}

// Vector search functions
export async function searchSimilarDocuments(
  query: string, 
  limit: number = 5,
  sourceType?: 'pdf' | 'report' | 'patient_data'
): Promise<DocumentChunk[]> {
  try {
    const queryEmbedding = await generateEmbedding(query);
    const collection = await getDocumentsCollection();

    // First, let's check if we have any documents at all
    const totalDocs = await collection.countDocuments();
    console.log(`Total documents in collection: ${totalDocs}`);

    if (totalDocs === 0) {
      console.log('No documents found in collection');
      return [];
    }

    // Get a sample document to check structure
    const sampleDoc = await collection.findOne();
    console.log('Sample document structure:', JSON.stringify(sampleDoc, null, 2));

    const pipeline: object[] = [
      {
        $vectorSearch: {
          index: "vtma",
          queryVector: queryEmbedding,
          path: "embedding",
          numCandidates: 50,
          limit: limit,
          ...(sourceType && {
            filter: { sourceType: { $eq: sourceType } }
          })
        }
      },
      {
        $project: {
          content: 1,
          source: 1,
          sourceType: 1,
          metadata: 1,
          createdAt: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ];

    console.log('Vector search pipeline:', JSON.stringify(pipeline, null, 2));
    const results = await collection.aggregate(pipeline).toArray();
    console.log(`Vector search returned ${results.length} results`);
    
    return results as DocumentChunk[];
  } catch (error) {
    console.error('Error in vector search:', error);
    throw error;
  }
}

export async function searchSimilarReports(
  query: string,
  limit: number = 5,
  patientId?: string
): Promise<ReportSearchDocument[]> {
  try {
    const queryEmbedding = await generateEmbedding(query);
    const collection = await getReportsCollection();

    const pipeline: object[] = [
      {
        $vectorSearch: {
          index: "reports_vector_index",
          queryVector: queryEmbedding,
          path: "embedding",
          numCandidates: 50,
          limit: limit,
          ...(patientId && {
            filter: { patientId: { $eq: patientId } }
          })
        }
      },
      {
        $project: {
          reportId: 1,
          patientId: 1,
          content: 1,
          section: 1,
          findings: 1,
          confidence: 1,
          createdAt: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    return results as ReportSearchDocument[];
  } catch (error) {
    console.error('Error in report vector search:', error);
    throw error;
  }
}

// Hybrid search combining vector and text search
export async function hybridSearch(
  query: string,
  limit: number = 10,
  options?: {
    sourceType?: 'pdf' | 'report' | 'patient_data';
    patientId?: string;
    weightVector?: number; // 0-1, weight for vector vs text search
  }
): Promise<{documents: DocumentChunk[], reports: ReportSearchDocument[]}> {
  try {
    const [documents, reports] = await Promise.all([
      searchSimilarDocuments(query, limit, options?.sourceType),
      searchSimilarReports(query, limit, options?.patientId)
    ]);

    return { documents, reports };
  } catch (error) {
    console.error('Error in hybrid search:', error);
    throw error;
  }
}

// Close connection
export async function closeMongoDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
} 