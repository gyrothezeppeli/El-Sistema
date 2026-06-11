// app/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Music, History, UserPlus, Star, User, ArrowRight, X, Table, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Componente interno que usa useSession
function HomeContent() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Determinar si el usuario es administrador
  const isAdmin = session?.user?.rol === 'administrador';

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ 
        redirect: false
      });
      toast.success('Sesión cerrada exitosamente');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Navegación móvil
  const MobileNavigation = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] bg-[#362511] border-l-[#795C34]">
        <div className="flex flex-col gap-3 mt-8">
          <Link href="/inicio/instrumentos" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-[#795C34]">
              <Music className="w-4 h-4" />
              Instrumentos
            </Button>
          </Link>
          
          <Link href="#historia" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-[#795C34]">
              <History className="w-4 h-4" />
              Historia
            </Button>
          </Link>

          {isAdmin && (
            <Link href="/tabla" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-[#795C34]">
                <Table className="w-4 h-4" />
                Tabla Estudiantes
              </Button>
            </Link>
          )}

          <Button 
            onClick={() => {
              setShowRegistrationModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full justify-start gap-2 bg-[#9A784F] hover:bg-[#795C34] text-white"
          >
            <UserPlus className="w-4 h-4" />
            Inscripción
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            disabled={isLoggingOut}
            className="w-full justify-start gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Si está cargando la sesión, mostrar un indicador
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-10 h-10 border-4 border-[#795C34] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[#362511] text-base">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4]">
      {/* Navigation Header - Optimizado para móvil */}
      <nav className="bg-[#362511] border-b border-[#795C34] sticky top-0 z-50 shadow-lg">
        <div className="px-3">
          <div className="flex items-center justify-between h-14">
            {/* Título del sistema - Responsive con truncado */}
            <div className="flex-1 min-w-0">
              <span className="text-white text-xs font-bold line-clamp-2 block leading-tight">
                Sistema de Gestión de Prácticas Musicales
              </span>
            </div>

            {/* Mobile Menu Button */}
            <MobileNavigation />
          </div>
        </div>
      </nav>

      {/* Modal de Selección de Inscripción - Optimizado para móvil */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="max-w-[95%] w-[95%] mx-auto p-0 overflow-hidden border-[#9A784F] shadow-2xl rounded-lg max-h-[90vh]">
          {/* Header con botón de cerrar */}
          <div className="relative bg-gradient-to-r from-[#795C34] to-[#65350F] p-4 text-white">
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-bold">
                Inscripción
              </DialogTitle>
              <DialogDescription className="text-[#F8F4F0] text-sm mt-1">
                Para mantener el orden para todos los estudiantes.
              </DialogDescription>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-white hover:bg-white/20 w-8 h-8"
              onClick={() => setShowRegistrationModal(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="p-4 max-h-[calc(90vh-100px)] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 gap-4">
              {/* Inscripción de Estudiantes */}
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#9A784F] bg-white"
                onClick={() => {
                  setShowRegistrationModal(false);
                  window.location.href = '/inscripcion_alumno';
                }}
              >
                <CardHeader className="text-center pb-3">
                  <div className="mx-auto w-16 h-16 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-3 border-4 border-[#E8D5C4]">
                    <User className="w-8 h-8 text-[#9A784F]" />
                  </div>
                  <CardTitle className="text-lg text-[#362511] mb-1">Inscripción de Estudiantes</CardTitle>
                  <CardDescription className="text-sm text-[#65350F] font-medium">
                    Para nuevos estudiantes que desean unirse al sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-[#362511] mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#9A784F] rounded-full flex-shrink-0"></div>
                      <span className="text-left text-xs">Información personal del estudiante</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#9A784F] rounded-full flex-shrink-0"></div>
                      <span className="text-left text-xs">Datos académicos y musicales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#9A784F] rounded-full flex-shrink-0"></div>
                      <span className="text-left text-xs">Información de salud</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#9A784F] hover:bg-[#795C34] text-sm py-2 h-auto font-bold text-white">
                    Comenzar Inscripción
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <div className="bg-[#F8F4F0] border border-[#E8D5C4] rounded-lg p-3 mt-4">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#795C34] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-bold text-[#362511] text-sm mb-0.5">Proceso de Inscripción Completo</h4>
                  <p className="text-[#65350F] text-xs">
                    Recomendamos comenzar con la <strong>Inscripción de Estudiantes</strong> y luego completar 
                    con la <strong>Inscripción de Representantes</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section - Optimizado para móvil */}
      <section 
        className="relative py-12 text-white overflow-hidden min-h-[400px] flex items-center"
        style={{
          backgroundImage: 'url(/images/fondo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll' // Cambiado de 'fixed' para mejor rendimiento en móvil
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl font-bold mb-2 text-[#F8F4F0] drop-shadow-lg px-2 leading-tight">
              Sistema Integral de Gestión de Prácticas Musicales
            </h1>
            <div className="text-base mb-3 text-white font-light">
              <p>Música</p>
              <p>Cultura</p>
              <p>Arte</p>
            </div>
            <p className="text-sm mb-4 text-[#E8D5C4] font-medium px-4">
              Formando músicos, transformando vidas
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Optimizado para móvil */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-3">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#362511] mb-2 drop-shadow-sm px-2">
              Bienvenido al Sistema
            </h2>
            <p className="text-sm text-[#65350F] max-w-2xl mx-auto font-medium px-4">
              Descubre el mundo de la música a través de nuestros programas educativos
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-7xl mx-auto">
            {/* Instrumentos Card */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-[#E8D5C4] shadow-lg bg-white">
              <CardHeader className="pb-3">
                <div className="mx-auto w-14 h-14 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-3 border-4 border-[#E8D5C4]">
                  <Music className="w-7 h-7 text-[#9A784F]" />
                </div>
                <CardTitle className="text-lg mb-1 text-[#362511]">Instrumentos</CardTitle>
                <CardDescription className="text-sm text-[#65350F] font-medium px-2">
                  Conoce los instrumentos musicales disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/inicio/instrumentos" className="w-full">
                  <Button className="w-full bg-[#65350F] hover:bg-[#362511] text-sm py-2 h-auto text-white font-bold">
                    Explorar Instrumentos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Historia Card */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-[#E8D5C4] shadow-lg bg-white">
              <CardHeader className="pb-3">
                <div className="mx-auto w-14 h-14 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-3 border-4 border-[#E8D5C4]">
                  <History className="w-7 h-7 text-[#795C34]" />
                </div>
                <CardTitle className="text-lg mb-1 text-[#362511]">Nuestra Historia</CardTitle>
                <CardDescription className="text-sm text-[#65350F] font-medium px-2">
                  Descubre la historia del Sistema Nacional de Orquestas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="#historia" className="w-full">
                  <Button className="w-full bg-[#65350F] hover:bg-[#362511] text-sm py-2 h-auto text-white font-bold">
                    Conocer Historia
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Inscripción Card */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-[#E8D5C4] shadow-lg bg-white">
              <CardHeader className="pb-3">
                <div className="mx-auto w-14 h-14 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-3 border-4 border-[#E8D5C4]">
                  <UserPlus className="w-7 h-7 text-[#65350F]" />
                </div>
                <CardTitle className="text-lg mb-1 text-[#362511]">Inscripción</CardTitle>
                <CardDescription className="text-sm text-[#65350F] font-medium px-2">
                  Únete a nuestra comunidad musical
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-[#65350F] hover:bg-[#362511] text-sm py-2 h-auto text-white font-bold"
                  onClick={() => setShowRegistrationModal(true)}
                >
                  Inscribirse Ahora
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sección de Tabla de Estudiantes */}
          {isAdmin && (
            <div className="max-w-4xl mx-auto mt-6 text-center px-3">
              <Card className="border-2 border-[#65350F] bg-[#F8F4F0] shadow-lg">
                <CardHeader className="pb-3">
                  <div className="mx-auto w-12 h-12 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-2 border-4 border-[#E8D5C4]">
                    <Table className="w-6 h-6 text-[#65350F]" />
                  </div>
                  <CardTitle className="text-lg text-[#362511] mb-1">Tabla de Estudiantes</CardTitle>
                  <CardDescription className="text-sm text-[#65350F] font-medium px-2">
                    Visualiza todos los estudiantes registrados en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tabla">
                    <Button className="bg-[#65350F] hover:bg-[#362511] text-white text-sm py-2 px-4 font-bold">
                      <Table className="w-4 h-4 mr-2" />
                      Ver Tabla de Estudiantes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Historia Section - Optimizado para móvil */}
      <section 
        id="historia" 
        className="relative py-10 text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/images/fondo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container mx-auto px-3 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-xl font-bold mb-4 text-[#F8F4F0] drop-shadow-lg px-2">
              Historia del Sistema
            </h2>
            
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-px bg-white"></div>
              <div className="mx-2">
                <Star className="text-white w-4 h-4" />
              </div>
              <div className="w-8 h-px bg-white"></div>
            </div>

            <div className="text-xs leading-relaxed space-y-3 text-left bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs text-white font-medium">
                El Sistema Nacional de Orquestas y Coros Juveniles e Infantiles de Venezuela, 
                conocido como <strong className="text-[#F8F4F0]">&quot;El Sistema&quot;</strong>, es un programa de educación musical fundado 
                en 1975 por el maestro José Antonio Abreu.
              </p>
              
              <p className="text-xs text-white font-medium">
                Su misión es sistematizar la instrucción y práctica colectiva e individual 
                de la música a través de orquestas sinfónicas y coros, como instrumentos 
                de organización social y desarrollo humanístico.
              </p>

              <blockquote className="italic border-l-2 border-[#F8F4F0] pl-3 my-4 text-xs text-[#F8F4F0] text-left font-medium">
                &quot;La música es un instrumento irremplazable para unir a las personas.&quot;
                <footer className="mt-1 text-white text-xs">- José Antonio Abreu</footer>
              </blockquote>

              <p className="text-xs text-white font-medium">
                Hoy en día, El Sistema atiende a más de 800,000 niños y jóvenes en todo el territorio 
                venezolano, demostrando que la música puede ser una poderosa herramienta de 
                transformación social.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Optimizado para móvil */}
      <footer className="bg-[#362511] text-white py-6 border-t border-[#795C34]">
        <div className="container mx-auto px-3">
          <div className="border-t border-[#795C34] mt-4 pt-3 text-center text-[#D4B8A4]">
            <p className="text-xs">&copy; 2024 Sistema Nacional de Orquestas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componente principal que provee la sesión
export default function HomePage() {
  return (
    <HomeContent />
  );
}