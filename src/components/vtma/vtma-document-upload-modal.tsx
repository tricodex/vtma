'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface VTMADocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

export function VTMADocumentUploadModal({
  isOpen,
  onClose,
  onUploadComplete,
}: VTMADocumentUploadModalProps) {
  const { t } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setIsUploading(true);

    // Process each file
    for (const [index, file] of acceptedFiles.entries()) {
      const uploadFile = newFiles[index];
      
      try {
        // Convert file to base64
        const base64 = await fileToBase64(file);
        
        // Update progress to show uploading
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, progress: 30, status: 'uploading' }
              : f
          )
        );

        // Upload to server
        const response = await fetch('/api/knowledge/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: file.name,
            content: base64,
            contentType: file.type,
          }),
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        // Update progress to show processing
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, progress: 60, status: 'processing' }
              : f
          )
        );

        const result = await response.json();

        // Update to success
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, progress: 100, status: 'success' }
              : f
          )
        );
      } catch (error) {
        console.error('Upload error:', error);
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? {
                  ...f,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Upload failed',
                }
              : f
          )
        );
      }
    }

    setIsUploading(false);
    onUploadComplete?.();
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading,
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:application/pdf;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Upload className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusText = (file: UploadedFile) => {
    switch (file.status) {
      case 'uploading':
        return t('upload.uploading');
      case 'processing':
        return t('aiChat.processingDocument');
      case 'success':
        return t('aiChat.uploadSuccess');
      case 'error':
        return file.error || t('aiChat.uploadError');
    }
  };

  const successCount = uploadedFiles.filter((f) => f.status === 'success').length;
  const hasErrors = uploadedFiles.some((f) => f.status === 'error');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span>{t('aiChat.uploadDocuments')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200
              ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 mb-2">{t('aiChat.uploadDescription')}</p>
            <p className="text-sm text-gray-500">{t('aiChat.supportedFormats')}</p>
          </div>

          {/* Success/Error Summary */}
          {successCount > 0 && !isUploading && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successCount} {t('aiChat.documentsUploaded')}
              </AlertDescription>
            </Alert>
          )}

          {hasErrors && !isUploading && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('aiChat.uploadError')}
              </AlertDescription>
            </Alert>
          )}

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    
                    {file.status === 'uploading' || file.status === 'processing' ? (
                      <div className="mt-1">
                        <Progress value={file.progress} className="h-1" />
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 mt-1">
                        {getStatusText(file)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusIcon(file.status)}
                    {file.status === 'success' || file.status === 'error' ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              {t('aiChat.closeModal')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}