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
        
        console.log('🔐 Verificando acceso admin:', { isAuthenticated, userRole });
        
        if (!isAuthenticated || userRole !== 'admin') {
          console.warn('🚫 Acceso denegado - No es administrador');
          setTimeout(() => {
            alert('❌ Acceso denegado. Solo los administradores pueden ver esta página.');
            router.push('/inicio');
          }, 100);
          return;
        }
        
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error verificando acceso:', error);
        router.push('/inicio');
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
          <p className="text-[#65350F] font-semibold">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}