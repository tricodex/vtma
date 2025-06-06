'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  FileText, 
  Download, 
  Eye, 
  Thermometer, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Stethoscope,
  Activity,
  TrendingUp,
  Target,
  Clock
} from 'lucide-react';

interface VTMAReportViewerProps {
  uploadedImages: string[];
}

interface ReportSection {
  title: string;
  content: string;
  confidence: number;
  findings: string[];
}

interface AIAnalysisResult {
  patientIdentification: ReportSection;
  anamnesis: ReportSection;
  protocolConditions: ReportSection;
  thermographicFindings: ReportSection;
  interpretation: ReportSection;
  recommendations: ReportSection;
  differentialDiagnoses: string[];
  urgencyLevel: 'routine' | 'urgent' | 'immediate';
  confidence: number;
}

export function VTMAReportViewer({ uploadedImages }: VTMAReportViewerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  const [report, setReport] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    if (uploadedImages.length === 0) {
      setError('Upload eerst thermografische beelden om een rapport te genereren.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);

    try {
      // Simulate AI analysis stages
      const stages = [
        'Beelden voorverwerken...',
        'Temperatuurpatronen analyseren...',
        'Asymmetrieën detecteren...',
        'Pathologische patronen identificeren...',
        'Differentiaal diagnoses genereren...',
        'Rapport samenstellen...'
      ];

      for (let i = 0; i < stages.length; i++) {
        setAnalysisStage(stages[i]);
        setAnalysisProgress((i + 1) * (100 / stages.length));
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Generate AI report using Gemini
      const response = await fetch('/api/vtma/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: uploadedImages,
          patientData: {
            species: 'paard', // This would come from the patient form
            symptoms: ['staartzwiepen', 'gevoelig_borstelen'], // From patient form
            primaryComplaint: 'Verzet en gevoeligheid in rug'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('AI analyse gefaald');
      }

      const analysisResult = await response.json();
      setReport(analysisResult);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout opgetreden');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    // Generate PDF or Word document (simplified implementation)
    const reportText = generateReportText(report);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VTMA_Rapport_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportText = (report: AIAnalysisResult): string => {
    return `
VETERINAIRE THERMOGRAFIE RAPPORT
================================

Datum: ${new Date().toLocaleDateString('nl-NL')}
Gegenereerd door: VTMA AI Systeem
Betrouwbaarheid: ${report.confidence}%

PATIËNT IDENTIFICATIE
--------------------
${report.patientIdentification.content}

ANAMNESE EN HOOFDKLACHT
----------------------
${report.anamnesis.content}

ONDERZOEKSPROTOCOL EN OMSTANDIGHEDEN
------------------------------------
${report.protocolConditions.content}

THERMOGRAFISCHE BEVINDINGEN
---------------------------
${report.thermographicFindings.content}

Belangrijke bevindingen:
${report.thermographicFindings.findings.map(f => `• ${f}`).join('\n')}

INTERPRETATIE EN DIFFERENTIAAL DIAGNOSE
---------------------------------------
${report.interpretation.content}

Differentiaal diagnoses:
${report.differentialDiagnoses.map(d => `• ${d}`).join('\n')}

AANBEVELINGEN
------------
${report.recommendations.content}

Urgentie: ${report.urgencyLevel === 'immediate' ? 'Onmiddellijk' : 
           report.urgencyLevel === 'urgent' ? 'Spoedig' : 'Routine'}

---
Dit rapport is gegenereerd door AI en dient als ondersteuning voor veterinaire diagnose.
Definitieve diagnose vereist altijd veterinaire beoordeling.
    `.trim();
  };

  // Mock report for demo purposes
  const mockReport: AIAnalysisResult = {
    patientIdentification: {
      title: 'Patiënt Identificatie',
      content: 'Paard: Thunder, 8 jaar, KWPN ruin, Eigenaar: J. Jansen',
      confidence: 100,
      findings: []
    },
    anamnesis: {
      title: 'Anamnese',
      content: 'Hoofdklacht: Verzet tijdens dressuurwerk, gevoeligheid bij borstelen rug. Duur: 3 weken. Geen eerdere behandelingen.',
      confidence: 95,
      findings: ['Acute symptomen', 'Gedragsverandering', 'Lokale gevoeligheid']
    },
    protocolConditions: {
      title: 'Onderzoeksomstandigheden',
      content: 'Thermografisch onderzoek uitgevoerd onder gecontroleerde omstandigheden. Omgevingstemperatuur: 20°C, Emissiviteit: 0.98, Camera afstand: 1.5m.',
      confidence: 100,
      findings: ['Optimale omstandigheden', 'Gecalibreerde apparatuur']
    },
    thermographicFindings: {
      title: 'Thermografische Bevindingen',
      content: 'Significante temperatuursverhoging (2.3°C) ter hoogte van T15-T18 thoracale wervelkolom. Asymmetrisch warmtepatroon aan weerszijden van de schoft.',
      confidence: 87,
      findings: [
        'Hyperthermie T15-T18 gebied (+2.3°C)',
        'Asymmetrische warmteverdeling schoft',
        'Verhoogde circulatie thoracolumbale overgang',
        'Normale hoefontwikkeling voorvoeten'
      ]
    },
    interpretation: {
      title: 'Interpretatie',
      content: 'De thermografische bevindingen zijn consistent met inflammatoire veranderingen in de thoracolumbale wervelkolom, mogelijk gerelateerd aan Kissing Spine syndrome.',
      confidence: 82,
      findings: ['Inflammatie wervelkolom', 'Mogelijk kissing spine', 'Geen acute blessures extremiteiten']
    },
    recommendations: {
      title: 'Aanbevelingen',
      content: 'Aanvullend onderzoek: Röntgen thoracolumbale wervelkolom. Behandeling: Anti-inflammatoire therapie, aangepast trainingsschema. Follow-up thermografie na 4 weken.',
      confidence: 90,
      findings: ['Röntgen onderzoek aanbevolen', 'Rustperiode nodig', 'Follow-up planning']
    },
    differentialDiagnoses: [
      'Kissing Spine Syndrome (primair)',
      'Spierspasmen thoracolumbaal',
      'Zadeldruk gerelateerde inflammatie',
      'Ligamenteuze beschadiging supraspinous ligament'
    ],
    urgencyLevel: 'urgent',
    confidence: 85
  };

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Thermografische Analyse</span>
            </div>
            <Badge 
              variant={report ? "default" : "secondary"}
              className={report ? "bg-green-100 text-green-800" : ""}
            >
              {report ? 'Rapport Beschikbaar' : 'Nog Geen Analyse'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isAnalyzing && !report && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Klaar voor AI Analyse
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start de AI-analyse om automatisch een gestandaardiseerd thermografie rapport te genereren volgens AAT richtlijnen.
              </p>
              <Button
                onClick={generateReport}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                Start AI Analyse
              </Button>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI Analyseert Thermografische Beelden
                </h3>
                <p className="text-gray-600 mb-4">{analysisStage}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Analyse Voortgang</span>
                  <span>{Math.round(analysisProgress)}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Generated Report */}
      {(report || (!isAnalyzing && uploadedImages.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Gestandaardiseerd Thermografie Rapport</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>{(report || mockReport).confidence}% Betrouwbaar</span>
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadReport}
                  disabled={!report && !mockReport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="findings" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="findings">Bevindingen</TabsTrigger>
                <TabsTrigger value="interpretation">Interpretatie</TabsTrigger>
                <TabsTrigger value="recommendations">Aanbevelingen</TabsTrigger>
                <TabsTrigger value="full-report">Volledig Rapport</TabsTrigger>
              </TabsList>

              <TabsContent value="findings" className="space-y-4">
                <ReportSectionCard
                  icon={<Thermometer className="w-5 h-5" />}
                  section={(report || mockReport).thermographicFindings}
                  color="blue"
                />
                <ReportSectionCard
                  icon={<Stethoscope className="w-5 h-5" />}
                  section={(report || mockReport).anamnesis}
                  color="green"
                />
              </TabsContent>

              <TabsContent value="interpretation" className="space-y-4">
                <ReportSectionCard
                  icon={<Brain className="w-5 h-5" />}
                  section={(report || mockReport).interpretation}
                  color="purple"
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Differentiaal Diagnoses</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(report || mockReport).differentialDiagnoses.map((diagnosis, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <span className="text-sm">{diagnosis}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <ReportSectionCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  section={(report || mockReport).recommendations}
                  color="orange"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>Urgentie Niveau</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge 
                        variant={
                          (report || mockReport).urgencyLevel === 'immediate' ? 'destructive' :
                          (report || mockReport).urgencyLevel === 'urgent' ? 'default' :
                          'secondary'
                        }
                        className="text-sm"
                      >
                        {(report || mockReport).urgencyLevel === 'immediate' ? 'Onmiddellijk' :
                         (report || mockReport).urgencyLevel === 'urgent' ? 'Spoedig' :
                         'Routine'}
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5" />
                        <span>Follow-up Planning</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Controle thermografie aanbevolen na 4 weken
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="full-report">
                <Card>
                  <CardContent className="p-6">
                    <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                      {generateReportText(report || mockReport)}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ReportSectionCardProps {
  icon: React.ReactNode;
  section: ReportSection;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function ReportSectionCard({ icon, section, color }: ReportSectionCardProps) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    orange: 'border-orange-200 bg-orange-50',
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  return (
    <Card className={`border-2 ${colorClasses[color]}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 ${iconColorClasses[color]}`}>
            {icon}
            <span>{section.title}</span>
          </div>
          <Badge variant="outline" className="bg-white">
            {section.confidence}% betrouwbaar
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{section.content}</p>
        {section.findings.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-semibold text-sm text-gray-900">Specifieke Bevindingen:</h5>
            <ul className="space-y-1">
              {section.findings.map((finding, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}