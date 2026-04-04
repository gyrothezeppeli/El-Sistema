// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  console.log("\n📝 ===== NUEVO REGISTRO =====");
  
  try {
    const body = await request.json()
    const { email, nombre, apellido, cedula, password, rolId } = body

    console.log("📧 Email:", email);
    console.log("👤 Nombre:", nombre, apellido);
    console.log("🆔 Cédula:", cedula);
    console.log("🎭 Rol ID:", rolId);

    // Validaciones
    if (!email || !nombre || !apellido || !cedula || !password || !rolId) {
      console.log("❌ Campos faltantes");
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    // Verificar email duplicado
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log("❌ Email ya registrado:", email);
      return NextResponse.json(
        { error: 'El correo ya está registrado' },
        { status: 409 }
      )
    }

    // Verificar cédula duplicada
    const existingCedula = await prisma.usuario.findUnique({
      where: { cedula }
    })

    if (existingCedula) {
      console.log("❌ Cédula ya registrada:", cedula);
      return NextResponse.json(
        { error: 'La cédula ya está registrada' },
        { status: 409 }
      )
    }

    // Verificar que el rol existe
    const rol = await prisma.rol.findUnique({
      where: { id: rolId }
    })

    if (!rol) {
      console.log("❌ Rol no encontrado:", rolId);
      return NextResponse.json(
        { error: 'Rol inválido' },
        { status: 400 }
      )
    }

    // Crear usuario
    console.log("💾 Guardando usuario en BD...");
    const user = await prisma.usuario.create({
      data: {
        email: email.toLowerCase().trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        cedula: cedula.trim(),
        password: password,
        rolId: rolId,
      }
    })

    console.log("✅ Usuario creado con ID:", user.id);
    console.log("✅ Rol asignado:", rol.rol);
    console.log("=====================================\n");

    return NextResponse.json(
      { 
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: rol.rol
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("🔥 Error en registro:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}