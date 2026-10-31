'use client'; // Necesario para usar useSession y signOut

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Music, 
  UserPlus, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  // Validar si es administrador
  const isAdmin = session?.user?.rol === 'administrador'

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      toast.success('Sesión cerrada exitosamente')
      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error('Error al cerrar sesión')
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 font-montserrat flex justify-center">
      
      {/* Panel Principal (Liquid Glass Amplio) */}
      <div className="w-full max-w-[1400px] bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[2.5rem] shadow-[0_20px_60px_rgba(91,43,23,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] overflow-hidden relative">
        
        {/* Brillo sutil de fondo */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="p-6 md:p-12 relative z-10">
          
          {/* SECCIÓN SUPERIOR: Bienvenida y Tarjeta de Usuario */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-2">
                Hola, <span className="text-primary">{session?.user?.nombre || 'Estudiante'}</span>
              </h1>
              <p className="text-base text-foreground/70 font-medium max-w-2xl">
                Bienvenido al portal de la Fundación Musical. Desde aquí puedes acceder a tu material de estudio y gestionar tu cuenta.
              </p>
            </div>

            {/* Tarjeta de Usuario Pequeña */}
            <div className="flex items-center gap-4 bg-white/30 backdrop-blur-md border border-white/50 p-3 pr-5 rounded-3xl shadow-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                <UserIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground leading-tight">
                  {session?.user?.nombre} {session?.user?.apellido}
                </span>
                <span className="text-[10px] text-foreground/60 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                  {isAdmin ? <><ShieldCheck className="w-3 h-3" /> Administrador</> : 'Estudiante'}
                </span>
              </div>
              <div className="w-px h-8 bg-black/10 mx-2"></div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full h-10 w-10"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* MÓDULOS PRINCIPALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            
            {/* Módulo 1: Partituras (Destacado y Principal para alumnos) */}
            <Link href="/partituras" className="group md:col-span-2 lg:col-span-1">
              <Card className="h-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 rounded-[2rem] overflow-hidden relative border border-primary/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <CardContent className="p-8 flex flex-col h-full relative z-10 min-h-[250px] justify-between">
                  <div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-white">Mis Partituras</h3>
                    <p className="text-sm text-primary-foreground/80 mb-6 font-medium">
                      Accede a tu repertorio musical, practica en casa y descarga los materiales de tus clases.
                    </p>
                  </div>
                  <div className="flex items-center text-white font-bold text-sm bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
                    Explorar Archivos
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Módulo 2: Estudiantes (SOLO ADMINISTRADORES) */}
            {isAdmin && (
              <Link href="/tabla" className="group">
                <Card className="h-full bg-white/30 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-xl hover:border-primary/50 hover:bg-white/40 transition-all duration-300 rounded-[2rem]">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Users className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Base de Datos</h3>
                    <p className="text-sm text-foreground/60 mb-6 flex-1 font-medium">
                      Consulta la tabla general de alumnos, edita expedientes y gestiona el estatus del personal.
                    </p>
                    <div className="flex items-center text-blue-600 font-bold text-sm">
                      Ver Estudiantes
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}

            {/* Módulo 3: Inscripciones (SOLO ADMINISTRADORES) */}
            {isAdmin && (
              <Link href="/inscripcion_alumno" className="group">
                <Card className="h-full bg-white/30 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-xl hover:border-primary/50 hover:bg-white/40 transition-all duration-300 rounded-[2rem]">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <UserPlus className="w-7 h-7 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Inscripciones</h3>
                    <p className="text-sm text-foreground/60 mb-6 flex-1 font-medium">
                      Registra nuevos estudiantes en el sistema, asigna representantes y actualiza sus datos.
                    </p>
                    <div className="flex items-center text-purple-600 font-bold text-sm">
                      Nuevo Alumno
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>

          {/* SECCIÓN DE HISTORIA */}
          <div className="bg-white/20 backdrop-blur-lg border border-white/40 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
             {/* Adorno de fondo */}
             <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                <Music className="w-64 h-64" />
             </div>

            <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
              <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">Historia del Sistema Nacional de Orquestas</h2>
              
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-px bg-primary/50"></div>
                <div className="mx-4">
                  <Star className="text-primary w-5 h-5 fill-primary" />
                </div>
                <div className="w-16 h-px bg-primary/50"></div>
              </div>
              
              <p className="text-foreground/80 text-lg leading-relaxed font-medium">
                El Sistema Nacional de Orquestas y Coros Juveniles e Infantiles de Venezuela, 
                conocido mundialmente como <strong className="text-foreground">'El Sistema'</strong>, es un programa de educación musical fundado 
                en 1975 por el maestro y músico venezolano José Antonio Abreu.
              </p>
              
              <p className="text-foreground/80 text-base leading-relaxed">
                Su misión principal ha sido sistematizar la instrucción y la práctica colectiva e individual de la música 
                a través de orquestas sinfónicas y coros, como instrumentos de organización social y desarrollo humanístico. 
                Ha demostrado ser un modelo de transformación social, rescatando a millones de niños y jóvenes en situación de vulnerabilidad.
              </p>

              <blockquote className="italic border-l-4 border-primary pl-6 my-8 text-foreground text-left bg-white/30 p-6 rounded-r-2xl shadow-sm">
                'La música es un instrumento irremplazable para unir a las personas y expresar los sentimientos más profundos del alma humana.'
                <footer className="mt-3 text-primary text-sm not-italic font-bold uppercase tracking-widest">— José Antonio Abreu</footer>
              </blockquote>

              <p className="text-foreground/80 text-base leading-relaxed">
                Hoy en día, El Sistema es un referente internacional y atiende a cientos de miles de niños y jóvenes, 
                demostrando que el arte y la cultura son las herramientas más poderosas para la paz y el progreso.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}