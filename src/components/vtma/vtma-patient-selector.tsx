'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  User, 
  Calendar, 
  Stethoscope,
  Heart,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import type { Patient } from '@/lib/types';

interface PatientSelectorProps {
  selectedPatient?: Patient | null;
  onPatientSelect: (patient: Patient | null) => void;
  onAddNew: () => void;
  className?: string;
}

export function PatientSelector({ 
  selectedPatient, 
  onPatientSelect, 
  onAddNew,
  className = "" 
}: PatientSelectorProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filterSpecies, setFilterSpecies] = useState<string>('all');

  // Fetch all patients from Convex
  const allPatientsQuery = useQuery(api.patients.getAll);
  const allPatients = useMemo(() => allPatientsQuery || [], [allPatientsQuery]);

  // Memoized filtered patients to prevent infinite loops
  const filteredPatients = useMemo(() => {
    let patients = allPatients;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      patients = patients.filter((patient: Patient) => 
        patient.patientName.toLowerCase().includes(lowerQuery) ||
        patient.patientNumber.toLowerCase().includes(lowerQuery) ||
        patient.breed.toLowerCase().includes(lowerQuery) ||
        patient.ownerName.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Filter by species
    if (filterSpecies !== 'all') {
      patients = patients.filter((patient: Patient) => patient.species === filterSpecies);
    }
    
    return patients;
  }, [allPatients, searchQuery, filterSpecies]);

  const getPatientInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatAge = (age: string): string => {
    return age.replace(' jaar', 'j').replace(' maanden', 'm');
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
    <div className={`relative ${className}`}>
      {/* Current Selection Display */}
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsOpen(!isOpen)}>
        <CardContent className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {selectedPatient ? (
                <>
                  <Avatar className="h-10 w-10 relative">
                    <AvatarImage src={selectedPatient.thumbnail} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm">
                      {getPatientInitials(selectedPatient.patientName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">
                        {selectedPatient.patientName}
                      </span>
                      <span className="text-lg">{getSpeciesEmoji(selectedPatient.species)}</span>
                      <Badge variant="outline" className={`${getGenderBadgeColor(selectedPatient.gender)} text-xs py-0 px-2`}>
                        {selectedPatient.gender}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {selectedPatient.patientNumber} • {selectedPatient.breed} • {formatAge(selectedPatient.age)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {selectedPatient.ownerName} • {selectedPatient.clinicName}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-600">{t('workflow.selectPatient')}</span>
                    <div className="text-sm text-gray-400">{t('workflow.selectOrAddPatient')}</div>
                  </div>
                </>
              )}
            </div>
            <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </div>
        </CardContent>
      </Card>

      {/* Dropdown Panel */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg border border-gray-200">
          <CardContent className="p-3">
            {/* Search and Filter Header */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('workflow.searchPatients') as string}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select value={filterSpecies} onValueChange={setFilterSpecies}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('workflow.allAnimals')}</SelectItem>
                      <SelectItem value="paard">{t('workflow.horses')}</SelectItem>
                      <SelectItem value="hond">{t('workflow.dogs')}</SelectItem>
                      <SelectItem value="kat">{t('workflow.cats')}</SelectItem>
                      <SelectItem value="rund">{t('workflow.cattle')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onAddNew();
                    setIsOpen(false);
                  }}
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('workflow.addNewPatient')}
                </Button>
              </div>
            </div>

            {/* Patient List */}
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>{t('workflow.noMatchingPatients')}</p>
                  <p className="text-sm">{t('common.search')}</p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient._id}
                    className={`p-2 rounded-lg border cursor-pointer transition-colors hover:bg-blue-50 hover:border-blue-200 ${
                      selectedPatient?._id === patient._id 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-white border-gray-200'
                    }`}
                    onClick={() => {
                      onPatientSelect(patient);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={patient.thumbnail} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                          {getPatientInitials(patient.patientName)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {patient.patientName}
                          </h4>
                          <span className="text-lg">{getSpeciesEmoji(patient.species)}</span>
                          <Badge variant="outline" className={getGenderBadgeColor(patient.gender)}>
                            {patient.gender}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span className="font-mono">{patient.patientNumber}</span>
                          <span>{patient.breed}</span>
                          <span>{formatAge(patient.age)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{patient.ownerName}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Stethoscope className="h-3 w-3" />
                            <span>{patient.clinicName}</span>
                          </span>
                          {(patient.tailSwishing || patient.behaviorResistance || patient.performanceDrop) && (
                            <div className="flex items-center space-x-1">
                              <Heart className="h-3 w-3 text-amber-500" />
                              <span className="text-amber-600">Actieve klachten</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(patient._creationTime).toLocaleDateString('nl-NL')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
