
import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { fileApi } from '@/api/apiClient';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  parentFolderId?: string;
  onUploadComplete: () => void;
}

export function FileUpload({ parentFolderId, onUploadComplete }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB maximum file size for Cloudflare Worker
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 300);

      // Upload the file
      await fileApi.uploadFile(selectedFile);

      // Complete the upload progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: 'Upload successful',
        description: `${selectedFile.name} has been uploaded`,
      });

      // Reset the state
      setSelectedFile(null);
      onUploadComplete();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer flex flex-col items-center justify-center h-40 ${
          isDragActive ? 'border-drive-blue bg-blue-50' : 'border-gray-300 hover:border-drive-blue'
        }`}
      >
        <input {...getInputProps()} ref={fileInputRef} onChange={handleFileChange} />
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag & drop a file here, or click to browse'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
        </div>
      </div>

      {selectedFile && (
        <div className="p-3 bg-white border rounded-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium truncate">{selectedFile.name}</span>
            <span className="text-xs text-gray-500">
              {Math.round(selectedFile.size / 1024)} KB
            </span>
          </div>

          {uploading && (
            <Progress value={uploadProgress} className="h-1 mb-2" />
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFile(null)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleUpload}
              disabled={uploading}
              className="bg-drive-blue"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
