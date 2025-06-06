'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  Camera, 
  Calendar,
  User, 
  Phone, 
  Mail, 
  MapPin,
  Stethoscope,
  Heart,
  Activity,
  Eye,
  AlertTriangle,
  CheckCircle,
  Download
} from 'lucide-react';
import { DemoPatient, getDemoPatient } from '@/lib/demo-data';

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [patient, setPatient] = useState<DemoPatient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const foundPatient = getDemoPatient(params.id as string);
      setPatient(foundPatient || null);
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Patiëntgegevens laden...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Patiënt Niet Gevonden</h2>
            <p className="text-gray-600 mb-4">
              De gevraagde patiënt kon niet worden gevonden in het systeem.
            </p>
            <Button onClick={() => router.push('/vtma')} variant="outline">
              Terug naar Workflow
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={patient.thumbnail} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  {getPatientInitials(patient.patientName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-semibold text-gray-900">{patient.patientName}</h1>
                  <span className="text-xl">{getSpeciesEmoji(patient.species)}</span>
                  <Badge variant="outline" className={getGenderBadgeColor(patient.gender)}>
                    {patient.gender}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {patient.patientNumber} • {patient.breed} • {patient.age}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Bewerken
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Camera className="w-4 h-4 mr-2" />
              Nieuw Onderzoek
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="overview">Overzicht</TabsTrigger>
            <TabsTrigger value="anamnesis">Anamnese</TabsTrigger>
            <TabsTrigger value="reports">Rapporten</TabsTrigger>
            <TabsTrigger value="history">Geschiedenis</TabsTrigger>
            <TabsTrigger value="contacts">Contacten</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Info */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Patiënt Informatie</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Patiëntnummer</label>
                    <p className="font-mono text-sm">{patient.patientNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Chip/ID</label>
                    <p className="text-sm">{patient.patientId || 'Niet geregistreerd'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Diersoort</label>
                    <p className="text-sm capitalize">{patient.species}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ras</label>
                    <p className="text-sm">{patient.breed}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Leeftijd</label>
                    <p className="text-sm">{patient.age}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gewicht</label>
                    <p className="text-sm">{patient.weight}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Status & Symptoms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span>Huidige Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Badge 
                      variant={patient.status === 'active' ? 'default' : 'secondary'}
                      className={patient.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {patient.status === 'active' ? 'Actieve Patiënt' : 'Gearchiveerd'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Actieve Symptomen:</h4>
                    <div className="space-y-1">
                      {patient.tailSwishing && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-amber-500" />
                          <span className="text-sm">Staartzwiepen</span>
                        </div>
                      )}
                      {patient.behaviorResistance && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-amber-500" />
                          <span className="text-sm">Verzet gedrag</span>
                        </div>
                      )}
                      {patient.sensitiveBrushing && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-amber-500" />
                          <span className="text-sm">Gevoelig borstelen</span>
                        </div>
                      )}
                      {patient.reluctantBending && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-amber-500" />
                          <span className="text-sm">Moeite met buigen</span>
                        </div>
                      )}
                      {patient.performanceDrop && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-amber-500" />
                          <span className="text-sm">Prestatieverlies</span>
                        </div>
                      )}
                      {patient.gaitIrregularity && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-amber-500" />
                          <span className="text-sm">Onregelmatige gang</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Laatste Update</label>
                    <p className="text-sm">{new Date(patient.lastUpdated).toLocaleDateString('nl-NL')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="anamnesis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="w-5 h-5" />
                  <span>Anamnese en Klachten</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Hoofdklacht</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{patient.primaryComplaint}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Duur Symptomen</label>
                    <p className="text-sm">{patient.symptomDuration}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Activiteitsniveau</label>
                    <p className="text-sm capitalize">{patient.activityLevel}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Gedragsveranderingen</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{patient.behaviorChanges}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Eerdere Behandelingen</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{patient.previousTreatments}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Huidige Medicatie</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{patient.currentMedications || 'Geen medicatie'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Thermografie Rapporten</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nog Geen Rapporten
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start een nieuw thermografisch onderzoek om rapporten te genereren
                  </p>
                  <Button onClick={() => router.push('/vtma')}>
                    <Camera className="w-4 h-4 mr-2" />
                    Nieuw Onderzoek Starten
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Behandelingsgeschiedenis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Geschiedenis wordt bijgehouden
                  </h3>
                  <p className="text-gray-500">
                    Alle onderzoeken en behandelingen worden hier geregistreerd
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Owner Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Eigenaar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Naam</label>
                    <p className="text-sm">{patient.ownerName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${patient.ownerEmail}`} className="text-sm text-blue-600 hover:underline">
                      {patient.ownerEmail}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${patient.ownerPhone}`} className="text-sm text-blue-600 hover:underline">
                      {patient.ownerPhone}
                    </a>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-sm whitespace-pre-line">{patient.ownerAddress}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Veterinarian Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Stethoscope className="w-5 h-5" />
                    <span>Verwijzend Dierenarts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dierenarts</label>
                    <p className="text-sm">{patient.veterinarianName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Praktijk/Kliniek</label>
                    <p className="text-sm">{patient.clinicName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${patient.veterinarianPhone}`} className="text-sm text-blue-600 hover:underline">
                      {patient.veterinarianPhone}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
