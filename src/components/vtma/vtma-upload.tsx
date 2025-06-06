'use client';

import { useState, useCallback } from 'react';
import { useOptimistic } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileImage, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Thermometer,
  Camera,
  Settings
} from 'lucide-react';

interface VTMAUploadProps {
  onImagesUploaded: (images: string[]) => void;
  uploadedImages: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  url: string;
  base64: string; // Added for Gemini API compatibility
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  metadata?: {
    temperature?: string;
    emissivity?: string;
    distance?: string;
  };
}

export function VTMAUpload({ onImagesUploaded, uploadedImages }: VTMAUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // React 19.1 useOptimistic for immediate feedback
  const [optimisticFiles, setOptimisticFiles] = useOptimistic(
    files,
    (currentFiles, newFiles: UploadedFile[]) => [...currentFiles, ...newFiles]
  );

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Process files with base64 conversion
    const newFiles: UploadedFile[] = await Promise.all(
      acceptedFiles.map(async file => {
        const base64 = await fileToBase64(file);
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          url: URL.createObjectURL(file),
          base64: base64,
          type: file.type,
          status: 'uploading' as const,
          progress: 0,
          metadata: {
            temperature: '20°C',
            emissivity: '0.98',
            distance: '1.5m'
          }
        };
      })
    );

    // Optimistically add files immediately
    setOptimisticFiles(newFiles);
    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...f, progress: 100, status: 'completed' as const };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 200);
    });

    // Update parent component with base64 data for API compatibility
    const base64Images = newFiles.map(f => f.base64);
    onImagesUploaded([...uploadedImages, ...base64Images]);
  }, [uploadedImages, onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.tif'],
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    // Optimistically remove file for immediate feedback
    setOptimisticFiles(optimisticFiles.filter(f => f.id !== id));
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getThermalQuality = (fileName: string) => {
    // Mock thermal quality assessment
    const qualities = ['Uitstekend', 'Goed', 'Matig'];
    return qualities[Math.floor(Math.random() * qualities.length)];
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
            <Thermometer className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Sleep bestanden hier' : 'Thermografische beelden uploaden'}
            </h3>
            <p className="text-gray-600 mb-4">
              Sleep thermografische beelden hier of klik om te selecteren
            </p>
            <p className="text-sm text-gray-500">
              Ondersteunde formaten: JPG, PNG, TIFF (Max 50MB per bestand)
            </p>
          </div>
        </div>
      </div>

      {/* Upload Guidelines */}
      <Alert>
        <Camera className="h-4 w-4" />
        <AlertDescription>
          <strong>Richtlijnen voor optimale beeldkwaliteit:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Gebruik een gecalibreerde infraroodcamera (min. 320x240 resolutie)</li>
            <li>• Zorg voor stabiele omgevingstemperatuur (18-24°C)</li>
            <li>• Vermijd directe zonlicht en tocht</li>
            <li>• Laat het dier 15-30 minuten acclimatiseren</li>
            <li>• Stel emissiviteit in op 0.98 voor dierenhuid</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <FileImage className="w-5 h-5 mr-2" />
              Geüploade Bestanden ({files.length})
            </h4>
            <div className="space-y-4">
              {optimisticFiles.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </h5>
                      <div className="flex items-center space-x-2">
                        {file.status === 'completed' && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Compleet
                          </Badge>
                        )}
                        {file.status === 'error' && (
                          <Badge variant="destructive">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Error
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span className="mx-2">•</span>
                        <span>Kwaliteit: {getThermalQuality(file.name)}</span>
                      </div>
                      
                      {file.status === 'uploading' && (
                        <Progress value={file.progress} className="h-2" />
                      )}
                      
                      {file.metadata && file.status === 'completed' && (
                        <div className="flex space-x-4 text-xs text-gray-600">
                          <span>Temp: {file.metadata.temperature}</span>
                          <span>Emis: {file.metadata.emissivity}</span>
                          <span>Afstand: {file.metadata.distance}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Button */}
      {optimisticFiles.some(f => f.status === 'completed') && (
        <div className="flex justify-center">
          <Button
            onClick={() => setIsAnalyzing(!isAnalyzing)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            disabled={isAnalyzing}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'AI Analyseert...' : 'Analyse'}
          </Button>
        </div>
      )}
    </div>
  );
}