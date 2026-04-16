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

// Componente interno que usa useSession
function HomeContent() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Determinar si el usuario es administrador (CORREGIDO: 'administrador' no 'admin')
  const isAdmin = session?.user?.rol === 'administrador';
  
  // Para depuración - mostrar en consola
  console.log('📊 Sesión en HomePage:', {
    session: session?.user,
    rol: session?.user?.rol,
    isAdmin: isAdmin,
    status: status
  });

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

  // Si está cargando la sesión, mostrar un indicador
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#795C34] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#362511] text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F4F0] via-[#E8D5C4] to-[#D4B8A4]">
      {/* Navigation Header */}
      <nav className="bg-[#362511] backdrop-blur-md border-b border-[#795C34] sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo.png"
                  alt="Logo EL SISTEMA"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/inicio/instrumentos">
                <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-[#795C34] hover:text-white font-semibold transition-colors duration-200">
                  <Music className="w-5 h-5" />
                  Instrumentos
                </Button>
              </Link>
              
              <Link href="#historia">
                <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-[#795C34] hover:text-white font-semibold transition-colors duration-200">
                  <History className="w-5 h-5" />
                  Historia
                </Button>
              </Link>

             

              {/* Botón de Tabla - Visible SOLO para administradores */}
              {isAdmin && (
                <Link href="/tabla">
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-[#795C34] hover:text-white font-semibold transition-colors duration-200">
                    <Table className="w-5 h-5" />
                    Tabla Estudiantes
                  </Button>
                </Link>
              )}

              {/* Botón de Inscripción */}
              <Button 
                onClick={() => setShowRegistrationModal(true)}
                className="flex items-center gap-2 bg-[#9A784F] hover:bg-[#795C34] text-white font-bold transition-colors duration-200 shadow-lg"
              >
                <UserPlus className="w-5 h-5" />
                Inscripción
              </Button>

              {/* Botón de Cerrar Sesión */}
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de Selección de Inscripción */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="max-w-[1000px] mx-auto p-0 overflow-hidden border-[#9A784F] shadow-2xl">
          {/* Header con botón de cerrar */}
          <div className="relative bg-gradient-to-r from-[#795C34] to-[#65350F] p-8 text-white">
            <DialogHeader className="text-center">
              <DialogTitle className="text-3xl md:text-5xl font-bold">
                Inscripción
              </DialogTitle>
              <DialogDescription className="text-[#F8F4F0] text-xl mt-3">
                Para mantener el orden para todos los estudiantes.
              </DialogDescription>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-6 top-6 text-white hover:bg-white/20 w-10 h-10 transition-colors duration-200"
              onClick={() => setShowRegistrationModal(false)}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="p-10 max-h-[60vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
              {/* Inscripción de Estudiantes */}
              <Card 
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#9A784F] h-full flex flex-col min-h-[500px] bg-white"
                onClick={() => {
                  setShowRegistrationModal(false);
                  window.location.href = '/inscripcion_alumno';
                }}
              >
                <CardHeader className="text-center pb-6 flex-shrink-0">
                  <div className="mx-auto w-24 h-24 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-6 border-4 border-[#E8D5C4]">
                    <User className="w-12 h-12 text-[#9A784F]" />
                  </div>
                  <CardTitle className="text-3xl text-[#362511] mb-4">Inscripción de Estudiantes</CardTitle>
                  <CardDescription className="text-xl text-[#65350F] font-medium">
                    Para nuevos estudiantes que desean unirse al sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div className="space-y-4 text-lg text-[#362511] mb-8 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#9A784F] rounded-full flex-shrink-0"></div>
                      <span className="text-left">Información personal del estudiante</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#9A784F] rounded-full flex-shrink-0"></div>
                      <span className="text-left">Datos académicos y musicales</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#9A784F] rounded-full flex-shrink-0"></div>
                      <span className="text-left">Información de salud</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#9A784F] rounded-full flex-shrink-0"></div>
                      <span className="text-left">Continúa con representantes después</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#9A784F] hover:bg-[#795C34] text-xl py-6 h-auto text-lg font-bold text-white shadow-lg transition-colors duration-200">
                    Comenzar Inscripción
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <div className="bg-[#F8F4F0] border border-[#E8D5C4] rounded-xl p-6 mt-8">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-[#795C34] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-bold text-[#362511] text-xl mb-2">Proceso de Inscripción Completo</h4>
                  <p className="text-[#65350F] text-lg font-medium">
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
        className="relative py-20 md:py-32 text-white overflow-hidden min-h-screen flex items-center"
        style={{
          backgroundImage: 'url(/images/fondo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay para mejor legibilidad */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Logo arriba del título */}
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="relative w-24 h-24 md:w-32 md:h-32">
                <Image
                  src="/images/logo.png"
                  alt="Logo EL SISTEMA"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-[#F8F4F0] drop-shadow-lg">
              EL SISTEMA
            </h1>
            <div className="text-xl md:text-2xl lg:text-3xl mb-6 md:mb-8 text-white font-light space-y-1 md:space-y-2">
              <p>Música</p>
              <p>Cultura</p>
              <p>Arte</p>
            </div>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-[#E8D5C4] font-medium">
              Formando músicos, transformando vidas
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#362511] mb-4 drop-shadow-sm">
              Bienvenido al Sistema
            </h2>
            <p className="text-lg md:text-xl text-[#65350F] max-w-2xl mx-auto font-medium">
              Descubre el mundo de la música a través de nuestros programas educativos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Instrumentos Card */}
            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-[#E8D5C4] shadow-lg hover:scale-105 min-h-[400px] flex flex-col bg-white">
              <CardHeader className="pb-6 flex-shrink-0">
                <div className="mx-auto w-20 h-20 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-6 border-4 border-[#E8D5C4]">
                  <Music className="w-10 h-10 text-[#9A784F]" />
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-3 text-[#362511]">Instrumentos</CardTitle>
                <CardDescription className="text-lg md:text-xl text-[#65350F] font-medium">
                  Conoce los instrumentos musicales disponibles
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Link href="/inicio/instrumentos" className="w-full">
                  <Button className="w-full bg-[#65350F] hover:bg-[#362511] text-lg py-4 h-auto text-white font-bold shadow-lg transition-colors duration-200">
                    Explorar Instrumentos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Historia Card */}
            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-[#E8D5C4] shadow-lg hover:scale-105 min-h-[400px] flex flex-col bg-white">
              <CardHeader className="pb-6 flex-shrink-0">
                <div className="mx-auto w-20 h-20 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-6 border-4 border-[#E8D5C4]">
                  <History className="w-10 h-10 text-[#795C34]" />
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-3 text-[#362511]">Nuestra Historia</CardTitle>
                <CardDescription className="text-lg md:text-xl text-[#65350F] font-medium">
                  Descubre la historia del Sistema Nacional de Orquestas
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Link href="#historia" className="w-full">
                  <Button className="w-full bg-[#65350F] hover:bg-[#362511] text-lg py-4 h-auto text-white font-bold shadow-lg transition-colors duration-200">
                    Conocer Historia
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Inscripción Card */}
            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-[#E8D5C4] shadow-lg hover:scale-105 min-h-[400px] flex flex-col bg-white">
              <CardHeader className="pb-6 flex-shrink-0">
                <div className="mx-auto w-20 h-20 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-6 border-4 border-[#E8D5C4]">
                  <UserPlus className="w-10 h-10 text-[#65350F]" />
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-3 text-[#362511]">Inscripción</CardTitle>
                <CardDescription className="text-lg md:text-xl text-[#65350F] font-medium">
                  Únete a nuestra comunidad musical
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Button 
                  className="w-full bg-[#65350F] hover:bg-[#362511] text-lg py-4 h-auto text-white font-bold shadow-lg transition-colors duration-200"
                  onClick={() => setShowRegistrationModal(true)}
                >
                  Inscribirse Ahora
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sección de Tabla de Estudiantes - Visible SOLO para administradores */}
          {isAdmin && (
            <div className="max-w-4xl mx-auto mt-16 text-center">
              <Card className="border-2 border-[#65350F] bg-[#F8F4F0] min-h-[200px] flex flex-col justify-center shadow-lg">
                <CardHeader className="pb-6">
                  <div className="mx-auto w-16 h-16 bg-[#F8F4F0] rounded-full flex items-center justify-center mb-4 border-4 border-[#E8D5C4]">
                    <Table className="w-8 h-8 text-[#65350F]" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl text-[#362511] mb-3">Tabla de Estudiantes</CardTitle>
                  <CardDescription className="text-lg md:text-xl text-[#65350F] font-medium">
                    Visualiza todos los estudiantes registrados en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tabla">
                    <Button className="bg-[#65350F] hover:bg-[#362511] text-white text-lg py-4 px-12 font-bold shadow-lg transition-colors duration-200">
                      <Table className="w-5 h-5 mr-3" />
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
        className="relative py-20 md:py-32 text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/images/fondo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay para mejor legibilidad */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-[#F8F4F0] drop-shadow-lg">
              Historia del Sistema
            </h2>
            
            {/* Divider */}
            <div className="flex items-center justify-center mb-12 md:mb-16">
              <div className="w-16 h-1 bg-white"></div>
              <div className="mx-4 md:mx-6">
                <Star className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="w-16 h-1 bg-white"></div>
            </div>

            <div className="text-base md:text-lg lg:text-xl leading-relaxed space-y-6 md:space-y-8 text-left bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12">
              <p className="text-lg md:text-xl text-white font-medium">
                El Sistema Nacional de Orquestas y Coros Juveniles e Infantiles de Venezuela, 
                conocido como <strong className="text-[#F8F4F0]">&quot;El Sistema&quot;</strong>, es un programa de educación musical fundado 
                en 1975 por el maestro José Antonio Abreu.
              </p>
              
              <p className="text-lg md:text-xl text-white font-medium">
                Su misión es sistematizar la instrucción y práctica colectiva e individual 
                de la música a través de orquestas sinfónicas y coros, como instrumentos 
                de organización social y desarrollo humanístico. Este modelo ha sido replicado 
                en más de 60 países alrededor del mundo.
              </p>

              <blockquote className="italic border-l-4 border-[#F8F4F0] pl-4 md:pl-8 my-8 md:my-12 text-xl md:text-2xl text-[#F8F4F0] text-center font-medium">
                &quot;La música es un instrumento irremplazable para unir a las personas.&quot;
                <footer className="mt-3 md:mt-4 text-white text-lg md:text-xl">- José Antonio Abreu</footer>
              </blockquote>

              <p className="text-lg md:text-xl text-white font-medium">
                Hoy en día, El Sistema atiende a más de 800,000 niños y jóvenes en todo el territorio 
                venezolano, demostrando que la música puede ser una poderosa herramienta de 
                transformación social y desarrollo humano.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#362511] text-white py-12 md:py-16 border-t border-[#795C34]">
        <div className="container mx-auto px-4">
          <div className="border-t border-[#795C34] mt-8 md:mt-12 pt-6 md:pt-8 text-center text-[#D4B8A4]">
            <p className="text-sm md:text-lg">&copy; 2024 Sistema Nacional de Orquestas. Todos los derechos reservados.</p>
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