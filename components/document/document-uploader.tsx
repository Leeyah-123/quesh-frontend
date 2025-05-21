'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  LinkIcon,
  File,
  X,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TiltCard } from '@/components/tilt-card';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSessionStore } from '@/store/session-store';
import { Card } from '../ui/card';

export function DocumentUploader() {
  const router = useRouter();
  const createSession = useSessionStore((state) => state.createSession);

  const [activeTab, setActiveTab] = useState<'file' | 'link'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<
    'idle' | 'uploading' | 'complete' | 'error'
  >('idle');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState('');
  const [isValidatingLink, setIsValidatingLink] = useState(false);
  const [linkPreview, setLinkPreview] = useState<{
    title: string;
    type: string;
    isValid: boolean;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndUploadFile(files[0]);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndUploadFile(files[0]);
    }
  };

  // Validate and upload file
  const validateAndUploadFile = (file: File) => {
    // Reset error state
    setError(null);

    // Check file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF or DOCX file.');
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    // Set file details
    setFileName(file.name);
    setFileSize(file.size);
    setFileType(file.type);

    // Start upload
    handleFileUpload(file);
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploadState('uploading');
    setUploadProgress(0);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      // Call API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Complete upload
      setUploadProgress(100);
      setUploadState('complete');

      // Create a new session
      const documentType = file.type.includes('pdf') ? 'pdf' : 'docx';
      const sessionId = createSession(file.name, documentType, file.size);

      // Navigate to document view after a short delay
      setTimeout(() => {
        router.push(`/document/${sessionId}`);
      }, 1000);
    } catch (err) {
      setUploadState('error');
      setError('Upload failed. Please try again.');
    }
  };

  // Handle link validation and upload
  const validateAndUploadLink = async () => {
    // Reset states
    setError(null);
    setIsValidatingLink(true);
    setLinkPreview(null);

    try {
      // Basic URL validation
      let url;
      try {
        url = new URL(link);
      } catch (e) {
        throw new Error('Invalid URL format');
      }

      // Check if URL ends with .pdf or .docx
      const isPdf = url.pathname.toLowerCase().endsWith('.pdf');
      const isDocx = url.pathname.toLowerCase().endsWith('.docx');

      if (!isPdf && !isDocx) {
        // For demo purposes, we'll still allow it but show a warning
        setLinkPreview({
          title: url.pathname.split('/').pop() || 'Document',
          type: 'Unknown',
          isValid: true,
        });
      } else {
        setLinkPreview({
          title: url.pathname.split('/').pop() || 'Document',
          type: isPdf ? 'PDF' : 'DOCX',
          isValid: true,
        });
      }

      setIsValidatingLink(false);
    } catch (err) {
      setIsValidatingLink(false);
      setError((err as Error).message || 'Invalid URL');
    }
  };

  // Handle link upload
  const handleLinkUpload = async () => {
    if (!linkPreview?.isValid) {
      validateAndUploadLink();
      return;
    }

    setUploadState('uploading');
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      // Call API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: link }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Complete upload
      setUploadProgress(100);
      setUploadState('complete');

      // Create a new session
      const documentTitle = linkPreview?.title || 'Document from URL';
      const documentType = linkPreview?.type.toLowerCase().includes('pdf')
        ? 'pdf'
        : 'docx';
      const sessionId = createSession(documentTitle, 'url', undefined, link);

      // Navigate to document view after a short delay
      setTimeout(() => {
        router.push(`/document/${sessionId}`);
      }, 1000);
    } catch (err) {
      setUploadState('error');
      setError('Upload failed. Please try again.');
    }
  };

  // Cancel upload
  const cancelUpload = () => {
    setUploadState('idle');
    setUploadProgress(0);
    setFileName('');
    setFileSize(0);
    setFileType('');
    setError(null);
    setLink('');
    setLinkPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {uploadState === 'idle' ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Tabs
              defaultValue="file"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'file' | 'link')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="file">Upload File</TabsTrigger>
                <TabsTrigger value="link">Paste Link</TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-4">
                {error && (
                  <Alert
                    variant="destructive"
                    className="bg-red-900/20 border-red-900 text-red-300"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Card>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/50'
                    }`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                    />

                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="bg-slate-800 p-3 rounded-full mb-4">
                          <Upload className="h-6 w-6 text-purple-400" />
                        </div>
                        <p className="text-sm mb-2">
                          <span className="font-semibold">Click to upload</span>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          PDF or DOCX (max 10MB)
                        </p>
                      </div>
                    </label>
                  </div>
                </Card>

                <p className="text-xs text-gray-400 text-center">
                  By uploading, you agree to our{' '}
                  <a href="#" className="text-purple-400 hover:underline">
                    Terms of Service
                  </a>
                </p>
              </TabsContent>

              <TabsContent value="link" className="space-y-4">
                {error && (
                  <Alert
                    variant="destructive"
                    className="bg-red-900/20 border-red-900 text-red-300"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="https://example.com/document.pdf"
                        value={link}
                        onChange={(e) => {
                          setLink(e.target.value);
                          setLinkPreview(null);
                        }}
                        className="bg-slate-800/50 border-slate-700 text-white pr-10"
                      />
                      {isValidatingLink && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={
                        linkPreview?.isValid
                          ? handleLinkUpload
                          : validateAndUploadLink
                      }
                      disabled={!link || isValidatingLink}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {linkPreview?.isValid ? 'Upload' : 'Validate'}
                    </Button>
                  </div>

                  {linkPreview && (
                    <TiltCard
                      intensity={8}
                      scale={1.02}
                      className="glass p-4 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="bg-slate-800 p-2 rounded mr-3">
                          <File className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">
                            {linkPreview.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {linkPreview.type}
                          </p>
                        </div>
                      </div>
                    </TiltCard>
                  )}

                  <p className="text-xs text-gray-400 text-center">
                    Supported formats: PDF, DOCX. Direct links only.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <div className="bg-slate-800 p-2 rounded mr-3">
                {activeTab === 'file' ? (
                  <File className="h-5 w-5 text-purple-400" />
                ) : (
                  <LinkIcon className="h-5 w-5 text-purple-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {activeTab === 'file'
                    ? fileName
                    : linkPreview?.title || 'Document'}
                </p>
                {activeTab === 'file' && (
                  <p className="text-xs text-gray-400">
                    {(fileSize / 1024 / 1024).toFixed(2)} MB •{' '}
                    {fileType === 'application/pdf' ? 'PDF' : 'DOCX'}
                  </p>
                )}
              </div>
              {uploadState === 'uploading' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={cancelUpload}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Progress value={uploadProgress} className="h-2" />
                {uploadState === 'uploading' && uploadProgress < 100 && (
                  <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
                    <div
                      className="h-full w-1/3 bg-white/10 animate-shimmer"
                      style={{ backgroundSize: '200% 100%' }}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  {uploadState === 'uploading'
                    ? `Uploading... ${uploadProgress}%`
                    : uploadState === 'complete'
                    ? 'Upload complete! Redirecting...'
                    : 'Upload failed'}
                </p>

                {uploadState === 'complete' && (
                  <div className="bg-green-500/20 p-1 rounded-full">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                )}

                {uploadState === 'error' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-purple-500/50 hover:bg-purple-500/10"
                    onClick={cancelUpload}
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </div>

            {uploadState === 'uploading' && (
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-2 items-center">
                  <div
                    className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
