import { NextRequest, NextResponse } from 'next/server';
import { 
  searchSimilarDocuments, 
  searchSimilarReports, 
  hybridSearch
} from '@/lib/mongodb';

// Handle POST requests for vector search
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, searchType, options = {} } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    let results;

    switch (searchType) {
      case 'documents':
        results = await searchSimilarDocuments(
          query,
          options.limit || 5,
          options.sourceType
        );
        break;

      case 'reports':
        results = await searchSimilarReports(
          query,
          options.limit || 5,
          options.patientId
        );
        break;

      case 'hybrid':
        results = await hybridSearch(query, options.limit || 10, {
          sourceType: options.sourceType,
          patientId: options.patientId,
          weightVector: options.weightVector
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid search type. Use "documents", "reports", or "hybrid"' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      query,
      searchType,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Vector search API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during vector search',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for health check
export async function GET() {
  return NextResponse.json({
    status: 'Vector search API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: {
        description: 'Perform vector search',
        body: {
          query: 'string (required)',
          searchType: '"documents" | "reports" | "hybrid"',
          options: {
            limit: 'number (optional, default: 5)',
            sourceType: '"pdf" | "report" | "patient_data" (optional)',
            patientId: 'string (optional)',
            weightVector: 'number 0-1 (optional)'
          }
        }
      }
    }
  });
} 