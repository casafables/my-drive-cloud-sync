
import { useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  // Add safe area meta tag
  useEffect(() => {
    document.querySelector('meta[name="viewport"]')?.setAttribute(
      'content',
      'width=device-width, initial-scale=1, viewport-fit=cover'
    );
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-drive-bg-light px-4 safe-area">
      <LoginForm />
    </div>
  );
}
