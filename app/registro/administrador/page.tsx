// components/RegisterForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, UserPlus, User, Mail, Lock, AlertCircle, CheckCircle2, IdCard, Shield, Key } from 'lucide-react'

interface RegisterData {
  email: string
  nombre: string
  apellido: string
  cedula: string
  password: string
  confirmPassword: string
  rol: string
  codigoAdmin: string
}

interface FieldErrors {
  nombre: string
  apellido: string
  cedula: string
  email?: string
  password?: string
  confirmPassword?: string
  codigoAdmin?: string
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    nombre: '',
    apellido: '',
    cedula: '',
    password: '',
    confirmPassword: '',
    rol: 'admin',
    codigoAdmin: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    nombre: '',
    apellido: '',
    cedula: ''
  })
  
  const router = useRouter()

  // Código de administrador (puedes cambiarlo por uno más seguro)
  const ADMIN_CODE = "ADMIN2025";

  // 🔍 VALIDACIONES ESPECÍFICAS
  const validateCedula = (cedula: string): string => {
    if (!cedula.trim()) return 'La cédula es obligatoria'
    if (!/^\d+$/.test(cedula)) return 'Solo se permiten números'
    if (cedula.length < 7 || cedula.length > 8) return 'La cédula debe tener entre 7 y 8 dígitos'
    return ''
  }

  const validateNombre = (text: string): string => {
    if (!text.trim()) return 'Este campo es obligatorio'
    if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(text)) return 'Solo se permiten letras y espacios'
    if (text.trim().length < 2) return 'Debe tener al menos 2 caracteres'
    if (text.trim().length > 50) return 'No puede exceder los 50 caracteres'
    return ''
  }

  const validateApellido = (text: string): string => {
    if (!text.trim()) return 'Este campo es obligatorio'
    if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(text)) return 'Solo se permiten letras y espacios'
    if (text.trim().length < 2) return 'Debe tener al menos 2 caracteres'
    if (text.trim().length > 50) return 'No puede exceder los 50 caracteres'
    return ''
  }

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'El correo electrónico es obligatorio'
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'El formato del correo electrónico no es válido'
    return ''
  }

  const validatePassword = (password: string): string => {
    if (!password) return 'La contraseña es obligatoria'
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    }
    return ''
  }

  const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    if (!confirmPassword) return 'Debes confirmar tu contraseña'
    if (confirmPassword !== password) return 'Las contraseñas no coinciden'
    return ''
  }

  const validateAdminCode = (code: string): string => {
    if (!code.trim()) return 'El código de administrador es obligatorio'
    if (code !== ADMIN_CODE) return 'Código de administrador incorrecto'
    return ''
  }

  const handleChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validación en tiempo real
    let fieldError = ''
    
    switch (field) {
      case 'cedula':
        fieldError = validateCedula(value)
        break
      case 'nombre':
        fieldError = validateNombre(value)
        break
      case 'apellido':
        fieldError = validateApellido(value)
        break
      case 'email':
        fieldError = validateEmail(value)
        break
      case 'password':
        fieldError = validatePassword(value)
        // Re-validar confirmación si cambia la contraseña
        if (formData.confirmPassword) {
          setFieldErrors(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
          }))
        }
        break
      case 'confirmPassword':
        fieldError = validateConfirmPassword(value, formData.password)
        break
      case 'codigoAdmin':
        fieldError = validateAdminCode(value)
        break
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [field]: fieldError
    }))
    
    if (error) setError('')
    if (success) setSuccess('')
  }

  const validateForm = (): boolean => {
    const errors: FieldErrors = {
      nombre: validateNombre(formData.nombre),
      apellido: validateApellido(formData.apellido),
      cedula: validateCedula(formData.cedula),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
      codigoAdmin: validateAdminCode(formData.codigoAdmin)
    }

    setFieldErrors(errors)

    const hasErrors = Object.values(errors).some(error => error !== '')
    if (hasErrors) {
      setError('Por favor corrige los errores en el formulario')
      return false
    }

    return true
  }

  const handleRegister = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          nombre: userData.nombre.trim(),
          apellido: userData.apellido.trim(),
          cedula: userData.cedula,
          password: userData.password,
          rol: 'admin' // Siempre será admin
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro')
      }

      return true
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      await handleRegister(formData)
      
      setSuccess('¡Administrador registrado exitosamente! Redirigiendo al login...')
      setFormData({
        email: '',
        nombre: '',
        apellido: '',
        cedula: '',
        password: '',
        confirmPassword: '',
        rol: 'admin',
        codigoAdmin: ''
      })
      
      setTimeout(() => {
        router.push('/')
      }, 2000)
      
    } catch (err: unknown) {
      // Obtener mensaje de error de forma segura
      let errorMessage = 'Error al procesar el registro. Por favor, intenta nuevamente.'
      
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return !Object.values(fieldErrors).some(error => error !== '') &&
           formData.nombre.trim() !== '' &&
           formData.apellido.trim() !== '' &&
           formData.cedula.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.password !== '' &&
           formData.confirmPassword !== '' &&
           formData.codigoAdmin !== ''
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-[#D9C7A8]">
      <CardHeader className="space-y-1 text-center pb-6 bg-gradient-to-r from-[#795C34] to-[#65350F] text-white rounded-t-lg">
        <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold">Registro de Administrador</CardTitle>
        <CardDescription className="text-lg text-[#E8DFD1]">
          Acceso exclusivo para personal autorizado
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 bg-[#FDF8F3] p-8">
        {/* Advertencia de seguridad */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Key className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">Acceso Restringido</p>
              <p className="text-sm text-amber-700 mt-1">
                Este formulario es exclusivo para crear cuentas de administrador. 
                Solo personal autorizado debe completar este registro.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo Nombre */}
            <div className="space-y-3">
              <Label htmlFor="nombre" className="text-sm font-medium text-[#362511]">
                Nombre *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  required
                  disabled={isLoading}
                  className={`h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10 ${
                    fieldErrors.nombre ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  maxLength={50}
                />
              </div>
              {fieldErrors.nombre && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {fieldErrors.nombre}
                </p>
              )}
            </div>
            
            {/* Campo Apellido */}
            <div className="space-y-3">
              <Label htmlFor="apellido" className="text-sm font-medium text-[#362511]">
                Apellido *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                <Input
                  id="apellido"
                  type="text"
                  placeholder="Ingresa tu apellido"
                  value={formData.apellido}
                  onChange={(e) => handleChange('apellido', e.target.value)}
                  required
                  disabled={isLoading}
                  className={`h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10 ${
                    fieldErrors.apellido ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  maxLength={50}
                />
              </div>
              {fieldErrors.apellido && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {fieldErrors.apellido}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo Cédula */}
            <div className="space-y-3">
              <Label htmlFor="cedula" className="text-sm font-medium text-[#362511]">
                Cédula de Identidad *
              </Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                <Input
                  id="cedula"
                  type="text"
                  placeholder="Ej: 12345678"
                  value={formData.cedula}
                  onChange={(e) => {
                    // Permitir solo números
                    const value = e.target.value.replace(/\D/g, '')
                    handleChange('cedula', value)
                  }}
                  required
                  disabled={isLoading}
                  className={`h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10 ${
                    fieldErrors.cedula ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  maxLength={8}
                />
              </div>
              {fieldErrors.cedula ? (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {fieldErrors.cedula}
                </p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">
                  {formData.cedula.length}/8 dígitos
                </p>
              )}
            </div>

            {/* Campo Email */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-[#362511]">
                Correo Electrónico *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sistema.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  disabled={isLoading}
                  className={`h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10 ${
                    fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo Contraseña */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium text-[#362511]">
                Contraseña *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  disabled={isLoading}
                  className={`h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10 pr-12 ${
                    fieldErrors.password ? 'border-red-500 focus:border-red-500' : ''
                  }`}
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
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {fieldErrors.password}
                </p>
              )}
              <p className="text-gray-500 text-xs">
                Debe contener al menos una mayúscula, una minúscula y un número
              </p>
            </div>

            {/* Campo Confirmar Contraseña */}
            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#362511]">
                Confirmar Contraseña *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                  disabled={isLoading}
                  className={`h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10 pr-12 ${
                    fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                  }`}
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
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Campo Código de Administrador */}
          <div className="space-y-3">
            <Label htmlFor="codigoAdmin" className="text-sm font-medium text-[#362511]">
              Código de Administrador *
            </Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-[#795C34]" />
              <Input
                id="codigoAdmin"
                type="password"
                placeholder="Ingresa el código de acceso"
                value={formData.codigoAdmin}
                onChange={(e) => handleChange('codigoAdmin', e.target.value)}
                required
                disabled={isLoading}
                className={`h-12 text-base border-[#D9C7A8] focus:border-[#795C34] bg-white pl-10 ${
                  fieldErrors.codigoAdmin ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
            </div>
            {fieldErrors.codigoAdmin && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {fieldErrors.codigoAdmin}
              </p>
            )}
            <p className="text-gray-500 text-xs">
              Código especial requerido para crear cuentas de administrador
            </p>
          </div>

          {/* Información del Rol */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Cuenta de Administrador</p>
                <p className="text-sm text-blue-700 mt-1">
                  Esta cuenta tendrá acceso completo al sistema: gestión de estudiantes, 
                  representantes, reportes y configuración del sistema.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium">Error en el registro</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium">¡Administrador registrado exitosamente!</p>
                <p className="mt-1">{success}</p>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-[#795C34] to-[#65350F] hover:from-[#65350F] hover:to-[#5E2C04] transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Creando cuenta de administrador...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Shield className="w-5 h-5 mr-2" />
                Registrar Administrador
              </div>
            )}
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-[#D9C7A8]">
          <p className="text-sm text-[#5E2C04]">
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              className="text-[#795C34] hover:text-[#65350F] font-medium transition-colors underline hover:no-underline"
              onClick={() => router.push('/')}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}