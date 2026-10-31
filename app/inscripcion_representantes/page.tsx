'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckCircle2, Info, Save, User, Users } from 'lucide-react';
import { Suspense } from 'react';
import { toast } from 'sonner';

const gradosInstruccion = [
  "Primaria",
  "Bachillerato",
  "Técnico Medio",
  "TSU",
  "Universitario",
  "Postgrado",
  "Maestría",
  "Doctorado"
];

const parentescos = [
  "Abuelo/a",
  "Tío/a",
  "Hermano/a",
  "Primo/a",
  "Padrino/Madrina",
  "Tutor Legal",
  "Otro"
];

interface FormData {
  // Datos de la Madre
  nombreApellidoMadre: string;
  cedulaMadre: string;
  madreViveConAlumno: string;
  gradoInstruccionMadre: string;
  direccionMadre: string;
  telefonoMadre: string;
  correoMadre: string;

  // Datos del Padre
  nombreApellidoPadre: string;
  cedulaPadre: string;
  padreViveConAlumno: string;
  gradoInstruccionPadre: string;
  direccionPadre: string;
  telefonoPadre: string;
  correoPadre: string;

  // Datos del Tutor Legal
  nombreApellidoRepresentanteLegal: string;
  cedulaRepresentanteLegal: string;
  representanteLegalViveConAlumno: string;
  parentescoRepresentanteLegal: string;
  gradoInstruccionRepresentanteLegal: string;
  direccionRepresentanteLegal: string;
  telefonoRepresentanteLegal: string;
  correoRepresentanteLegal: string;
}

interface EstudianteInfo {
  id: string;
  nombres: string;
  apellidos: string;
  cedulaIdentidad: string;
}

// Función auxiliar para manejar localStorage de forma segura
const guardarEnLocalStorage = (key: string, value: string) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
  }
};

const obtenerDeLocalStorage = (key: string): string | null => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo de localStorage:', error);
    return null;
  }
};

// Componente principal que usa useSearchParams
function RegistroRepresentantesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [estudianteId, setEstudianteId] = useState<string | null>(null);
  const [estudianteInfo, setEstudianteInfo] = useState<EstudianteInfo | null>(null);
  const [loadingEstudiante, setLoadingEstudiante] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    // Datos de la Madre
    nombreApellidoMadre: '',
    cedulaMadre: '',
    madreViveConAlumno: '',
    gradoInstruccionMadre: '',
    direccionMadre: '',
    telefonoMadre: '',
    correoMadre: '',

    // Datos del Padre
    nombreApellidoPadre: '',
    cedulaPadre: '',
    padreViveConAlumno: '',
    gradoInstruccionPadre: '',
    direccionPadre: '',
    telefonoPadre: '',
    correoPadre: '',

    // Datos del Tutor Legal
    nombreApellidoRepresentanteLegal: '',
    cedulaRepresentanteLegal: '',
    representanteLegalViveConAlumno: '',
    parentescoRepresentanteLegal: '',
    gradoInstruccionRepresentanteLegal: '',
    direccionRepresentanteLegal: '',
    telefonoRepresentanteLegal: '',
    correoRepresentanteLegal: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener el ID del estudiante de la URL o localStorage
  const cargarInformacionEstudiante = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/estudiantes/${id}`, {
        headers: {
          'Authorization': 'admin',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'No se pudo cargar la información del estudiante.');
      }

      setEstudianteInfo(await response.json());
    } catch (error) {
      console.error('Error al cargar información del estudiante:', error);
      toast.error(error instanceof Error ? error.message : 'Error de conexión al cargar el estudiante.');
    } finally {
      setLoadingEstudiante(false);
    }
  }, []);

  useEffect(() => {
    const id = searchParams.get('estudianteId');
    if (id) {
      setEstudianteId(id);
      cargarInformacionEstudiante(id);
      guardarEnLocalStorage('ultimoEstudianteId', id);
    } else {
      // Intentar obtener del localStorage como fallback
      const savedId = obtenerDeLocalStorage('ultimoEstudianteId');
      if (savedId) {
        setEstudianteId(savedId);
        cargarInformacionEstudiante(savedId);
      } else {
        setLoadingEstudiante(false);
        toast.error('No se encontró información del estudiante. Serás redirigido al registro.');
        router.push('/inscripcion_alumno');
      }
    }
  }, [cargarInformacionEstudiante, router, searchParams]);

  // Función simple para manejar cambios de texto
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Función para campos numéricos
  const handleNumericChange = (field: keyof FormData, value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): string | null => {
    const newErrors: Record<string, string> = {};

    // Validar que al menos un representante esté completo
    const madreCompleta = formData.nombreApellidoMadre.trim() && formData.cedulaMadre.trim();
    const padreCompleto = formData.nombreApellidoPadre.trim() && formData.cedulaPadre.trim();
    const tutorCompleto = formData.nombreApellidoRepresentanteLegal.trim() && formData.cedulaRepresentanteLegal.trim();

    if (!madreCompleta && !padreCompleto && !tutorCompleto) {
      newErrors.general = 'Debe completar al menos los datos de un representante (Madre, Padre o Tutor Legal)';
    }

    // Validaciones para madre (si tiene datos)
    if (formData.nombreApellidoMadre.trim() || formData.cedulaMadre.trim()) {
      if (!formData.nombreApellidoMadre.trim()) newErrors.nombreApellidoMadre = 'Los nombres y apellidos son obligatorios';
      if (!formData.cedulaMadre.trim()) newErrors.cedulaMadre = 'La cédula es obligatoria';
      if (!formData.madreViveConAlumno) newErrors.madreViveConAlumno = 'Este campo es obligatorio';
      if (!formData.gradoInstruccionMadre) newErrors.gradoInstruccionMadre = 'Este campo es obligatorio';
      if (!formData.telefonoMadre.trim()) newErrors.telefonoMadre = 'El teléfono es obligatorio';
      
      if (formData.cedulaMadre && !/^\d+$/.test(formData.cedulaMadre)) {
        newErrors.cedulaMadre = 'La cédula debe contener solo números';
      }
      if (formData.telefonoMadre && !/^\d+$/.test(formData.telefonoMadre)) {
        newErrors.telefonoMadre = 'El teléfono debe contener solo números';
      }
      if (formData.correoMadre && !/^\S+@\S+\.\S+$/.test(formData.correoMadre)) {
        newErrors.correoMadre = 'El correo electrónico no es válido';
      }
    }

    // Validaciones para padre (si tiene datos)
    if (formData.nombreApellidoPadre.trim() || formData.cedulaPadre.trim()) {
      if (!formData.nombreApellidoPadre.trim()) newErrors.nombreApellidoPadre = 'Los nombres y apellidos son obligatorios';
      if (!formData.cedulaPadre.trim()) newErrors.cedulaPadre = 'La cédula es obligatoria';
      if (!formData.padreViveConAlumno) newErrors.padreViveConAlumno = 'Este campo es obligatorio';
      if (!formData.gradoInstruccionPadre) newErrors.gradoInstruccionPadre = 'Este campo es obligatorio';
      if (!formData.telefonoPadre.trim()) newErrors.telefonoPadre = 'El teléfono es obligatorio';
      
      if (formData.cedulaPadre && !/^\d+$/.test(formData.cedulaPadre)) {
        newErrors.cedulaPadre = 'La cédula debe contener solo números';
      }
      if (formData.telefonoPadre && !/^\d+$/.test(formData.telefonoPadre)) {
        newErrors.telefonoPadre = 'El teléfono debe contener solo números';
      }
      if (formData.correoPadre && !/^\S+@\S+\.\S+$/.test(formData.correoPadre)) {
        newErrors.correoPadre = 'El correo electrónico no es válido';
      }
    }

    // Validaciones para tutor (si tiene datos)
    if (formData.nombreApellidoRepresentanteLegal.trim() || formData.cedulaRepresentanteLegal.trim()) {
      if (!formData.nombreApellidoRepresentanteLegal.trim()) newErrors.nombreApellidoRepresentanteLegal = 'Los nombres y apellidos son obligatorios';
      if (!formData.cedulaRepresentanteLegal.trim()) newErrors.cedulaRepresentanteLegal = 'La cédula es obligatoria';
      if (!formData.representanteLegalViveConAlumno) newErrors.representanteLegalViveConAlumno = 'Este campo es obligatorio';
      if (!formData.parentescoRepresentanteLegal) newErrors.parentescoRepresentanteLegal = 'El parentesco es obligatorio';
      if (!formData.gradoInstruccionRepresentanteLegal) newErrors.gradoInstruccionRepresentanteLegal = 'Este campo es obligatorio';
      if (!formData.telefonoRepresentanteLegal.trim()) newErrors.telefonoRepresentanteLegal = 'El teléfono es obligatorio';
      
      if (formData.cedulaRepresentanteLegal && !/^\d+$/.test(formData.cedulaRepresentanteLegal)) {
        newErrors.cedulaRepresentanteLegal = 'La cédula debe contener solo números';
      }
      if (formData.telefonoRepresentanteLegal && !/^\d+$/.test(formData.telefonoRepresentanteLegal)) {
        newErrors.telefonoRepresentanteLegal = 'El teléfono debe contener solo números';
      }
      if (formData.correoRepresentanteLegal && !/^\S+@\S+\.\S+$/.test(formData.correoRepresentanteLegal)) {
        newErrors.correoRepresentanteLegal = 'El correo electrónico no es válido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)[0] ?? null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const firstErrorField = validateForm();
    if (firstErrorField) {
      const field = document.getElementById(firstErrorField);
      (field ?? document.querySelector('.text-red-500'))?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      toast.error('Revisa los campos marcados antes de continuar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/representantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'admin',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const representanteCreado = await response.json();
      if (!representanteCreado.id) {
        throw new Error('La respuesta del servidor no contiene el ID del representante.');
      }

      if (estudianteId) {
        const updateResponse = await fetch(`/api/estudiantes/${estudianteId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'admin',
          },
          body: JSON.stringify({ representanteId: representanteCreado.id }),
        });

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(errorData.error || 'Error al asociar el representante con el estudiante.');
        }
      }

      localStorage.removeItem('ultimoEstudianteId');
      toast.success('Registro completado. El estudiante y sus representantes ya están registrados.');
      router.push('/inicio');
    } catch (error) {
      console.error('Error al procesar el formulario de representantes:', error);
      let errorMessage = error instanceof Error ? error.message : 'Hubo un error al procesar el registro.';
      if (errorMessage.includes('403')) {
        errorMessage = 'No tienes permisos para crear representantes. Contacta al administrador.';
      } else if (errorMessage.includes('500')) {
        errorMessage = 'Error del servidor al guardar el registro. Contacta al administrador.';
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToStudents = () => {
    if (confirm('¿Está seguro de que desea volver al registro de estudiantes? Los datos ingresados aquí no se guardarán.')) {
      router.push('/inscripcion_alumno');
    }
  };

  if (loadingEstudiante) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1EB] to-[#E8DFD1] py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#795C34] mx-auto"></div>
              <p className="mt-4 text-[#5E2C04]">Cargando información del estudiante...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1EB] to-[#E8DFD1] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-[#5E2C04] hover:text-[#795C34] hover:bg-[#F5F1EB]"
            onClick={handleBackToStudents}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Estudiantes
          </Button>
          
          <h1 className="text-3xl font-bold text-[#362511] text-center">
            Sistema de Inscripción
          </h1>
          
          <div className="w-24"></div>
        </div>

        {/* Indicador de Progreso */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#795C34] text-white flex items-center justify-center font-semibold">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-sm mt-2 text-[#5E2C04]">Estudiante</span>
            </div>
            <div className="w-32 h-1 bg-[#795C34] mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#65350F] text-white flex items-center justify-center font-semibold">
                2
              </div>
              <span className="text-sm mt-2 font-semibold text-[#65350F]">Representantes</span>
            </div>
          </div>
        </div>

        <Card className="max-w-6xl mx-auto shadow-xl border-[#D9C7A8]">
          <CardHeader className="bg-gradient-to-r from-[#795C34] to-[#65350F] text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="w-6 h-6" />
              Registro de Representantes - Paso 2 de 2
            </CardTitle>
            <CardDescription className="text-[#E8DFD1]">
              Complete los datos de los representantes del estudiante. Complete al menos un representante.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 bg-[#FDF8F3]">
            {/* Información del estudiante */}
            {estudianteInfo && (
              <div className="bg-gradient-to-r from-[#F5F1EB] to-[#E8DFD1] border border-[#D9C7A8] rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#795C34] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#5E2C04]">Estudiante Registrado</h4>
                    <p className="text-[#65350F] text-sm mt-1">
                      <strong>Nombre:</strong> {estudianteInfo.nombres} {estudianteInfo.apellidos} | 
                      <strong> Cédula:</strong> {estudianteInfo.cedulaIdentidad}
                    </p>
                    <p className="text-[#795C34] text-xs mt-1">
                      Ahora complete la información de los representantes de este estudiante.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Información del progreso */}
            <div className="bg-gradient-to-r from-[#E8F5E8] to-[#D4E8D4] border border-[#B8D4B8] rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#795C34] mt-0.5" aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-[#1B5E20]">Paso 1 Completado</h4>
                  <p className="text-[#2E7D32] text-sm mt-1">
                    Los datos del estudiante han sido registrados exitosamente. Ahora complete la información de los representantes.
                  </p>
                </div>
              </div>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Sección 1: Datos de la Madre */}
              <Card className="border-[#D9C7A8]">
                <CardHeader className="bg-gradient-to-r from-[#F5F1EB] to-[#E8DFD1]">
                  <CardTitle className="flex items-center gap-2 text-lg text-[#362511]">
                    <User className="w-5 h-5 text-[#795C34]" />
                    Datos de la Madre
                  </CardTitle>
                  <CardDescription className="text-[#5E2C04]">
                    Complete los datos de la madre (opcional si completa otros representantes)
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-[#795C34]" />
                      <h4 className="text-lg font-semibold text-[#362511]">Información de la Madre</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nombres y Apellidos */}
                      <div className="space-y-2">
                        <Label htmlFor="nombreApellidoMadre" className="text-sm font-medium text-[#362511]">
                          Nombres y Apellidos {formData.nombreApellidoMadre || formData.cedulaMadre ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Input
                          id="nombreApellidoMadre"
                          value={formData.nombreApellidoMadre}
                          onChange={(e) => handleInputChange('nombreApellidoMadre', e.target.value)}
                          placeholder="Ingrese nombres y apellidos completos"
                          className={errors.nombreApellidoMadre ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}
                        />
                        {errors.nombreApellidoMadre && (
                          <p className="text-red-500 text-sm">{errors.nombreApellidoMadre}</p>
                        )}
                      </div>

                      {/* Cédula - Solo números */}
                      <div className="space-y-2">
                        <Label htmlFor="cedulaMadre" className="text-sm font-medium text-[#362511]">
                          Cédula de Identidad {formData.nombreApellidoMadre || formData.cedulaMadre ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Input
                          id="cedulaMadre"
                          type="text"
                          inputMode="numeric"
                          value={formData.cedulaMadre}
                          onChange={(e) => handleNumericChange('cedulaMadre', e.target.value)}
                          placeholder="Ej: 12345678"
                          className={errors.cedulaMadre ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}
                          maxLength={8}
                        />
                        {errors.cedulaMadre && (
                          <p className="text-red-500 text-sm">{errors.cedulaMadre}</p>
                        )}
                      </div>

                      {/* Vive con el estudiante */}
                      <div className="space-y-2">
                        <Label htmlFor="madreViveConAlumno" className="text-sm font-medium text-[#362511]">
                          ¿Vive con el estudiante? {formData.nombreApellidoMadre || formData.cedulaMadre ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Select 
                          value={formData.madreViveConAlumno} 
                          onValueChange={(value) => handleInputChange('madreViveConAlumno', value)}
                        >
                          <SelectTrigger className={errors.madreViveConAlumno ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}>
                            <SelectValue placeholder="Seleccione una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="si">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.madreViveConAlumno && (
                          <p className="text-red-500 text-sm">{errors.madreViveConAlumno}</p>
                        )}
                      </div>

                      {/* Grado de Instrucción */}
                      <div className="space-y-2">
                        <Label htmlFor="gradoInstruccionMadre" className="text-sm font-medium text-[#362511]">
                          Grado de Instrucción {formData.nombreApellidoMadre || formData.cedulaMadre ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Select 
                          value={formData.gradoInstruccionMadre} 
                          onValueChange={(value) => handleInputChange('gradoInstruccionMadre', value)}
                        >
                          <SelectTrigger className={errors.gradoInstruccionMadre ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}>
                            <SelectValue placeholder="Seleccione el grado" />
                          </SelectTrigger>
                          <SelectContent>
                            {gradosInstruccion.map((grado) => (
                              <SelectItem key={grado} value={grado}>
                                {grado}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.gradoInstruccionMadre && (
                          <p className="text-red-500 text-sm">{errors.gradoInstruccionMadre}</p>
                        )}
                      </div>

                      {/* Teléfono - Solo números */}
                      <div className="space-y-2">
                        <Label htmlFor="telefonoMadre" className="text-sm font-medium text-[#362511]">
                          Teléfono {formData.nombreApellidoMadre || formData.cedulaMadre ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Input
                          id="telefonoMadre"
                          type="text"
                          inputMode="numeric"
                          value={formData.telefonoMadre}
                          onChange={(e) => handleNumericChange('telefonoMadre', e.target.value)}
                          placeholder="Ej: 04121234567"
                          className={errors.telefonoMadre ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}
                          maxLength={11}
                        />
                        {errors.telefonoMadre && (
                          <p className="text-red-500 text-sm">{errors.telefonoMadre}</p>
                        )}
                      </div>

                      {/* Correo Electrónico */}
                      <div className="space-y-2">
                        <Label htmlFor="correoMadre" className="text-sm font-medium text-[#362511]">
                          Correo Electrónico
                        </Label>
                        <Input
                          id="correoMadre"
                          type="email"
                          inputMode="email"
                          value={formData.correoMadre}
                          onChange={(e) => handleInputChange('correoMadre', e.target.value)}
                          placeholder="ejemplo@correo.com"
                          className={errors.correoMadre ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}
                        />
                        {errors.correoMadre && (
                          <p className="text-red-500 text-sm">{errors.correoMadre}</p>
                        )}
                      </div>
                    </div>

                    {/* Dirección */}
                    <div className="space-y-2">
                      <Label htmlFor="direccionMadre" className="text-sm font-medium text-[#362511]">
                        Dirección
                      </Label>
                      <Input
                        id="direccionMadre"
                        value={formData.direccionMadre}
                        onChange={(e) => handleInputChange('direccionMadre', e.target.value)}
                        placeholder="Ingrese la dirección completa"
                        className="border-[#D9C7A8] focus:border-[#795C34]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sección 2: Datos del Padre */}
              <Card className="border-[#D9C7A8]">
                <CardHeader className="bg-gradient-to-r from-[#F5F1EB] to-[#E8DFD1]">
                  <CardTitle className="flex items-center gap-2 text-lg text-[#362511]">
                    <User className="w-5 h-5 text-[#795C34]" />
                    Datos del Padre
                  </CardTitle>
                  <CardDescription className="text-[#5E2C04]">
                    Complete los datos del padre (opcional si completa otros representantes)
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-[#795C34]" />
                      <h4 className="text-lg font-semibold text-[#362511]">Información del Padre</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nombres y Apellidos */}
                      <div className="space-y-2">
                        <Label htmlFor="nombreApellidoPadre" className="text-sm font-medium text-[#362511]">
                          Nombres y Apellidos {formData.nombreApellidoPadre || formData.cedulaPadre ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Input
                          id="nombreApellidoPadre"
                          value={formData.nombreApellidoPadre}
                          onChange={(e) => handleInputChange('nombreApellidoPadre', e.target.value)}
                          placeholder="Ingrese nombres y apellidos completos"
                          className={errors.nombreApellidoPadre ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}
                        />
                        {errors.nombreApellidoPadre && (
                          <p className="text-red-500 text-sm">{errors.nombreApellidoPadre}</p>
                        )}
                      </div>

                      {/* Cédula - Solo números */}
                      <div className="space-y-2">
                        <Label htmlFor="cedulaPadre" className="text-sm font-medium text-[#362511]">
                          Cédula de Identidad {formData.nombreApellidoPadre || formData.cedulaPadre ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Input
                          id="cedulaPadre"
                          type="text"
                          inputMode="numeric"
                          value={formData.cedulaPadre}
                          onChange={(e) => handleNumericChange('cedulaPadre', e.target.value)}
                          placeholder="Ej: 12345678"
                          className={errors.cedulaPadre ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}
                          maxLength={8}
                        />
                        {errors.cedulaPadre && (
                          <p className="text-red-500 text-sm">{errors.cedulaPadre}</p>
                        )}
                      </div>

                      {/* Vive con el estudiante */}
                      <div className="space-y-2">
                        <Label htmlFor="padreViveConAlumno" className="text-sm font-medium text-[#362511]">
                          ¿Vive con el estudiante? {formData.nombreApellidoPadre || formData.cedulaPadre ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Select 
                          value={formData.padreViveConAlumno} 
                          onValueChange={(value) => handleInputChange('padreViveConAlumno', value)}
                        >
                          <SelectTrigger className={errors.padreViveConAlumno ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}>
                            <SelectValue placeholder="Seleccione una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="si">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.padreViveConAlumno && (
                          <p className="text-red-500 text-sm">{errors.padreViveConAlumno}</p>
                        )}
                      </div>

                      {/* Grado de Instrucción */}
                      <div className="space-y-2">
                        <Label htmlFor="gradoInstruccionPadre" className="text-sm font-medium text-[#362511]">
                          Grado de Instrucción {formData.nombreApellidoPadre || formData.cedulaPadre ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Select 
                          value={formData.gradoInstruccionPadre} 
                          onValueChange={(value) => handleInputChange('gradoInstruccionPadre', value)}
                        >
                          <SelectTrigger className={errors.gradoInstruccionPadre ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}>
                            <SelectValue placeholder="Seleccione el grado" />
                          </SelectTrigger>
                          <SelectContent>
                            {gradosInstruccion.map((grado) => (
                              <SelectItem key={grado} value={grado}>
                                {grado}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.gradoInstruccionPadre && (
                          <p className="text-red-500 text-sm">{errors.gradoInstruccionPadre}</p>
                        )}
                      </div>

                      {/* Teléfono - Solo números */}
                      <div className="space-y-2">
                        <Label htmlFor="telefonoPadre" className="text-sm font-medium text-[#362511]">
                          Teléfono {formData.nombreApellidoPadre || formData.cedulaPadre ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Input
                          id="telefonoPadre"
                          type="text"
                          inputMode="numeric"
                          value={formData.telefonoPadre}
                          onChange={(e) => handleNumericChange('telefonoPadre', e.target.value)}
                          placeholder="Ej: 04121234567"
                          className={errors.telefonoPadre ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}
                          maxLength={11}
                        />
                        {errors.telefonoPadre && (
                          <p className="text-red-500 text-sm">{errors.telefonoPadre}</p>
                        )}
                      </div>

                      {/* Correo Electrónico */}
                      <div className="space-y-2">
                        <Label htmlFor="correoPadre" className="text-sm font-medium text-[#362511]">
                          Correo Electrónico
                        </Label>
                        <Input
                          id="correoPadre"
                          type="email"
                          inputMode="email"
                          value={formData.correoPadre}
                          onChange={(e) => handleInputChange('correoPadre', e.target.value)}
                          placeholder="ejemplo@correo.com"
                          className={errors.correoPadre ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}
                        />
                        {errors.correoPadre && (
                          <p className="text-red-500 text-sm">{errors.correoPadre}</p>
                        )}
                      </div>
                    </div>

                    {/* Dirección */}
                    <div className="space-y-2">
                      <Label htmlFor="direccionPadre" className="text-sm font-medium text-[#362511]">
                        Dirección
                      </Label>
                      <Input
                        id="direccionPadre"
                        value={formData.direccionPadre}
                        onChange={(e) => handleInputChange('direccionPadre', e.target.value)}
                        placeholder="Ingrese la dirección completa"
                        className="border-[#D9C7A8] focus:border-[#795C34]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sección 3: Datos del Tutor Legal */}
              <Card className="border-[#D9C7A8]">
                <CardHeader className="bg-gradient-to-r from-[#F5F1EB] to-[#E8DFD1]">
                  <CardTitle className="flex items-center gap-2 text-lg text-[#362511]">
                    <Users className="w-5 h-5 text-[#795C34]" />
                    Datos del Tutor Legal
                  </CardTitle>
                  <CardDescription className="text-[#5E2C04]">
                    Complete los datos del tutor legal (opcional si completa otros representantes)
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-[#795C34]" />
                      <h4 className="text-lg font-semibold text-[#362511]">Información del Tutor Legal</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nombres y Apellidos */}
                      <div className="space-y-2">
                        <Label htmlFor="nombreApellidoRepresentanteLegal" className="text-sm font-medium text-[#362511]">
                          Nombres y Apellidos {formData.nombreApellidoRepresentanteLegal || formData.cedulaRepresentanteLegal ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Input
                          id="nombreApellidoRepresentanteLegal"
                          value={formData.nombreApellidoRepresentanteLegal}
                          onChange={(e) => handleInputChange('nombreApellidoRepresentanteLegal', e.target.value)}
                          placeholder="Ingrese nombres y apellidos completos"
                          className={errors.nombreApellidoRepresentanteLegal ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}
                        />
                        {errors.nombreApellidoRepresentanteLegal && (
                          <p className="text-red-500 text-sm">{errors.nombreApellidoRepresentanteLegal}</p>
                        )}
                      </div>

                      {/* Cédula - Solo números */}
                      <div className="space-y-2">
                        <Label htmlFor="cedulaRepresentanteLegal" className="text-sm font-medium text-[#362511]">
                          Cédula de Identidad {formData.nombreApellidoRepresentanteLegal || formData.cedulaRepresentanteLegal ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Input
                          id="cedulaRepresentanteLegal"
                          type="text"
                          inputMode="numeric"
                          value={formData.cedulaRepresentanteLegal}
                          onChange={(e) => handleNumericChange('cedulaRepresentanteLegal', e.target.value)}
                          placeholder="Ej: 12345678"
                          className={errors.cedulaRepresentanteLegal ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}
                          maxLength={8}
                        />
                        {errors.cedulaRepresentanteLegal && (
                          <p className="text-red-500 text-sm">{errors.cedulaRepresentanteLegal}</p>
                        )}
                      </div>

                      {/* Parentesco */}
                      <div className="space-y-2">
                        <Label htmlFor="parentescoRepresentanteLegal" className="text-sm font-medium text-[#362511]">
                          Parentesco {formData.nombreApellidoRepresentanteLegal || formData.cedulaRepresentanteLegal ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Select 
                          value={formData.parentescoRepresentanteLegal} 
                          onValueChange={(value) => handleInputChange('parentescoRepresentanteLegal', value)}
                        >
                          <SelectTrigger className={errors.parentescoRepresentanteLegal ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}>
                            <SelectValue placeholder="Seleccione el parentesco" />
                          </SelectTrigger>
                          <SelectContent>
                            {parentescos.map((parentesco) => (
                              <SelectItem key={parentesco} value={parentesco}>
                                {parentesco}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.parentescoRepresentanteLegal && (
                          <p className="text-red-500 text-sm">{errors.parentescoRepresentanteLegal}</p>
                        )}
                      </div>

                      {/* Vive con el estudiante */}
                      <div className="space-y-2">
                        <Label htmlFor="representanteLegalViveConAlumno" className="text-sm font-medium text-[#362511]">
                          ¿Vive con el estudiante? {formData.nombreApellidoRepresentanteLegal || formData.cedulaRepresentanteLegal ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Select 
                          value={formData.representanteLegalViveConAlumno} 
                          onValueChange={(value) => handleInputChange('representanteLegalViveConAlumno', value)}
                        >
                          <SelectTrigger className={errors.representanteLegalViveConAlumno ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}>
                            <SelectValue placeholder="Seleccione una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="si">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.representanteLegalViveConAlumno && (
                          <p className="text-red-500 text-sm">{errors.representanteLegalViveConAlumno}</p>
                        )}
                      </div>

                      {/* Grado de Instrucción */}
                      <div className="space-y-2">
                        <Label htmlFor="gradoInstruccionRepresentanteLegal" className="text-sm font-medium text-[#362511]">
                          Grado de Instrucción {formData.nombreApellidoRepresentanteLegal || formData.cedulaRepresentanteLegal ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Select 
                          value={formData.gradoInstruccionRepresentanteLegal} 
                          onValueChange={(value) => handleInputChange('gradoInstruccionRepresentanteLegal', value)}
                        >
                          <SelectTrigger className={errors.gradoInstruccionRepresentanteLegal ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}>
                            <SelectValue placeholder="Seleccione el grado" />
                          </SelectTrigger>
                          <SelectContent>
                            {gradosInstruccion.map((grado) => (
                              <SelectItem key={grado} value={grado}>
                                {grado}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.gradoInstruccionRepresentanteLegal && (
                          <p className="text-red-500 text-sm">{errors.gradoInstruccionRepresentanteLegal}</p>
                        )}
                      </div>

                      {/* Teléfono - Solo números */}
                      <div className="space-y-2">
                        <Label htmlFor="telefonoRepresentanteLegal" className="text-sm font-medium text-[#362511]">
                          Teléfono {formData.nombreApellidoRepresentanteLegal || formData.cedulaRepresentanteLegal ? <span className="text-red-500">*</span> : ''}
                        </Label>
                        <Input
                          id="telefonoRepresentanteLegal"
                          type="text"
                          inputMode="numeric"
                          value={formData.telefonoRepresentanteLegal}
                          onChange={(e) => handleNumericChange('telefonoRepresentanteLegal', e.target.value)}
                          placeholder="Ej: 04121234567"
                          className={errors.telefonoRepresentanteLegal ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}
                          maxLength={11}
                        />
                        {errors.telefonoRepresentanteLegal && (
                          <p className="text-red-500 text-sm">{errors.telefonoRepresentanteLegal}</p>
                        )}
                      </div>

                      {/* Correo Electrónico */}
                      <div className="space-y-2">
                        <Label htmlFor="correoRepresentanteLegal" className="text-sm font-medium text-[#362511]">
                          Correo Electrónico
                        </Label>
                        <Input
                          id="correoRepresentanteLegal"
                          type="email"
                          inputMode="email"
                          value={formData.correoRepresentanteLegal}
                          onChange={(e) => handleInputChange('correoRepresentanteLegal', e.target.value)}
                          placeholder="ejemplo@correo.com"
                          className={errors.correoRepresentanteLegal ? 'border-red-500' : 'border-[#D9C7A8] focus:border-[#795C34]'}
                        />
                        {errors.correoRepresentanteLegal && (
                          <p className="text-red-500 text-sm">{errors.correoRepresentanteLegal}</p>
                        )}
                      </div>
                    </div>

                    {/* Dirección */}
                    <div className="space-y-2">
                      <Label htmlFor="direccionRepresentanteLegal" className="text-sm font-medium text-[#362511]">
                        Dirección
                      </Label>
                      <Input
                        id="direccionRepresentanteLegal"
                        value={formData.direccionRepresentanteLegal}
                        onChange={(e) => handleInputChange('direccionRepresentanteLegal', e.target.value)}
                        placeholder="Ingrese la dirección completa"
                        className="border-[#D9C7A8] focus:border-[#795C34]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información de finalización */}
              <div className="bg-gradient-to-r from-[#F5F1EB] to-[#E8DFD1] border border-[#D9C7A8] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#795C34] mt-0.5" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-[#5E2C04]">Finalización del Registro</h4>
                    <p className="text-[#65350F] text-sm mt-1">
                      Al completar este formulario, el registro del estudiante y sus representantes quedará finalizado. 
                      Recibirá una confirmación por correo electrónico.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-[#795C34] to-[#65350F] hover:from-[#65350F] hover:to-[#5E2C04] flex-1"
                  size="lg"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Procesando...' : 'Finalizar Registro'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-[#D9C7A8] text-[#5E2C04] hover:bg-[#F5F1EB] hover:text-[#65350F]"
                  size="lg"
                  onClick={handleBackToStudents}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Estudiantes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente principal con Suspense
export default function RegistroRepresentantesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1EB] to-[#E8DFD1] py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#795C34] mx-auto"></div>
              <p className="mt-4 text-[#5E2C04]">Cargando formulario...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <RegistroRepresentantesContent />
    </Suspense>
  );
}