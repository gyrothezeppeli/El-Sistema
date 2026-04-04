// types/usuario.ts
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  cedula: string;
  password: string;
  rol: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}