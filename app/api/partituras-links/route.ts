// app/api/partituras-links/route.ts
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET() {
  try {
    const partituras = await prismadb.partituraLink.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ partituras }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al obtener las partituras';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, autor, instrumento, enlace } = body;

    if (!titulo || !enlace) {
      return NextResponse.json({ error: 'El título y el enlace son obligatorios' }, { status: 400 });
    }

    const nuevaPartitura = await prismadb.partituraLink.create({
      data: {
        titulo,
        autor: autor || null,
        instrumento: instrumento || null,
        enlace,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Partitura guardada exitosamente', 
      partitura: nuevaPartitura 
    }, { status: 201 });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al guardar la partitura';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'El ID es obligatorio para eliminar' }, { status: 400 });
    }

    await prismadb.partituraLink.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Partitura eliminada exitosamente' }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la partitura';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}