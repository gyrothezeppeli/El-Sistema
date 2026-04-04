// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    nombre: string;
    apellido: string;
    rol: string;
    rolId: number;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      nombre: string;
      apellido: string;
      rol: string;
      rolId: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    nombre: string;
    apellido: string;
    rol: string;
    rolId: number;
  }
}