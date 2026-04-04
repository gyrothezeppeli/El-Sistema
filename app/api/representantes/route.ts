import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función auxiliar para verificar admin
function checkAdminAccess(request: NextRequest): boolean {
  try {
    // Múltiples formas de obtener el rol
    const authHeader = request.headers.get('authorization');
    const userRoleHeader = request.headers.get('x-user-role');
    const userRole = request.headers.get('role');
    
    console.log('🔐 Headers de autenticación recibidos:', {
      authorization: authHeader,
      'x-user-role': userRoleHeader,
      'role': userRole
    });

    // Verificar en diferentes headers
    const posiblesHeaders = [authHeader, userRoleHeader, userRole];
    
    for (const headerValue of posiblesHeaders) {
      if (headerValue === 'admin') {
        console.log('✅ Acceso de administrador verificado');
        return true;
      }
      
      // Si usas Bearer token
      if (headerValue?.startsWith('Bearer ')) {
        const token = headerValue.substring(7);
        // Lógica de verificación de token (ajusta según tu sistema)
        if (token === 'admin-token' || token === 'admin') {
          console.log('✅ Acceso de administrador verificado via token');
          return true;
        }
      }
    }

    console.log('❌ No se encontraron credenciales de administrador válidas');
    return false;
    
  } catch (error) {
    console.error('Error verificando acceso:', error);
    return false;
  }
}

// POST - Crear nuevo representante
export async function POST(request: NextRequest) {
  try {
    // 🔐 VERIFICAR ADMIN para crear representantes
    if (!checkAdminAccess(request)) {
      return NextResponse.json(
        { 
          error: '❌ Acceso denegado. Solo administradores pueden crear representantes.',
          details: 'Asegúrate de incluir el header de autorización con rol "admin"'
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validar que al menos un representante esté completo
    const madreCompleta = body.nombreApellidoMadre?.trim() && body.cedulaMadre?.trim();
    const padreCompleto = body.nombreApellidoPadre?.trim() && body.cedulaPadre?.trim();
    const tutorCompleto = body.nombreApellidoRepresentanteLegal?.trim() && body.cedulaRepresentanteLegal?.trim();

    if (!madreCompleta && !padreCompleto && !tutorCompleto) {
      return NextResponse.json(
        { error: 'Debe completar al menos los datos de un representante (Madre, Padre o Tutor Legal)' },
        { status: 400 }
      );
    }

    // Validaciones para madre (si tiene datos)
    if (body.nombreApellidoMadre?.trim() || body.cedulaMadre?.trim()) {
      if (!body.nombreApellidoMadre?.trim()) {
        return NextResponse.json(
          { error: 'Los nombres y apellidos de la madre son obligatorios' },
          { status: 400 }
        );
      }
      if (!body.cedulaMadre?.trim()) {
        return NextResponse.json(
          { error: 'La cédula de la madre es obligatoria' },
          { status: 400 }
        );
      }
      if (!body.madreViveConAlumno) {
        return NextResponse.json(
          { error: 'El campo "¿Vive con el estudiante?" es obligatorio para la madre' },
          { status: 400 }
        );
      }
      if (!body.gradoInstruccionMadre) {
        return NextResponse.json(
          { error: 'El grado de instrucción de la madre es obligatorio' },
          { status: 400 }
        );
      }
      if (!body.telefonoMadre?.trim()) {
        return NextResponse.json(
          { error: 'El teléfono de la madre es obligatorio' },
          { status: 400 }
        );
      }

      // Validar formato de cédula y teléfono
      if (body.cedulaMadre && !/^\d+$/.test(body.cedulaMadre)) {
        return NextResponse.json(
          { error: 'La cédula de la madre debe contener solo números' },
          { status: 400 }
        );
      }
      if (body.telefonoMadre && !/^\d+$/.test(body.telefonoMadre)) {
        return NextResponse.json(
          { error: 'El teléfono de la madre debe contener solo números' },
          { status: 400 }
        );
      }
      if (body.correoMadre && !/^\S+@\S+\.\S+$/.test(body.correoMadre)) {
        return NextResponse.json(
          { error: 'El correo electrónico de la madre no es válido' },
          { status: 400 }
        );
      }
    }

    // Validaciones para padre (si tiene datos)
    if (body.nombreApellidoPadre?.trim() || body.cedulaPadre?.trim()) {
      if (!body.nombreApellidoPadre?.trim()) {
        return NextResponse.json(
          { error: 'Los nombres y apellidos del padre son obligatorios' },
          { status: 400 }
        );
      }
      if (!body.cedulaPadre?.trim()) {
        return NextResponse.json(
          { error: 'La cédula del padre es obligatoria' },
          { status: 400 }
        );
      }
      if (!body.padreViveConAlumno) {
        return NextResponse.json(
          { error: 'El campo "¿Vive con el estudiante?" es obligatorio para el padre' },
          { status: 400 }
        );
      }
      if (!body.gradoInstruccionPadre) {
        return NextResponse.json(
          { error: 'El grado de instrucción del padre es obligatorio' },
          { status: 400 }
        );
      }
      if (!body.telefonoPadre?.trim()) {
        return NextResponse.json(
          { error: 'El teléfono del padre es obligatorio' },
          { status: 400 }
        );
      }

      // Validar formato de cédula y teléfono
      if (body.cedulaPadre && !/^\d+$/.test(body.cedulaPadre)) {
        return NextResponse.json(
          { error: 'La cédula del padre debe contener solo números' },
          { status: 400 }
        );
      }
      if (body.telefonoPadre && !/^\d+$/.test(body.telefonoPadre)) {
        return NextResponse.json(
          { error: 'El teléfono del padre debe contener solo números' },
          { status: 400 }
        );
      }
      if (body.correoPadre && !/^\S+@\S+\.\S+$/.test(body.correoPadre)) {
        return NextResponse.json(
          { error: 'El correo electrónico del padre no es válido' },
          { status: 400 }
        );
      }
    }

    // Validaciones para tutor legal (si tiene datos)
    if (body.nombreApellidoRepresentanteLegal?.trim() || body.cedulaRepresentanteLegal?.trim()) {
      if (!body.nombreApellidoRepresentanteLegal?.trim()) {
        return NextResponse.json(
          { error: 'Los nombres y apellidos del tutor legal son obligatorios' },
          { status: 400 }
        );
      }
      if (!body.cedulaRepresentanteLegal?.trim()) {
        return NextResponse.json(
          { error: 'La cédula del tutor legal es obligatoria' },
          { status: 400 }
        );
      }
      if (!body.representanteLegalViveConAlumno) {
        return NextResponse.json(
          { error: 'El campo "¿Vive con el estudiante?" es obligatorio para el tutor legal' },
          { status: 400 }
        );
      }
      if (!body.parentescoRepresentanteLegal) {
        return NextResponse.json(
          { error: 'El parentesco del tutor legal es obligatorio' },
          { status: 400 }
        );
      }
      if (!body.gradoInstruccionRepresentanteLegal) {
        return NextResponse.json(
          { error: 'El grado de instrucción del tutor legal es obligatorio' },
          { status: 400 }
        );
      }
      if (!body.telefonoRepresentanteLegal?.trim()) {
        return NextResponse.json(
          { error: 'El teléfono del tutor legal es obligatorio' },
          { status: 400 }
        );
      }

      // Validar formato de cédula y teléfono
      if (body.cedulaRepresentanteLegal && !/^\d+$/.test(body.cedulaRepresentanteLegal)) {
        return NextResponse.json(
          { error: 'La cédula del tutor legal debe contener solo números' },
          { status: 400 }
        );
      }
      if (body.telefonoRepresentanteLegal && !/^\d+$/.test(body.telefonoRepresentanteLegal)) {
        return NextResponse.json(
          { error: 'El teléfono del tutor legal debe contener solo números' },
          { status: 400 }
        );
      }
      if (body.correoRepresentanteLegal && !/^\S+@\S+\.\S+$/.test(body.correoRepresentanteLegal)) {
        return NextResponse.json(
          { error: 'El correo electrónico del tutor legal no es válido' },
          { status: 400 }
        );
      }
    }

    // Crear el representante
    const nuevoRepresentante = await prisma.representante.create({
      data: {
        // Datos de la Madre
        nombreApellidoMadre: body.nombreApellidoMadre || '',
        cedulaMadre: body.cedulaMadre || '',
        madreViveConAlumno: body.madreViveConAlumno || 'no',
        gradoInstruccionMadre: body.gradoInstruccionMadre || '',
        direccionMadre: body.direccionMadre || '',
        telefonoMadre: body.telefonoMadre || '',
        correoMadre: body.correoMadre || '',

        // Datos del Padre
        nombreApellidoPadre: body.nombreApellidoPadre || '',
        cedulaPadre: body.cedulaPadre || '',
        padreViveConAlumno: body.padreViveConAlumno || 'no',
        gradoInstruccionPadre: body.gradoInstruccionPadre || '',
        direccionPadre: body.direccionPadre || '',
        telefonoPadre: body.telefonoPadre || '',
        correoPadre: body.correoPadre || '',

        // Datos del Representante Legal
        nombreApellidoRepresentanteLegal: body.nombreApellidoRepresentanteLegal || '',
        cedulaRepresentanteLegal: body.cedulaRepresentanteLegal || '',
        representanteLegalViveConAlumno: body.representanteLegalViveConAlumno || 'no',
        gradoInstruccionRepresentanteLegal: body.gradoInstruccionRepresentanteLegal || '',
        direccionRepresentanteLegal: body.direccionRepresentanteLegal || '',
        telefonoRepresentanteLegal: body.telefonoRepresentanteLegal || '',
        correoRepresentanteLegal: body.correoRepresentanteLegal || '',
        parentescoRepresentanteLegal: body.parentescoRepresentanteLegal || ''
      },
      include: {
        estudiantes: true
      }
    });

    console.log('✅ Representante creado exitosamente:', nuevoRepresentante.id);
    return NextResponse.json(nuevoRepresentante, { status: 201 });
    
  } catch (error) {
    console.error('❌ Error al crear representante:', error);
    return NextResponse.json(
      { 
        error: `Error del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        details: 'Problema con la base de datos.'
      },
      { status: 500 }
    );
  }
}

// GET - Obtener todos los representantes
export async function GET(request: NextRequest) {
  try {
    // 🔐 VERIFICAR ADMIN para ver representantes
    if (!checkAdminAccess(request)) {
      return NextResponse.json(
        { 
          error: '❌ Acceso denegado. Solo administradores pueden ver la lista de representantes.',
          details: 'Asegúrate de incluir el header de autorización con rol "admin"'
        },
        { status: 403 }
      );
    }

    const representantes = await prisma.representante.findMany({
      include: {
        estudiantes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('✅ Lista de representantes enviada a admin');
    return NextResponse.json(representantes);
  } catch (error) {
    console.error('❌ Error al obtener representantes:', error);
    return NextResponse.json(
      { 
        error: `Error del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        details: 'Problema con la base de datos.'
      },
      { status: 500 }
    );
  }
}