// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, LogIn, Music, User, AlertCircle, Shield, Key } from 'lucide-react'
import { toast } from 'sonner'
import bcrypt from 'bcryptjs'

type AuthMode = 'login' | 'register';

const ADMIN_CODE = "admin2026";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    cedula: '',
    confirmPassword: '',
    isAdminRegister: false,
    adminCode: '',
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
          if (session.user.rol === 'administrador') {
            router.push('/dashboard');
          } else {
            router.push('/inicio');
          }
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
        if (session?.user?.rol === 'administrador') {
          router.push('/dashboard');
        } else {
          router.push('/inicio');
        }
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
          email: formData.email,
          nombre: formData.nombre,
          apellido: formData.apellido,
          cedula: formData.cedula,
          password: hashedPassword,
          rolId: rolId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al registrar usuario');

      toast.success(formData.isAdminRegister ? '¡Administrador registrado exitosamente!' : '¡Registro exitoso!');
      setMode('login');
      setFormData({
        email: '',
        password: '',
        nombre: '',
        apellido: '',
        cedula: '',
        confirmPassword: '',
        isAdminRegister: false,
        adminCode: '',
      });
      
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
    setFormData({
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      cedula: '',
      confirmPassword: '',
      isAdminRegister: false,
      adminCode: '',
    });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F2E7CB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#C64F2D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2A1E14]/70 text-xs font-semibold tracking-wider uppercase">Cargando...</p>
        </div>
      </div>
    );
  }

  // Estilos limpios inspirados en el diseño de tarjetas editoriales
  const inputClass = "w-full bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-2xl h-13 pl-11 pr-11 outline-none focus:border-[#C64F2D] focus:ring-2 focus:ring-[#C64F2D]/20 transition-all text-sm shadow-sm";
  const inputNoIconClass = "w-full bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-2xl h-13 px-4 outline-none focus:border-[#C64F2D] focus:ring-2 focus:ring-[#C64F2D]/20 transition-all text-sm shadow-sm";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-5 bg-[#F2E7CB] text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* Tarjeta con estilo editorial limpio sobre fondo crema */}
      <main className="relative z-10 w-full max-w-sm my-6">
        <div className="bg-white/90 border border-white shadow-[0_20px_50px_rgba(42,30,20,0.08)] backdrop-blur-xl rounded-[32px] p-8">
          
          {/* Header minimalista y estructurado */}
          <div className="text-left mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C64F2D] text-white shadow-sm">
                <Music className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C64F2D]">
                Fundación Musical Latina
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
              {mode === 'login' 
                ? 'Iniciar sesión'
                : (formData.isAdminRegister ? 'Registro Admin' : 'Crear cuenta')
              }
            </h1>
            <p className="text-gray-500 text-xs font-normal">
              {mode === 'login'
                ? 'Ingresa tus credenciales para continuar'
                : 'Completa tus datos para crear una cuenta'
              }
            </p>
          </div>

          {mode === 'login' ? (
            /* FORMULARIO DE LOGIN */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Correo Electrónico"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    disabled={isLoading}
                    className={inputClass}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                    disabled={isLoading}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {/* Botón principal con acento en rojo (#C64F2D) */}
              <Button 
                type="submit" 
                className="w-full h-12 text-sm font-semibold bg-[#C64F2D] hover:bg-[#a93e1f] text-white transition-all duration-200 rounded-2xl shadow-md mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
            /* FORMULARIO DE REGISTRO */
            <form onSubmit={handleRegister} className="space-y-3">
              
              {/* Selector Estudiante / Administrador con acento rojo en la opción activa */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200 mb-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isAdminRegister: false, adminCode: '' }))}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    !formData.isAdminRegister
                      ? 'bg-[#C64F2D] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  disabled={isLoading}
                >
                  Estudiante
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isAdminRegister: true }))}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    formData.isAdminRegister
                      ? 'bg-[#C64F2D] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
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
                    className="h-11 text-xs bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-2xl px-4 pr-9 focus:border-[#C64F2D]"
                  />
                  <Key className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-[#C64F2D]" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Nombre *"
                  value={formData.nombre}
                  onChange={handleInputChange('nombre')}
                  required
                  disabled={isLoading}
                  className={inputNoIconClass}
                />
                <Input
                  id="apellido"
                  type="text"
                  placeholder="Apellido *"
                  value={formData.apellido}
                  onChange={handleInputChange('apellido')}
                  required
                  disabled={isLoading}
                  className={inputNoIconClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="cedula"
                  type="text"
                  placeholder="Cédula *"
                  value={formData.cedula}
                  onChange={handleInputChange('cedula')}
                  required
                  disabled={isLoading}
                  className={inputNoIconClass}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="Correo *"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                  disabled={isLoading}
                  className={inputNoIconClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña *"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  disabled={isLoading}
                  className="h-13 text-xs bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-2xl px-4 focus:border-[#C64F2D]"
                />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar *"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  required
                  disabled={isLoading}
                  className="h-13 text-xs bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-2xl px-4 focus:border-[#C64F2D]"
                />
              </div>

              {error && (
                <div className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-sm font-semibold bg-[#C64F2D] hover:bg-[#a93e1f] text-white transition-all rounded-2xl shadow-md mt-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registrando...
                  </div>
                ) : (
                  formData.isAdminRegister ? 'Registrar Admin' : 'Registrar Estudiante'
                )}
              </Button>
            </form>
          )}

          {/* Cambiar de Login a Registro */}
          <div className="text-center pt-5 mt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={toggleMode}
              disabled={isLoading}
              className="text-xs font-normal text-gray-500 hover:text-gray-900 transition-colors"
            >
              {mode === 'login' ? (
                <>¿No tienes una cuenta? <span className="font-semibold text-[#C64F2D] hover:underline">Regístrate</span></>
              ) : (
                <>¿Ya tienes una cuenta? <span className="font-semibold text-[#C64F2D] hover:underline">Inicia sesión</span></>
              )}
            </button>
          </div>

        </div>
      </main>

      {/* Pie de página */}
      <footer className="w-full text-gray-500/80 py-3 text-center relative z-10 text-[11px] font-semibold">
        <p>© 2026 Fundación Musical Latina</p>
      </footer>
    </div>
  );
}