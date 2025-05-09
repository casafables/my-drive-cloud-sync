
import { useState, useEffect } from 'react';
import { FileItem } from './FileItem';
import { FolderItem } from './FolderItem';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { RenameModal } from './RenameModal';
import { NewFolderModal } from './NewFolderModal';
import { FileUpload } from './FileUpload';
import { fileApi } from '@/api/apiClient';
import { useToast } from '@/hooks/use-toast';
import { 
  FolderOpen, 
  Upload, 
  LayoutGrid, 
  List, 
  RefreshCw, 
  Plus 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface File {
  id: string;
  name: string;
  size?: number;
  createdAt: string;
}

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

interface FileExplorerProps {
  folderId?: string;
  folderName?: string;
}

export function FileExplorer({ folderId, folderName }: FileExplorerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<{id: string | null; name: string}[]>([
    { id: null, name: 'My Drive' }
  ]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{id: string; name: string} | null>(null);
  const { toast } = useToast();

  // Update breadcrumbs when folder changes
  useEffect(() => {
    if (folderId && folderName) {
      setBreadcrumbs([
        { id: null, name: 'My Drive' },
        { id: folderId, name: folderName }
      ]);
    } else {
      setBreadcrumbs([{ id: null, name: 'My Drive' }]);
    }
  }, [folderId, folderName]);

  // Load files and folders
  const loadFilesAndFolders = async () => {
    setIsLoading(true);
    try {
      const response = await fileApi.getFolder(folderId);
      // Backend currently returns empty arrays, but we'll handle real data when available
      setFiles(response.data.files || []);
      setFolders(response.data.folders || []);
    } catch (error) {
      console.error('Error loading files and folders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load files and folders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFilesAndFolders();
  }, [folderId]);

  // Placeholder data for demo purposes
  useEffect(() => {
    // This data is just for UI demonstration since the backend endpoints return empty arrays
    const dummyFiles = [
      { id: 'file1', name: 'Project Proposal.pdf', size: 1024 * 1024 * 2.5, createdAt: '2023-06-15T10:30:00Z' },
      { id: 'file2', name: 'Budget Spreadsheet.xlsx', size: 1024 * 512, createdAt: '2023-06-14T14:15:00Z' },
      { id: 'file3', name: 'Meeting Notes.docx', size: 1024 * 256, createdAt: '2023-06-13T09:45:00Z' },
      { id: 'file4', name: 'Product Mockup.png', size: 1024 * 1024 * 3.2, createdAt: '2023-06-12T16:20:00Z' },
    ];
    
    const dummyFolders = [
      { id: 'folder1', name: 'Documents', parentId: null, createdAt: '2023-06-10T08:00:00Z' },
      { id: 'folder2', name: 'Images', parentId: null, createdAt: '2023-06-09T11:30:00Z' },
      { id: 'folder3', name: 'Projects', parentId: null, createdAt: '2023-06-08T14:45:00Z' },
    ];
    
    // Only set placeholder data if we're not in a specific folder or if backend returns empty
    if (!folderId || files.length === 0) {
      setFiles(dummyFiles);
    }
    
    if (!folderId || folders.length === 0) {
      setFolders(dummyFolders);
    }
  }, [folderId, files.length, folders.length]);

  const handleRename = (id: string, currentName: string) => {
    setSelectedItem({ id, name: currentName });
    setIsRenameModalOpen(true);
  };

  const handleRefresh = () => {
    loadFilesAndFolders();
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb navigation */}
      <Breadcrumbs items={breadcrumbs} />
      
      {/* Action bar */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsNewFolderModalOpen(true)}
          >
            <FolderOpen className="mr-1 h-4 w-4" />
            New Folder
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="mr-1 h-4 w-4" />
            Upload
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'secondary' : 'outline'} 
            size="icon" 
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'secondary' : 'outline'} 
            size="icon" 
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {/* Mobile FAB for actions */}
      <div className="md:hidden fixed bottom-20 right-4 z-10">
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg bg-drive-blue hover:bg-blue-600"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Files and folders */}
      {viewMode === 'grid' ? (
        <div className="file-grid">
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              id={folder.id}
              name={folder.name}
              createdAt={folder.createdAt}
              onRename={handleRename}
              view={viewMode}
            />
          ))}
          {files.map((file) => (
            <FileItem
              key={file.id}
              id={file.id}
              name={file.name}
              size={file.size}
              createdAt={file.createdAt}
              onRename={handleRename}
              view={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              id={folder.id}
              name={folder.name}
              createdAt={folder.createdAt}
              onRename={handleRename}
              view={viewMode}
            />
          ))}
          {files.map((file) => (
            <FileItem
              key={file.id}
              id={file.id}
              name={file.name}
              size={file.size}
              createdAt={file.createdAt}
              onRename={handleRename}
              view={viewMode}
            />
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {folders.length === 0 && files.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No files or folders</h3>
          <p className="text-sm text-gray-500 max-w-md mt-1">
            Upload files or create folders to see them here
          </p>
          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsNewFolderModalOpen(true)}
            >
              <FolderOpen className="mr-1 h-4 w-4" />
              New Folder
            </Button>
            <Button 
              className="bg-drive-blue hover:bg-blue-600"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload className="mr-1 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
      )}
      
      {/* Modals */}
      <RenameModal 
        isOpen={isRenameModalOpen} 
        onClose={() => setIsRenameModalOpen(false)} 
        itemId={selectedItem?.id || ''} 
        currentName={selectedItem?.name || ''} 
        onRenameComplete={handleRefresh} 
      />
      
      <NewFolderModal 
        isOpen={isNewFolderModalOpen} 
        onClose={() => setIsNewFolderModalOpen(false)} 
        parentFolderId={folderId} 
        onFolderCreated={handleRefresh} 
      />
      
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <FileUpload 
            parentFolderId={folderId}
            onUploadComplete={() => {
              setIsUploadModalOpen(false);
              handleRefresh();
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
