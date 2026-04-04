// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Definir rutas protegidas por rol
    const adminRoutes = ["/admin", "/dashboard"];
    const studentRoutes = ["/estudiante", "/perfil"];

    // Verificar si la ruta requiere ser administrador
    if (adminRoutes.some(route => path.startsWith(route))) {
      if (token?.rol !== "administrador") {
        return NextResponse.redirect(new URL("/no-autorizado", req.url));
      }
    }

    // Verificar si la ruta requiere ser estudiante
    if (studentRoutes.some(route => path.startsWith(route))) {
      if (token?.rol !== "estudiante" && token?.rol !== "administrador") {
        return NextResponse.redirect(new URL("/no-autorizado", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/estudiante/:path*",
    "/perfil/:path*",
  ],
};