
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { FileExplorer } from "@/components/files/FileExplorer";
import { fileApi } from "@/api/apiClient";
import { useToast } from "@/hooks/use-toast";

export default function FolderPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const [folderName, setFolderName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Add safe area meta tag
  useEffect(() => {
    document.querySelector('meta[name="viewport"]')?.setAttribute(
      'content',
      'width=device-width, initial-scale=1, viewport-fit=cover'
    );
  }, []);

  useEffect(() => {
    const loadFolderDetails = async () => {
      if (!folderId) return;
      
      try {
        setLoading(true);
        const response = await fileApi.getFolder(folderId);
        
        if (response.data && response.data.folder) {
          setFolderName(response.data.folder.name);
        } else {
          // If the backend doesn't return folder details yet, use a placeholder
          setFolderName(`Folder ${folderId.substring(0, 6)}`);
        }
      } catch (error) {
        console.error("Error loading folder:", error);
        toast({
          title: "Error",
          description: "Failed to load folder details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadFolderDetails();
  }, [folderId]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 pb-20 md:pb-4 safe-area">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">{folderName}</h1>
            <FileExplorer folderId={folderId} folderName={folderName} />
          </div>
        </main>
      </div>
    </div>
  );
}
