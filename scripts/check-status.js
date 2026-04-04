// check-status.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function checkStatus() {
  console.log('🔍 DIAGNÓSTICO COMPLETO\n');
  
  // 1. Verificar el usuario
  const user = await prisma.usuario.findUnique({
    where: { email: 'kelvincenteno25@gmail.com' },
    include: { rol: true }
  });
  
  if (!user) {
    console.log('❌ Usuario NO encontrado');
    return;
  }
  
  console.log('✅ Usuario ENCONTRADO:');
  console.log('   ID:', user.id);
  console.log('   Email:', `"${user.email}"`);
  console.log('   Email length:', user.email.length);
  console.log('   Rol ID:', user.rolId);
  console.log('   Rol nombre:', user.rol?.rol);
  console.log('   Password hash length:', user.password.length);
  console.log('   Password preview:', user.password.substring(0, 30) + '...');
  
  // 2. Verificar la contraseña con la que intentas login
  const testPassword = '123456'; // Cambia a la que usas
  const isValid = await bcrypt.compare(testPassword, user.password);
  console.log('\n🔐 Prueba con contraseña:', testPassword);
  console.log('   ¿Coincide?:', isValid ? '✅ SÍ' : '❌ NO');
  
  // 3. Si no coincide, generar un hash nuevo para comparar
  if (!isValid) {
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log('\n📊 Información técnica:');
    console.log('   Hash actual en BD:', user.password);
    console.log('   Nuevo hash generado:', newHash);
    console.log('   NOTA: Los hashes son diferentes por diseño, pero bcrypt.compare() debería funcionar');
  }
  
  // 4. Verificar todos los usuarios (por si hay duplicados)
  const allUsers = await prisma.usuario.findMany({
    where: { email: { contains: 'kelvin' } }
  });
  
  if (allUsers.length > 1) {
    console.log('\n⚠️ Usuarios similares encontrados:');
    allUsers.forEach(u => console.log('   -', u.email));
  }
  
  await prisma.$disconnect();
}

checkStatus().catch(console.error);