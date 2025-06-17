# VTMA - Veterinary Thermography Medical Administration

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

### MongoDB Vector Search Indexes

Create these indexes in MongoDB Atlas:

1. For document chunks collection (`document_chunks`):
```javascript
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    }
  ]
}
```

2. Initialize knowledge base:
```bash
curl -X POST http://localhost:3000/api/initialize-vector-db -d '{"force": true}'
```

### Convex Setup

Deploy Convex schema:
```bash
npx convex dev
```

## Running the Application

Development:
```bash
bun dev
```

Production build:
```bash
bun run build
bun start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── vtma/analyze/       # Gemini 2.0 Flash image analysis
│   │   ├── vector-search/      # MongoDB semantic search
│   │   └── initialize-vector-db/
│   ├── vtma/                   # Main application page
│   └── patient/                # Patient management
├── components/
│   └── vtma/                   # VTMA-specific components
└── lib/
    ├── mongodb.ts              # Vector search implementation
    └── i18n/                   # Dutch/English translations
```

## API Endpoints

### Image Analysis
```bash
POST /api/vtma/analyze
Content-Type: application/json

{
  "images": ["base64_encoded_image"],
  "patientData": {
    "species": "paard",
    "symptoms": ["staartzwiepen", "rugpijn"]
  }
}
```

### Vector Search
```bash
POST /api/vector-search
Content-Type: application/json

{
  "query": "thermografie kissing spine",
  "searchType": "documents",
  "options": {"limit": 5}
}
```

## Key Components

### Gemini Integration

Multimodal analysis directly with Gemini 2.0 Flash:
```typescript
const response = await genAI.models.generateContent({
  model: 'gemini-2.0-flash',
  contents: [
    { text: analysisPrompt },
    { inlineData: { mimeType: 'image/jpeg', data: base64Image }}
  ]
});
```

### MongoDB Vector Search

Semantic search implementation:
```typescript
const pipeline = [{
  $vectorSearch: {
    index: "vector_index",
    queryVector: embedding,
    path: "embedding",
    numCandidates: 50,
    limit: 5
  }
}];
```

## Thermographic Analysis Features

- Temperature asymmetry detection (≥1°C difference)
- Bilateral symmetry comparison
- Hotspot/coldspot identification
- AAT-compliant report sections:
  - Patient identification
  - Examination protocol
  - Thermographic findings
  - Clinical interpretation
  - Follow-up recommendations

## Performance

- Report generation: 45 minutes → 5 minutes
- Image processing: 2-3 seconds
- Vector search: <500ms
- Patient data sync: real-time via Convex

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Data Privacy

- Images processed in-memory only
- Patient data stored in Convex with encryption
- No image storage on servers
- GDPR-compliant data handling
