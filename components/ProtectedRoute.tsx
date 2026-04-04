// components/AdminProtectedRoute.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        const userRole = sessionStorage.getItem('userRole');
        
        if (!isAuthenticated || userRole !== 'admin') {
          alert("❌ Acceso denegado. Solo administradores.");
          router.push("/inicio");
          return;
        }
        
        setIsAuthorized(true);
      } catch (error) {
        router.push("/inicio");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9A784F] mx-auto mb-4"></div>
          <p className="text-[#65350F] font-semibold">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}