# VTMA - Veterinary Thermography Medical Administration

![VTMA Banner](public/vtma6.png)

AI-powered administrative system for veterinary thermography. Reduces report generation from 45 minutes to 5 minutes while maintaining AAT (American Academy of Thermology) compliance.

Live demo: [https://veterinaire-thermografie.vercel.app/](https://veterinaire-thermografie.vercel.app/)

## Features

- **Thermographic image analysis** using Gemini 2.0 Flash multimodal AI
- **AAT-compliant report generation** following veterinary guidelines
- **Semantic knowledge search** via MongoDB Atlas vector search
- **Bilingual support** (Dutch/English)
- **Patient management** with Convex real-time database
- **Single-page workflow** optimized for veterinary practices

## Tech Stack

- **Frontend**: Next.js 15.3.3, React 19, TypeScript 5.8
- **AI/ML**: Google Gemini 2.0 Flash API, text-embedding-004
- **Database**: MongoDB Atlas (vector search), Convex (patient data)
- **Package Manager**: Bun

## Google Cloud Integration

### Gemini 2.0 Flash for Image Analysis

Direct multimodal analysis of thermographic images:

```typescript
// api/vtma/analyze/route.ts
const response = await genAI.models.generateContent({
  model: 'gemini-2.0-flash',
  contents: [
    { text: THERMOGRAPHY_ANALYSIS_PROMPT },
    { text: patientContext },
    { inlineData: { 
      mimeType: 'image/jpeg', 
      data: base64Image 
    }},
  ],
  config: {
    temperature: 0.1,  // Low temperature for medical accuracy
    maxOutputTokens: 2048
  }
});
```

Gemini analyzes:
- Temperature asymmetries (≥1°C difference)
- Bilateral symmetry comparison
- Hotspot/coldspot detection
- Anatomical pattern correlation

### Text Embeddings for Knowledge Base

768-dimensional vectors using text-embedding-004:

```typescript
// lib/mongodb.ts
const response = await genAI.models.embedContent({
  model: 'text-embedding-004',
  contents: text,
  config: {
    taskType: 'RETRIEVAL_DOCUMENT',  // Optimized for search
  }
});
```

## MongoDB Atlas Vector Search

### Document Processing Pipeline

PDF documents → Text extraction → Chunking → Embeddings → MongoDB:

```typescript
// lib/document-processor.ts
const chunks = splitTextIntoChunks(text, 500);  // ~500 words per chunk

for (const chunk of chunks) {
  const embedding = await generateEmbedding(chunk, 'RETRIEVAL_DOCUMENT');
  
  documentChunks.push({
    content: chunk,
    source: filename,
    sourceType: 'pdf',
    metadata: {
      language: detectLanguage(chunk),  // Auto-detect NL/EN
      title: extractTitleFromFilename(filename)
    },
    embedding,  // 768-dimensional vector
    createdAt: new Date()
  });
}
```

### Vector Search Implementation

Hybrid search combining vector similarity with metadata filtering:

```typescript
// lib/mongodb.ts - searchSimilarDocuments()
const pipeline = [
  {
    $vectorSearch: {
      index: "vector_index",
      queryVector: queryEmbedding,  // User query embedded
      path: "embedding",
      numCandidates: 50,
      limit: 5,
      filter: { sourceType: { $eq: sourceType } }  // Optional filtering
    }
  },
  {
    $project: {
      content: 1,
      source: 1,
      metadata: 1,
      score: { $meta: "vectorSearchScore" }  // Cosine similarity
    }
  }
];
```

### MongoDB Indexes Configuration

Two vector search indexes required:

1. **Documents Collection** (`document_chunks`):
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
      "path": "metadata.language"  // Enable language filtering
    }
  ]
}
```

2. **Reports Collection** (`report_search_documents`):
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
      "path": "patientId"  // Patient-specific search
    }
  ]
}
```

## Prerequisites

- Node.js 18+
- Bun package manager
- MongoDB Atlas account with vector search enabled
- Google Cloud account with Gemini API access
- Convex account

## Installation

Clone and install dependencies:

```bash
git clone https://github.com/yourusername/vtma.git
cd vtma
bun install
```

## Environment Setup

Create `.env.local`:

```env
# Google AI
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# MongoDB
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/vtma_database

# Convex
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## Database Setup

### MongoDB Atlas Setup

1. Create vector search indexes (see MongoDB Indexes Configuration above)
2. Initialize knowledge base:

```bash
curl -X POST http://localhost:3000/api/initialize-vector-db -d '{"force": true}'
```

This processes PDFs in `/data` directory and creates searchable chunks.

### Convex Setup

Deploy schema:
```bash
npx convex dev
```

## Running the Application

Development:
```bash
bun dev
```

Production:
```bash
bun run build
bun start
```

## API Usage Examples

### Analyze Thermographic Images

```bash
POST /api/vtma/analyze
{
  "images": ["base64_encoded_thermal_image"],
  "patientData": {
    "species": "paard",
    "primaryComplaint": "staartzwiepen tijdens rijden",
    "symptoms": ["rugpijn", "verzet"]
  }
}
```

Response includes AAT-compliant sections with temperature findings.

### Vector Search for Knowledge

```bash
POST /api/vector-search
{
  "query": "kissing spine thermografie behandeling",
  "searchType": "hybrid",
  "options": {
    "limit": 5,
    "weightVector": 0.7  // 70% vector, 30% keyword
  }
}
```

Returns relevant document chunks with similarity scores.

## How It Works

1. **Image Upload**: Thermographic images converted to base64
2. **AI Analysis**: Gemini 2.0 Flash identifies thermal patterns
3. **Knowledge Retrieval**: MongoDB vector search finds similar cases
4. **Report Generation**: Structured output following AAT guidelines
5. **Bilingual Support**: Auto-detection of Dutch/English content

## Performance

- Report generation: 45 minutes → 5 minutes
- Gemini API response: 2-3 seconds
- Vector search: <500ms for 58 documents
- Patient sync: Real-time via Convex

## Data Flow

```
Thermal Images → Gemini 2.0 Flash Vision
                        ↓
              Temperature Analysis
                        ↓
        MongoDB Vector Search (768D embeddings)
                        ↓
          Similar Cases + Knowledge Base
                        ↓
              AAT-Compliant Report
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Data Privacy

- Images processed in-memory only
- No permanent image storage
- Patient data encrypted in Convex
- GDPR-compliant handling
