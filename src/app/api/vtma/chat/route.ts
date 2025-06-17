import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  let language = 'nl'; // Default language
  
  try {
    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json(
        { error: 'AI service is not configured. Please check server configuration.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, context, language: requestLanguage = 'nl' } = body;
    language = requestLanguage; // Update language from request

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create the prompt based on language
    const systemPrompt = language === 'en' 
      ? `You are a professional veterinary thermography assistant specialized in helping veterinarians with thermographic analysis of animals. You provide detailed, accurate information based on the provided context and your knowledge of veterinary thermography.

Always respond in English. Be professional, helpful, and focus on practical veterinary applications.`
      : `Je bent een professionele veterinaire thermografie assistent die gespecialiseerd is in het helpen van dierenartsen met thermografische analyse van dieren. Je geeft gedetailleerde, accurate informatie op basis van de verstrekte context en je kennis van veterinaire thermografie.

Antwoord altijd in het Nederlands. Wees professioneel, behulpzaam en richt je op praktische veterinaire toepassingen.`;

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      systemInstruction: systemPrompt
    });

    // Build the full prompt with context
    interface ContextItem {
      text: string;
      type?: string;
    }
    
    let fullPrompt = message;
    if (context && context.length > 0) {
      const contextText = language === 'en'
        ? `Based on the following relevant information:\n\n${context.map((c: ContextItem) => c.text).join('\n\n')}\n\nQuestion: ${message}`
        : `Op basis van de volgende relevante informatie:\n\n${context.map((c: ContextItem) => c.text).join('\n\n')}\n\nVraag: ${message}`;
      fullPrompt = contextText;
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      response: text,
      model: 'gemini-2.0-flash-exp'
    });

  } catch (error) {
    console.error('AI chat error:', error);
    
    const errorMessage = language === 'en'
      ? 'An error occurred while generating the response. Please try again.'
      : 'Er is een fout opgetreden bij het genereren van het antwoord. Probeer het opnieuw.';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}