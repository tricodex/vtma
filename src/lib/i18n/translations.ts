export const translations = {
  nl: {
    common: {
      // Actions
      save: 'Opslaan',
      cancel: 'Annuleren',
      delete: 'Verwijderen',
      edit: 'Bewerken',
      view: 'Bekijken',
      download: 'Downloaden',
      upload: 'Uploaden',
      search: 'Zoeken',
      filter: 'Filteren',
      add: 'Toevoegen',
      new: 'Nieuw',
      back: 'Terug',
      next: 'Volgende',
      previous: 'Vorige',
      close: 'Sluiten',
      help: 'Hulp',
      share: 'Delen',
      
      // Status
      loading: 'Laden...',
      error: 'Fout',
      success: 'Succes',
      warning: 'Waarschuwing',
      info: 'Informatie',
      
      // Common words
      yes: 'Ja',
      no: 'Nee',
      or: 'of',
      and: 'en',
      from: 'van',
      to: 'tot',
      with: 'met',
      without: 'zonder',
      for: 'voor',
      all: 'Alle',
      none: 'Geen',
      optional: 'Optioneel',
      required: 'Verplicht',
    },
    
    header: {
      title: 'Veterinaire Thermografie',
      subtitle: 'Geautomatiseerd Analyse & Rapportage Systeem',
    },
    
    sidebar: {
      mainMenu: 'Hoofd Menu',
      system: 'Systeem',
      
      workflow: {
        label: 'Workflow',
        description: 'Upload, Patiënt & Rapport',
      },
      patients: {
        label: 'Patiënten',
        description: 'Patiënt overzicht',
      },
      reports: {
        label: 'Rapporten',
        description: 'Gegenereerde rapporten',
      },
      analytics: {
        label: 'Analyse',
        description: 'Statistieken & trends',
      },
      calendar: {
        label: 'Planning',
        description: 'Afspraken & planning',
      },
      aiChat: {
        label: 'AI Assistent',
        description: 'Chat met AI over thermografie',
      },
      settings: 'Instellingen',
      help: 'Hulp',
      
      vtma: 'VTMA',
      thermographySystem: 'Thermografie Systeem',
    },
    
    workflow: {
      title: 'Thermografie Workflow',
      subtitle: 'Complete workflow voor rapportage',
      
      steps: {
        uploadImages: {
          title: '1. Upload Thermografische Beelden',
          description: 'Upload thermografische beelden voor analyse',
        },
        patientForm: {
          title: '2. Patiënt Formulier',
          description: 'Vul patiëntgegevens en anamnese in',
        },
        generateReport: {
          title: '3. Genereer Rapport',
          description: 'AI-analyse en rapportgeneratie',
        },
      },
      
      selectPatient: 'Selecteer patiënt',
      selectOrAddPatient: 'Kies bestaande patiënt of voeg nieuwe toe',
      searchPatients: 'Zoek op naam, nummer, ras...',
      addNewPatient: 'Nieuwe patiënt toevoegen',
      patientSelected: 'Patiënt geselecteerd',
      noPatientSelected: 'Geen patiënt geselecteerd',
      allAnimals: 'Alle dieren',
      horses: 'Paarden',
      dogs: 'Honden',
      cats: 'Katten',
      cattle: 'Runderen',
      noMatchingPatients: 'Geen patiënten gevonden',
      showActivePatients: 'Toon alleen actieve patiënten',
    },
    
    patientsView: {
      title: 'Patiënten Overzicht',
      subtitle: 'Overzicht van alle geregistreerde patiënten',
      newPatient: 'Nieuwe Patiënt',
      demoMode: 'DEMO MODUS',
      demoNotice: 'Hieronder worden voorbeeldpatiënten getoond voor demonstratiedoeleinden',
      demo: 'DEMO',
      gender: 'Geslacht',
      age: 'Leeftijd',
      owner: 'Eigenaar',
      veterinarian: 'Dierenarts',
    },
    
    patient: {
      // Patient form sections
      identification: 'Patiënt Identificatie',
      owner: 'Eigenaar Gegevens',
      veterinarian: 'Verwijzend Dierenarts',
      anamnesis: 'Anamnese',
      examinationConditions: 'Onderzoeksomstandigheden',
      specificSymptoms: 'Specifieke Symptomen',
      
      // Fields
      patientNumber: 'Patiëntnummer',
      patientName: 'Patiëntnaam',
      patientId: 'Patiënt ID',
      species: 'Diersoort',
      breed: 'Ras',
      gender: 'Geslacht',
      age: 'Leeftijd',
      weight: 'Gewicht',
      
      ownerName: 'Naam eigenaar',
      ownerEmail: 'E-mail eigenaar',
      ownerPhone: 'Telefoon eigenaar',
      ownerAddress: 'Adres eigenaar',
      
      veterinarianName: 'Naam dierenarts',
      clinicName: 'Naam kliniek',
      veterinarianPhone: 'Telefoon dierenarts',
      
      primaryComplaint: 'Hoofdklacht',
      symptomDuration: 'Duur symptomen',
      previousTreatments: 'Eerdere behandelingen',
      currentMedications: 'Huidige medicatie',
      activityLevel: 'Activiteitsniveau',
      behaviorChanges: 'Gedragsveranderingen',
      
      ambientTemperature: 'Omgevingstemperatuur',
      humidity: 'Luchtvochtigheid',
      lastActivity: 'Laatste activiteit',
      acclimationTime: 'Acclimatisatietijd',
      skinCondition: 'Huidconditie',
      
      // Symptoms
      tailSwishing: 'Staart zwiepen',
      behaviorResistance: 'Weerstand bij handelingen',
      sensitiveBrushing: 'Gevoelig bij borstelen',
      reluctantBending: 'Onwillig bij buigen',
      performanceDrop: 'Prestatievermindering',
      gaitIrregularity: 'Onregelmatige gang',
      
      // Values
      male: 'Mannelijk',
      female: 'Vrouwelijk',
      gelding: 'Ruin',
      
      // Messages
      formValidationError: 'Vul alle verplichte velden in (patiëntnaam, diersoort, hoofdklacht)',
      patientCreated: 'Patiënt aangemaakt',
      patientUpdated: 'Patiënt bijgewerkt',
      patientDeleted: 'Patiënt verwijderd',
    },
    
    report: {
      title: 'Thermografie Rapport',
      generateReport: 'Genereer Rapport',
      generating: 'Rapport genereren...',
      downloadPDF: 'Download PDF',
      saveReport: 'Rapport Opslaan',
      saved: 'Rapport opgeslagen',
      
      noImages: 'Upload eerst thermografische beelden',
      noPatient: 'Selecteer eerst een patiënt',
      noReportAvailable: 'Geen rapport beschikbaar voor PDF export',
      
      startAnalysis: 'Start Thermografische Analyse',
      analyzing: 'Analyseert...',
      uploadImagesFirst: 'Upload thermografische beelden om AI-analyse te starten',
      analysisLinkedTo: 'Analyse wordt gekoppeld aan patiënt',
      analysisResults: 'Analyse Resultaten',
      reportSavedFor: 'Rapport succesvol opgeslagen voor patiënt',
      analysisFailed: 'Analyse voltooid maar rapport kon niet worden opgeslagen',
      unexpectedResponse: 'Onverwachte response structuur van API',
      errorAnalyzing: 'Fout bij het analyseren van de afbeeldingen',
      
      sections: {
        patientIdentification: 'Patiënt Identificatie',
        anamnesis: 'Anamnese',
        protocolConditions: 'Protocol Condities',
        thermographicFindings: 'Thermografische Bevindingen',
        interpretation: 'Interpretatie',
        recommendations: 'Aanbevelingen',
        differentialDiagnoses: 'Differentiaal Diagnoses',
      },
      
      urgency: {
        label: 'Urgentie',
        routine: 'Routine',
        urgent: 'Urgent',
        immediate: 'Onmiddellijk',
      },
      
      confidence: 'Betrouwbaarheid',
      analysisComplete: 'Analyse voltooid',
      errorGenerating: 'Fout bij het genereren van rapport',
      
      thermographicAreas: 'Thermografische Gebieden',
      variable: 'Variabel',
      normal: 'normaal',
      elevated: 'verhoogd',
      abnormal: 'afwijkend',
    },
    
    upload: {
      title: 'Thermografische Beelden',
      dropzone: 'Sleep beelden hierheen of klik om te selecteren',
      dropHere: 'Sleep bestanden hier',
      uploadTitle: 'Thermografische beelden uploaden',
      uploadDescription: 'Sleep thermografische beelden hier of klik om te selecteren',
      acceptedFormats: 'Ondersteunde formaten: JPG, PNG, TIFF (Max 50MB per bestand)',
      uploading: 'Uploaden...',
      uploaded: 'geüpload',
      error: 'Upload mislukt',
      removeImage: 'Verwijder afbeelding',
      viewImage: 'Bekijk afbeelding',
      uploadedFiles: 'Geüploade Bestanden',
      complete: 'Compleet',
      quality: 'Kwaliteit',
      guidelines: 'Richtlijnen voor optimale beeldkwaliteit',
      guidelinesList: [
        'Gebruik een gecalibreerde infraroodcamera (min. 320x240 resolutie)',
        'Zorg voor stabiele omgevingstemperatuur (18-24°C)',
        'Vermijd directe zonlicht en tocht',
        'Laat het dier 15-30 minuten acclimatiseren',
        'Stel emissiviteit in op 0.98 voor dierenhuid'
      ],
    },
    
    error: {
      generic: 'Er is een fout opgetreden',
      networkError: 'Netwerkfout',
      validationError: 'Validatiefout',
      notFound: 'Niet gevonden',
      unauthorized: 'Niet geautoriseerd',
      serverError: 'Serverfout',
    },
    
    aiChat: {
      title: 'Thermografie Assistent',
      pageTitle: 'Thermografie Assistent',
      pageSubtitle: 'Stel vragen over thermografie rapporten en kennis',
      greeting: `Hallo! Ik ben uw AI-assistent voor thermografie. Ik kan u helpen met:

• **Vragen over thermografie rapporten** - Zoek informatie in bestaande rapporten
• **Kennis over thermografie** - Gebruik de documentenbibliotheek met thermografie expertise
• **Patiënt-specifieke analyses** - Als u een patiënt geselecteerd heeft
• **Vergelijkende studies** - Zoek naar vergelijkbare gevallen

Stel gerust uw vraag!`,
      patientContextActive: 'Patiënt context actief',
      sourcesFound: 'bronnen gevonden',
      thinking: 'AI denkt na...',
      placeholder: 'Stel een vraag over thermografie...',
      errorOccurred: 'Sorry, er is een fout opgetreden. Probeer het opnieuw.',
      errorGenerating: 'Sorry, ik kan momenteel geen antwoord genereren. Probeer het later opnieuw.',
      addKnowledge: 'Kennis',
      uploadDocuments: 'Upload Documenten',
      uploadDescription: 'Sleep PDF documenten hierheen of klik om te selecteren',
      supportedFormats: 'Ondersteunde formaten: PDF, TXT (Max 10MB per bestand)',
      processing: 'Verwerken...',
      uploadSuccess: 'Document succesvol toegevoegd aan kennisbank',
      uploadError: 'Fout bij het uploaden van document',
      processingDocument: 'Document verwerken en indexeren...',
      documentsUploaded: 'documenten geüpload',
      closeModal: 'Sluiten',
    },
  },
  
  en: {
    common: {
      // Actions
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      download: 'Download',
      upload: 'Upload',
      search: 'Search',
      filter: 'Filter',
      add: 'Add',
      new: 'New',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      help: 'Help',
      share: 'Share',
      
      // Status
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      
      // Common words
      yes: 'Yes',
      no: 'No',
      or: 'or',
      and: 'and',
      from: 'from',
      to: 'to',
      with: 'with',
      without: 'without',
      for: 'for',
      all: 'All',
      none: 'None',
      optional: 'Optional',
      required: 'Required',
    },
    
    header: {
      title: 'Veterinary Thermography',
      subtitle: 'Automated Analysis & Reporting System',
    },
    
    sidebar: {
      mainMenu: 'Main Menu',
      system: 'System',
      
      workflow: {
        label: 'Workflow',
        description: 'Upload, Patient & Report',
      },
      patients: {
        label: 'Patients',
        description: 'Patient overview',
      },
      reports: {
        label: 'Reports',
        description: 'Generated reports',
      },
      analytics: {
        label: 'Analytics',
        description: 'Statistics & trends',
      },
      calendar: {
        label: 'Calendar',
        description: 'Appointments & planning',
      },
      aiChat: {
        label: 'Assistant',
        description: 'Thermography Assistant',
      },
      settings: 'Settings',
      help: 'Help',
      
      vtma: 'VTMA',
      thermographySystem: 'Thermography System',
    },
    
    workflow: {
      title: 'Thermography Workflow',
      subtitle: 'Complete workflow for reporting',
      
      steps: {
        uploadImages: {
          title: '1. Upload Thermographic Images',
          description: 'Upload thermographic images for analysis',
        },
        patientForm: {
          title: '2. Patient Form',
          description: 'Fill in patient data and anamnesis',
        },
        generateReport: {
          title: '3. Generate Report',
          description: 'AI analysis and report generation',
        },
      },
      
      selectPatient: 'Select patient',
      selectOrAddPatient: 'Choose existing patient or add new one',
      searchPatients: 'Search by name, number, breed...',
      addNewPatient: 'Add new patient',
      patientSelected: 'Patient selected',
      noPatientSelected: 'No patient selected',
      allAnimals: 'All animals',
      horses: 'Horses',
      dogs: 'Dogs',
      cats: 'Cats',
      cattle: 'Cattle',
      noMatchingPatients: 'No patients found',
      showActivePatients: 'Show only active patients',
    },
    
    patientsView: {
      title: 'Patients Overview',
      subtitle: 'Overview of all registered patients',
      newPatient: 'New Patient',
      demoMode: 'DEMO MODE',
      demoNotice: 'Sample patients are shown below for demonstration purposes',
      demo: 'DEMO',
      gender: 'Gender',
      age: 'Age',
      owner: 'Owner',
      veterinarian: 'Veterinarian',
    },
    
    patient: {
      // Patient form sections
      identification: 'Patient Identification',
      owner: 'Owner Details',
      veterinarian: 'Referring Veterinarian',
      anamnesis: 'Anamnesis',
      examinationConditions: 'Examination Conditions',
      specificSymptoms: 'Specific Symptoms',
      
      // Fields
      patientNumber: 'Patient Number',
      patientName: 'Patient Name',
      patientId: 'Patient ID',
      species: 'Species',
      breed: 'Breed',
      gender: 'Gender',
      age: 'Age',
      weight: 'Weight',
      
      ownerName: 'Owner Name',
      ownerEmail: 'Owner Email',
      ownerPhone: 'Owner Phone',
      ownerAddress: 'Owner Address',
      
      veterinarianName: 'Veterinarian Name',
      clinicName: 'Clinic Name',
      veterinarianPhone: 'Veterinarian Phone',
      
      primaryComplaint: 'Primary Complaint',
      symptomDuration: 'Symptom Duration',
      previousTreatments: 'Previous Treatments',
      currentMedications: 'Current Medications',
      activityLevel: 'Activity Level',
      behaviorChanges: 'Behavior Changes',
      
      ambientTemperature: 'Ambient Temperature',
      humidity: 'Humidity',
      lastActivity: 'Last Activity',
      acclimationTime: 'Acclimation Time',
      skinCondition: 'Skin Condition',
      
      // Symptoms
      tailSwishing: 'Tail Swishing',
      behaviorResistance: 'Behavior Resistance',
      sensitiveBrushing: 'Sensitive to Brushing',
      reluctantBending: 'Reluctant to Bend',
      performanceDrop: 'Performance Drop',
      gaitIrregularity: 'Gait Irregularity',
      
      // Values
      male: 'Male',
      female: 'Female',
      gelding: 'Gelding',
      
      // Messages
      formValidationError: 'Please fill in all required fields (patient name, species, primary complaint)',
      patientCreated: 'Patient created',
      patientUpdated: 'Patient updated',
      patientDeleted: 'Patient deleted',
    },
    
    report: {
      title: 'Thermography Report',
      generateReport: 'Generate Report',
      generating: 'Generating report...',
      downloadPDF: 'Download PDF',
      saveReport: 'Save Report',
      saved: 'Report saved',
      
      noImages: 'Please upload thermographic images first',
      noPatient: 'Please select a patient first',
      noReportAvailable: 'No report available for PDF export',
      
      startAnalysis: 'Start Thermographic Analysis',
      analyzing: 'Analyzing...',
      uploadImagesFirst: 'Upload thermographic images to start AI analysis',
      analysisLinkedTo: 'Analysis will be linked to patient',
      analysisResults: 'Analysis Results',
      reportSavedFor: 'Report successfully saved for patient',
      analysisFailed: 'Analysis completed but report could not be saved',
      unexpectedResponse: 'Unexpected response structure from API',
      errorAnalyzing: 'Error analyzing the images',
      
      sections: {
        patientIdentification: 'Patient Identification',
        anamnesis: 'Anamnesis',
        protocolConditions: 'Protocol Conditions',
        thermographicFindings: 'Thermographic Findings',
        interpretation: 'Interpretation',
        recommendations: 'Recommendations',
        differentialDiagnoses: 'Differential Diagnoses',
      },
      
      urgency: {
        label: 'Urgency',
        routine: 'Routine',
        urgent: 'Urgent',
        immediate: 'Immediate',
      },
      
      confidence: 'Confidence',
      analysisComplete: 'Analysis complete',
      errorGenerating: 'Error generating report',
      
      thermographicAreas: 'Thermographic Areas',
      variable: 'Variable',
      normal: 'normal',
      elevated: 'elevated',
      abnormal: 'abnormal',
    },
    
    upload: {
      title: 'Thermographic Images',
      dropzone: 'Drag images here or click to select',
      dropHere: 'Drop files here',
      uploadTitle: 'Upload thermographic images',
      uploadDescription: 'Drop thermographic images here or click to select',
      acceptedFormats: 'Supported formats: JPG, PNG, TIFF (Max 50MB per file)',
      uploading: 'Uploading...',
      uploaded: 'uploaded',
      error: 'Upload failed',
      removeImage: 'Remove image',
      viewImage: 'View image',
      uploadedFiles: 'Uploaded Files',
      complete: 'Complete',
      quality: 'Quality',
      guidelines: 'Guidelines for optimal image quality',
      guidelinesList: [
        'Use a calibrated infrared camera (min. 320x240 resolution)',
        'Ensure stable ambient temperature (18-24°C)',
        'Avoid direct sunlight and drafts',
        'Allow the animal to acclimatize for 15-30 minutes',
        'Set emissivity to 0.98 for animal skin'
      ],
    },
    
    error: {
      generic: 'An error occurred',
      networkError: 'Network error',
      validationError: 'Validation error',
      notFound: 'Not found',
      unauthorized: 'Unauthorized',
      serverError: 'Server error',
    },
    
    aiChat: {
      title: 'Thermography Assistant',
      pageTitle: 'Thermography Assistant',
      pageSubtitle: 'Ask questions about thermography reports and knowledge',
      greeting: `Hello! I am your AI assistant for thermography. I can help you with:

• **Questions about thermography reports** - Search information in existing reports
• **Thermography knowledge** - Use the document library with thermography expertise
• **Patient-specific analyses** - If you have selected a patient
• **Comparative studies** - Search for similar cases

Feel free to ask your question!`,
      patientContextActive: 'Patient context active',
      sourcesFound: 'sources found',
      thinking: 'AI is thinking...',
      placeholder: 'Ask a question about thermography...',
      errorOccurred: 'Sorry, an error occurred. Please try again.',
      errorGenerating: 'Sorry, I cannot generate a response at the moment. Please try again later.',
      addKnowledge: 'Knowledge',
      uploadDocuments: 'Upload Documents',
      uploadDescription: 'Drag PDF documents here or click to select',
      supportedFormats: 'Supported formats: PDF, TXT (Max 10MB per file)',
      processing: 'Processing...',
      uploadSuccess: 'Document successfully added to knowledge base',
      uploadError: 'Error uploading document',
      processingDocument: 'Processing and indexing document...',
      documentsUploaded: 'documents uploaded',
      closeModal: 'Close',
    },
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.nl;