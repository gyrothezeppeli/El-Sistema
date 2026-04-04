// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log("\n🔐 ===== INTENTO DE LOGIN =====");
        console.log("📧 Email recibido:", credentials?.email);
        console.log("🔑 Password recibida:", credentials?.password ? "✓ (presente)" : "✗ (vacía)");
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Error: Credenciales incompletas");
          return null;
        }

        try {
          // Buscar usuario
          console.log("🔍 Buscando usuario en BD...");
          const user = await prisma.usuario.findUnique({
            where: {
              email: credentials.email
            },
            include: {
              rol: true
            }
          });

          if (!user) {
            console.log("❌ Usuario no encontrado en BD");
            return null;
          }

          console.log("✅ Usuario encontrado:");
          console.log("   - ID:", user.id);
          console.log("   - Email:", user.email);
          console.log("   - Nombre completo:", `${user.nombre} ${user.apellido}`);
          console.log("   - Rol ID:", user.rolId);
          console.log("   - Rol nombre:", user.rol?.rol);
          console.log("   - ¿Tiene password?:", user.password ? "✓" : "✗");

          if (!user.password) {
            console.log("❌ Usuario sin contraseña en BD");
            return null;
          }

          // Comparar contraseñas
          console.log("🔄 Comparando contraseñas...");
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("   Resultado comparación:", passwordMatch ? "✅ Correcta" : "❌ Incorrecta");

          if (!passwordMatch) {
            console.log("❌ Contraseña incorrecta");
            return null;
          }

          // Crear objeto de usuario para devolver
          const userToReturn = {
            id: user.id,
            email: user.email,
            name: `${user.nombre} ${user.apellido}`,
            nombre: user.nombre,
            apellido: user.apellido,
            rol: user.rol?.rol || 'estudiante',
            rolId: user.rolId,
          };

          console.log("✅ Autorización exitosa. Devolviendo:", userToReturn);
          console.log("=====================================\n");
          
          return userToReturn;

        } catch (error) {
          console.error("🔥 Error en authorize:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile, session, trigger }) {
      console.log("\n📝 JWT Callback - Datos recibidos:");
      console.log("   - Token actual:", token);
      console.log("   - User:", user ? "✓ presente" : "✗ no presente");
      console.log("   - Account:", account ? "✓" : "✗");
      console.log("   - Trigger:", trigger);
      
      if (user) {
        console.log("   Agregando datos del user al token:");
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.nombre = user.nombre;
        token.apellido = user.apellido;
        token.rol = user.rol;
        token.rolId = user.rolId;
        console.log("   Token después de agregar user:", token);
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log("\n📝 Session Callback - Datos recibidos:");
      console.log("   - Session actual:", session);
      console.log("   - Token:", token);
      
      if (session?.user) {
        console.log("   Agregando datos del token a la session:");
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.nombre = token.nombre as string;
        session.user.apellido = token.apellido as string;
        session.user.rol = token.rol as string;
        session.user.rolId = token.rolId as number;
        console.log("   Session después de agregar datos:", session);
      }
      
      return session;
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Activar debug mode
});

export { handler as GET, handler as POST };