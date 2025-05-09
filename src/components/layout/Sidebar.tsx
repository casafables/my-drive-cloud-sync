
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  FolderOpen,
  File,
  Upload
} from "lucide-react";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const navItems: NavItem[] = [
    {
      title: "Home",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "My Files",
      icon: File,
      href: "/dashboard/files",
    },
    {
      title: "Folders",
      icon: FolderOpen,
      href: "/dashboard/folders",
    },
    {
      title: "Upload",
      icon: Upload,
      href: "/dashboard/upload",
    },
  ];
  
  const handleNavigation = (href: string) => {
    navigate(href);
    if (isMobile) {
      setCollapsed(true);
    }
  };
  
  if (collapsed && isMobile) {
    return (
      <div className="fixed bottom-0 left-0 z-40 w-full bg-white border-t shadow-md safe-area">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center px-2 py-1 rounded-lg transition-colors",
                location.pathname === item.href
                  ? "bg-drive-blue/10 text-drive-blue"
                  : "text-gray-600 hover:text-drive-blue"
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.title}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        "h-screen border-r bg-sidebar transition-all duration-300 sticky top-0 left-0 z-30 safe-area",
        collapsed ? "w-16" : "sidebar-width"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        {!collapsed && (
          <div className="font-bold text-lg text-drive-blue">Drive</div>
        )}
      </div>
      <div className="space-y-2 py-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start px-4",
              location.pathname === item.href
                ? "bg-drive-blue/10 text-drive-blue"
                : "text-gray-600 hover:text-drive-blue"
            )}
            onClick={() => handleNavigation(item.href)}
          >
            <item.icon className="mr-2" size={18} />
            {!collapsed && <span>{item.title}</span>}
          </Button>
        ))}
      </div>
    </div>
  );
}
