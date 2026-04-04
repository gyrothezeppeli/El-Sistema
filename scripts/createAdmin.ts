import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    const adminData = {
      email: 'admin@sistema.com',
      nombre: 'Administrador',
      apellido: 'Sistema', 
      cedula: '00000000',
      password: await bcrypt.hash('admin123', 12),
      rol: 'admin' // Esto sigue siendo incorrecto para la creación
    }

    // Verificar si ya existe - INCLUYENDO la relación rol
    const existingAdmin = await prisma.usuario.findUnique({
      where: { email: adminData.email },
      include: { rol: true } // ¡IMPORTANTE! Incluir la relación
    })

    if (existingAdmin) {
      console.log('✅ El administrador ya existe')
      console.log('📧 Email:', existingAdmin.email)
      console.log('👤 Rol:', existingAdmin.rol?.rol) // Acceder al nombre del rol a través de la relación
      console.log('👤 Rol ID:', existingAdmin.rolId) // También puedes mostrar el ID
      return
    }

    // Primero, necesitamos obtener el ID del rol 'admin'
    const rolAdmin = await prisma.rol.findFirst({
      where: { rol: 'administrador' } // Buscar por el nombre del rol
    })

    if (!rolAdmin) {
      console.error('❌ No se encontró el rol "administrador" en la base de datos')
      console.log('💡 Ejecuta primero el script de inicialización para crear los roles')
      return
    }

    // Crear el administrador usando el rolId correcto
    const admin = await prisma.usuario.create({
      data: {
        email: adminData.email,
        nombre: adminData.nombre,
        apellido: adminData.apellido,
        cedula: adminData.cedula,
        password: adminData.password,
        rolId: rolAdmin.id // Usar el ID del rol, no el string 'admin'
      },
      include: { rol: true } // Incluir el rol en la respuesta
    })

    console.log('🎉 ADMINISTRADOR CREADO EXITOSAMENTE:')
    console.log('📧 Email: admin@sistema.com')
    console.log('🔑 Password: admin123') 
    console.log('👤 Rol:', admin.rol.rol) // Mostrar el nombre del rol
    console.log('🆔 ID:', admin.id)
    
  } catch (error) {
    console.error('❌ Error creando administrador:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()