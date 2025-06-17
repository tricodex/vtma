import { NextRequest, NextResponse } from 'next/server';
import { processKnowledgeDocument } from '@/lib/knowledge-processor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, content, contentType } = body;

    if (!filename || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: filename and content' },
        { status: 400 }
      );
    }

    // Validate file type
    if (contentType !== 'application/pdf' && contentType !== 'text/plain') {
      return NextResponse.json(
        { error: 'Only PDF and text files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (content is base64, so roughly 1.33x the original size)
    const estimatedSize = (content.length * 3) / 4;
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (estimatedSize > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Process the document
    console.log(`Processing knowledge document: ${filename}`);
    const result = await processKnowledgeDocument({
      filename,
      content, // base64 content
      contentType,
      sourceType: 'pdf',
      metadata: {
        uploadedAt: new Date(),
        source: 'manual_upload',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Document successfully processed and indexed',
      filename,
      chunksCreated: result.chunksCreated,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Knowledge upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Knowledge upload endpoint is ready',
    timestamp: new Date().toISOString(),
    usage: {
      POST: {
        description: 'Upload a PDF document to the knowledge base',
        body: {
          filename: 'string (required) - Name of the file',
          content: 'string (required) - Base64 encoded file content',
          contentType: 'string (required) - MIME type of the file (application/pdf)'
        }
      }
    }
  });
}