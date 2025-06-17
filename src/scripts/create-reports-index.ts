import { connectToMongoDB, getReportsCollection } from '../lib/mongodb';

async function createReportsVectorIndex() {
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
      
      console.log('✓ Successfully created reports_vector_index');
    } catch (error: any) {
      if (error.codeName === 'IndexAlreadyExists') {
        console.log('ℹ reports_vector_index already exists');
      } else {
        throw error;
      }
    }
    
    // Verify the index was created
    const indexes = await collection.listSearchIndexes().toArray();
    console.log('Current search indexes:', indexes);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating reports vector index:', error);
    process.exit(1);
  }
}

createReportsVectorIndex();