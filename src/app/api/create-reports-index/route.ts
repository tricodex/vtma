import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB, getReportsCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    console.log('Creating vector index for reports collection...');
    
    const db = await connectToMongoDB();
    const collection = await getReportsCollection();
    
    // Create the vector search index
    try {
      await db.command({
        createSearchIndexes: 'reports',
        indexes: [
          {
            name: 'reports_vector_index',
            definition: {
              mappings: {
                dynamic: true,
                fields: {
                  embedding: {
                    type: 'knnVector',
                    dimensions: 768,
                    similarity: 'cosine'
                  },
                  patientId: {
                    type: 'string'
                  },
                  reportId: {
                    type: 'string'
                  },
                  section: {
                    type: 'string'
                  },
                  content: {
                    type: 'string'
                  },
                  findings: {
                    type: 'string'
                  }
                }
              }
            }
          }
        ]
      });
      
      return NextResponse.json({
        success: true,
        message: 'Successfully created reports_vector_index'
      });
    } catch (error: any) {
      if (error.codeName === 'IndexAlreadyExists') {
        return NextResponse.json({
          success: true,
          message: 'reports_vector_index already exists'
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error creating reports vector index:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create reports vector index',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const collection = await getReportsCollection();
    const indexes = await collection.listSearchIndexes().toArray();
    
    return NextResponse.json({
      status: 'Reports index status',
      indexes: indexes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to get index status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}