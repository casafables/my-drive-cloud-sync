
import { useState } from 'react';
import { File, MoreVertical, Download, Trash2, Pencil, FileText } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { fileApi } from '@/api/apiClient';
import { useToast } from '@/hooks/use-toast';
import { downloadBlob, formatFileSize, isImage } from '@/utils/fileUtils';

interface FileItemProps {
  id: string;
  name: string;
  size?: number;
  createdAt?: string;
  onRename: (id: string, currentName: string) => void;
  onDelete?: (id: string) => void;
  view: 'grid' | 'list';
}

export function FileItem({ id, name, size, createdAt, onRename, onDelete, view }: FileItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePreview = async () => {
    try {
      setIsLoading(true);
      const response = await fileApi.getPreviewUrl(id);
      const { previewUrl } = response.data;
      
      window.open(previewUrl, '_blank');
    } catch (error) {
      toast({
        title: 'Preview failed',
        description: 'Could not generate preview for this file',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const response = await fileApi.downloadFile(id);
      downloadBlob(response.data, name);
      toast({
        title: 'Download started',
        description: `${name} is being downloaded`,
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Could not download this file',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (view === 'grid') {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-3 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <div 
            className="flex items-center justify-center bg-gray-50 rounded-md p-3 w-full h-24"
            onClick={handlePreview}
          >
            <FileText size={40} className="text-drive-blue" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:opacity-100">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem className="cursor-pointer" onClick={handlePreview}>
                <FileText className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => onRename(id, name)}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem className="cursor-pointer text-red-500" onClick={() => onDelete(id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-1 px-1">
          <p className="text-sm font-medium truncate" title={name}>{name}</p>
          {size && (
            <p className="text-xs text-gray-500">{formatFileSize(size)}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-2 flex items-center hover:bg-gray-50 transition-colors">
      <div className="mr-3">
        <FileText size={24} className="text-drive-blue" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" title={name}>{name}</p>
        {size && (
          <p className="text-xs text-gray-500">{formatFileSize(size)}</p>
        )}
      </div>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
          <Download size={18} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem className="cursor-pointer" onClick={handlePreview}>
              <FileText className="mr-2 h-4 w-4" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => onRename(id, name)}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            {onDelete && (
              <DropdownMenuItem className="cursor-pointer text-red-500" onClick={() => onDelete(id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
