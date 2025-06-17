import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { processDataDirectory } from '@/lib/document-processor';
import { connectToMongoDB } from '@/lib/mongodb';

// Handle POST requests to initialize the vector database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { force = false } = body;

    // Connect to MongoDB first
    await connectToMongoDB();
    
    // Path to the data directory (relative to the project root)
    const dataPath = path.join(process.cwd(), '..', 'data');
    
    console.log(`Current working directory: ${process.cwd()}`);
    console.log(`Target data path: ${dataPath}`);
    console.log(`Data path exists: ${fs.existsSync(dataPath)}`);
    
    // List files in data directory for debugging
    if (fs.existsSync(dataPath)) {
      const files = fs.readdirSync(dataPath);
      console.log(`Files in data directory: ${files.filter(f => f.endsWith('.pdf')).length} PDFs found`);
    }
    
    if (force) {
      // If force is true, we could clear existing data here
      console.log('Force initialization requested');
    }
    
    await processDataDirectory(dataPath);
    
    return NextResponse.json({
      success: true,
      message: 'Vector database initialized successfully with thermography documents',
      dataPath,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Vector database initialization error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize vector database',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for status check
export async function GET() {
  try {
    await connectToMongoDB();
    
    const dataPath = path.join(process.cwd(), '..', 'data');
    const dataExists = fs.existsSync(dataPath);
    let fileCount = 0;
    
    if (dataExists) {
      const files = fs.readdirSync(dataPath);
      fileCount = files.filter(f => f.endsWith('.pdf')).length;
    }
    
    return NextResponse.json({
      status: 'Vector database initialization endpoint is ready',
      timestamp: new Date().toISOString(),
      usage: {
        POST: {
          description: 'Initialize vector database with thermography documents',
          body: {
            force: 'boolean (optional) - Force re-processing even if documents exist'
          }
        }
      },
      environment: {
        cwd: process.cwd(),
        dataPath,
        dataExists,
        pdfCount: fileCount
      }
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 