
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const navigate = useNavigate();
  
  const handleClick = (id: string | null) => {
    if (id === null) {
      navigate('/dashboard');
    } else {
      navigate(`/folder/${id}`);
    }
  };
  
  return (
    <div className="flex items-center space-x-1 text-sm text-gray-600 overflow-x-auto py-2">
      <button
        onClick={() => handleClick(null)}
        className="flex items-center hover:text-drive-blue"
      >
        <Home size={16} />
      </button>
      
      {items.map((item, index) => (
        <Fragment key={index}>
          <ChevronRight size={16} className="text-gray-400" />
          <button
            onClick={() => handleClick(item.id)}
            className="hover:text-drive-blue whitespace-nowrap"
          >
            {item.name}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
