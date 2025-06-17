import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { processPDFFile } from '@/lib/document-processor';

export async function GET() {
  try {
    console.log('Testing PDF processing...');
    
    // Test with a small file
    const dataPath = path.join(process.cwd(), '..', 'data');
    const files = fs.readdirSync(dataPath).filter(f => f.endsWith('.pdf'));
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'No PDF files found' });
    }
    
    const testFile = path.join(dataPath, files[0]);
    console.log(`Testing with file: ${testFile}`);
    
    const chunks = await processPDFFile(testFile);
    
    return NextResponse.json({
      success: true,
      testFile: files[0],
      chunksCreated: chunks.length,
      totalCharacters: chunks.reduce((total, chunk) => total + chunk.content.length, 0),
      sampleChunk: chunks[0]?.content.substring(0, 200) || 'No content'
    });
    
  } catch (error) {
    console.error('PDF test error:', error);
    return NextResponse.json({
      error: 'PDF test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 