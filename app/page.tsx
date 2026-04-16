// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, LogIn, User, AlertCircle, UserPlus, Shield, Key, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'
import bcrypt from 'bcryptjs'

type AuthMode = 'login' | 'register';

// Código de administrador (solo para validación, no está en BD)
const ADMIN_CODE = "admin2026";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    // Login fields
    email: '',
    password: '',
    
    // Register fields
    nombre: '',
    apellido: '',
    cedula: '',
    confirmPassword: '',
    isAdminRegister: false, // Para saber si quiere registrarse como admin
    adminCode: '', // Código para registro admin
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const router = useRouter();

  // Función para agregar logs de depuración
  const addDebugLog = (message: string) => {
    console.log(`🔍 [DEBUG] ${message}`);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Verificar si ya está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        addDebugLog('Verificando autenticación existente...');
        const session = await getSession();
        
        if (session?.user) {
          addDebugLog(`Sesión activa encontrada para: ${session.user.email}`);
          addDebugLog(`Rol de usuario: ${session.user.rol}`);
          
          // Redirigir según el rol
          if (session.user.rol === 'administrador') {
            addDebugLog('Redirigiendo a dashboard de administrador');
            router.push('/dashboard');
          } else {
            addDebugLog('Redirigiendo a inicio de usuario');
            router.push('/inicio');
          }
        } else {
          addDebugLog('No hay sesión activa');
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        addDebugLog(`Error verificando autenticación: ${errorMessage}`);
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
    setDebugInfo([]);

    try {
      addDebugLog('=== INICIO DE INTENTO DE LOGIN ===');
      addDebugLog(`Email ingresado: ${formData.email}`);
      addDebugLog(`Password ingresada: ${formData.password ? '✓ (presente)' : '✗ (vacía)'}`);

      if (!formData.email || !formData.password) {
        const errorMsg = 'Por favor completa todos los campos';
        addDebugLog(`❌ Error de validación: ${errorMsg}`);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      addDebugLog('Enviando petición de login a NextAuth...');
      
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      addDebugLog(`Respuesta de NextAuth - Status: ${result?.status || 'desconocido'}`);
      addDebugLog(`Respuesta de NextAuth - OK: ${result?.ok || false}`);
      addDebugLog(`Respuesta de NextAuth - Error: ${result?.error || 'ninguno'}`);

      if (result?.error) {
        const errorMsg = 'Credenciales inválidas';
        addDebugLog(`❌ Error de autenticación: ${result.error}`);
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        addDebugLog('✅ Login exitoso, obteniendo sesión...');
        
        // Obtener la sesión para saber el rol
        const session = await getSession();
        
        if (session?.user) {
          addDebugLog(`✅ Sesión obtenida - Usuario: ${session.user.email}`);
          addDebugLog(`✅ Sesión obtenida - Rol: ${session.user.rol}`);
          addDebugLog(`✅ Sesión obtenida - Nombre: ${session.user.nombre} ${session.user.apellido}`);
          
          if (session.user.rol === 'administrador') {
            addDebugLog('Redirigiendo a dashboard de administrador');
            toast.success('¡Bienvenido Administrador!');
            router.push('/inicio');
          } else {
            addDebugLog('Redirigiendo a inicio de usuario');
            toast.success('¡Bienvenido!');
            router.push('/inicio');
          }
          router.refresh();
        } else {
          addDebugLog('⚠️ Login exitoso pero no se pudo obtener la sesión');
          toast.success('¡Bienvenido!');
          router.push('/inicio');
          router.refresh();
        }
      }
    } catch (error: unknown) {
      let errorMessage = 'Error de conexión. Por favor, intenta nuevamente.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        addDebugLog(`🔥 Error en login: ${error.message}`);
        addDebugLog(`🔥 Stack: ${error.stack || 'no disponible'}`);
      } else {
        addDebugLog(`🔥 Error desconocido: ${String(error)}`);
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      addDebugLog('=== FIN DE INTENTO DE LOGIN ===');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDebugInfo([]);

    try {
      addDebugLog('=== INICIO DE INTENTO DE REGISTRO ===');
      addDebugLog(`Email: ${formData.email}`);
      addDebugLog(`Nombre: ${formData.nombre}`);
      addDebugLog(`Apellido: ${formData.apellido}`);
      addDebugLog(`Cédula: ${formData.cedula}`);
      addDebugLog(`Registro como admin: ${formData.isAdminRegister ? 'Sí' : 'No'}`);

      // Validaciones básicas
      if (!formData.email || !formData.password || !formData.nombre || !formData.apellido || !formData.cedula) {
        const errorMsg = 'Por favor completa todos los campos';
        addDebugLog(`❌ Error de validación: ${errorMsg}`);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        const errorMsg = 'Las contraseñas no coinciden';
        addDebugLog(`❌ Error de validación: ${errorMsg}`);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        const errorMsg = 'La contraseña debe tener al menos 6 caracteres';
        addDebugLog(`❌ Error de validación: ${errorMsg}`);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      // Validar código de administrador si quiere ser admin
      let rolId = 2; // Por defecto, rol de estudiante
      
      if (formData.isAdminRegister) {
        addDebugLog('🔑 Verificando código de administrador...');
        
        if (!formData.adminCode) {
          const errorMsg = 'Debes ingresar el código de administrador';
          addDebugLog(`❌ Error: ${errorMsg}`);
          setError(errorMsg);
          setIsLoading(false);
          return;
        }

        if (formData.adminCode !== ADMIN_CODE) {
          const errorMsg = 'Código de administrador incorrecto';
          addDebugLog(`❌ Error: ${errorMsg}`);
          setError(errorMsg);
          setIsLoading(false);
          return;
        }

        addDebugLog('✅ Código de administrador válido');
        rolId = 1; // Rol de administrador
      }

      // Encriptar contraseña
      addDebugLog('Generando hash de contraseña...');
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      addDebugLog('✅ Hash generado correctamente');

      // Enviar datos al servidor
      addDebugLog('Enviando petición de registro a /api/auth/register...');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          nombre: formData.nombre,
          apellido: formData.apellido,
          cedula: formData.cedula,
          password: hashedPassword,
          rolId: rolId, // Enviamos el rolId determinado
        }),
      });

      addDebugLog(`Respuesta del servidor - Status: ${response.status}`);
      addDebugLog(`Respuesta del servidor - StatusText: ${response.statusText}`);

      let data;
      try {
        data = await response.json();
        addDebugLog(`Respuesta del servidor - Data: ${JSON.stringify(data)}`);
      } catch (parseError: unknown) {
        const errorMsg = parseError instanceof Error ? parseError.message : 'Error parseando respuesta';
        addDebugLog(`❌ Error parseando JSON: ${errorMsg}`);
        throw new Error('Error en la respuesta del servidor');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      addDebugLog('✅ Registro exitoso');
      toast.success(formData.isAdminRegister ? '¡Administrador registrado exitosamente!' : '¡Registro exitoso! Ahora puedes iniciar sesión');
      
      // Limpiar formulario y cambiar a modo login
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
      let errorMessage = 'Error al registrar. Por favor, intenta nuevamente.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        addDebugLog(`❌ Error en registro: ${error.message}`);
        addDebugLog(`❌ Stack: ${error.stack || 'no disponible'}`);
      } else {
        addDebugLog(`❌ Error desconocido: ${String(error)}`);
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      addDebugLog('=== FIN DE INTENTO DE REGISTRO ===');
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setDebugInfo([]);
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
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] to-[#F5F1EB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#795C34] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#362511]">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] to-[#F5F1EB] flex flex-col">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-[#795C34] to-[#65350F] text-white py-6 md:py-8 shadow-lg">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-md">
            SISTEMA DE GESTIÓN ESTUDIANTIL
          </h1>
          <p className="text-lg md:text-xl font-semibold text-[#E8DFD1]">
            Fundación Musical Latina
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-[#D9C7A8]">
          <CardHeader className="space-y-1 text-center pb-6 bg-gradient-to-r from-[#795C34] to-[#65350F] text-white rounded-t-lg">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              {mode === 'login' ? (
                <LogIn className="w-8 h-8 text-white" />
              ) : (
                formData.isAdminRegister ? (
                  <Shield className="w-8 h-8 text-white" />
                ) : (
                  <UserPlus className="w-8 h-8 text-white" />
                )
              )}
            </div>
            <CardTitle className="text-3xl font-bold">
              {mode === 'login' 
                ? 'Iniciar Sesión'
                : (formData.isAdminRegister ? 'Registro de Administrador' : 'Registro de Estudiante')
              }
            </CardTitle>
            <CardDescription className="text-lg text-[#E8DFD1]">
              {mode === 'login'
                ? 'Ingresa tus credenciales'
                : 'Completa el formulario para registrarte'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 bg-[#FDF8F3] p-8">
            {mode === 'login' ? (
              /* FORMULARIO DE LOGIN */
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-[#362511]">
                    Correo Electrónico
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="usuario@sistema.com"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      required
                      disabled={isLoading}
                      className="h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-[#362511]">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      required
                      disabled={isLoading}
                      className="h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#795C34] hover:text-[#65350F]"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-[#795C34] to-[#65350F] hover:from-[#65350F] hover:to-[#5E2C04] transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Iniciando sesión...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <LogIn className="w-5 h-5 mr-2" />
                      Iniciar Sesión
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              /* FORMULARIO DE REGISTRO */
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Selector de tipo de registro */}
                <div className="flex gap-2 p-1 bg-[#F5F1EB] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isAdminRegister: false, adminCode: '' }))}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      !formData.isAdminRegister
                        ? 'bg-white text-[#795C34] shadow-sm'
                        : 'text-[#5E2C04] hover:text-[#795C34]'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      Estudiante
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isAdminRegister: true }))}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      formData.isAdminRegister
                        ? 'bg-white text-[#795C34] shadow-sm'
                        : 'text-[#5E2C04] hover:text-[#795C34]'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      Administrador
                    </div>
                  </button>
                </div>

                {formData.isAdminRegister && (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Key className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-amber-800">Registro de Administrador</p>
                          <p className="text-sm text-amber-700 mt-1">
                            Se requiere código especial para registrar administradores.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adminCode" className="text-sm font-medium text-[#362511]">
                        Código de Administrador
                      </Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                        <Input
                          id="adminCode"
                          type="password"
                          placeholder="Ingresa el código de administrador"
                          value={formData.adminCode}
                          onChange={handleInputChange('adminCode')}
                          required={formData.isAdminRegister}
                          disabled={isLoading}
                          className="h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Código especial para registro de administradores
                      </p>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-sm font-medium text-[#362511]">
                      Nombre
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                      <Input
                        id="nombre"
                        type="text"
                        placeholder="Tu nombre"
                        value={formData.nombre}
                        onChange={handleInputChange('nombre')}
                        required
                        disabled={isLoading}
                        className="h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellido" className="text-sm font-medium text-[#362511]">
                      Apellido
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                      <Input
                        id="apellido"
                        type="text"
                        placeholder="Tu apellido"
                        value={formData.apellido}
                        onChange={handleInputChange('apellido')}
                        required
                        disabled={isLoading}
                        className="h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cedula" className="text-sm font-medium text-[#362511]">
                      Cédula de Identidad
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                      <Input
                        id="cedula"
                        type="text"
                        placeholder="V-12345678"
                        value={formData.cedula}
                        onChange={handleInputChange('cedula')}
                        required
                        disabled={isLoading}
                        className="h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-[#362511]">
                      Correo Electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="usuario@ejemplo.com"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        required
                        disabled={isLoading}
                        className="h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-[#362511]">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        required
                        disabled={isLoading}
                        className="h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#795C34] hover:text-[#65350F]"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#362511]">
                      Confirmar Contraseña
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        value={formData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        required
                        disabled={isLoading}
                        className="h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#795C34] hover:text-[#65350F]"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-[#795C34] to-[#65350F] hover:from-[#65350F] hover:to-[#5E2C04] transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Registrando...
                    </div>
                  ) : (
                    formData.isAdminRegister ? 'Registrar Administrador' : 'Registrar Estudiante'
                  )}
                </Button>
              </form>
            )}

            {/* Panel de depuración */}
            {process.env.NODE_ENV === 'development' && debugInfo.length > 0 && (
              <div className="mt-4 p-3 bg-gray-900 text-green-400 rounded-lg text-xs font-mono">
                <p className="font-bold mb-2">🔍 LOGS DE DEPURACIÓN:</p>
                {debugInfo.map((log, index) => (
                  <p key={index} className="whitespace-pre-wrap break-all border-b border-gray-700 py-1">
                    {log}
                  </p>
                ))}
              </div>
            )}

            {/* Divider y botón de cambio */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D9C7A8]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#FDF8F3] text-[#5E2C04]">
                  {mode === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-lg font-semibold border-2 border-[#795C34] text-[#795C34] hover:bg-[#F5F1EB] hover:text-[#65350F] hover:border-[#65350F] transition-all duration-200"
              onClick={toggleMode}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center">
                {mode === 'login' ? (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Crear nueva cuenta
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Volver a iniciar sesión
                  </>
                )}
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-[#795C34] to-[#65350F] text-white py-4 mt-auto">
        <div className="text-center px-4">
          <p className="text-sm">
            © 2024 Fundación Musical Latina - Sistema de Gestión Estudiantil
          </p>
        </div>
      </footer>
    </div>
  );
}