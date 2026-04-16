import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Obtener un estudiante específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;

    const estudiante = await prisma.estudiante.findUnique({
      where: { id },
      include: {
        representante: true
      }
    });

    if (!estudiante) {
      return NextResponse.json(
        { error: 'Estudiante no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(estudiante);
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    return NextResponse.json(
      { error: 'Error al obtener el estudiante' },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un estudiante completo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Verificar si el estudiante existe
    const existingEstudiante = await prisma.estudiante.findUnique({
      where: { id },
      include: { representante: true }
    });

    if (!existingEstudiante) {
      return NextResponse.json(
        { error: 'Estudiante no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si la cédula ya está en uso por otro estudiante
    if (body.cedulaIdentidad && body.cedulaIdentidad !== existingEstudiante.cedulaIdentidad) {
      const cedulaExists = await prisma.estudiante.findFirst({
        where: {
          cedulaIdentidad: body.cedulaIdentidad,
          id: { not: id }
        }
      });

      if (cedulaExists) {
        return NextResponse.json(
          { error: 'Ya existe otro estudiante con esta cédula' },
          { status: 400 }
        );
      }
    }

    // Actualizar el estudiante
    const updatedEstudiante = await prisma.estudiante.update({
      where: { id },
      data: {
        apellidos: body.apellidos,
        nombres: body.nombres,
        cedulaIdentidad: body.cedulaIdentidad,
        fechaNacimiento: body.fechaNacimiento,
        edad: body.edad,
        sexo: body.sexo,
        lugarNacimiento: body.lugarNacimiento || '',
        municipio: body.municipio || '',
        parroquia: body.parroquia || '',
        direccionHabitacion: body.direccionHabitacion || '',
        numeroTelefonoCelular: body.numeroTelefonoCelular || '',
        numeroTelefonoLocal: body.numeroTelefonoLocal || '',
        correoElectronico: body.correoElectronico || '',
        nombreAgrupacionesPertenecio: body.nombreAgrupacionesPertenecio || '',
        añoInicio: body.añoInicio || '',
        agrupacionPertenece: body.agrupacionPertenece || '',
        instrumentoPrincipal: body.instrumentoPrincipal || '',
        instrumentosSecundarios: body.instrumentosSecundarios || '',
        enfermedadesPadece: body.enfermedadesPadece || '',
        condicionAlumno: body.condicionAlumno || '',
        necesidadesEspecialesAprendizaje: body.necesidadesEspecialesAprendizaje || '',
        esAlergico: body.esAlergico || 'no',
        estaVacunado: body.estaVacunado || 'no',
        numeroDosisVacuna: body.numeroDosisVacuna || '',
      },
      include: {
        representante: true
      }
    });

    return NextResponse.json(updatedEstudiante);
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el estudiante' },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar parcialmente un estudiante
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    const updatedEstudiante = await prisma.estudiante.update({
      where: { id },
      data: body,
      include: {
        representante: true
      }
    });

    return NextResponse.json(updatedEstudiante);
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el estudiante' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un estudiante
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Verificar si el estudiante existe
    const estudiante = await prisma.estudiante.findUnique({
      where: { id },
      include: { representante: true }
    });

    if (!estudiante) {
      return NextResponse.json(
        { error: 'Estudiante no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar en una transacción para asegurar consistencia
    await prisma.$transaction(async (tx) => {
      // Si tiene representante, eliminarlo primero
      if (estudiante.representanteId) {
        await tx.representante.delete({
          where: { id: estudiante.representanteId }
        });
      }

      // Luego eliminar el estudiante
      await tx.estudiante.delete({
        where: { id }
      });
    });

    return NextResponse.json({ 
      message: 'Estudiante eliminado exitosamente',
      deletedId: id 
    });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el estudiante' },
      { status: 500 }
    );
  }
}