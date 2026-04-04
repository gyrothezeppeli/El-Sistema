// lib/initdb.ts
import prismadb from "./prismadb";
import bcrypt from 'bcryptjs';

export async function initDatabase() {
  try {
    console.log("🔄 Inicializando base de datos...");
    
    // Verificar si ya existen roles
    const rolesCount = await prismadb.rol.count();
    
    if (rolesCount === 0) {
      console.log("📦 Creando roles iniciales...");
      
      // Crear roles iniciales
      await prismadb.rol.createMany({
        data: [
          { id: 1, rol: "administrador" },
          { id: 2, rol: "estudiante" }
        ]
      });
      
      console.log("✅ Roles creados exitosamente");
      
      // Verificar si hay un usuario admin, si no, crear uno por defecto
      const adminExists = await prismadb.usuario.findFirst({
        where: {
          rolId: 1
        }
      });

      if (!adminExists) {
        console.log("👤 Creando usuario administrador por defecto...");
        
        const hashedPassword = await bcrypt.hash("admin123", 10);
        
        await prismadb.usuario.create({
          data: {
            email: "admin@sistema.com",
            nombre: "Admin",
            apellido: "Sistema",
            cedula: "V-12345678",
            password: hashedPassword,
            rolId: 1,
          }
        });
        
        console.log("✅ Usuario administrador creado:");
        console.log("   📧 Email: admin@sistema.com");
        console.log("   🔑 Contraseña: admin123");
      }
    } else {
      console.log("ℹ️ Los roles ya existen en la base de datos");
    }
    
    console.log("✅ Inicialización completada");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
  }
}