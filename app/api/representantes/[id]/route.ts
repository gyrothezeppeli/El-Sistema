import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener representante por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Esperar (await) los params
    const { id } = await params;
    
    const representante = await prisma.representante.findUnique({
      where: { id: id },
      include: {
        estudiantes: true
      }
    });

    if (!representante) {
      return NextResponse.json(
        { error: 'Representante no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(representante);
  } catch (error) {
    console.error('Error al obtener representante:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar representante
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Esperar (await) los params
    const { id } = await params;
    const body = await request.json();

    // Verificar que el representante existe
    const representanteExistente = await prisma.representante.findUnique({
      where: { id: id }
    });

    if (!representanteExistente) {
      return NextResponse.json(
        { error: 'Representante no encontrado' },
        { status: 404 }
      );
    }

    const representanteActualizado = await prisma.representante.update({
      where: { id: id },
      data: body,
      include: {
        estudiantes: true
      }
    });

    return NextResponse.json(representanteActualizado);
  } catch (error) {
    console.error('Error al actualizar representante:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar representante
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Esperar (await) los params
    const { id } = await params;
    
    // Verificar que el representante existe
    const representanteExistente = await prisma.representante.findUnique({
      where: { id: id }
    });

    if (!representanteExistente) {
      return NextResponse.json(
        { error: 'Representante no encontrado' },
        { status: 404 }
      );
    }

    await prisma.representante.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Representante eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar representante:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}