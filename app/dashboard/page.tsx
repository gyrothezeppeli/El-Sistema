// app/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Music, History, UserPlus, Star, User, X, Table, LogOut, Menu, Info, ArrowDownRight, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Componente para las etiquetas "Pill"
const Tag = ({ children, variant = 'glass' }: { children: React.ReactNode, variant?: 'glass' | 'primary' | 'dark' }) => {
  const base = "px-3 py-1.5 text-[11px] font-bold rounded-full border transition-all backdrop-blur-md";
  const variants = {
    glass: "bg-white/20 text-foreground border-white/40 hover:bg-white/30",
    primary: "bg-primary text-primary-foreground border-primary/50 shadow-[0_0_15px_rgba(208,98,36,0.4)]",
    dark: "bg-black/80 text-white border-white/20 hover:bg-black",
  };
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
};

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
      await signOut({ redirect: false });
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

  const MobileNavigation = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/20">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] bg-[#f3e7d2]/95 backdrop-blur-xl border-l-white/50">
        <div className="flex flex-col gap-3 mt-8">
          <Link href="/inicio/instrumentos" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary">
              <Music className="w-4 h-4" /> Instrumentos
            </Button>
          </Link>
          <Link href="#historia" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary">
              <History className="w-4 h-4" /> Historia
            </Button>
          </Link>
          {isAdmin && (
            <Link href="/tabla" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary">
                <Table className="w-4 h-4" /> Tabla Estudiantes
              </Button>
            </Link>
          )}
          <Button 
            onClick={() => { setShowRegistrationModal(true); setIsMobileMenuOpen(false); }}
            className="w-full justify-start gap-2 mt-2"
          >
            <UserPlus className="w-4 h-4" /> Inscripción
          </Button>
          <Button 
            variant="destructive"
            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
            disabled={isLoggingOut}
            className="w-full justify-start gap-2 mt-2"
          >
            <LogOut className="w-4 h-4" /> {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-foreground text-base font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 md:p-6 font-montserrat">
      {/* Contenedor Principal Liquid Glass */}
      <div className="max-w-[1200px] mx-auto bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[2rem] shadow-[0_20px_60px_rgba(91,43,23,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] overflow-hidden relative">
        
        {/* Brillo sutil superior */}
        <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-white/20 blur-[80px] rounded-full pointer-events-none"></div>

        {/* 1. NAVBAR (Estilo Portafolio) */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-black/10 bg-white/20 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm border-2 border-black/20">
              F
            </div>
            <h1 className="text-sm md:text-base font-black tracking-tight text-foreground uppercase">Fundación Musical</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-foreground/70 uppercase tracking-widest">
            <Link href="/inicio/instrumentos" className="hover:text-primary transition-colors">Instrumentos</Link>
            <Link href="#historia" className="hover:text-primary transition-colors">Historia</Link>
            {isAdmin && <Link href="/tabla" className="hover:text-primary transition-colors">Tabla</Link>}
            <Button onClick={() => setShowRegistrationModal(true)} className="rounded-full h-8 text-xs font-bold">
              Inscripción
            </Button>
            <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut} className="rounded-full h-8 text-xs font-bold">
              Salir
            </Button>
          </div>
          <MobileNavigation />
        </nav>

        {/* 2. HERO SECTION (Flecha y Tarjeta Grande) */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-black/10">
          {/* Columna Izquierda */}
          <div className="p-8 flex flex-col justify-end items-start border-r border-black/10 bg-white/5">
            <ArrowDownRight className="w-16 h-16 text-foreground mb-6 opacity-80" strokeWidth={1.5} />
            <div className="flex flex-wrap gap-2">
              <Tag variant="glass">#Música</Tag>
              <Tag variant="glass">#Cultura</Tag>
              <Tag variant="glass">#Arte</Tag>
              <Tag variant="glass">#Formación</Tag>
            </div>
          </div>

          {/* Columna Derecha (Tarjeta Principal) */}
          <div className="md:col-span-2 p-4 md:p-6">
            <div className="w-full h-full min-h-[300px] bg-primary rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden shadow-lg border border-primary/50 group">
              <div className="absolute inset-0 bg-[url('/images/fondo.jpg')] opacity-20 mix-blend-overlay bg-cover bg-center"></div>
              
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-[0.9] tracking-tighter relative z-10 mt-4 drop-shadow-md">
                Sistema<br/>Integral<br/>de Gestión
              </h2>
              
              <div className="flex justify-between items-end relative z-10 mt-8">
                <span className="text-3xl md:text-5xl font-black text-black/40 tracking-tighter">2026</span>
                <span className="text-xs font-bold bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md border border-white/30">
                  Prácticas Musicales
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SECCIÓN INTRODUCCIÓN Y ACCESO RÁPIDO */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black/10">
          
          {/* Tarjeta Oscura (Bienvenida) */}
          <div className="md:col-span-4 p-4 md:p-6 border-r border-black/10">
            <div className="bg-[#1a1a1a] text-white rounded-[2rem] p-6 h-full min-h-[300px] flex flex-col justify-between relative overflow-hidden shadow-xl border border-white/10">
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-0"></div>
               <div className="relative z-10">
                  <span className="text-xs text-white/60 mb-2 block font-medium">Bienvenido al</span>
                  <h3 className="text-3xl font-bold leading-tight mb-4">Sistema de Prácticas</h3>
                  <p className="text-xs text-white/70 leading-relaxed mt-4">
                    Descubre el mundo de la música a través de nuestros programas educativos. Formando músicos, transformando vidas.
                  </p>
               </div>
               <Button onClick={() => setShowRegistrationModal(true)} className="relative z-10 mt-6 rounded-full bg-white text-black hover:bg-gray-200 w-fit font-bold">
                 Inscribirse Ahora
               </Button>
            </div>
          </div>

          {/* Introducción y Redes */}
          <div className="md:col-span-8 p-4 md:p-6 flex flex-col gap-6 bg-white/5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Bienvenido al Sistema</h3>
                <div className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center">
                  <ChevronDown className="w-4 h-4 text-foreground" />
                </div>
              </div>
              <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                  Descubre el mundo de la música a través de nuestros programas educativos. Explora nuestros instrumentos, conoce nuestra historia y únete a nuestra comunidad musical.
                </p>
              </div>
            </div>

            {/* 3 Botones de Acción */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Explorar</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <Link href="/inicio/instrumentos" className="bg-[#1a1a1a] text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg border border-white/10">
                  <Music className="w-6 h-6" />
                  <span className="text-[10px] font-bold text-center">Instrumentos</span>
                </Link>
                <Link href="#historia" className="bg-primary text-primary-foreground rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg border border-primary/50">
                  <History className="w-6 h-6" />
                  <span className="text-[10px] font-bold text-center">Historia</span>
                </Link>
                <div onClick={() => setShowRegistrationModal(true)} className="bg-white/40 backdrop-blur-md text-foreground rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform shadow-sm border border-white/60 cursor-pointer">
                  <UserPlus className="w-6 h-6" />
                  <span className="text-[10px] font-bold text-center">Inscripción</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. HISTORIA (Sección Editorial Inferior) */}
        <div id="historia" className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10 bg-white/5">
          <div className="p-6 md:p-8 md:col-span-3">
            <h2 className="text-3xl font-black text-foreground mb-8 text-center uppercase tracking-tighter">Historia del Sistema</h2>
            
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-px bg-primary"></div>
                <div className="mx-4">
                  <Star className="text-primary w-6 h-6" />
                </div>
                <div className="w-16 h-px bg-primary"></div>
              </div>
              
              <p className="text-foreground/80 text-lg leading-relaxed">
                El Sistema Nacional de Orquestas y Coros Juveniles e Infantiles de Venezuela, 
                conocido como <strong className="text-foreground">'El Sistema'</strong>, es un programa de educación musical fundado 
                en 1975 por el maestro José Antonio Abreu.
              </p>
              
              <blockquote className="italic border-l-4 border-primary pl-6 my-8 text-foreground text-left bg-white/20 p-6 rounded-r-2xl">
                'La música es un instrumento irremplazable para unir a las personas.'
                <footer className="mt-2 text-foreground/60 text-sm not-italic font-bold uppercase tracking-wider">- José Antonio Abreu</footer>
              </blockquote>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 bg-black/5 text-xs font-bold text-foreground/50 border-t border-black/10">
          © 2026 Fundación Musical Latina. Todos los derechos reservados.
        </div>
      </div>

      {/* MODAL DE INSCRIPCIÓN (Liquid Glass) */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="sm:max-w-[500px] max-w-[95%] w-[95%] mx-auto p-0 overflow-hidden border-white/40 shadow-2xl rounded-3xl bg-[#f3e7d2]/90 backdrop-blur-2xl">
          <div className="relative bg-primary/90 p-6 text-white border-b border-white/20">
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">Inscripción</DialogTitle>
              <DialogDescription className="text-white/80 mt-2 text-xs">
                Selecciona el tipo de inscripción que deseas realizar.
              </DialogDescription>
            </DialogHeader>
            <Button
              variant="ghost" size="icon"
              className="absolute right-4 top-4 text-white hover:bg-white/20 rounded-full"
              onClick={() => setShowRegistrationModal(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="p-6">
            <div 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-primary bg-white/40 backdrop-blur-md rounded-2xl p-6 group"
              onClick={() => {
                setShowRegistrationModal(false);
                router.push('/inscripcion_alumno');
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">Estudiante</h4>
                  <p className="text-xs text-foreground/60 mt-1">Ingresa tus datos para unirte a la fundación.</p>
                </div>
              </div>
              <Button className="w-full mt-6 font-bold rounded-xl">
                Comenzar Inscripción
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function HomePage() {
  return <HomeContent />;
}