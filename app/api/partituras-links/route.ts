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
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener partituras';
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
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar en la base de datos';
    // Esto enviará el error exacto a la respuesta para que lo veas al hacer la petición
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}