// app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Music, History, UserPlus, Star, User, ArrowRight, X, Table, LogOut } from 'lucide-react';

function HomeContent() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#795C34] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#362511] text-lg md:text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4]">
      {/* Navigation Header */}
      <nav className="bg-[#362511] backdrop-blur-md border-b border-[#795C34] sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Título responsive */}
            <div className="flex items-center space-x-2 md:space-x-3 flex-1">
              <span className="text-white text-sm md:text-xl font-bold truncate">
                Sistema Integral de Gestión de Prácticas Musicales
              </span>
            </div>

            {/* Botón de menú hamburguesa para móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-[#795C34] rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Menú desktop */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <Link href="/inicio/instrumentos">
                <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-[#795C34] hover:text-white font-semibold transition-colors duration-200 text-sm lg:text-base">
                  <Music className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden lg:inline">Instrumentos</span>
                  <span className="lg:hidden">Inst.</span>
                </Button>
              </Link>
              
              <Link href="#historia">
                <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-[#795C34] hover:text-white font-semibold transition-colors duration-200 text-sm lg:text-base">
                  <History className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden lg:inline">Historia</span>
                  <span className="lg:hidden">Hist.</span>
                </Button>
              </Link>

              {isAdmin && (
                <Link href="/tabla">
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-[#795C34] hover:text-white font-semibold transition-colors duration-200 text-sm lg:text-base">
                    <Table className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="hidden lg:inline">Tabla Estudiantes</span>
                    <span className="lg:hidden">Tabla</span>
                  </Button>
                </Link>
              )}

              <Button 
                onClick={() => setShowRegistrationModal(true)}
                className="flex items-center gap-2 bg-[#9A784F] hover:bg-[#795C34] text-white font-bold transition-colors duration-200 shadow-lg text-sm lg:text-base px-3 lg:px-4"
              >
                <UserPlus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden lg:inline">Inscripción</span>
                <span className="lg:hidden">Inscr.</span>
              </Button>

              <Button 
                variant="ghost" 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-200 text-sm lg:text-base px-3 lg:px-4"
              >
                <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden lg:inline">{isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}</span>
                <span className="lg:hidden">Salir</span>
              </Button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-[#795C34] mt-2">
              <Link href="/inicio/instrumentos" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full flex items-center gap-2 text-white hover:bg-[#795C34] hover:text-white font-semibold transition-colors duration-200 justify-start">
                  <Music className="w-5 h-5" />
                  Instrumentos
                </Button>
              </Link>
              
              <Link href="#historia" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full flex items-center gap-2 text-white hover:bg-[#795C34] hover:text-white font-semibold transition-colors duration-200 justify-start">
                  <History className="w-5 h-5" />
                  Historia
                </Button>
              </Link>

              {isAdmin && (
                <Link href="/tabla" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full flex items-center gap-2 text-white hover:bg-[#795C34] hover:text-white font-semibold transition-colors duration-200 justify-start">
                    <Table className="w-5 h-5" />
                    Tabla Estudiantes
                  </Button>
                </Link>
              )}

              <Button 
                onClick={() => {
                  setShowRegistrationModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 bg-[#9A784F] hover:bg-[#795C34] text-white font-bold transition-colors duration-200 shadow-lg justify-start"
              >
                <UserPlus className="w-5 h-5" />
                Inscripción
              </Button>

              <Button 
                variant="ghost" 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-200 justify-start"
              >
                <LogOut className="w-5 h-5" />
                {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Modal de Selección de Inscripción */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="max-w-[95vw] md:max-w-[1000px] mx-auto p-0 overflow-hidden border-[#9A784F] shadow-2xl">
          <div className="relative bg-gradient-to-r from-[#795C34] to-[#65350F] p-6 md:p-8 text-white">
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl md:text-5xl font-bold">
                Inscripción
              </DialogTitle>
              <DialogDescription className="text-[#F8F4F0] text-base md:text-xl mt-2 md:mt-3">
                Para mantener el orden para todos los estudiantes.
              </DialogDescription>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 md:right-6 top-4 md:top-6 text-white hover:bg-white/20 w-8 h-8 md:w-10 md:h-10 transition-colors duration-200"
              onClick={() => setShowRegistrationModal(false)}
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </div>
          
          <div className="p-6 md:p-10 max-h-[60vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              <Card 
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#9A784F] h-full flex flex-col min-h-[400px] md:min-h-[500px] bg-white"
                onClick={() => {
                  setShowRegistrationModal(false);
                  window.location.href = '/inscripcion_alumno';
                }}
              >
                <CardHeader className="text-center pb-4 md:pb-6 flex-shrink-0">
                  <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-4 md:mb-6 border-4 border-[#E8D5C4]">
                    <User className="w-10 h-10 md:w-12 md:h-12 text-[#9A784F]" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl text-[#362511] mb-2 md:mb-4">Inscripción de Estudiantes</CardTitle>
                  <CardDescription className="text-base md:text-xl text-[#65350F] font-medium">
                    Para nuevos estudiantes que desean unirse al sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div className="space-y-3 md:space-y-4 text-base md:text-lg text-[#362511] mb-6 md:mb-8 font-medium">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-[#9A784F] rounded-full flex-shrink-0"></div>
                      <span className="text-left">Información personal del estudiante</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-[#9A784F] rounded-full flex-shrink-0"></div>
                      <span className="text-left">Datos académicos y musicales</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-[#9A784F] rounded-full flex-shrink-0"></div>
                      <span className="text-left">Información de salud</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-[#9A784F] rounded-full flex-shrink-0"></div>
                      <span className="text-left">Continúa con representantes después</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#9A784F] hover:bg-[#795C34] text-base md:text-xl py-4 md:py-6 h-auto font-bold text-white shadow-lg transition-colors duration-200">
                    Comenzar Inscripción
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2 md:ml-3" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-[#F8F4F0] border border-[#E8D5C4] rounded-xl p-4 md:p-6 mt-6 md:mt-8">
              <div className="flex items-start gap-3 md:gap-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#795C34] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-bold text-[#362511] text-lg md:text-xl mb-1 md:mb-2">Proceso de Inscripción Completo</h4>
                  <p className="text-[#65350F] text-sm md:text-lg font-medium">
                    Recomendamos comenzar con la <strong>Inscripción de Estudiantes</strong> y luego completar 
                    con la <strong>Inscripción de Representantes</strong> para un proceso completo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section 
        className="relative py-20 md:py-32 text-white overflow-hidden min-h-[600px] md:min-h-screen flex items-center"
        style={{
          backgroundImage: 'url(/images/fondo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll md:fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-[#F8F4F0] drop-shadow-lg px-2">
              Sistema Integral de Gestión de Prácticas Musicales
            </h1>
            <div className="text-lg md:text-2xl lg:text-3xl mb-6 md:mb-8 text-white font-light space-y-1 md:space-y-2">
              <p>Música</p>
              <p>Cultura</p>
              <p>Arte</p>
            </div>
            <p className="text-base md:text-xl lg:text-2xl mb-8 md:mb-12 text-[#E8D5C4] font-medium px-4">
              Formando músicos, transformando vidas
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#362511] mb-3 md:mb-4 drop-shadow-sm">
              Bienvenido al Sistema
            </h2>
            <p className="text-base md:text-xl text-[#65350F] max-w-2xl mx-auto font-medium px-4">
              Descubre el mundo de la música a través de nuestros programas educativos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-[#E8D5C4] shadow-lg hover:scale-105 min-h-[350px] md:min-h-[400px] flex flex-col bg-white">
              <CardHeader className="pb-4 md:pb-6 flex-shrink-0">
                <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-4 md:mb-6 border-4 border-[#E8D5C4]">
                  <Music className="w-8 h-8 md:w-10 md:h-10 text-[#9A784F]" />
                </div>
                <CardTitle className="text-xl md:text-3xl mb-2 md:mb-3 text-[#362511]">Instrumentos</CardTitle>
                <CardDescription className="text-base md:text-xl text-[#65350F] font-medium">
                  Conoce los instrumentos musicales disponibles
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Link href="/inicio/instrumentos" className="w-full">
                  <Button className="w-full bg-[#65350F] hover:bg-[#362511] text-base md:text-lg py-3 md:py-4 h-auto text-white font-bold shadow-lg transition-colors duration-200">
                    Explorar Instrumentos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-[#E8D5C4] shadow-lg hover:scale-105 min-h-[350px] md:min-h-[400px] flex flex-col bg-white">
              <CardHeader className="pb-4 md:pb-6 flex-shrink-0">
                <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-4 md:mb-6 border-4 border-[#E8D5C4]">
                  <History className="w-8 h-8 md:w-10 md:h-10 text-[#795C34]" />
                </div>
                <CardTitle className="text-xl md:text-3xl mb-2 md:mb-3 text-[#362511]">Nuestra Historia</CardTitle>
                <CardDescription className="text-base md:text-xl text-[#65350F] font-medium">
                  Descubre la historia del Sistema Nacional de Orquestas
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Link href="#historia" className="w-full">
                  <Button className="w-full bg-[#65350F] hover:bg-[#362511] text-base md:text-lg py-3 md:py-4 h-auto text-white font-bold shadow-lg transition-colors duration-200">
                    Conocer Historia
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-[#E8D5C4] shadow-lg hover:scale-105 min-h-[350px] md:min-h-[400px] flex flex-col bg-white">
              <CardHeader className="pb-4 md:pb-6 flex-shrink-0">
                <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-4 md:mb-6 border-4 border-[#E8D5C4]">
                  <UserPlus className="w-8 h-8 md:w-10 md:h-10 text-[#65350F]" />
                </div>
                <CardTitle className="text-xl md:text-3xl mb-2 md:mb-3 text-[#362511]">Inscripción</CardTitle>
                <CardDescription className="text-base md:text-xl text-[#65350F] font-medium">
                  Únete a nuestra comunidad musical
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Button 
                  className="w-full bg-[#65350F] hover:bg-[#362511] text-base md:text-lg py-3 md:py-4 h-auto text-white font-bold shadow-lg transition-colors duration-200"
                  onClick={() => setShowRegistrationModal(true)}
                >
                  Inscribirse Ahora
                </Button>
              </CardContent>
            </Card>
          </div>

          {isAdmin && (
            <div className="max-w-4xl mx-auto mt-12 md:mt-16 text-center">
              <Card className="border-2 border-[#65350F] bg-[#F8F4F0] min-h-[180px] md:min-h-[200px] flex flex-col justify-center shadow-lg">
                <CardHeader className="pb-4 md:pb-6">
                  <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-3 md:mb-4 border-4 border-[#E8D5C4]">
                    <Table className="w-6 h-6 md:w-8 md:h-8 text-[#65350F]" />
                  </div>
                  <CardTitle className="text-xl md:text-3xl text-[#362511] mb-2 md:mb-3">Tabla de Estudiantes</CardTitle>
                  <CardDescription className="text-base md:text-xl text-[#65350F] font-medium">
                    Visualiza todos los estudiantes registrados en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tabla">
                    <Button className="bg-[#65350F] hover:bg-[#362511] text-white text-base md:text-lg py-3 md:py-4 px-6 md:px-12 font-bold shadow-lg transition-colors duration-200">
                      <Table className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
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
        className="relative py-16 md:py-32 text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/images/fondo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll md:fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-12 text-[#F8F4F0] drop-shadow-lg">
              Historia del Sistema
            </h2>
            
            <div className="flex items-center justify-center mb-8 md:mb-16">
              <div className="w-12 md:w-16 h-1 bg-white"></div>
              <div className="mx-3 md:mx-6">
                <Star className="text-white w-5 h-5 md:w-8 md:h-8" />
              </div>
              <div className="w-12 md:w-16 h-1 bg-white"></div>
            </div>

            <div className="text-base md:text-lg lg:text-xl leading-relaxed space-y-4 md:space-y-8 text-left bg-white/10 backdrop-blur-sm rounded-xl md:rounded-3xl p-5 md:p-8 lg:p-12">
              <p className="text-base md:text-xl text-white font-medium">
                El Sistema Nacional de Orquestas y Coros Juveniles e Infantiles de Venezuela, 
                conocido como <strong className="text-[#F8F4F0]">"El Sistema"</strong>, es un programa de educación musical fundado 
                en 1975 por el maestro José Antonio Abreu.
              </p>
              
              <p className="text-base md:text-xl text-white font-medium">
                Su misión es sistematizar la instrucción y práctica colectiva e individual 
                de la música a través de orquestas sinfónicas y coros, como instrumentos 
                de organización social y desarrollo humanístico. Este modelo ha sido replicado 
                en más de 60 países alrededor del mundo.
              </p>

              <blockquote className="italic border-l-4 border-[#F8F4F0] pl-4 md:pl-8 my-6 md:my-12 text-lg md:text-2xl text-[#F8F4F0] text-center font-medium">
                "La música es un instrumento irremplazable para unir a las personas."
                <footer className="mt-2 md:mt-4 text-white text-base md:text-xl">- José Antonio Abreu</footer>
              </blockquote>

              <p className="text-base md:text-xl text-white font-medium">
                Hoy en día, El Sistema atiende a más de 800,000 niños y jóvenes en todo el territorio 
                venezolano, demostrando que la música puede ser una poderosa herramienta de 
                transformación social y desarrollo humano.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#362511] text-white py-10 md:py-16 border-t border-[#795C34]">
        <div className="container mx-auto px-4">
          <div className="border-t border-[#795C34] mt-6 md:mt-12 pt-6 md:pt-8 text-center text-[#D4B8A4]">
            <p className="text-xs md:text-lg">&copy; 2024 Sistema Nacional de Orquestas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <HomeContent />
  );
}