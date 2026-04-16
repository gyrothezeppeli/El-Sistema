import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Definir tipo para error con código (para errores de Prisma)
interface ErrorWithCode extends Error {
  code?: string
}

// Definir tipo para el cuerpo de la solicitud PUT
interface UpdateEstudianteData {
  apellidos?: string
  nombres?: string
  cedulaIdentidad?: string
  fechaNacimiento?: string
  edad?: string
  sexo?: string
  lugarNacimiento?: string
  municipio?: string
  parroquia?: string
  direccionHabitacion?: string
  numeroTelefonoCelular?: string
  numeroTelefonoLocal?: string
  correoElectronico?: string
  nombreAgrupacionesPertenecio?: string
  añoInicio?: string
  agrupacionPertenece?: string
  nucleo?: string
  nombreColegio?: string
  gradoCursa?: string
  enfermedadesPadece?: string
  condicionAlumno?: string
  necesidadesEspecialesAprendizaje?: string
  esAlergico?: string
  estaVacunado?: string
  numeroDosisVacuna?: string
  representanteId?: string | null
  instrumento?: string
  esPrincipal?: boolean
}

// GET /api/estudiantes/[id] - Obtener un estudiante específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params es una Promise
) {
  try {
    const { id } = await params // ¡Agrega await aquí!
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID del estudiante es requerido' },
        { status: 400 }
      )
    }

    const estudiante = await prisma.estudiante.findUnique({
      where: { id },
      include: {
        instrumentos: true,
        representante: true
      }
    })

    if (!estudiante) {
      return NextResponse.json(
        { error: 'Estudiante no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(estudiante)
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT /api/estudiantes/[id] - Actualizar un estudiante
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params es una Promise
) {
  try {
    const { id } = await params // ¡Agrega await aquí!
    const body = await request.json() as UpdateEstudianteData

    if (!id) {
      return NextResponse.json(
        { error: 'ID del estudiante es requerido' },
        { status: 400 }
      )
    }

    // Verificar si el estudiante existe
    const estudianteExistente = await prisma.estudiante.findUnique({
      where: { id }
    })

    if (!estudianteExistente) {
      return NextResponse.json(
        { error: 'Estudiante no encontrado' },
        { status: 404 }
      )
    }

    // Preparar datos para actualizar
    const datosActualizacion = {
      apellidos: body.apellidos,
      nombres: body.nombres,
      cedulaIdentidad: body.cedulaIdentidad,
      fechaNacimiento: body.fechaNacimiento,
      edad: body.edad,
      sexo: body.sexo,
      lugarNacimiento: body.lugarNacimiento,
      municipio: body.municipio,
      parroquia: body.parroquia,
      direccionHabitacion: body.direccionHabitacion,
      numeroTelefonoCelular: body.numeroTelefonoCelular,
      numeroTelefonoLocal: body.numeroTelefonoLocal,
      correoElectronico: body.correoElectronico,
      nombreAgrupacionesPertenecio: body.nombreAgrupacionesPertenecio,
      añoInicio: body.añoInicio,
      agrupacionPertenece: body.agrupacionPertenece,
      nucleo: body.nucleo,
      nombreColegio: body.nombreColegio,
      gradoCursa: body.gradoCursa,
      enfermedadesPadece: body.enfermedadesPadece,
      condicionAlumno: body.condicionAlumno,
      necesidadesEspecialesAprendizaje: body.necesidadesEspecialesAprendizaje,
      esAlergico: body.esAlergico,
      estaVacunado: body.estaVacunado,
      numeroDosisVacuna: body.numeroDosisVacuna,
      representanteId: body.representanteId || null,
    }

    // Actualizar instrumentos si se proporcionan
    if (body.instrumento) {
      // Eliminar instrumentos existentes y crear nuevos
      await prisma.instrumentoEstudiante.deleteMany({
        where: { estudianteId: id }
      })

      await prisma.instrumentoEstudiante.create({
        data: {
          instrumento: body.instrumento,
          esPrincipal: body.esPrincipal || true,
          estudianteId: id
        }
      })
    }

    const estudianteActualizado = await prisma.estudiante.update({
      where: { id },
      data: datosActualizacion,
      include: {
        instrumentos: true,
        representante: true
      }
    })

    return NextResponse.json(estudianteActualizado)
  } catch (error: unknown) {
    console.error('Error updating student:', error)
    
    // Convertir error a tipo específico para verificar el código
    const err = error as ErrorWithCode
    
    // Manejar errores específicos de Prisma
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un estudiante con esta cédula de identidad' },
        { status: 400 }
      )
    }

    // Obtener mensaje de error de forma segura
    let errorMessage = 'Error al actualizar el estudiante'
    if (err.message) {
      errorMessage = err.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/estudiantes/[id] - Eliminar un estudiante
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params es una Promise
) {
  try {
    const { id } = await params // ¡Agrega await aquí!

    if (!id) {
      return NextResponse.json(
        { error: 'ID del estudiante es requerido' },
        { status: 400 }
      )
    }

    // Verificar si el estudiante existe
    const estudianteExistente = await prisma.estudiante.findUnique({
      where: { id }
    })

    if (!estudianteExistente) {
      return NextResponse.json(
        { error: 'Estudiante no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar instrumentos primero (por la relación)
    await prisma.instrumentoEstudiante.deleteMany({
      where: { estudianteId: id }
    })

    // Luego eliminar el estudiante
    await prisma.estudiante.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Estudiante eliminado correctamente' },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error deleting student:', error)
    
    // Obtener mensaje de error de forma segura
    let errorMessage = 'Error al eliminar el estudiante'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}