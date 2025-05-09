
import { FolderOpen, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FolderItemProps {
  id: string;
  name: string;
  createdAt?: string;
  onRename: (id: string, currentName: string) => void;
  onDelete?: (id: string) => void;
  view: 'grid' | 'list';
}

export function FolderItem({ id, name, createdAt, onRename, onDelete, view }: FolderItemProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/folder/${id}`);
  };
  
  if (view === 'grid') {
    return (
      <div 
        className="bg-white rounded-lg border shadow-sm p-3 flex flex-col hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center justify-center bg-gray-50 rounded-md p-3 w-full h-24">
            <FolderOpen size={40} className="text-drive-blue" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:opacity-100"
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem 
                className="cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(id, name);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-1 px-1">
          <p className="text-sm font-medium truncate" title={name}>{name}</p>
          {createdAt && (
            <p className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-white rounded-lg border p-2 flex items-center hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="mr-3">
        <FolderOpen size={24} className="text-drive-blue" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" title={name}>{name}</p>
        {createdAt && (
          <p className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                onRename(id, name);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            {onDelete && (
              <DropdownMenuItem 
                className="cursor-pointer text-red-500" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
              >
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
