// app/api/test-admin/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Buscar usuarios que tengan el rol con nombre 'administrador'
    const admins = await prisma.usuario.findMany({
      where: { 
        rol: {
          rol: 'administrador' // Filtra por el campo 'rol' en el modelo Rol
        }
      },
      select: { 
        id: true,
        email: true, 
        nombre: true, 
        apellido: true,
        cedula: true,
        rol: { // Incluye la información del rol
          select: {
            id: true,
            rol: true
          }
        },
        createdAt: true
      }
    })

    return NextResponse.json({ 
      success: true,
      admins: admins,
      message: admins.length > 0 
        ? `✅ ${admins.length} administrador(es) encontrado(s)` 
        : '❌ No hay administradores en el sistema',
      totalAdmins: admins.length
    })
  } catch (error: unknown) {
    console.error('Error en test-admin:', error)
    
    let errorMessage = 'Error buscando administrador'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    return NextResponse.json({ 
      success: false,
      error: 'Error buscando administrador',
      details: errorMessage 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}