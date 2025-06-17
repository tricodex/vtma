'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  File, 
  FileText, 
  Calendar,
  BarChart3,
  Plus
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { VTMAUpload } from '@/components/vtma/vtma-upload';
import { VTMAReportViewer } from '@/components/vtma/vtma-report-viewer';
import { PatientSelector } from '@/components/vtma/vtma-patient-selector';
import { VTMASidebar } from '@/components/vtma/vtma-sidebar';
import { VTMAHeader } from '@/components/vtma/vtma-header';
import { VTMAAIChat } from '@/components/vtma/vtma-ai-chat';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Patient } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';

export default function VTMAPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeView, setActiveView] = useState('workflow');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // Fetch all patients from Convex
  const allPatients = useQuery(api.patients.getAll) || [];



  const handleAddNewPatient = () => {
    router.push('/patient/add');
  };

  const handlePatientSelect = (patient: Patient | null) => {
    setSelectedPatient(patient);
  };

  return (
    <SidebarProvider>
      <VTMASidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        variant="inset" 
      />
      <SidebarInset>
        <VTMAHeader />
        <main className="flex-1 overflow-auto">
          {activeView === 'workflow' && (
            <div className="p-6 max-w-7xl mx-auto">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                      {t('workflow.title')}
                    </h1>
                    <p className="text-gray-600">
                      {t('workflow.subtitle')}
                    </p>
                  </div>
                  <div className="flex-1 max-w-2xl ml-8">
                    <PatientSelector
                      selectedPatient={selectedPatient}
                      onPatientSelect={handlePatientSelect}
                      onAddNew={handleAddNewPatient}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <Card className="border-2 border-blue-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <span>{t('workflow.steps.uploadImages.title')}</span>
                    </CardTitle>
                    <CardDescription>
                      {t('workflow.steps.uploadImages.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VTMAUpload 
                      onImagesUploaded={setUploadedImages}
                      uploadedImages={uploadedImages}
                    />
                  </CardContent>
                </Card>

                {/* Report Section */}
                <Card className="border-2 border-purple-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <File className="w-5 h-5 text-purple-600" />
                      <span>{t('workflow.steps.generateReport.title')}</span>
                      {selectedPatient && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {t('patient.identification')}: {selectedPatient.patientName}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {t('workflow.steps.generateReport.description')}
                      {selectedPatient && (
                        <span className="block text-xs mt-1 text-blue-600">
                          {t('workflow.patientSelected')}: {selectedPatient.patientName}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VTMAReportViewer 
                      uploadedImages={uploadedImages} 
                      selectedPatient={selectedPatient}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeView === 'patients' && (
            <div className="p-6 max-w-7xl mx-auto">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    {t('patientsView.title')}
                  </h1>
                  <p className="text-gray-600">
                    {t('patientsView.subtitle')}
                  </p>
                </div>
                <Button 
                  onClick={handleAddNewPatient}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('patientsView.newPatient')}
                </Button>
              </div>
              
              {/* Demo Data Notice */}
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                    {t('patientsView.demoMode')}
                  </Badge>
                  <span className="text-sm text-amber-700">
                    {t('patientsView.demoNotice')}
                  </span>
                </div>
              </div>

              {/* Patient Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPatients.map((patient) => {
                  const getPatientInitials = (name: string): string => {
                    return name.split(' ').map(n => n[0]).join('').toUpperCase();
                  };
                  
                  const getSpeciesEmoji = (species: string): string => {
                    switch (species) {
                      case 'paard': return '🐴';
                      case 'hond': return '🐕';
                      case 'kat': return '🐱';
                      case 'rund': return '🐄';
                      default: return '🐾';
                    }
                  };
                  
                  const getGenderBadgeColor = (gender: string): string => {
                    switch (gender) {
                      case 'reu':
                      case 'hengst': return 'bg-blue-100 text-blue-800';
                      case 'teef':
                      case 'merrie': return 'bg-pink-100 text-pink-800';
                      case 'gecastreerd':
                      case 'ruin': return 'bg-gray-100 text-gray-800';
                      default: return 'bg-gray-100 text-gray-800';
                    }
                  };
                  
                  return (
                    <Card key={patient._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        {/* Patient Header */}
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={patient.thumbnail} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm">
                              {getPatientInitials(patient.patientName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">
                                {patient.patientName}
                              </h3>
                              <span className="text-lg">{getSpeciesEmoji(patient.species)}</span>
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                {t('patientsView.demo')}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              {patient.patientNumber} • {patient.breed}
                            </p>
                          </div>
                        </div>
                        
                        {/* Patient Details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">{t('patientsView.gender')}:</span>
                            <Badge variant="outline" className={getGenderBadgeColor(patient.gender)}>
                              {patient.gender}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">{t('patientsView.age')}:</span>
                            <span className="text-gray-900">{patient.age}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">{t('patientsView.owner')}:</span>
                            <span className="text-gray-900 truncate">{patient.ownerName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Laatste update:</span>
                            <span className="text-gray-900">
                              {new Date(patient._creationTime).toLocaleDateString('nl-NL')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Active Issues */}
                        {(patient.tailSwishing || patient.behaviorResistance || patient.performanceDrop) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2">Actieve symptomen:</p>
                            <div className="flex flex-wrap gap-1">
                              {patient.tailSwishing && (
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                  Staartzwiepen
                                </Badge>
                              )}
                              {patient.behaviorResistance && (
                                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                  Verzet
                                </Badge>
                              )}
                              {patient.performanceDrop && (
                                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                  Prestatieverval
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setActiveView('workflow');
                              }}
                            >
                              Selecteren
                            </Button>
                            <Button size="sm" variant="ghost" className="px-3">
                              <FileText className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {/* Add New Patient Card */}
              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer" onClick={handleAddNewPatient}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Nieuwe Patiënt Toevoegen
                    </h3>
                    <p className="text-sm text-gray-500">
                      Voeg een nieuwe patiënt toe aan het systeem
                    </p>
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

          {activeView === 'ai-chat' && (
            <div className="p-6 max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Thermografie Assistent
                </h1>
                <p className="text-gray-600">
                  Stel vragen over thermografie rapporten en kennis
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <VTMAAIChat 
                  selectedPatientId={selectedPatient?._id}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}