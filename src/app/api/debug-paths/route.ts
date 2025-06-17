import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { connectToMongoDB, getDocumentsCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const cwd = process.cwd();
    const dataPath = path.join(cwd, '..', 'data');
    const dataPathResolved = path.resolve(dataPath);
    
    const result = {
      cwd,
      dataPath,
      dataPathResolved,
      dataExists: fs.existsSync(dataPath),
      files: [] as string[],
      mongodb: {
        connected: false,
        documentCount: 0,
        error: null as string | null
      }
    };
    
    if (fs.existsSync(dataPath)) {
      const files = fs.readdirSync(dataPath);
      result.files = files.filter(f => f.endsWith('.pdf'));
    }
    
    // Test MongoDB connection and document count
    try {
      await connectToMongoDB();
      const collection = await getDocumentsCollection();
      const count = await collection.countDocuments();
      result.mongodb.connected = true;
      result.mongodb.documentCount = count;
    } catch (error) {
      result.mongodb.error = error instanceof Error ? error.message : 'Unknown MongoDB error';
    }
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 