// components/AdminProtection.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Home, LogOut, Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface AdminProtectionProps {
  children: React.ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar si la sesión está cargando
    if (status === 'loading') return;

    // Verificar si hay sesión y el rol es administrador
    if (session?.user?.rol === 'administrador') {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [session, status]);

  const handleGoBack = () => {
    router.push('/inicio');
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Mostrar loading mientras se verifica
  if (status === 'loading' || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4] flex items-center justify-center">
        <Card className="w-96 text-center border-2 border-[#E8D5C4] shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto w-20 h-20 bg-[#F5F1EB] rounded-full flex items-center justify-center mb-4 border-4 border-[#E8D5C4]">
              <Loader2 className="w-10 h-10 text-[#9A784F] animate-spin" />
            </div>
            <CardTitle className="text-2xl text-[#362511]">Verificando acceso...</CardTitle>
            <CardDescription className="text-[#65350F] mt-2">
              Por favor espera mientras verificamos tus credenciales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-[#F5F1EB] rounded-full h-2 overflow-hidden">
              <div className="bg-[#9A784F] h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si no está autorizado, mostrar mensaje de acceso restringido
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-2 border-red-200 shadow-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
          {/* Cabecera con gradiente rojo */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 text-white">
            <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border-4 border-white/30">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-center">Acceso Restringido</CardTitle>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Mensaje de advertencia */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-700 mb-1">Área de Administración</h3>
                  <p className="text-sm text-red-600">
                    Esta sección está reservada exclusivamente para administradores del sistema.
                    No tienes los permisos necesarios para acceder a esta página.
                  </p>
                </div>
              </div>
            </div>

            {/* Información de la sesión actual */}
            {session?.user && (
              <div className="bg-[#F5F1EB] border border-[#E8D5C4] rounded-lg p-4">
                <h4 className="font-medium text-[#362511] mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#9A784F]" />
                  Tu sesión actual:
                </h4>
                <div className="space-y-1 text-sm text-[#65350F]">
                  <p><span className="font-medium">Usuario:</span> {session.user.email}</p>
                  <p><span className="font-medium">Rol:</span> {
                    session.user.rol === 'administrador' ? 'Administrador' : 
                    session.user.rol === 'estudiante' ? 'Estudiante' : 
                    session.user.rol
                  }</p>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={handleGoBack}
                className="flex-1 bg-[#9A784F] hover:bg-[#795C34] text-white transition-colors py-5"
              >
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
              
              {session?.user && (
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors py-5"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              )}
            </div>

            {/* Mensaje adicional */}
            <p className="text-xs text-center text-[#795C34] mt-4">
              Si crees que esto es un error, contacta al administrador del sistema.
            </p>
          </CardContent>

          {/* Footer decorativo */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 h-2"></div>
        </Card>
      </div>
    );
  }

  // Si está autorizado, mostrar el contenido
  return <>{children}</>;
}