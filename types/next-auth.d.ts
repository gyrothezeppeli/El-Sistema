// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;           // ← Agregar id
    nombre: string;
    apellido: string;
    rol: string;
    rolId: number;
  }

  interface Session {
    user: {
      id: string;         // ← Agregar id aquí también
      nombre: string;
      apellido: string;
      rol: string;
      rolId: number;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;           // ← Agregar id aquí también
    nombre: string;
    apellido: string;
    rol: string;
    rolId: number;
  }
}