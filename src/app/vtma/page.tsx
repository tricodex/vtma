'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Upload, FileImage, Brain, Activity, Heart } from 'lucide-react';
import { VTMAUpload } from '@/components/vtma/vtma-upload';
import { VTMAPatientForm } from '@/components/vtma/vtma-patient-form';
import { VTMAReportViewer } from '@/components/vtma/vtma-report-viewer';
import { VTMADashboard } from '@/components/vtma/vtma-dashboard';

export default function VTMAPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Thermometer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">VTMA</h1>
                  <p className="text-sm text-gray-600">Veterinaire Thermografie Medische Administratie</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="w-3 h-3 mr-1" />
                AI Actief
              </Badge>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Hulp
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="patient" className="flex items-center space-x-2">
              <FileImage className="w-4 h-4" />
              <span>Patiënt</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Rapport</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <VTMADashboard />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Thermografische Beelden Uploaden</span>
                </CardTitle>
                <CardDescription>
                  Upload thermografische beelden voor AI-analyse en automatische rapportgeneratie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VTMAUpload 
                  onImagesUploaded={setUploadedImages}
                  uploadedImages={uploadedImages}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patient" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileImage className="w-5 h-5" />
                  <span>Patiëntgegevens</span>
                </CardTitle>
                <CardDescription>
                  Voer patiëntgegevens in volgens AAT richtlijnen voor thermografisch onderzoek
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VTMAPatientForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Rapport Generatie</span>
                </CardTitle>
                <CardDescription>
                  Geautomatiseerde rapportgeneratie gebaseerd op thermografische analyse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VTMAReportViewer uploadedImages={uploadedImages} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}