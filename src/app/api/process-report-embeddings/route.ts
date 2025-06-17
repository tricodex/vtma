import { NextRequest, NextResponse } from 'next/server';
import { processReportForSearch } from '@/lib/document-processor';

// Handle POST requests to process report embeddings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, patientId, reportData } = body;

    if (!reportId || !patientId || !reportData) {
      return NextResponse.json(
        { error: 'Missing required fields: reportId, patientId, reportData' },
        { status: 400 }
      );
    }

    // Process the report and create embeddings
    await processReportForSearch(reportId, patientId, reportData);

    return NextResponse.json({
      success: true,
      message: 'Report embeddings created successfully',
      reportId,
      patientId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Report embedding processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process report embeddings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for health check
export async function GET() {
  return NextResponse.json({
    status: 'Report embedding processor is ready',
    timestamp: new Date().toISOString(),
    usage: {
      POST: {
        description: 'Process report data and create vector embeddings',
        body: {
          reportId: 'string (required)',
          patientId: 'string (required)', 
          reportData: 'object (required) - Report sections with content and findings'
        }
      }
    }
  });
} 