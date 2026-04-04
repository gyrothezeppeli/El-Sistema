// app/api/estudiantes/route.ts
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Definir tipo para error con código (para errores de Prisma)
interface ErrorWithCode extends Error {
  code?: string
}

// Definir tipo para datos del estudiante del request
interface EstudianteRequestData {
  apellidos: string
  nombres: string
  cedulaIdentidad: string
  fechaNacimiento: string
  edad: string | number
  sexo: string
  lugarNacimiento: string
  municipio: string
  parroquia: string
  direccionHabitacion: string
  numeroTelefonoCelular: string
  numeroTelefonoLocal?: string
  correoElectronico: string
  nombreAgrupacionesPertenecio?: string
  añoInicio: string
  agrupacionPertenece: string
  nucleo?: string
  instrumentoPrincipal: string
  instrumentosSecundarios?: string
  nombreColegio: string
  gradoCursa: string
  enfermedadesPadece?: string
  condicionAlumno?: string
  necesidadesEspecialesAprendizaje?: string
  esAlergico?: string
  estaVacunado?: string
  numeroDosisVacuna?: string
  especifiqueCondicion?: string
  especifiqueNecesidades?: string
  especifiqueAlergia?: string
  otrasEnfermedades?: string
  representanteId?: string
}

// Definir tipo para datos de creación de estudiante en Prisma
interface CreateEstudianteData {
  apellidos: string
  nombres: string
  cedulaIdentidad: string
  fechaNacimiento: string
  edad: string
  sexo: string
  lugarNacimiento: string
  municipio: string
  parroquia: string
  direccionHabitacion: string
  numeroTelefonoCelular: string
  numeroTelefonoLocal: string
  correoElectronico: string
  nombreAgrupacionesPertenecio: string
  añoInicio: string
  agrupacionPertenece: string
  nucleo: string
  instrumentoPrincipal: string
  instrumentosSecundarios: string
  nombreColegio: string
  gradoCursa: string
  enfermedadesPadece: string
  condicionAlumno: string
  necesidadesEspecialesAprendizaje: string
  esAlergico: string
  estaVacunado: string
  numeroDosisVacuna: string
  especifiqueCondicion: string
  especifiqueNecesidades: string
  especifiqueAlergia: string
  otrasEnfermedades: string
  representante?: {
    connect: {
      id: string
    }
  }
}

// GET /api/estudiantes - Obtener todos los estudiantes
export async function GET() {
  try {
    console.log('📋 Obteniendo lista de estudiantes...')
    
    const estudiantes = await prisma.estudiante.findMany({
      include: {
        representante: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log(`✅ Encontrados ${estudiantes.length} estudiantes`)
    
    // Log para verificar los datos de instrumentos - SIN tipo explícito
    estudiantes.forEach((estudiante, index) => {
      console.log(`🎵 Estudiante ${index + 1}:`, {
        nombres: estudiante.nombres,
        instrumentoPrincipal: estudiante.instrumentoPrincipal,
        instrumentosSecundarios: estudiante.instrumentosSecundarios
      })
    })

    return NextResponse.json(estudiantes)
    
  } catch (error: unknown) {
    console.error('❌ Error obteniendo estudiantes:', error)
    
    let errorMessage = 'Error interno del servidor'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: errorMessage
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Función de tipo guard para verificar si un objeto es EstudianteRequestData
function isEstudianteRequestData(obj: unknown): obj is EstudianteRequestData {
  if (typeof obj !== 'object' || obj === null) return false
  
  const data = obj as Partial<EstudianteRequestData>
  
  // Verificar campos requeridos principales
  const requiredFields: Array<keyof EstudianteRequestData> = [
    'apellidos', 'nombres', 'cedulaIdentidad', 'fechaNacimiento', 
    'edad', 'sexo', 'lugarNacimiento', 'municipio', 'parroquia',
    'direccionHabitacion', 'numeroTelefonoCelular', 'correoElectronico',
    'añoInicio', 'agrupacionPertenece', 'nombreColegio', 'gradoCursa',
    'instrumentoPrincipal'
  ]
  
  return requiredFields.every(field => {
    const value = data[field]
    if (field === 'edad') {
      return typeof value === 'string' || typeof value === 'number'
    }
    return typeof value === 'string'
  })
}

// POST /api/estudiantes - Crear un nuevo estudiante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown
    
    // Validar que body sea del tipo esperado
    if (!isEstudianteRequestData(body)) {
      console.log('❌ Datos de request inválidos:', body)
      return NextResponse.json(
        { 
          error: 'Datos de estudiante inválidos o incompletos',
          message: 'Estructura de datos incorrecta o campos requeridos faltantes'
        },
        { status: 400 }
      )
    }

    console.log('📝 Datos recibidos para crear estudiante:', body)

    // Validar campos requeridos
    const camposRequeridos: Array<keyof EstudianteRequestData> = [
      'apellidos', 'nombres', 'cedulaIdentidad', 'fechaNacimiento', 
      'edad', 'sexo', 'lugarNacimiento', 'municipio', 'parroquia',
      'direccionHabitacion', 'numeroTelefonoCelular', 'correoElectronico',
      'añoInicio', 'agrupacionPertenece', 'nombreColegio', 'gradoCursa',
      'instrumentoPrincipal'
    ]

    const camposFaltantes = camposRequeridos.filter(campo => {
      const value = body[campo]
      return value === undefined || value === null || value === ''
    })
    
    if (camposFaltantes.length > 0) {
      console.log('❌ Campos faltantes:', camposFaltantes)
      return NextResponse.json(
        { 
          error: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}`,
          camposFaltantes 
        },
        { status: 400 }
      )
    }

    // Verificar si ya existe un estudiante con la misma cédula
    const estudianteExistente = await prisma.estudiante.findUnique({
      where: {
        cedulaIdentidad: body.cedulaIdentidad
      }
    })

    if (estudianteExistente) {
      console.log('❌ Ya existe un estudiante con esta cédula:', body.cedulaIdentidad)
      return NextResponse.json(
        { 
          error: 'Ya existe un estudiante con esta cédula de identidad',
          code: 'DUPLICATED_CEDULA'
        },
        { status: 400 }
      )
    }

    // Convertir edad a string si viene como number
    const edadString = typeof body.edad === 'number' ? String(body.edad) : body.edad

    // Preparar datos completos del estudiante
    const estudianteData = {
      apellidos: body.apellidos,
      nombres: body.nombres,
      cedulaIdentidad: body.cedulaIdentidad,
      fechaNacimiento: body.fechaNacimiento,
      edad: edadString,
      sexo: body.sexo,
      lugarNacimiento: body.lugarNacimiento,
      municipio: body.municipio,
      parroquia: body.parroquia,
      direccionHabitacion: body.direccionHabitacion,
      numeroTelefonoCelular: body.numeroTelefonoCelular,
      numeroTelefonoLocal: body.numeroTelefonoLocal || "",
      correoElectronico: body.correoElectronico,
      nombreAgrupacionesPertenecio: body.nombreAgrupacionesPertenecio || "",
      añoInicio: body.añoInicio,
      agrupacionPertenece: body.agrupacionPertenece,
      nucleo: body.nucleo || "",
      instrumentoPrincipal: body.instrumentoPrincipal,
      instrumentosSecundarios: body.instrumentosSecundarios || "",
      nombreColegio: body.nombreColegio,
      gradoCursa: body.gradoCursa,
      enfermedadesPadece: body.enfermedadesPadece || "",
      condicionAlumno: body.condicionAlumno || "no",
      necesidadesEspecialesAprendizaje: body.necesidadesEspecialesAprendizaje || "no",
      esAlergico: body.esAlergico || "no",
      estaVacunado: body.estaVacunado || "no",
      numeroDosisVacuna: body.numeroDosisVacuna || "",
      especifiqueCondicion: body.especifiqueCondicion || "",
      especifiqueNecesidades: body.especifiqueNecesidades || "",
      especifiqueAlergia: body.especifiqueAlergia || "",
      otrasEnfermedades: body.otrasEnfermedades || "",
    }

    console.log('🎵 Datos de instrumentos a guardar:', {
      instrumentoPrincipal: estudianteData.instrumentoPrincipal,
      instrumentosSecundarios: estudianteData.instrumentosSecundarios
    })

    // Crear el objeto de datos para Prisma
    const createData: CreateEstudianteData = {
      apellidos: estudianteData.apellidos,
      nombres: estudianteData.nombres,
      cedulaIdentidad: estudianteData.cedulaIdentidad,
      fechaNacimiento: estudianteData.fechaNacimiento,
      edad: estudianteData.edad,
      sexo: estudianteData.sexo,
      lugarNacimiento: estudianteData.lugarNacimiento,
      municipio: estudianteData.municipio,
      parroquia: estudianteData.parroquia,
      direccionHabitacion: estudianteData.direccionHabitacion,
      numeroTelefonoCelular: estudianteData.numeroTelefonoCelular,
      numeroTelefonoLocal: estudianteData.numeroTelefonoLocal,
      correoElectronico: estudianteData.correoElectronico,
      nombreAgrupacionesPertenecio: estudianteData.nombreAgrupacionesPertenecio,
      añoInicio: estudianteData.añoInicio,
      agrupacionPertenece: estudianteData.agrupacionPertenece,
      nucleo: estudianteData.nucleo,
      instrumentoPrincipal: estudianteData.instrumentoPrincipal,
      instrumentosSecundarios: estudianteData.instrumentosSecundarios,
      nombreColegio: estudianteData.nombreColegio,
      gradoCursa: estudianteData.gradoCursa,
      enfermedadesPadece: estudianteData.enfermedadesPadece,
      condicionAlumno: estudianteData.condicionAlumno,
      necesidadesEspecialesAprendizaje: estudianteData.necesidadesEspecialesAprendizaje,
      esAlergico: estudianteData.esAlergico,
      estaVacunado: estudianteData.estaVacunado,
      numeroDosisVacuna: estudianteData.numeroDosisVacuna,
      especifiqueCondicion: estudianteData.especifiqueCondicion,
      especifiqueNecesidades: estudianteData.especifiqueNecesidades,
      especifiqueAlergia: estudianteData.especifiqueAlergia,
      otrasEnfermedades: estudianteData.otrasEnfermedades,
    }
    
    // Agregar relación con representante si existe
    if (body.representanteId) {
      createData.representante = {
        connect: {
          id: body.representanteId
        }
      }
    }

    // Crear el estudiante
    console.log('🚀 Creando estudiante con datos:', createData)
    const nuevoEstudiante = await prisma.estudiante.create({
      data: createData,
      include: {
        representante: true
      }
    })

    console.log('✅ Estudiante creado exitosamente:', {
      id: nuevoEstudiante.id,
      nombres: nuevoEstudiante.nombres,
      instrumentoPrincipal: nuevoEstudiante.instrumentoPrincipal,
      instrumentosSecundarios: nuevoEstudiante.instrumentosSecundarios
    })

    return NextResponse.json({ 
      success: true,
      estudiante: nuevoEstudiante 
    }, { status: 201 })

  } catch (error: unknown) {
    console.error('❌ Error creando estudiante:', error)

    // Verificar si es un error de Prisma
    let prismaError: ErrorWithCode | null = null
    if (error instanceof Error) {
      const possiblePrismaError = error as ErrorWithCode
      if (possiblePrismaError.code) {
        prismaError = possiblePrismaError
      }
    }

    // Manejar errores específicos de Prisma
    if (prismaError?.code === 'P2002') {
      // Verificar qué campo único se duplicó
      const target = prismaError.message || ''
      if (target.includes('cedulaIdentidad')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Ya existe un estudiante con esta cédula de identidad',
            code: 'DUPLICATED_CEDULA'
          },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { 
          success: false,
          error: 'Ya existe un registro con este valor único',
          code: 'DUPLICATED_UNIQUE_FIELD'
        },
        { status: 400 }
      )
    }

    // Obtener mensaje de error de forma segura
    let errorMessage = 'Error interno del servidor al crear el estudiante'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/estudiantes/[id] - Eliminar un estudiante (si lo necesitas)
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de estudiante no proporcionado' },
        { status: 400 }
      )
    }

    await prisma.estudiante.delete({
      where: { id }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Estudiante eliminado exitosamente' 
    })

  } catch (error: unknown) {
    console.error('❌ Error eliminando estudiante:', error)

    if (error instanceof Error && 'code' in error && (error as ErrorWithCode).code === 'P2025') {
      return NextResponse.json(
        { error: 'Estudiante no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}