'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  Stethoscope,
  AlertTriangle
} from 'lucide-react';
import { VTMAPatientForm } from '@/components/vtma/vtma-patient-form';

export default function AddPatientPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Nieuwe Patiënt Toevoegen</h1>
              <p className="text-sm text-gray-500">Voer alle patiëntgegevens in volgens AAT richtlijnen</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <User className="w-3 h-3 mr-1" />
            Nieuw Formulier
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6">
        {/* Info Alert */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Stethoscope className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Veterinaire Thermografie Patiënt Registratie
                </h3>
                <p className="text-sm text-blue-800">
                  Vul alle relevante patiëntgegevens in voor een complete thermografische beoordeling. 
                  Volledige anamnese verhoogt de nauwkeurigheid van de AI-analyse.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Patiënt Registratie Formulier</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VTMAPatientForm />
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Belangrijke Richtlijnen</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Patiënt Voorbereiding:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Droge en schone huid/vacht</li>
                  <li>• 15-30 minuten acclimatisatie</li>
                  <li>• Geen recente activiteit (&lt;2 uur)</li>
                  <li>• Verwijder alle bedekkingen vooraf</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Gedragssignalen:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Let op subtiele pijnsignalen</li>
                  <li>• Documenteer gedragsveranderingen</li>
                  <li>• Noteer asymmetrieën in beweging</li>
                  <li>• Beschrijf specificiteit van klachten</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
