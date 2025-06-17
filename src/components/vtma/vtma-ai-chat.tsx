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
  ChevronUp,
  Plus
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/lib/i18n/language-context';
import { VTMADocumentUploadModal } from './vtma-document-upload-modal';

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
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSources, setShowSources] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
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
        content: t('aiChat.greeting') as string,
        timestamp: new Date()
      }]);
    }
  }, [t, messages.length]);

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
      // Prepare context from search results
      const contextArray = [
        ...(searchResults.documents?.map((doc) => ({
          text: `Document: ${doc.source}\n${doc.content}`,
          type: 'document'
        })) || []),
        ...(searchResults.reports?.map((report) => ({
          text: `Report Section (${report.section}): ${report.content}\nFindings: ${report.findings.join(', ')}`,
          type: 'report'
        })) || [])
      ];

      const response = await fetch('/api/vtma/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: contextArray,
          language: language
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate response');
      }

      const data = await response.json();
      return data.response || t('aiChat.errorGenerating') as string;
      
    } catch (error) {
      console.error('AI response generation error:', error);
      return t('aiChat.errorGenerating') as string;
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
      interface DocumentResult {
        source: string;
        content: string;
        sourceType: 'pdf' | 'report' | 'patient_data';
        score?: number;
      }
      
      interface ReportResult {
        section: string;
        content: string;
        sourceType?: string;
        score?: number;
      }
      
      const sources = [
        ...(searchResults.documents?.map((doc: DocumentResult) => ({
          title: doc.source,
          content: doc.content.substring(0, 200) + '...',
          sourceType: doc.sourceType,
          score: doc.score
        })) || []),
        ...(searchResults.reports?.map((report: ReportResult) => ({
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
        content: t('aiChat.errorOccurred') as string,
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>{t('aiChat.title')}</span>
            {selectedPatientId && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {t('aiChat.patientContextActive')}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>{t('aiChat.addKnowledge')}</span>
          </Button>
        </div>
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
                      {message.sources.length} {t('aiChat.sourcesFound')}
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
                <span className="text-sm">{t('aiChat.thinking')}</span>
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
            placeholder={t('aiChat.placeholder') as string}
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
      
      {/* Document Upload Modal */}
      <VTMADocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={() => {
          // Optionally refresh or show a success message
          console.log('Documents uploaded successfully');
        }}
      />
    </Card>
  );
} 