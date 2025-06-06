'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, Activity, Eye, Download, FileText, ArrowRight, Brain, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Patient } from '@/lib/types';
import { Id } from '@/../convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';

interface VTMAReportViewerProps {
  uploadedImages: string[];
  selectedPatient?: Patient | null;
}

interface AnalysisResult {
  regions: Array<{
    region: string;
    temperature: string;
    status: string;
    findings: string[];
  }>;
  summary: string;
  recommendations: string[];
}

// AAT Report structure that matches the API response
interface AAT_AnalysisResult {
  patientIdentification: {
    title: string;
    content: string;
    confidence: number;
    findings: string[];
  };
  anamnesis: {
    title: string;
    content: string;
    confidence: number;
    findings: string[];
  };
  protocolConditions: {
    title: string;
    content: string;
    confidence: number;
    findings: string[];
  };
  thermographicFindings: {
    title: string;
    content: string;
    confidence: number;
    findings: string[];
  };
  interpretation: {
    title: string;
    content: string;
    confidence: number;
    findings: string[];
  };
  recommendations: {
    title: string;
    content: string;
    confidence: number;
    findings: string[];
  };
  differentialDiagnoses: string[];
  urgencyLevel: 'routine' | 'urgent' | 'immediate';
  confidence: number;
}

export function VTMAReportViewer({ uploadedImages, selectedPatient }: VTMAReportViewerProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [aatReport, setAATReport] = useState<AAT_AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Convex mutations
  const createReport = useMutation(api.reports.create);

  const downloadPDF = useCallback(async () => {
    if (!aatReport) {
      setError('Geen rapport beschikbaar voor PDF export');
      return;
    }

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Helper function to add text with word wrapping
      const addWrappedText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        pdf.setFontSize(fontSize);
        if (isBold) pdf.setFont('helvetica', 'bold');
        else pdf.setFont('helvetica', 'normal');
        
        const lines = pdf.splitTextToSize(text, maxWidth);
        
        // Check if we need a new page
        if (yPosition + (lines.length * fontSize * 0.3527) > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * fontSize * 0.3527 + 5;
      };

      // Header
      addWrappedText('VETERINAIRE THERMOGRAFISCH RAPPORT', 18, true);
      yPosition += 10;

      // Patient info
      if (selectedPatient) {
        addWrappedText(`Patiënt: ${selectedPatient.patientName}`, 14, true);
        addWrappedText(`Diersoort: ${selectedPatient.species} | Ras: ${selectedPatient.breed}`);
        addWrappedText(`Eigenaar: ${selectedPatient.ownerName}`);
        yPosition += 10;
      }

      // Report sections
      const sections = [
        aatReport.patientIdentification,
        aatReport.anamnesis,
        aatReport.protocolConditions,
        aatReport.thermographicFindings,
        aatReport.interpretation,
        aatReport.recommendations
      ];

      sections.forEach(section => {
        addWrappedText(section.title, 14, true);
        addWrappedText(section.content);
        
        if (section.findings.length > 0) {
          addWrappedText('Bevindingen:', 12, true);
          section.findings.forEach(finding => {
            addWrappedText(`• ${finding}`);
          });
        }
        yPosition += 10;
      });

      // Differential diagnoses
      if (aatReport.differentialDiagnoses.length > 0) {
        addWrappedText('Differentiaal Diagnoses:', 14, true);
        aatReport.differentialDiagnoses.forEach(diagnosis => {
          addWrappedText(`• ${diagnosis}`);
        });
        yPosition += 10;
      }

      // Footer
      yPosition += 10;
      addWrappedText(`Urgentieniveau: ${aatReport.urgencyLevel}`, 12, true);
      addWrappedText(`Betrouwbaarheid: ${aatReport.confidence}%`);
      addWrappedText(`Gegenereerd: ${new Date().toLocaleDateString('nl-NL')}`);

      // Save PDF
      const fileName = `VTMA_Rapport_${selectedPatient?.patientName || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      setError('Fout bij het genereren van PDF rapport');
    }
  }, [aatReport, selectedPatient]);

  const handleAnalyze = useCallback(async () => {
    if (uploadedImages.length === 0) {
      setError('Geen afbeeldingen geüpload om te analyseren');
      return;
    }

    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch('/api/vtma/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          images: uploadedImages,
          patient: selectedPatient
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Check if we have error in response
      if (result.error) {
        throw new Error(result.error);
      }
      
      // The API returns AAT_AnalysisResult directly
      if (result.patientIdentification && result.thermographicFindings) {
        setAATReport(result as AAT_AnalysisResult);
        
        // Create simplified analysis for UI display from thermographic findings
        const simplifiedAnalysis: AnalysisResult = {
          regions: [{
            region: 'Thermografische Gebieden',
            temperature: 'Variabel',
            status: result.urgencyLevel === 'immediate' ? 'afwijkend' : 
                    result.urgencyLevel === 'urgent' ? 'verhoogd' : 'normaal',
            findings: result.thermographicFindings.findings || []
          }],
          summary: result.thermographicFindings.content || 'Analyse voltooid',
          recommendations: result.recommendations.findings || []
        };
        setAnalysis(simplifiedAnalysis);
        
        // Save report to Convex if patient is selected
        if (selectedPatient && selectedPatient._id) {
          try {
            const reportId = await createReport({
              patientId: selectedPatient._id as Id<'patients'>,
              patientIdentification: result.patientIdentification,
              anamnesis: result.anamnesis,
              protocolConditions: result.protocolConditions,
              thermographicFindings: result.thermographicFindings,
              interpretation: result.interpretation,
              recommendations: result.recommendations,
              differentialDiagnoses: result.differentialDiagnoses,
              urgencyLevel: result.urgencyLevel,
              confidence: result.confidence,
              images: [], // Don't store large base64 images, just reference count
              status: 'completed'
            });
            
            if (reportId) {
              setSaved(true);
              console.log('Report saved with ID:', reportId);
            }
          } catch (saveError) {
            console.error('Failed to save report to Convex:', saveError);
            setError('Analyse voltooid maar rapport kon niet worden opgeslagen');
          }
        }
      } else {
        throw new Error('Onverwachte response structuur van API');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Fout bij het analyseren van de afbeeldingen');
    } finally {
      setLoading(false);
    }
  }, [uploadedImages, selectedPatient, createReport]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normaal': return 'text-green-600 bg-green-50 border-green-200';
      case 'verhoogd': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'verhoogde temperatuur': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'afwijkend': return 'text-red-600 bg-red-50 border-red-200';
      case 'hoge temperatuur': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };



  return (
    <div className="space-y-4">
      {/* Analysis Controls */}
      <div className="space-y-3">
        {uploadedImages.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Upload thermografische beelden om AI-analyse te starten
            </AlertDescription>
          </Alert>
        )}

        {selectedPatient && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Eye className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Analyse wordt gekoppeld aan patiënt: <strong>{selectedPatient.patientName}</strong>
            </span>
          </div>
        )}
        
        <Button 
          onClick={handleAnalyze}
          disabled={uploadedImages.length === 0 || loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyseert...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Start Thermografische Analyse
            </>
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {saved && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Rapport succesvol opgeslagen voor patiënt {selectedPatient?.patientName}
          </AlertDescription>
        </Alert>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Analyse Resultaten
            </h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadPDF}
                disabled={!aatReport}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF Export
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Rapport Delen
              </Button>
            </div>
          </div>

          {/* Temperature Analysis per Region */}
          <div className="grid gap-4">
            {analysis.regions.map((region, index) => (
              <Card key={index} className="border-l-4 border-purple-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium text-gray-900">
                      {region.region}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="font-mono text-sm">
                        {region.temperature}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`border ${getStatusColor(region.status)}`}
                      >
                        {region.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {region.findings.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Bevindingen:</h4>
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>
                          {region.findings.map(finding => `- ${finding}`).join('\n')}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-900">
                <FileText className="w-5 h-5 mr-2" />
                Samenvatting Analyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                <ReactMarkdown>{analysis.summary}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-900">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Aanbevelingen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 text-orange-600 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Status Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Geanalyseerd: {new Date().toLocaleString('nl-NL')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Beelden: {uploadedImages.length}</span>
              {selectedPatient && (
                <span>Patiënt: {selectedPatient.patientName}</span>
              )}
              {aatReport && (
                <span>Betrouwbaarheid: {aatReport.confidence}%</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}