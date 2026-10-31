// components/DashboardLayout.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardLayout({ 
  title, 
  subtitle, 
  children,
  showBackButton = true 
}: { 
  title: string; 
  subtitle: string; 
  children: React.ReactNode;
  showBackButton?: boolean;
}) {
  return (
    <div className="min-h-screen p-4 md:p-8 font-montserrat flex justify-center">
      {/* Panel Principal (Liquid Glass Amplio) */}
      <div className="w-full max-w-[1400px] bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[2.5rem] shadow-[0_20px_60px_rgba(91,43,23,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] overflow-hidden relative">
        
        {/* Brillo sutil de fondo */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="p-6 md:p-12 relative z-10">
          {/* Header de la página */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              {showBackButton && (
                <Button variant="ghost" asChild className="mb-4 -ml-4 text-foreground/60 hover:text-foreground hover:bg-white/20 rounded-full">
                  <Link href="/inicio">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Inicio
                  </Link>
                </Button>
              )}
              <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-2">
                {title}
              </h1>
              <p className="text-base text-foreground/70 font-medium max-w-2xl">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Contenido de la página */}
          {children}
        </div>
      </div>
    </div>
  );
}