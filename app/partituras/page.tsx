// app/partituras/page.tsx
'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, PlayCircle, Music } from 'lucide-react';

const partiturasMock = [
  { id: 1, title: 'Escalas Mayores', instrument: 'Piano', level: 'Principiante', type: 'PDF' },
  { id: 2, title: 'Estudio No. 1', instrument: 'Guitarra', level: 'Intermedio', type: 'PDF' },
  { id: 3, title: 'Concierto de Aranjuez', instrument: 'Guitarra', level: 'Avanzado', type: 'Audio + PDF' },
  { id: 4, title: 'Método Suzuki Vol. 1', instrument: 'Violín', level: 'Principiante', type: 'PDF' },
];

export default function PartiturasPage() {
  return (
    <DashboardLayout 
      title="Biblioteca Musical" 
      subtitle="Accede a tus partituras, audios de práctica y material de estudio."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partiturasMock.map((item) => (
          <Card key={item.id} className="bg-white/30 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-xl hover:border-primary/50 hover:bg-white/40 transition-all duration-300 rounded-3xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/5 text-foreground/70 px-3 py-1 rounded-full">
                  {item.type}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-foreground/60 mb-6">{item.instrument} • {item.level}</p>
              
              <div className="flex gap-2">
                <Button className="flex-1 rounded-xl font-bold gap-2">
                  <Download className="w-4 h-4" /> Descargar
                </Button>
                {item.type.includes('Audio') && (
                  <Button variant="outline" size="icon" className="rounded-xl bg-white/50 border-white/60">
                    <PlayCircle className="w-5 h-5 text-primary" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}