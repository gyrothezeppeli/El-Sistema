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
      {/* Navigation Header */}
      <nav className="bg-[#362511] border-b border-[#795C34] sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/inicio/instrumentos">
                <Button variant="ghost" className="text-white hover:bg-[#795C34]">
                  <Music className="w-4 h-4 mr-2" />
                  Instrumentos
                </Button>
              </Link>
              
              <Link href="#historia">
                <Button variant="ghost" className="text-white hover:bg-[#795C34]">
                  <History className="w-4 h-4 mr-2" />
                  Historia
                </Button>
              </Link>

              {isAdmin && (
                <Link href="/tabla">
                  <Button variant="ghost" className="text-white hover:bg-[#795C34]">
                    <Table className="w-4 h-4 mr-2" />
                    Tabla Estudiantes
                  </Button>
                </Link>
              )}
            </div>

            {/* Desktop Right Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                onClick={() => setShowRegistrationModal(true)}
                className="bg-[#9A784F] hover:bg-[#795C34] text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Inscripción
              </Button>

              <Button 
                variant="ghost" 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
              </Button>
            </div>

            {/* Título del sistema - Desktop */}
            <div className="hidden md:block">
              <span className="text-white font-bold text-lg">
                Sistema de Gestión de Prácticas Musicales
              </span>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center justify-between w-full">
              <span className="text-white text-xs font-bold line-clamp-2 block leading-tight">
                Sistema de Gestión de Prácticas Musicales
              </span>
              <MobileNavigation />
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de Selección de Inscripción */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="sm:max-w-[700px] max-w-[95%] w-[95%] mx-auto p-0 overflow-hidden border-[#9A784F] shadow-2xl rounded-lg max-h-[90vh]">
          {/* Header con botón de cerrar */}
          <div className="relative bg-gradient-to-r from-[#795C34] to-[#65350F] p-6 text-white">
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold">
                Inscripción
              </DialogTitle>
              <DialogDescription className="text-[#F8F4F0] mt-2">
                Para mantener el orden para todos los estudiantes.
              </DialogDescription>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 text-white hover:bg-white/20"
              onClick={() => setShowRegistrationModal(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inscripción de Estudiantes */}
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#9A784F] bg-white"
                onClick={() => {
                  setShowRegistrationModal(false);
                  window.location.href = '/inscripcion_alumno';
                }}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-20 h-20 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-4 border-4 border-[#E8D5C4]">
                    <User className="w-10 h-10 text-[#9A784F]" />
                  </div>
                  <CardTitle className="text-xl text-[#362511]">Inscripción de Estudiantes</CardTitle>
                  <CardDescription className="text-[#65350F] font-medium">
                    Para nuevos estudiantes que desean unirse al sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-[#362511] mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#9A784F] rounded-full"></div>
                      <span>Información personal del estudiante</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#9A784F] rounded-full"></div>
                      <span>Datos académicos y musicales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#9A784F] rounded-full"></div>
                      <span>Información de salud</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#9A784F] hover:bg-[#795C34] font-bold">
                    Comenzar Inscripción
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <div className="bg-[#F8F4F0] border border-[#E8D5C4] rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#795C34] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-bold text-[#362511] mb-1">Proceso de Inscripción Completo</h4>
                  <p className="text-[#65350F] text-sm">
                    Recomendamos comenzar con la <strong>Inscripción de Estudiantes</strong> y luego completar 
                    con la <strong>Inscripción de Representantes</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section 
        className="relative py-20 text-white overflow-hidden min-h-[500px] flex items-center"
        style={{
          backgroundImage: 'url(/images/fondo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#F8F4F0] drop-shadow-lg">
              Sistema Integral de Gestión de Prácticas Musicales
            </h1>
            <div className="text-xl md:text-2xl mb-6 text-white font-light">
              <p>Música</p>
              <p>Cultura</p>
              <p>Arte</p>
            </div>
            <p className="text-lg md:text-xl mb-8 text-[#E8D5C4] font-medium">
              Formando músicos, transformando vidas
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#362511] mb-4 drop-shadow-sm">
              Bienvenido al Sistema
            </h2>
            <p className="text-lg text-[#65350F] max-w-2xl mx-auto font-medium">
              Descubre el mundo de la música a través de nuestros programas educativos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Instrumentos Card */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-[#E8D5C4] shadow-lg bg-white">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-4 border-4 border-[#E8D5C4]">
                  <Music className="w-10 h-10 text-[#9A784F]" />
                </div>
                <CardTitle className="text-2xl text-[#362511]">Instrumentos</CardTitle>
                <CardDescription className="text-[#65350F] font-medium">
                  Conoce los instrumentos musicales disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/inicio/instrumentos">
                  <Button className="w-full bg-[#65350F] hover:bg-[#362511]">
                    Explorar Instrumentos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Historia Card */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-[#E8D5C4] shadow-lg bg-white">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-4 border-4 border-[#E8D5C4]">
                  <History className="w-10 h-10 text-[#795C34]" />
                </div>
                <CardTitle className="text-2xl text-[#362511]">Nuestra Historia</CardTitle>
                <CardDescription className="text-[#65350F] font-medium">
                  Descubre la historia del Sistema Nacional de Orquestas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="#historia">
                  <Button className="w-full bg-[#65350F] hover:bg-[#362511]">
                    Conocer Historia
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Inscripción Card */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-[#E8D5C4] shadow-lg bg-white">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-4 border-4 border-[#E8D5C4]">
                  <UserPlus className="w-10 h-10 text-[#65350F]" />
                </div>
                <CardTitle className="text-2xl text-[#362511]">Inscripción</CardTitle>
                <CardDescription className="text-[#65350F] font-medium">
                  Únete a nuestra comunidad musical
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-[#65350F] hover:bg-[#362511]"
                  onClick={() => setShowRegistrationModal(true)}
                >
                  Inscribirse Ahora
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sección de Tabla de Estudiantes */}
          {isAdmin && (
            <div className="max-w-4xl mx-auto mt-12 text-center">
              <Card className="border-2 border-[#65350F] bg-[#F8F4F0] shadow-lg">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-4 border-4 border-[#E8D5C4]">
                    <Table className="w-8 h-8 text-[#65350F]" />
                  </div>
                  <CardTitle className="text-2xl text-[#362511]">Tabla de Estudiantes</CardTitle>
                  <CardDescription className="text-[#65350F] font-medium">
                    Visualiza todos los estudiantes registrados en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tabla">
                    <Button className="bg-[#65350F] hover:bg-[#362511]">
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

      {/* Historia Section */}
      <section 
        id="historia" 
        className="relative py-20 text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/images/fondo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-[#F8F4F0] drop-shadow-lg">
              Historia del Sistema
            </h2>
            
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-px bg-white"></div>
              <div className="mx-4">
                <Star className="text-white w-6 h-6" />
              </div>
              <div className="w-16 h-px bg-white"></div>
            </div>

            <div className="space-y-4 text-left bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-white">
                El Sistema Nacional de Orquestas y Coros Juveniles e Infantiles de Venezuela, 
                conocido como <strong className="text-[#F8F4F0]">&quot;El Sistema&quot;</strong>, es un programa de educación musical fundado 
                en 1975 por el maestro José Antonio Abreu.
              </p>
              
              <p className="text-white">
                Su misión es sistematizar la instrucción y práctica colectiva e individual 
                de la música a través de orquestas sinfónicas y coros, como instrumentos 
                de organización social y desarrollo humanístico.
              </p>

              <blockquote className="italic border-l-4 border-[#F8F4F0] pl-4 my-4 text-[#F8F4F0]">
                &quot;La música es un instrumento irremplazable para unir a las personas.&quot;
                <footer className="mt-2 text-white">- José Antonio Abreu</footer>
              </blockquote>

              <p className="text-white">
                Hoy en día, El Sistema atiende a más de 800,000 niños y jóvenes en todo el territorio 
                venezolano, demostrando que la música puede ser una poderosa herramienta de 
                transformación social.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#362511] text-white py-8 border-t border-[#795C34]">
        <div className="container mx-auto px-4">
          <div className="border-t border-[#795C34] mt-6 pt-6 text-center text-[#D4B8A4]">
            <p>&copy; 2024 Sistema Nacional de Orquestas. Todos los derechos reservados.</p>
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