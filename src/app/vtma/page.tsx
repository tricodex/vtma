'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Thermometer, 
  Upload, 
  FileImage, 
  Brain, 
  Activity, 
  Settings, 
  FileText, 
  Calendar,
  HelpCircle,
  Stethoscope,
  BarChart3,
  Camera,
  User,
  Search,
  Languages
} from 'lucide-react';
import { VTMAUpload } from '@/components/vtma/vtma-upload';
import { VTMAPatientForm } from '@/components/vtma/vtma-patient-form';
import { VTMAReportViewer } from '@/components/vtma/vtma-report-viewer';

export default function VTMAPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeView, setActiveView] = useState('workflow');

  const sidebarItems = [
    { 
      id: 'workflow', 
      label: 'Workflow', 
      icon: Activity, 
      description: 'Upload, Patiënt & Rapport'
    },
    { 
      id: 'patients', 
      label: 'Patiënten', 
      icon: User, 
      description: 'Patiënt overzicht'
    },
    { 
      id: 'reports', 
      label: 'Rapporten', 
      icon: FileText, 
      description: 'Gegenereerde rapporten'
    },
    { 
      id: 'analytics', 
      label: 'Analyse', 
      icon: BarChart3, 
      description: 'Statistieken & trends'
    },
    { 
      id: 'calendar', 
      label: 'Planning', 
      icon: Calendar, 
      description: 'Afspraken & planning'
    }
  ];

  const secondaryItems = [
    { id: 'search', label: 'Zoeken', icon: Search },
    { id: 'settings', label: 'Instellingen', icon: Settings },
    { id: 'help', label: 'Hulp', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Compact Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Thermometer className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">VTMA</h1>
            <p className="text-xs text-gray-500">Veterinaire Thermografie</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200 text-blue-700">
            <Languages className="w-4 h-4 mr-1" />
            NL
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            EN
          </Button>
          <Button variant="outline" size="sm">
            <HelpCircle className="w-4 h-4 mr-2" />
            Hulp
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Professional Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Hoofd Menu
            </h2>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <Separator />

          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Systeem
            </h2>
            <nav className="space-y-1">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-800">Systeem Online</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {activeView === 'workflow' && (
            <div className="p-6 max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Thermografie Workflow
                </h1>
                <p className="text-gray-600">
                  Complete workflow voor thermografisch onderzoek - van upload tot rapport
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Upload Section */}
                <Card className="border-2 border-blue-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <span>1. Upload Thermografische Beelden</span>
                    </CardTitle>
                    <CardDescription>
                      Upload thermografische beelden voor AI-analyse
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VTMAUpload 
                      onImagesUploaded={setUploadedImages}
                      uploadedImages={uploadedImages}
                    />
                  </CardContent>
                </Card>

                {/* Patient Form Section */}
                <Card className="border-2 border-green-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Stethoscope className="w-5 h-5 text-green-600" />
                      <span>2. Patiëntgegevens Invoeren</span>
                    </CardTitle>
                    <CardDescription>
                      Voer patiëntgegevens in volgens AAT richtlijnen
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <VTMAPatientForm />
                  </CardContent>
                </Card>
              </div>

              {/* Report Section - Full Width */}
              <Card className="mt-6 border-2 border-purple-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span>3. AI Rapport Generatie</span>
                  </CardTitle>
                  <CardDescription>
                    Geautomatiseerde rapportgeneratie gebaseerd op thermografische analyse
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VTMAReportViewer uploadedImages={uploadedImages} />
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'patients' && (
            <div className="p-6 max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Patiënten Overzicht
                </h1>
                <p className="text-gray-600">
                  Overzicht van alle geregistreerde patiënten
                </p>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Geen patiënten gevonden
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Start met het toevoegen van een nieuwe patiënt via de workflow
                    </p>
                    <Button onClick={() => setActiveView('workflow')}>
                      Naar Workflow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'reports' && (
            <div className="p-6 max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Rapporten Archief
                </h1>
                <p className="text-gray-600">
                  Overzicht van alle gegenereerde thermografie rapporten
                </p>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Geen rapporten beschikbaar
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Rapporten verschijnen hier nadat ze zijn gegenereerd
                    </p>
                    <Button onClick={() => setActiveView('workflow')}>
                      Nieuw Rapport Maken
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'analytics' && (
            <div className="p-6 max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Praktijk Analyse
                </h1>
                <p className="text-gray-600">
                  Inzichten en statistieken over uw thermografie praktijk
                </p>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Analyse wordt voorbereid
                    </h3>
                    <p className="text-gray-500">
                      Statistieken worden gegenereerd nadat u meer onderzoeken heeft uitgevoerd
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'calendar' && (
            <div className="p-6 max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Afspraken Planning
                </h1>
                <p className="text-gray-600">
                  Beheer uw thermografie afspraken en planning
                </p>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Planning Module
                    </h3>
                    <p className="text-gray-500">
                      Afspraken planning wordt binnenkort beschikbaar
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}