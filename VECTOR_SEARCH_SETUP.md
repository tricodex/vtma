# VTMA Vector Search Setup Guide

## Overview

This guide covers setting up MongoDB Vector Search for the VTMA (Veterinaire Thermografie Medische Administratie) system. The integration provides AI-powered document search and chat functionality.

## Architecture

```
PDF Documents → Document Processor → MongoDB Atlas (Vector Search)
     ↓                                        ↑
User Query → AI Chat → Vector Search API → Gemini AI (RAG)
```

## Prerequisites

1. **MongoDB Atlas Account** with Vector Search enabled
2. **Google Cloud API Key** for Gemini AI embeddings
3. **Environment Variables** properly configured

## Step 1: Environment Setup

Ensure your `.env.local` contains:

```env
MONGODB_URL="mongodb+srv://username:password@cluster.mongodb.net/vtma_database"
GEMINI_API_KEY="your_gemini_api_key"
NEXT_PUBLIC_GEMINI_API_KEY="your_gemini_api_key"
```

## Step 2: MongoDB Vector Search Indexes

You MUST create vector search indexes in MongoDB Atlas for the system to work.

### For PDF Documents Collection (`document_chunks`)

```javascript
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "metadata.language"
    },
    {
      "type": "filter", 
      "path": "sourceType"
    },
    {
      "type": "filter",
      "path": "source"
    }
  ]
}
```

**Index Name:** `vector_index`

### For Reports Collection (`report_search_documents`)

```javascript
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding", 
      "numDimensions": 768,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "patientId"
    },
    {
      "type": "filter",
      "path": "section"
    }
  ]
}
```

**Index Name:** `reports_vector_index`

### Creating Indexes in MongoDB Atlas

1. Go to your MongoDB Atlas cluster
2. Navigate to "Search" → "Create Search Index"
3. Choose "JSON Editor"
4. Select the appropriate collection
5. Paste the JSON configuration above
6. Name the index as specified
7. Create the index

## Step 3: Initialize Vector Database

Run the initialization endpoint to process all PDFs:

```bash
curl -X POST http://localhost:3000/api/initialize-vector-db \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

Expected response:
```json
{
  "success": true,
  "message": "Vector database initialized successfully with thermography documents",
  "dataPath": "/path/to/data",
  "timestamp": "2025-06-17T12:41:09.746Z"
}
```

## Step 4: Test Vector Search

Test the search functionality:

```bash
curl -X POST http://localhost:3000/api/vector-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "thermografie bij paarden",
    "searchType": "documents", 
    "options": {"limit": 3}
  }'
```

## Step 5: Access AI Chat Interface

1. Navigate to `/vtma` in your browser
2. Click "AI Assistent" in the sidebar
3. Start chatting with the AI about thermography topics

## API Endpoints

### Vector Search API
- **Endpoint:** `POST /api/vector-search`
- **Body:**
  ```json
  {
    "query": "search query",
    "searchType": "documents|reports|hybrid",
    "options": {
      "limit": 5,
      "patientId": "optional_patient_id",
      "sourceType": "pdf|report|patient_data"
    }
  }
  ```

### Database Initialization
- **Endpoint:** `POST /api/initialize-vector-db`
- **Body:**
  ```json
  {
    "force": true  // optional, forces re-processing
  }
  ```

### Debug Information
- **Endpoint:** `GET /api/debug-paths`
- **Response:** File paths, MongoDB connection status, document count

## Troubleshooting

### Empty Search Results

**Symptoms:** Vector search returns empty results despite documents being stored.

**Cause:** Vector search indexes not created in MongoDB Atlas.

**Solution:** Create the vector search indexes as outlined in Step 2.

### PDF Processing Errors

**Symptoms:** Error during document processing or PDF reading.

**Solutions:**
1. Ensure PDFs are in the `/data` directory
2. Check PDF file permissions
3. Verify Next.js configuration includes PDF.js webpack settings

### MongoDB Connection Issues

**Symptoms:** "Database connection failed" errors.

**Solutions:**
1. Verify `MONGODB_URL` in environment variables
2. Check MongoDB Atlas network access (IP whitelist)
3. Verify database credentials

### Gemini AI Errors

**Symptoms:** AI responses fail or return generic error messages.

**Solutions:**
1. Verify `GEMINI_API_KEY` is correct
2. Check Google Cloud API quotas
3. Ensure API key has proper permissions

## Performance Considerations

- **Document Chunking:** PDFs are split into ~500-word chunks for optimal embedding
- **Embedding Model:** Using Google `text-embedding-004` (768 dimensions)
- **Search Strategy:** Hybrid search combines vector similarity with metadata filtering
- **Language Detection:** Automatic Dutch/English detection for better search results

## Data Flow

1. **PDF Processing:** PDFs → Text extraction → Chunking → Embeddings → MongoDB
2. **Report Processing:** Generated reports → Section embeddings → MongoDB
3. **Search:** User query → Embedding → Vector search → Context retrieval
4. **AI Response:** Context + Query → Gemini AI → Formatted response

## File Structure

```
app/
├── src/
│   ├── app/api/
│   │   ├── vector-search/route.ts          # Main search endpoint
│   │   ├── initialize-vector-db/route.ts   # Database initialization
│   │   └── process-report-embeddings/route.ts
│   ├── lib/
│   │   ├── mongodb.ts                      # MongoDB connection & vector search
│   │   └── document-processor.ts           # PDF processing & embedding
│   └── components/vtma/
│       └── vtma-ai-chat.tsx               # AI chat interface
└── data/                                   # PDF documents (22 files)
```

## Success Indicators

✅ MongoDB shows 58+ documents stored
✅ Vector search returns relevant results  
✅ AI chat provides contextual responses
✅ PDF processing completes without errors
✅ Environment variables properly configured 