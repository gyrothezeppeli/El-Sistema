// app/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ChevronDown, 
  UserPlus, 
  FileText, 
  Mail, 
  Music,
  CalendarDays,
  Award,
  Users,
  Settings,
  Clock,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'

// Componente para las etiquetas estilo "Pill"
const Tag = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'primary' | 'outline' }) => {
  const base = "px-3 py-1.5 text-xs font-bold rounded-full border transition-colors";
  const variants = {
    default: "bg-black/5 text-foreground border-transparent hover:bg-black/10",
    primary: "bg-primary text-primary-foreground border-primary hover:bg-primary/90",
    outline: "bg-transparent text-foreground border-border hover:bg-black/5"
  };
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 font-montserrat">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header de la página */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Panel de Control</h1>
            <p className="text-muted-foreground text-sm font-medium mt-1">Gestiona tu fundación musical</p>
          </div>
          <Button variant="outline" className="rounded-full gap-2 border-border">
            <Settings className="w-4 h-4" />
            Ajustes
          </Button>
        </div>

        {/* Sección de Introducción (Similar al "Hello, My name is Qorry") */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Tarjeta de Bienvenida (Izquierda) */}
          <div className="md:col-span-4 bg-foreground text-background rounded-[2rem] p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden shadow-lg">
            {/* Patrón sutil de fondo */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-background/70 mb-2 block">Hola,</span>
              <h2 className="text-3xl font-black leading-tight mb-4">
                Mi nombre es <br />
                <span className="text-primary">Administrador</span>
              </h2>
              <p className="text-sm text-background/80 font-medium leading-relaxed">
                Considero que la música es una herramienta fundamental para el desarrollo humano.
              </p>
            </div>

            <div className="relative z-10 flex gap-2 mt-6">
              <Link href="/tabla">
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  Ver Estudiantes
                </Button>
              </Link>
            </div>
          </div>

          {/* Tarjeta de Introducción (Derecha) */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <Card className="border-border/50 bg-card rounded-[2rem] flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                  Introducción
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bienvenido al sistema de gestión. Desde aquí puedes administrar inscripciones, 
                  revisar la tabla general de alumnos y gestionar los recursos de la fundación. 
                  Utiliza el menú para navegar a las diferentes secciones.
                </p>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  <Tag variant="primary">Dashboard</Tag>
                  <Tag variant="outline">Gestión</Tag>
                  <Tag variant="outline">Música</Tag>
                  <Tag variant="outline">Administración</Tag>
                </div>
              </CardContent>
            </Card>

            {/* Get In Touch (Redes / Contacto rápido) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-foreground text-background rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer">
                <Mail className="w-6 h-6" />
                <span className="text-[10px] font-bold">Correo</span>
              </div>
              <div className="bg-primary text-primary-foreground rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer">
                <FileText className="w-6 h-6" />
                <span className="text-[10px] font-bold">Reportes</span>
              </div>
              <div className="bg-card border-2 border-border text-foreground rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted transition cursor-pointer">
                <Users className="w-6 h-6" />
                <span className="text-[10px] font-bold">Usuarios</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Inferior: Columnas (Experiencia, Habilidades, Educación) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Columna 1: Accesos Rápidos (Experiencia) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-foreground">Módulos</h3>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="border-border/50 bg-card rounded-[1.5rem] hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <Tag variant="primary">Activo</Tag>
                  <UserPlus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-bold text-foreground text-lg mb-1">Inscripciones</h4>
                <p className="text-xs text-muted-foreground mb-4">Registra nuevos alumnos y representantes.</p>
                <Link href="/inscripcion_alumno" className="text-xs font-bold text-primary hover:underline">
                  Ir al formulario →
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card rounded-[1.5rem] hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <Tag variant="outline">Base de Datos</Tag>
                  <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-bold text-foreground text-lg mb-1">Estudiantes</h4>
                <p className="text-xs text-muted-foreground mb-4">Consulta la tabla general de alumnos.</p>
                <Link href="/tabla" className="text-xs font-bold text-primary hover:underline">
                  Ver tabla →
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Columna 2: Habilidades / Estadísticas (Hard Skills) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-foreground">Resumen</h3>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="border-border/50 bg-card rounded-[1.5rem] overflow-hidden">
              <div className="bg-foreground/5 p-6 flex flex-col items-center justify-center border-b border-border/50">
                 <Music className="w-12 h-12 text-primary mb-3" />
                 <span className="text-3xl font-black text-foreground">124</span>
                 <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Alumnos Activos</span>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Inscripciones este mes</span>
                  <span className="font-bold text-foreground">12</span>
                </div>
                <div className="w-full bg-border/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary w-[60%] h-full rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card rounded-[1.5rem] p-5">
              <h4 className="font-bold text-foreground mb-3 text-sm">Herramientas</h4>
              <div className="flex flex-wrap gap-2">
                <Tag variant="primary">Partituras</Tag>
                <Tag variant="default">Calendario</Tag>
                <Tag variant="default">Pagos</Tag>
                <Tag variant="outline">Inventario</Tag>
              </div>
            </Card>
          </div>

          {/* Columna 3: Educación / Eventos (Education) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-foreground">Próximos Eventos</h3>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="border-border/50 bg-card rounded-[1.5rem] hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <Tag variant="primary">2026</Tag>
                  <CalendarDays className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="font-bold text-foreground mb-1">Concierto de Gala</h4>
                <p className="text-xs text-muted-foreground mb-2">Sala Principal - 7:00 PM</p>
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground border-t border-border/50 pt-3 mt-3">
                  <span>Invitados: 200</span>
                  <span>Confirmado</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card rounded-[1.5rem] hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <Tag variant="outline">2026</Tag>
                  <Award className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="font-bold text-foreground mb-1">Audiciones</h4>
                <p className="text-xs text-muted-foreground mb-2">Nuevos ingresos - 9:00 AM</p>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  )
}