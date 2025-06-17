'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Send, 
  Loader2, 
  BookOpen, 
  FileText, 
  Search,
  User,
  Bot,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    content: string;
    sourceType: 'pdf' | 'report' | 'patient_data';
    score?: number;
  }>;
  isStreaming?: boolean;
}

interface SearchResult {
  documents?: Array<{
    source: string;
    content: string;
    sourceType: 'pdf' | 'report' | 'patient_data';
    score?: number;
  }>;
  reports?: Array<{
    section: string;
    content: string;
    findings: string[];
    sourceType?: string;
    score?: number;
  }>;
}

interface VTMAAIChatProps {
  selectedPatientId?: string;
  className?: string;
}

export function VTMAAIChat({ selectedPatientId, className }: VTMAAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSources, setShowSources] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `Hallo! Ik ben uw AI-assistent voor thermografie. Ik kan u helpen met:

• **Vragen over thermografie rapporten** - Zoek informatie in bestaande rapporten
• **Kennis over thermografie** - Gebruik de documentenbibliotheek met thermografie expertise
• **Patiënt-specifieke analyses** - Als u een patiënt geselecteerd heeft
• **Vergelijkende studies** - Zoek naar vergelijkbare gevallen

Stel gerust uw vraag!`,
        timestamp: new Date()
      }]);
    }
  }, []);

  const performVectorSearch = async (query: string) => {
    try {
      const searchOptions = {
        limit: 5,
        ...(selectedPatientId && { patientId: selectedPatientId })
      };

      const response = await fetch('/api/vector-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          searchType: 'hybrid',
          options: searchOptions
        })
      });

      if (!response.ok) {
        throw new Error('Vector search failed');
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Vector search error:', error);
      return { documents: [], reports: [] };
    }
  };

  const generateAIResponse = async (
    userMessage: string, 
    searchResults: SearchResult
  ): Promise<string> => {
    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      // Prepare context from search results
      const contextDocuments = searchResults.documents?.map((doc) => 
        `Document: ${doc.source}\n${doc.content}`
      ).join('\n\n') || '';
      
      const contextReports = searchResults.reports?.map((report) => 
        `Report Section (${report.section}): ${report.content}\nFindings: ${report.findings.join(', ')}`
      ).join('\n\n') || '';

      const systemPrompt = `Je bent een expert in veterinaire thermografie. Je helpt dierenartsen met het interpreteren van thermografie rapporten en beantwoordt vragen over thermografie bij paarden.

CONTEXT VAN ZOEKRESULTATEN:
${contextDocuments}

${contextReports}

Geef een nuttig, nauwkeurig en professioneel antwoord op basis van de beschikbare context. Als de informatie niet beschikbaar is in de context, zeg dat duidelijk. Gebruik Nederlandse terminologie voor veterinaire concepten.

Gebruikersvraag: ${userMessage}`;

      const response = await genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: systemPrompt
      });

      return response.candidates?.[0]?.content?.parts?.[0]?.text || 'Er ging iets mis bij het genereren van het antwoord.';
      
    } catch (error) {
      console.error('AI response generation error:', error);
      return 'Sorry, ik kan momenteel geen antwoord genereren. Probeer het later opnieuw.';
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Perform vector search
      const searchResults = await performVectorSearch(userMessage.content);
      
      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage.content, searchResults);
      
      // Prepare sources
      const sources = [
        ...(searchResults.documents?.map((doc: { source: any; content: string; sourceType: any; score: any; }) => ({
          title: doc.source,
          content: doc.content.substring(0, 200) + '...',
          sourceType: doc.sourceType,
          score: doc.score
        })) || []),
        ...(searchResults.reports?.map((report: { section: any; content: string; sourceType: string; score: any; }) => ({
          title: `Report - ${report.section}`,
          content: report.content.substring(0, 200) + '...',
          sourceType: (report.sourceType as 'pdf' | 'report' | 'patient_data') || 'report',
          score: report.score
        })) || [])
      ];

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, er is een fout opgetreden. Probeer het opnieuw.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span>Thermografie Assistent</span>
          {selectedPatientId && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Patiënt context actief
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        {/* Messages Area */}
        <ScrollArea className="flex-1 border rounded-lg p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex items-start space-x-2 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`flex-1 max-w-[80%] ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="ml-10 space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSources(
                        showSources === message.id ? null : message.id
                      )}
                      className="text-xs text-gray-600 hover:text-gray-800"
                    >
                      <Search className="w-3 h-3 mr-1" />
                      {message.sources.length} bronnen gevonden
                      {showSources === message.id ? (
                        <ChevronUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ChevronDown className="w-3 h-3 ml-1" />
                      )}
                    </Button>
                    
                    {showSources === message.id && (
                      <div className="space-y-2">
                        {message.sources.map((source, idx) => (
                          <div key={idx} className="border rounded p-2 bg-gray-50">
                            <div className="flex items-center space-x-2 mb-1">
                              {source.sourceType === 'pdf' ? (
                                <BookOpen className="w-3 h-3 text-green-600" />
                              ) : (
                                <FileText className="w-3 h-3 text-blue-600" />
                              )}
                              <span className="text-xs font-medium">{source.title}</span>
                              {source.score && (
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(source.score * 100)}% match
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{source.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">AI denkt na...</span>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Stel een vraag over thermografie..."
            disabled={loading}
            className="flex-1"
          />
          <Button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            size="icon"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 