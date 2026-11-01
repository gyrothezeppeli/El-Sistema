// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, LogIn, Music, User, AlertCircle, Key } from 'lucide-react'
import { toast } from 'sonner'
import bcrypt from 'bcryptjs'

type AuthMode = 'login' | 'register';
const ADMIN_CODE = "admin2026";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    email: '', password: '', nombre: '', apellido: '', cedula: '',
    confirmPassword: '', isAdminRegister: false, adminCode: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          if (session.user.rol === 'administrador') router.push('/dashboard');
          else router.push('/inicio');
        }
      } catch (error: unknown) {
        console.error("Error checking auth:", error);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password) {
        setError('Por favor completa todos los campos');
        setIsLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciales inválidas');
        toast.error('Credenciales inválidas');
      } else {
        const session = await getSession();
        toast.success('¡Bienvenido!');
        if (session?.user?.rol === 'administrador') router.push('/dashboard');
        else router.push('/inicio');
        router.refresh();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password || !formData.nombre || !formData.apellido || !formData.cedula) {
        setError('Por favor completa todos los campos');
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setIsLoading(false);
        return;
      }

      let rolId = 2;
      if (formData.isAdminRegister) {
        if (!formData.adminCode || formData.adminCode !== ADMIN_CODE) {
          setError('Código de administrador incorrecto');
          setIsLoading(false);
          return;
        }
        rolId = 1;
      }

      const hashedPassword = await bcrypt.hash(formData.password, 10);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email, nombre: formData.nombre, apellido: formData.apellido,
          cedula: formData.cedula, password: hashedPassword, rolId: rolId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al registrar usuario');

      toast.success(formData.isAdminRegister ? '¡Administrador registrado!' : '¡Registro exitoso!');
      setMode('login');
      setFormData({ email: '', password: '', nombre: '', apellido: '', cedula: '', confirmPassword: '', isAdminRegister: false, adminCode: '' });
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setFormData({ email: '', password: '', nombre: '', apellido: '', cedula: '', confirmPassword: '', isAdminRegister: false, adminCode: '' });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 font-montserrat">
      
      <main className="relative z-10 w-full max-w-sm my-6">
        {/* Usamos el estilo de tarjeta translúcida que definiste en globals.css */}
        <div className="bg-card border border-border shadow-2xl backdrop-blur-xl rounded-[1.75rem] p-8">
          
          <div className="text-left mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Music className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
              {mode === 'login' ? 'Iniciar sesión' : (formData.isAdminRegister ? 'Registro Admin' : 'Crear cuenta')}
            </h1>
            <p className="text-muted-foreground text-xs font-normal">
              {mode === 'login' ? 'Ingresa tus credenciales para continuar' : 'Completa tus datos para crear una cuenta'}
            </p>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Correo Electrónico"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                  disabled={isLoading}
                  className="pl-11 h-12"
                />
              </div>
              
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  disabled={isLoading}
                  className="pr-11 h-12"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error && (
                <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-start">
                  <AlertCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-sm font-semibold shadow-md mt-2" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Cargando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Iniciar sesión
                  </div>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="flex gap-1 p-1 bg-secondary rounded-xl border border-border mb-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isAdminRegister: false, adminCode: '' }))}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    !formData.isAdminRegister ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  disabled={isLoading}
                >
                  Estudiante
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isAdminRegister: true }))}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    formData.isAdminRegister ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  disabled={isLoading}
                >
                  Administrador
                </button>
              </div>

              {formData.isAdminRegister && (
                <div className="relative">
                  <Input
                    id="adminCode"
                    type="password"
                    placeholder="Código de administrador *"
                    value={formData.adminCode}
                    onChange={handleInputChange('adminCode')}
                    required={formData.isAdminRegister}
                    disabled={isLoading}
                    className="h-11 text-xs pr-9"
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary z-10" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Input id="nombre" type="text" placeholder="Nombre *" value={formData.nombre} onChange={handleInputChange('nombre')} required disabled={isLoading} className="h-11 text-xs" />
                <Input id="apellido" type="text" placeholder="Apellido *" value={formData.apellido} onChange={handleInputChange('apellido')} required disabled={isLoading} className="h-11 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input id="cedula" type="text" placeholder="Cédula *" value={formData.cedula} onChange={handleInputChange('cedula')} required disabled={isLoading} className="h-11 text-xs" />
                <Input id="email" type="email" placeholder="Correo *" value={formData.email} onChange={handleInputChange('email')} required disabled={isLoading} className="h-11 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Contraseña *" value={formData.password} onChange={handleInputChange('password')} required disabled={isLoading} className="h-11 text-xs" />
                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirmar *" value={formData.confirmPassword} onChange={handleInputChange('confirmPassword')} required disabled={isLoading} className="h-11 text-xs" />
              </div>

              {error && (
                <div className="p-2.5 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-start">
                  <AlertCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-sm font-semibold shadow-md mt-1" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Registrando...
                  </div>
                ) : (
                  formData.isAdminRegister ? 'Registrar Admin' : 'Registrar Estudiante'
                )}
              </Button>
            </form>
          )}

          <div className="text-center pt-5 mt-4 border-t border-border/50">
            <button type="button" onClick={toggleMode} disabled={isLoading} className="text-xs font-normal text-muted-foreground hover:text-foreground transition-colors">
              {mode === 'login' ? (
                <>¿No tienes una cuenta? <span className="font-semibold text-primary hover:underline">Regístrate</span></>
              ) : (
                <>¿Ya tienes una cuenta? <span className="font-semibold text-primary hover:underline">Inicia sesión</span></>
              )}
            </button>
          </div>

        </div>
      </main>

      <footer className="w-full text-muted-foreground/80 py-3 text-center relative z-10 text-[11px] font-semibold">
        <p>© 2026 Fundación Musical Latina</p>
      </footer>
    </div>
  );
}