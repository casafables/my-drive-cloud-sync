
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { FileExplorer } from "@/components/files/FileExplorer";
import { useEffect } from "react";

export default function DashboardPage() {
  // Add safe area meta tag
  useEffect(() => {
    document.querySelector('meta[name="viewport"]')?.setAttribute(
      'content',
      'width=device-width, initial-scale=1, viewport-fit=cover'
    );
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 pb-20 md:pb-4 safe-area">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">My Drive</h1>
            <FileExplorer />
          </div>
        </main>
      </div>
    </div>
  );
}
