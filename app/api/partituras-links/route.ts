// app/api/partituras-links/route.ts
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

// GET: Obtener todos los enlaces de partituras registrados
export async function GET() {
  try {
    const partituras = await prismadb.partituraLink.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ partituras }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener partituras:', error);
    return NextResponse.json({ error: 'Error al obtener las partituras' }, { status: 500 });
  }
}

// POST: Registrar un nuevo enlace de partitura
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, autor, instrumento, enlace } = body;

    // Validación básica
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
    
  } catch (error) {
    console.error('Error al guardar partitura:', error);
    return NextResponse.json({ error: 'Error al guardar la partitura en la base de datos' }, { status: 500 });
  }
}