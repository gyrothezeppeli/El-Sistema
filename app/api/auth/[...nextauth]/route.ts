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
        email: { label: 'Email', type: 'email', placeholder: 'correo@ejemplo.com' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        console.log("\n🔐 ===== INTENTO DE LOGIN =====");
        console.log("📧 Email recibido:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Error: Credenciales incompletas");
          return null;
        }

        try {
          const user = await prisma.usuario.findUnique({
            where: { email: credentials.email },
            include: { rol: true }
          });

          if (!user || !user.password) {
            console.log("❌ Usuario no encontrado o sin contraseña");
            return null;
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (!passwordMatch) {
            console.log("❌ Contraseña incorrecta");
            return null;
          }

          console.log("✅ Login exitoso para:", user.email);
          
          return {
            id: user.id,
            email: user.email,
            name: `${user.nombre} ${user.apellido}`,
            nombre: user.nombre,
            apellido: user.apellido,
            rol: user.rol?.rol || 'estudiante',
            rolId: user.rolId,
          };

        } catch (error) {
          console.error("🔥 Error en authorize:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.nombre = user.nombre;
        token.apellido = user.apellido;
        token.rol = user.rol;
        token.rolId = user.rolId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.nombre = token.nombre as string;
        session.user.apellido = token.apellido as string;
        session.user.rol = token.rol as string;
        session.user.rolId = token.rolId as number;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Si la URL es la raíz o el login, redirige al dashboard
      if (url === '/' || url === '/login') {
        return `${baseUrl}/dashboard`;
      }
      // Si es una URL relativa, permite la redirección
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Si es una URL del mismo sitio, permite la redirección
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Por defecto, redirige al dashboard
      return `${baseUrl}/dashboard`;
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export { handler as GET, handler as POST };