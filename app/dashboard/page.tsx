// app/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ChevronDown, 
  UserPlus, 
  Mail, 
  Music,
  CalendarDays,
  Award,
  Users,
  Briefcase,
  ArrowDownRight,
  Search
} from 'lucide-react'
import Link from 'next/link'

// Componente para las etiquetas estilo "Pill"
const Tag = ({ children, variant = 'glass' }: { children: React.ReactNode, variant?: 'glass' | 'primary' | 'dark' }) => {
  const base = "px-3 py-1.5 text-[11px] font-bold rounded-full border transition-all backdrop-blur-md";
  const variants = {
    glass: "bg-black/5 text-foreground border-white/40 hover:bg-black/10", // Etiquetas claras
    primary: "bg-primary text-primary-foreground border-primary/50 shadow-[0_0_15px_rgba(208,98,36,0.4)]", // Etiquetas naranjas
    dark: "bg-black/80 text-white border-white/20 hover:bg-black", // Etiquetas oscuras
  };
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
};

export default function DashboardPage() {
  return (
    // El fondo global ya tiene el gradiente cálido. Añadimos padding.
    <div className="min-h-screen p-4 md:p-8 font-montserrat">
      
      {/* Contenedor principal con efecto Liquid Glass */}
      <div className="max-w-[1200px] mx-auto bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[2.5rem] shadow-[0_20px_60px_rgba(91,43,23,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] overflow-hidden relative">
        
        {/* Brillo sutil de fondo (Liquid Glass) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 blur-[100px] rounded-full pointer-events-none"></div>

        {/* HEADER SUPERIOR (Igual al de la imagen) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 bg-white/20">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
              F
            </div>
            <h1 className="text-sm md:text-base font-bold text-foreground">Fundación Musical Latina</h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-foreground/70">
            <span className="hidden md:block uppercase tracking-wider">Panel de Gestión</span>
            <Search className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
          </div>
        </div>

        {/* SECCIÓN 1: HERO Y ETIQUETAS (Branding) */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-black/10">
          {/* Columna Izquierda (Flecha y Tags) */}
          <div className="p-8 flex flex-col justify-end items-start border-r border-black/10 bg-white/5">
            <ArrowDownRight className="w-16 h-16 text-foreground mb-6 opacity-80" strokeWidth={1.5} />
            <div className="flex flex-wrap gap-2">
              <Tag variant="glass">#Gestión</Tag>
              <Tag variant="glass">#Alumnos</Tag>
              <Tag variant="glass">#Partituras</Tag>
              <Tag variant="glass">#Eventos</Tag>
              <Tag variant="glass">#Música</Tag>
            </div>
          </div>

          {/* Columna Derecha (Tarjeta Grande de Bienvenida) */}
          <div className="md:col-span-2 p-6">
            <div className="w-full h-full min-h-[250px] bg-primary rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-inner border border-primary/50 group">
              {/* Patrón de fondo */}
              <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay"></div>
              
              {/* Texto masivo tipo tipografía del portafolio */}
              <h2 className="text-4xl md:text-6xl font-black text-primary-foreground uppercase leading-none tracking-tighter relative z-10">
                Sistema<br/>Integral
              </h2>
              <div className="flex justify-between items-end relative z-10 mt-8">
                <span className="text-2xl md:text-4xl font-black text-black/80 tracking-tighter">2026</span>
                <span className="text-sm font-bold bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md">
                  Bienvenido, Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN SECUNDARIA (About me, Resume, Work) */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-black/10 bg-white/10">
          <div className="flex gap-6 text-sm font-bold text-foreground">
            <span className="border-b-2 border-foreground pb-1 cursor-pointer">Resumen</span>
            <span className="text-foreground/50 hover:text-foreground cursor-pointer transition-colors">Trabajo</span>
          </div>
          <Button variant="ghost" className="text-xs font-bold rounded-full hover:bg-black/5">
            Ver más <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* SECCIÓN 2: INTRODUCCIÓN Y CONTACTO */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black/10">
          
          {/* Tarjeta Negra (Mi nombre es...) */}
          <div className="md:col-span-4 p-6 border-r border-black/10">
            <div className="bg-[#1a1a1a] text-white rounded-3xl p-6 h-full min-h-[300px] flex flex-col justify-between relative overflow-hidden shadow-xl border border-white/10">
               {/* Efecto de foto de fondo */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0"></div>
               
               <div className="relative z-10">
                  <span className="text-xs text-white/60 mb-2 block font-medium">Hola,</span>
                  <h3 className="text-3xl font-bold leading-tight mb-4">Mi nombre es <br/>Administrador</h3>
                  <p className="text-xs text-white/70 leading-relaxed mt-4">
                    Gestiono los recursos y el talento de la fundación para asegurar que la música llegue a todos.
                  </p>
               </div>
            </div>
          </div>

          {/* Columna Derecha (Introducción y Get in Touch) */}
          <div className="md:col-span-8 p-6 flex flex-col gap-6 bg-white/5">
            <Card className="bg-transparent border-0 shadow-none">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Introducción</h3>
                <div className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center">
                  <ChevronDown className="w-4 h-4 text-foreground" />
                </div>
              </div>
              <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                  Como administrador de la fundación, mi objetivo es facilitar la inscripción, el seguimiento académico y la gestión de eventos musicales, garantizando una experiencia óptima para estudiantes y profesores.
                </p>
              </div>
            </Card>

            {/* Get In Touch */}
            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <h3 className="text-sm font-bold text-foreground">Acceso Rápido</h3>
                <div className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center">
                  <ChevronDown className="w-4 h-4 text-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Link href="/tabla" className="bg-[#1a1a1a] text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg border border-white/10">
                  <Users className="w-6 h-6" />
                  <span className="text-[10px] font-bold">Estudiantes</span>
                </Link>
                <Link href="/inscripcion_alumno" className="bg-primary text-primary-foreground rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg border border-primary/50">
                  <UserPlus className="w-6 h-6" />
                  <span className="text-[10px] font-bold">Inscribir</span>
                </Link>
                <div className="bg-white/40 backdrop-blur-md text-foreground rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform shadow-sm border border-white/60">
                  <Mail className="w-6 h-6" />
                  <span className="text-[10px] font-bold">Mensajes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: COLUMNAS (Experiencia, Expertise, Educación) */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10 bg-white/5">
          
          {/* Columna 1: Módulos (Experiencia) */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Módulos</h3>
              <div className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center">
                <ChevronDown className="w-4 h-4 text-foreground" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-white/40 bg-white/20 backdrop-blur-md rounded-2xl p-5 hover:border-primary/50 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <Tag variant="primary">Activo</Tag>
                  <div className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center">
                    <Briefcase className="w-3 h-3 text-foreground/70" />
                  </div>
                </div>
                <h4 className="font-bold text-foreground text-sm mt-3">Inscripciones</h4>
                <p className="text-xs text-foreground/60 mt-1">Gestión de nuevos ingresos</p>
                <div className="flex justify-between items-center text-[10px] font-bold text-foreground/50 mt-4 pt-3 border-t border-black/5">
                  <span>Ver todo</span>
                  <span>12 Pendientes</span>
                </div>
              </div>

              <div className="border border-white/40 bg-white/20 backdrop-blur-md rounded-2xl p-5 hover:border-primary/50 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <Tag variant="glass">Base de Datos</Tag>
                  <div className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center">
                    <Music className="w-3 h-3 text-foreground/70" />
                  </div>
                </div>
                <h4 className="font-bold text-foreground text-sm mt-3">Partituras</h4>
                <p className="text-xs text-foreground/60 mt-1">Administrar archivos musicales</p>
                <div className="flex justify-between items-center text-[10px] font-bold text-foreground/50 mt-4 pt-3 border-t border-black/5">
                  <span>Ver todo</span>
                  <span>Actualizado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 2: Habilidades (Expertise) */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Expertise</h3>
              <div className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center">
                <ChevronDown className="w-4 h-4 text-foreground" />
              </div>
            </div>

            <p className="text-xs text-foreground/70 font-medium mb-6 leading-relaxed">
              Gestión Académica, Administración de Personal, Logística de Eventos, Educación Musical y Desarrollo Comunitario.
            </p>

            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-foreground">Habilidades</h4>
              <div className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center">
                <ChevronDown className="w-4 h-4 text-foreground" />
              </div>
            </div>

            {/* Imagen simulada de "Hard Skills" */}
            <div className="bg-[#e8e3d9] rounded-2xl h-32 w-full mb-4 overflow-hidden relative border border-white/50">
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <Music className="w-16 h-16 text-black" />
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-8 h-8 rounded-full bg-[#FF9A00] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">Ai</div>
                <div className="w-8 h-8 rounded-full bg-[#00005B] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">Ps</div>
                <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">Id</div>
                <div className="w-8 h-8 rounded-full bg-[#FF3366] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">Pr</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-foreground">Softskills</h4>
              <div className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center">
                <ChevronDown className="w-4 h-4 text-foreground" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Tag variant="dark">#Liderazgo</Tag>
              <Tag variant="glass">#Trabajo en equipo</Tag>
              <Tag variant="glass">#Resolución</Tag>
              <Tag variant="dark">#Comunicación</Tag>
            </div>
          </div>

          {/* Columna 3: Educación (Education) */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Educación</h3>
              <div className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center">
                <ChevronDown className="w-4 h-4 text-foreground" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1a1a1a] text-white rounded-2xl p-5 shadow-lg border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <Tag variant="dark">2026</Tag>
                  <Award className="w-5 h-5 text-white/50" />
                </div>
                <p className="text-[10px] text-white/60 mb-1">Actual</p>
                <h4 className="font-bold text-sm leading-tight mb-2">Gestión de Instituciones Culturales</h4>
                <p className="text-[10px] text-white/50">Universidad Nacional</p>
              </div>

              <div className="bg-[#1a1a1a] text-white rounded-2xl p-5 shadow-lg border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <Tag variant="dark">2020 - 2024</Tag>
                  <CalendarDays className="w-5 h-5 text-white/50" />
                </div>
                <p className="text-[10px] text-white/60 mb-1">Grado</p>
                <h4 className="font-bold text-sm leading-tight mb-2">Licenciatura en Música</h4>
                <p className="text-[10px] text-white/50">Conservatorio de Música</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}