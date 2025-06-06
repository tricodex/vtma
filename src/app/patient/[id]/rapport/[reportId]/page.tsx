'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  FileText, 
  Download, 
  CheckCircle, 
  Calendar,
  User,
  Thermometer,
  Stethoscope,
  Brain,
  TrendingUp,
  AlertTriangle,
  Eye,
  Clock,
  Target
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportSection {
  title: string;
  content: string;
  confidence: number;
  findings: string[];
}

interface AIAnalysisResult {
  id: string;
  patientId: string;
  createdAt: string;
  patientIdentification: ReportSection;
  anamnesis: ReportSection;
  protocolConditions: ReportSection;
  thermographicFindings: ReportSection;
  interpretation: ReportSection;
  recommendations: ReportSection;
  differentialDiagnoses: string[];
  urgencyLevel: 'routine' | 'urgent' | 'immediate';
  confidence: number;
  images: string[];
}

// Mock data voor demo - in productie zou dit uit de database komen
const getMockReport = (reportId: string, patientId: string): AIAnalysisResult => ({
  id: reportId,
  patientId: patientId,
  createdAt: new Date().toISOString(),
  confidence: 92,
  urgencyLevel: 'routine',
  images: ['/horse-bg.png'],
  patientIdentification: {
    title: 'Patiënt Identificatie',
    content: `## Patiënt Gegevens\n\n**Identificatie**: Volledig geïdentificeerd patiënt met alle relevante gegevens beschikbaar.\n\n**Registratie**: Patiënt is correct geregistreerd in het systeem met unieke identificatie.`,
    confidence: 100,
    findings: ['Volledige patiënt identificatie beschikbaar', 'Alle relevante gegevens aanwezig']
  },
  anamnesis: {
    title: 'Anamnese en Hoofdklacht',
    content: `## Hoofdklacht\n\n**Primaire klacht**: Staartzwiepen en ongemak tijdens het zadelen.\n\n**Duur**: Symptomen zijn waargenomen gedurende de laatste 2-3 weken.\n\n**Triggers**: \n- Verhoogde gevoeligheid tijdens borstelen\n- Weerstand bij opzadelen\n- Onrustig gedrag tijdens verzorging\n\n**Aanvullende observaties**:\n- Geen duidelijke kreupelheid\n- Normale eetlust\n- Goede algemene conditie`,
    confidence: 88,
    findings: [
      'Gedragsveranderingen consistent met rugproblemen',
      'Geen systemische ziektesymptomen',
      'Lokale gevoeligheid in ruggebied'
    ]
  },
  protocolConditions: {
    title: 'Onderzoeksprotocol en Omstandigheden',
    content: `## Onderzoeksomstandigheden\n\n**Datum en tijd**: ${new Date().toLocaleDateString('nl-NL')} om ${new Date().toLocaleTimeString('nl-NL')}\n\n**Omgevingstemperatuur**: 18-24°C (optimaal)\n\n**Voorbereidingstijd**: 15 minuten acclimatisatie\n\n**Camera specificaties**:\n- Resolutie: 320x240 pixels\n- Thermische gevoeligheid: <0.08°C\n- Emissiviteit instelling: 0.98\n\n**Protocol naleving**: ✅ Volledig conform AAT richtlijnen`,
    confidence: 95,
    findings: [
      'Optimale omgevingsomstandigheden',
      'Correcte camera kalibratie',
      'Voldoende acclimatisatietijd',
      'AAT protocol volledig gevolgd'
    ]
  },
  thermographicFindings: {
    title: 'Thermografische Bevindingen',
    content: `## Temperatuurpatronen\n\n**Asymmetrische warmteverdeling** gedetecteerd in de thoracolumbale regio.\n\n### Specifieke Observaties:\n\n**Linker rugspieren (T10-L3)**:\n- Verhoogde temperatuur: +2.1°C ten opzichte van rechts\n- Patroon consistent met spiercompensatie\n- Duidelijke afbakening van het beïnvloede gebied\n\n**Rechter rugspieren**:\n- Normale temperatuurwaarden\n- Geen tekenen van inflammatie\n- Goede symmetrie in posterieure delen\n\n**Wervelboog regio**:\n- Lokale hotspots ter hoogte van T12-T14\n- Mogelijk indicatief voor gewrichtsproblematiek\n\n**Bilaterale vergelijking**:\n- Duidelijke asymmetrie (>1.5°C verschil)\n- Patroon wijst op unilaterale belasting`,
    confidence: 89,
    findings: [
      'Asymmetrische temperatuurverdeling linker thoracolumbale regio',
      'Temperatuurverschil van 2.1°C tussen links en rechts',
      'Hotspots ter hoogte van T12-T14 wervels',
      'Geen acute inflammatoire processen zichtbaar',
      'Patroon consistent met chronische spiercompensatie'
    ]
  },
  interpretation: {
    title: 'Interpretatie en Diagnose',
    content: `## Klinische Interpretatie\n\nDe thermografische bevindingen wijzen op een **chronisch compensatiepatroon** in de thoracolumbale regio.\n\n### Primaire bevindingen:\n\n**Spiercompensatie patroon**:\n- De verhoogde temperatuur in de linker rugmusculatuur suggereert verhoogde spieractiviteit\n- Dit is karakteristiek voor compensatiemechanismen bij asymmetrische belasting\n- Geen tekenen van acute inflammatie\n\n**Mogelijke onderliggende oorzaken**:\n1. **Zadel gerelateerd**: Mogelijk asymmetrische drukpunten\n2. **Biomechanisch**: Compensatie voor subtiele bewegingsbeperking\n3. **Training gerelateerd**: Eenzijdige belasting patronen\n\n### Klinische significantie:\n\nDe bevindingen zijn **klinisch relevant** en correleren goed met de gerapporteerde gedragssymptomen (staartzwiepen, verzet bij zadelen).\n\n**Prognose**: Goed, mits tijdige interventie en aanpassing van management.`,
    confidence: 87,
    findings: [
      'Chronisch compensatiepatroon geïdentificeerd',
      'Goede correlatie met klinische symptomen',
      'Geen acute pathologie aangetoond',
      'Interventie geïndiceerd voor preventie verergering'
    ]
  },
  recommendations: {
    title: 'Aanbevelingen en Behandelplan',
    content: `## Behandelaanbevelingen\n\n### Onmiddellijke acties:\n\n**1. Zadel evaluatie** (Prioriteit: Hoog)\n- Professionele zadel fitting binnen 1-2 weken\n- Controle op asymmetrische drukpunten\n- Mogelijk tijdelijke aanpassingen\n\n**2. Veterinaire follow-up**\n- Klinisch onderzoek rug en bewegingsapparaat\n- Palpatie thoracolumbale regio\n- Mobiliteitstest gewrichten\n\n### Behandeling:\n\n**Fysiotherapie** (4-6 weken programma):\n- Mobiliserende oefeningen\n- Symmetrische spierversterking\n- Stretching protocollen\n\n**Training aanpassingen**:\n- Tijdelijke reductie intensiteit (2 weken)\n- Focus op symmetrische oefeningen\n- Vermijd eenzijdige belasting\n\n### Monitoring:\n\n**Thermografische controle**:\n- Herhaling na 4-6 weken behandeling\n- Evaluatie temperatuurasymmetrie\n- Documentatie progressie\n\n**Gedragsobservatie**:\n- Dagelijkse monitoring staartzwiepen\n- Reactie op zadelen en borstelen\n- Algemene houding en beweging`,
    confidence: 93,
    findings: [
      'Multidisciplinaire aanpak geïndiceerd',
      'Zadel evaluatie hoogste prioriteit',
      'Fysiotherapie programma aanbevolen',
      'Follow-up thermografie over 4-6 weken',
      'Goede prognose bij adequate behandeling'
    ]
  },
  differentialDiagnoses: [
    'Zadel-gerelateerde rugpijn',
    'Thoracolumbale gewrichtsdysfunctie',
    'Compensatoire spieroverbelasting',
    'Chronische myalgie',
    'Biomechanische asymmetrie'
  ]
});

export default function RapportPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock patient data for now
  const patient = {
    _id: params.id as string,
    patientName: "Demo Patient",
    patientNumber: "P001",
    species: "paard",
    breed: "KWPN",
    age: "8 jaar",
    weight: "550kg",
    ownerName: "Demo Owner",
    clinicName: "Demo Clinic"
  };

  useEffect(() => {
    // Just load mock report for demo
    const mockReport = getMockReport(params.reportId as string, params.id as string);
    setReport(mockReport);
    setIsLoading(false);
  }, [params.id, params.reportId]);

  const downloadPDF = async () => {
    if (!report) return;
    
    try {
      const element = document.getElementById('rapport-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = `VTMA_Rapport_${patient?.patientName || 'Patient'}_${report.id}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'bg-red-100 text-red-800 border-red-300';
      case 'urgent': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'Onmiddellijk';
      case 'urgent': return 'Spoedig';
      default: return 'Routine';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Rapport laden...</p>
        </div>
      </div>
    );
  }

  if (!patient || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Rapport niet gevonden</h1>
          <p className="text-gray-600 mb-4">Het opgevraagde rapport kon niet worden geladen.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug
              </Button>
              
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/vtma">VTMA</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/vtma">Patiënten</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/patient/${patient._id}`}>{patient.patientName}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Rapport {report.id.substring(0, 8)}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className={getUrgencyColor(report.urgencyLevel)}>
                <Clock className="w-3 h-3 mr-1" />
                {getUrgencyText(report.urgencyLevel)}
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                {report.confidence}% Betrouwbaar
              </Badge>
              <Button variant="outline" size="sm" onClick={downloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                PDF Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div id="rapport-content" className="space-y-6">
          {/* Report Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-2xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <span>Veterinaire Thermografie Rapport</span>
                  </CardTitle>
                  <p className="text-gray-600 mt-1">Geautomatiseerde analyse volgens AAT richtlijnen</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(report.createdAt).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Rapport ID: {report.id}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Patiënt Informatie
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Naam:</span> {patient.patientName}</div>
                    <div><span className="font-medium">Diersoort:</span> {patient.species}</div>
                    <div><span className="font-medium">Ras:</span> {patient.breed}</div>
                    <div><span className="font-medium">Leeftijd:</span> {patient.age}</div>
                    <div><span className="font-medium">Gewicht:</span> {patient.weight}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Identificatie
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Patiënt ID:</span> {patient.patientNumber}</div>
                    <div><span className="font-medium">Eigenaar:</span> {patient.ownerName}</div>
                    <div><span className="font-medium">Praktijk:</span> {patient.clinicName}</div>
                    <div><span className="font-medium">Primaire klacht:</span> Thermografie onderzoek</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Sections */}
          <Tabs defaultValue="findings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="findings">Bevindingen</TabsTrigger>
              <TabsTrigger value="interpretation">Interpretatie</TabsTrigger>
              <TabsTrigger value="recommendations">Aanbevelingen</TabsTrigger>
              <TabsTrigger value="full-report">Volledig Rapport</TabsTrigger>
            </TabsList>

            <TabsContent value="findings" className="space-y-6">
              <ReportSectionCard
                icon={<Thermometer className="w-5 h-5" />}
                section={report.thermographicFindings}
                color="blue"
              />
              <ReportSectionCard
                icon={<Stethoscope className="w-5 h-5" />}
                section={report.anamnesis}
                color="green"
              />
              <ReportSectionCard
                icon={<Eye className="w-5 h-5" />}
                section={report.protocolConditions}
                color="purple"
              />
            </TabsContent>

            <TabsContent value="interpretation" className="space-y-6">
              <ReportSectionCard
                icon={<Brain className="w-5 h-5" />}
                section={report.interpretation}
                color="purple"
              />
              
              <Card className="border-2 border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-600">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Differentiële Diagnoses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {report.differentialDiagnoses.map((diagnosis, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded border">
                        <Target className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">{diagnosis}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <ReportSectionCard
                icon={<TrendingUp className="w-5 h-5" />}
                section={report.recommendations}
                color="orange"
              />
            </TabsContent>

            <TabsContent value="full-report" className="space-y-6">
              <div className="space-y-6">
                <ReportSectionCard
                  icon={<User className="w-5 h-5" />}
                  section={report.patientIdentification}
                  color="blue"
                />
                <ReportSectionCard
                  icon={<Stethoscope className="w-5 h-5" />}
                  section={report.anamnesis}
                  color="green"
                />
                <ReportSectionCard
                  icon={<Eye className="w-5 h-5" />}
                  section={report.protocolConditions}
                  color="purple"
                />
                <ReportSectionCard
                  icon={<Thermometer className="w-5 h-5" />}
                  section={report.thermographicFindings}
                  color="blue"
                />
                <ReportSectionCard
                  icon={<Brain className="w-5 h-5" />}
                  section={report.interpretation}
                  color="purple"
                />
                <ReportSectionCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  section={report.recommendations}
                  color="orange"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
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
        <div className="text-gray-700 mb-4 prose prose-sm max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900">
          <ReactMarkdown>{section.content}</ReactMarkdown>
        </div>
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
