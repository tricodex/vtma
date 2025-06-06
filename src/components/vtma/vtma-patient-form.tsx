'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Heart, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Stethoscope,
  ClipboardList,
  AlertTriangle,
  Save,
  Eye
} from 'lucide-react';

interface PatientFormData {
  // Patiënt Identificatie
  patientName: string;
  patientId: string;
  species: string;
  breed: string;
  gender: string;
  age: string;
  weight: string;
  
  // Eigenaar Gegevens
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
  
  // Verwijzend Dierenarts
  veterinarianName: string;
  clinicName: string;
  veterinarianPhone: string;
  
  // Anamnese
  primaryComplaint: string;
  symptomDuration: string;
  previousTreatments: string;
  currentMedications: string;
  activityLevel: string;
  behaviorChanges: string;
  
  // Onderzoeksomstandigheden
  ambientTemperature: string;
  humidity: string;
  lastActivity: string;
  acclimationTime: string;
  skinCondition: string;
  
  // Specifieke Symptomen (Nederlandse thermografie focus)
  tailSwishing: boolean;
  behaviorResistance: boolean;
  sensitiveBrushing: boolean;
  reluctantBending: boolean;
  performanceDrop: boolean;
  gaitIrregularity: boolean;
  
  errors?: string;
}

async function submitPatientForm(prevState: PatientFormData, formData: FormData): Promise<PatientFormData> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const data: PatientFormData = {
    // Patiënt data
    patientName: formData.get('patientName') as string,
    patientId: formData.get('patientId') as string,
    species: formData.get('species') as string,
    breed: formData.get('breed') as string,
    gender: formData.get('gender') as string,
    age: formData.get('age') as string,
    weight: formData.get('weight') as string,
    
    // Owner data
    ownerName: formData.get('ownerName') as string,
    ownerEmail: formData.get('ownerEmail') as string,
    ownerPhone: formData.get('ownerPhone') as string,
    ownerAddress: formData.get('ownerAddress') as string,
    
    // Veterinarian data
    veterinarianName: formData.get('veterinarianName') as string,
    clinicName: formData.get('clinicName') as string,
    veterinarianPhone: formData.get('veterinarianPhone') as string,
    
    // Anamnesis
    primaryComplaint: formData.get('primaryComplaint') as string,
    symptomDuration: formData.get('symptomDuration') as string,
    previousTreatments: formData.get('previousTreatments') as string,
    currentMedications: formData.get('currentMedications') as string,
    activityLevel: formData.get('activityLevel') as string,
    behaviorChanges: formData.get('behaviorChanges') as string,
    
    // Environmental conditions
    ambientTemperature: formData.get('ambientTemperature') as string,
    humidity: formData.get('humidity') as string,
    lastActivity: formData.get('lastActivity') as string,
    acclimationTime: formData.get('acclimationTime') as string,
    skinCondition: formData.get('skinCondition') as string,
    
    // Symptoms
    tailSwishing: formData.get('tailSwishing') === 'on',
    behaviorResistance: formData.get('behaviorResistance') === 'on',
    sensitiveBrushing: formData.get('sensitiveBrushing') === 'on',
    reluctantBending: formData.get('reluctantBending') === 'on',
    performanceDrop: formData.get('performanceDrop') === 'on',
    gaitIrregularity: formData.get('gaitIrregularity') === 'on',
  };
  
  // Basic validation
  if (!data.patientName || !data.species || !data.primaryComplaint) {
    return {
      ...data,
      errors: 'Vul alle verplichte velden in (patiëntnaam, diersoort, hoofdklacht)'
    };
  }
  
  // Success
  console.log('Patient form submitted:', data);
  return data;
}

export function VTMAPatientForm() {
  const [state, formAction, isPending] = useActionState(submitPatientForm, {
    patientName: '',
    patientId: '',
    species: '',
    breed: '',
    gender: '',
    age: '',
    weight: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerAddress: '',
    veterinarianName: '',
    clinicName: '',
    veterinarianPhone: '',
    primaryComplaint: '',
    symptomDuration: '',
    previousTreatments: '',
    currentMedications: '',
    activityLevel: '',
    behaviorChanges: '',
    ambientTemperature: '',
    humidity: '',
    lastActivity: '',
    acclimationTime: '',
    skinCondition: '',
    tailSwishing: false,
    behaviorResistance: false,
    sensitiveBrushing: false,
    reluctantBending: false,
    performanceDrop: false,
    gaitIrregularity: false,
  });

  return (
    <form action={formAction} className="space-y-8">
      {state.errors && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{state.errors}</AlertDescription>
        </Alert>
      )}

      {/* Patiënt Identificatie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Patiënt Identificatie</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patiëntnaam *</Label>
            <Input
              id="patientName"
              name="patientName"
              placeholder="Bijv. Bella, Thunder"
              defaultValue={state.patientName}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="patientId">Patiënt ID</Label>
            <Input
              id="patientId"
              name="patientId"
              placeholder="Chip/tattoo nummer"
              defaultValue={state.patientId}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="species">Diersoort *</Label>
            <Select name="species" defaultValue={state.species}>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer diersoort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paard">Paard</SelectItem>
                <SelectItem value="hond">Hond</SelectItem>
                <SelectItem value="kat">Kat</SelectItem>
                <SelectItem value="rund">Rund</SelectItem>
                <SelectItem value="schaap">Schaap</SelectItem>
                <SelectItem value="geit">Geit</SelectItem>
                <SelectItem value="varken">Varken</SelectItem>
                <SelectItem value="anders">Anders</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="breed">Ras</Label>
            <Input
              id="breed"
              name="breed"
              placeholder="Bijv. KWPN, Duitse Herder"
              defaultValue={state.breed}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Geslacht</Label>
            <Select name="gender" defaultValue={state.gender}>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer geslacht" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reu">Reu/Hengst</SelectItem>
                <SelectItem value="teef">Teef/Merrie</SelectItem>
                <SelectItem value="gecastreerd">Gecastreerd/Ruin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Leeftijd</Label>
            <Input
              id="age"
              name="age"
              placeholder="Bijv. 8 jaar, 3 maanden"
              defaultValue={state.age}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Gewicht</Label>
            <Input
              id="weight"
              name="weight"
              placeholder="Bijv. 500kg, 25kg"
              defaultValue={state.weight}
            />
          </div>
        </CardContent>
      </Card>

      {/* Eigenaar Contactgegevens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="w-5 h-5" />
            <span>Eigenaar Contactgegevens</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Naam Eigenaar</Label>
            <Input
              id="ownerName"
              name="ownerName"
              placeholder="Voor- en achternaam"
              defaultValue={state.ownerName}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ownerEmail">E-mail</Label>
            <Input
              id="ownerEmail"
              name="ownerEmail"
              type="email"
              placeholder="eigenaar@email.com"
              defaultValue={state.ownerEmail}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ownerPhone">Telefoon</Label>
            <Input
              id="ownerPhone"
              name="ownerPhone"
              placeholder="+31 6 12345678"
              defaultValue={state.ownerPhone}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ownerAddress">Adres</Label>
            <Textarea
              id="ownerAddress"
              name="ownerAddress"
              placeholder="Straat, huisnummer, postcode, plaats"
              defaultValue={state.ownerAddress}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Verwijzend Dierenarts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5" />
            <span>Verwijzend Dierenarts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="veterinarianName">Naam Dierenarts</Label>
            <Input
              id="veterinarianName"
              name="veterinarianName"
              placeholder="Dr. Naam"
              defaultValue={state.veterinarianName}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clinicName">Praktijk/Kliniek</Label>
            <Input
              id="clinicName"
              name="clinicName"
              placeholder="Naam van de praktijk"
              defaultValue={state.clinicName}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="veterinarianPhone">Telefoon</Label>
            <Input
              id="veterinarianPhone"
              name="veterinarianPhone"
              placeholder="+31 XX XXX XXXX"
              defaultValue={state.veterinarianPhone}
            />
          </div>
        </CardContent>
      </Card>

      {/* Anamnese en Hoofdklacht */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ClipboardList className="w-5 h-5" />
            <span>Anamnese en Hoofdklacht</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryComplaint">Hoofdklacht *</Label>
            <Textarea
              id="primaryComplaint"
              name="primaryComplaint"
              placeholder="Beschrijf de primaire klacht (bijv. kreupelheid, verzet, prestatieverval)"
              defaultValue={state.primaryComplaint}
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symptomDuration">Duur van Symptomen</Label>
              <Select name="symptomDuration" defaultValue={state.symptomDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer duur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acuut">Acuut (&lt; 1 week)</SelectItem>
                  <SelectItem value="subacuut">Subacuut (1-4 weken)</SelectItem>
                  <SelectItem value="chronisch">Chronisch (&gt; 4 weken)</SelectItem>
                  <SelectItem value="intermitterend">Intermitterend</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activiteitsniveau</Label>
              <Select name="activityLevel" defaultValue={state.activityLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rust">Alleen rust/weide</SelectItem>
                  <SelectItem value="licht">Lichte training</SelectItem>
                  <SelectItem value="matig">Matige training</SelectItem>
                  <SelectItem value="intensief">Intensieve training</SelectItem>
                  <SelectItem value="competitie">Competitie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="previousTreatments">Eerdere Behandelingen</Label>
            <Textarea
              id="previousTreatments"
              name="previousTreatments"
              placeholder="Beschrijf eerdere behandelingen, onderzoeken en resultaten"
              defaultValue={state.previousTreatments}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currentMedications">Huidige Medicatie</Label>
            <Textarea
              id="currentMedications"
              name="currentMedications"
              placeholder="Lijst huidige medicijnen en supplementen"
              defaultValue={state.currentMedications}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Specifieke Gedragssignalen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Specifieke Gedragssignalen (Praktijk Healthy Horse)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tailSwishing" 
                name="tailSwishing"
                defaultChecked={state.tailSwishing}
              />
              <Label htmlFor="tailSwishing">Staartzwiepen tijdens hulpen</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="behaviorResistance" 
                name="behaviorResistance"
                defaultChecked={state.behaviorResistance}
              />
              <Label htmlFor="behaviorResistance">Verzet tijdens werk</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sensitiveBrushing" 
                name="sensitiveBrushing"
                defaultChecked={state.sensitiveBrushing}
              />
              <Label htmlFor="sensitiveBrushing">Gevoelig bij borstelen</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="reluctantBending" 
                name="reluctantBending"
                defaultChecked={state.reluctantBending}
              />
              <Label htmlFor="reluctantBending">Moeite met buigen</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="performanceDrop" 
                name="performanceDrop"
                defaultChecked={state.performanceDrop}
              />
              <Label htmlFor="performanceDrop">Prestatieverlies</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="gaitIrregularity" 
                name="gaitIrregularity"
                defaultChecked={state.gaitIrregularity}
              />
              <Label htmlFor="gaitIrregularity">Onregelmatige gang</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 min-w-48"
        >
          <Save className="w-4 h-4 mr-2" />
          {isPending ? 'Opslaan...' : 'Patiëntgegevens Opslaan'}
        </Button>
      </div>

      {state.patientName && !state.errors && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Patiëntgegevens voor <strong>{state.patientName}</strong> succesvol opgeslagen!
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}