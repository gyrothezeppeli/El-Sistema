// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prismadb from "./prismadb";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔍 Intentando autorizar:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Credenciales incompletas");
          throw new Error("Credenciales inválidas");
        }

        try {
          const usuario = await prismadb.usuario.findUnique({
            where: {
              email: credentials.email,
            },
            include: {
              rol: true,
            },
          });

          console.log("👤 Usuario encontrado:", usuario ? "Sí" : "No");

          if (!usuario || !usuario.password) {
            console.log("❌ Usuario no encontrado o sin contraseña");
            throw new Error("Credenciales inválidas");
          }

          console.log("🔐 Comparando contraseñas...");
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            usuario.password
          );

          console.log("✅ Contraseña correcta:", isCorrectPassword ? "Sí" : "No");

          if (!isCorrectPassword) {
            console.log("❌ Contraseña incorrecta");
            throw new Error("Credenciales inválidas");
          }

          // El objeto que devolvemos debe coincidir con la interfaz User extendida
          return {
            id: usuario.id,
            email: usuario.email,
            name: `${usuario.nombre} ${usuario.apellido}`,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rol: usuario.rol.rol,
            rolId: usuario.rolId,
          };

        } catch (error) {
          console.error("❌ Error en authorize:", error);
          throw new Error("Credenciales inválidas");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("📝 JWT Callback - user:", user ? "Sí" : "No");
      if (user) {
        // TypeScript ahora debería reconocer las propiedades gracias a la extensión de tipos
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
      console.log("📝 Session Callback - token:", token ? "Sí" : "No");
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          name: token.name,
          nombre: token.nombre,
          apellido: token.apellido,
          rol: token.rol,
          rolId: token.rolId,
        },
      };
    },
  },
  pages: {
    signIn: "/",
  },
  debug: true,
};