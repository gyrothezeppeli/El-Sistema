// reset-password.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function resetPassword() {
  const email = 'kelvincenteno25@gmail.com';
  const newPassword = '123456';
  
  console.log('🔄 Reseteando contraseña para:', email);
  
  try {
    // Verificar que el usuario existe
    const user = await prisma.usuario.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      console.log('📋 Usuarios disponibles:');
      const users = await prisma.usuario.findMany({
        select: { email: true }
      });
      users.forEach(u => console.log('   -', u.email));
      return;
    }
    
    console.log('✅ Usuario encontrado, generando nuevo hash...');
    
    // Generar nuevo hash
    const hash = await bcrypt.hash(newPassword, 10);
    console.log('✅ Hash generado');
    
    // Actualizar en base de datos
    await prisma.usuario.update({
      where: { email },
      data: { password: hash }
    });
    
    console.log('✅ Contraseña actualizada exitosamente');
    console.log('📧 Email:', email);
    console.log('🔑 Nueva contraseña:', newPassword);
    
    // Verificar que funciona
    const verifyUser = await prisma.usuario.findUnique({
      where: { email }
    });
    
    const verify = await bcrypt.compare(newPassword, verifyUser.password);
    console.log('🔐 Verificación:', verify ? '✅ Correcta' : '❌ Error');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();