// app/dashboard/page.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Music, 
  FileText, 
  CalendarDays, 
  ChevronRight, 
  UserPlus,
  BookOpen,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 font-montserrat flex justify-center">
      
      {/* Panel Principal (Liquid Glass Amplio) */}
      <div className="w-full max-w-[1400px] bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[2.5rem] shadow-[0_20px_60px_rgba(91,43,23,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] overflow-hidden relative">
        
        {/* Brillo sutil de fondo */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 blur-[120px] rounded-full pointer-events-none"></div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-6 md:p-12 relative z-10">
          
          {/* Encabezado de Bienvenida */}
          <div className="mb-10 md:mb-16">
            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-3">
              Bienvenido al <span className="text-primary">Panel de Control</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/70 font-medium max-w-2xl">
              Selecciona un módulo para comenzar a gestionar la fundación, revisar los expedientes de los estudiantes o administrar el material musical.
            </p>
          </div>

          {/* Sección de Accesos Directos Principales (Módulos) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Módulo 1: Estudiantes */}
            <Link href="/tabla" className="group">
              <Card className="h-full bg-white/30 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-xl hover:border-primary/50 hover:bg-white/40 transition-all duration-300 rounded-3xl overflow-hidden relative">
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Estudiantes</h3>
                  <p className="text-sm text-foreground/60 mb-6 flex-1">
                    Consulta la base de datos general, edita expedientes y gestiona el estatus de los alumnos.
                  </p>
                  <div className="flex items-center text-primary font-bold text-sm">
                    Ver Tabla <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Módulo 2: Inscripciones */}
            <Link href="/inscripcion_alumno" className="group">
              <Card className="h-full bg-white/30 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-xl hover:border-primary/50 hover:bg-white/40 transition-all duration-300 rounded-3xl overflow-hidden relative">
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <UserPlus className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Inscripciones</h3>
                  <p className="text-sm text-foreground/60 mb-6 flex-1">
                    Registra nuevos estudiantes en el sistema, asigna representantes y actualiza sus datos personales.
                  </p>
                  <div className="flex items-center text-blue-600 font-bold text-sm">
                    Inscribir Alumno <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Módulo 3: Partituras */}
            <Link href="/partituras" className="group">
              <Card className="h-full bg-white/30 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-xl hover:border-primary/50 hover:bg-white/40 transition-all duration-300 rounded-3xl overflow-hidden relative">
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Music className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Partituras</h3>
                  <p className="text-sm text-foreground/60 mb-6 flex-1">
                    Administra el repertorio musical, sube nuevos archivos y organiza las partituras por instrumento.
                  </p>
                  <div className="flex items-center text-purple-600 font-bold text-sm">
                    Ver Archivos <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Módulo 4: Eventos (Placeholder para futuras rutas) */}
            <Link href="#" className="group">
              <Card className="h-full bg-white/30 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-xl hover:border-primary/50 hover:bg-white/40 transition-all duration-300 rounded-3xl overflow-hidden relative">
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <CalendarDays className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Eventos</h3>
                  <p className="text-sm text-foreground/60 mb-6 flex-1">
                    Programa conciertos, audiciones y clases magistrales. Gestiona los invitados y la logística.
                  </p>
                  <div className="flex items-center text-orange-600 font-bold text-sm">
                    Ver Calendario <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

          </div>

          {/* Sección Inferior: Enlaces Secundarios / Acciones Rápidas */}
          <div className="mt-12 md:mt-16">
            <h2 className="text-xl font-bold text-foreground mb-6">Acciones Adicionales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/inscripcion_representantes" className="flex items-center justify-between p-4 bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl hover:bg-white/40 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black/5 rounded-xl">
                    <BookOpen className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="font-bold text-foreground text-sm">Inscribir Representante</span>
                </div>
                <ChevronRight className="w-5 h-5 text-foreground/40 group-hover:text-primary transition-colors" />
              </Link>

              <Link href="/tabla" className="flex items-center justify-between p-4 bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl hover:bg-white/40 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black/5 rounded-xl">
                    <FileText className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="font-bold text-foreground text-sm">Exportar Base de Datos</span>
                </div>
                <ChevronRight className="w-5 h-5 text-foreground/40 group-hover:text-primary transition-colors" />
              </Link>

              <Link href="/" className="flex items-center justify-between p-4 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-2xl hover:bg-primary/20 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-xl">
                    <Music className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold text-primary text-sm">Ir al Portal Público</span>
                </div>
                <ChevronRight className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}